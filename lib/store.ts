"use client";

import { useEffect, useState } from "react";
import { Appointment, Patient, MessageThread, ClinicSettings, INITIAL_CLINIC_SETTINGS } from "./admin-data";
import { supabase, isSupabaseConfigured } from "./supabase";
import { CLINIC_INFO } from "./data";

const STORAGE_KEYS = {
  APPOINTMENTS: "dc_live_appointments",
  PATIENTS: "dc_live_patients",
  MESSAGES: "dc_live_messages",
  SETTINGS: "dc_clinic_settings"
};

const EVENT_NAME = "dc_store_updated";

function notifyChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(EVENT_NAME));
  }
}

export function getStoredClinicSettings(): ClinicSettings {
  if (typeof window === "undefined") return INITIAL_CLINIC_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return raw ? { ...INITIAL_CLINIC_SETTINGS, ...JSON.parse(raw) } : INITIAL_CLINIC_SETTINGS;
  } catch {
    return INITIAL_CLINIC_SETTINGS;
  }
}

export function saveStoredClinicSettings(settings: ClinicSettings) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    notifyChange();
  }
}

function deduplicateAppointments(list: Appointment[]): Appointment[] {
  const seenIds = new Set<string>();
  const result: Appointment[] = [];

  for (const apt of list) {
    if (!apt || typeof apt !== "object" || !apt.id) continue;
    if (apt.id.startsWith("APT-100")) continue;
    if (seenIds.has(apt.id)) continue;

    seenIds.add(apt.id);
    result.push(apt);
  }

  return result;
}

// 1. Appointments Storage Helpers
export function getStoredAppointments(): Appointment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? deduplicateAppointments(parsed) : [];
  } catch {
    return [];
  }
}

export function saveStoredAppointments(appointments: Appointment[]) {
  if (typeof window !== "undefined") {
    const clean = deduplicateAppointments(appointments || []);
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(clean));
    notifyChange();
  }
}

// 2. Patients Storage Helpers
export function getStoredPatients(): Patient[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((p) => p && typeof p === "object" && p.id && !p.id.startsWith("PAT-80"))
      : [];
  } catch {
    return [];
  }
}

export function saveStoredPatients(patients: Patient[]) {
  if (typeof window !== "undefined") {
    const clean = (patients || []).filter((p) => p && typeof p === "object" && p.id);
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(clean));
    notifyChange();
  }
}

// 3. Messages Storage Helpers
export function getStoredMessages(): MessageThread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((m) => m && typeof m === "object" && m.id) : [];
  } catch {
    return [];
  }
}

export function saveStoredMessages(threads: MessageThread[]) {
  if (typeof window !== "undefined") {
    const clean = (threads || []).filter((m) => m && typeof m === "object" && m.id);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(clean));
    notifyChange();
  }
}

// Store Mutation Actions
export function updateAppointmentStatus(id: string, newStatus: Appointment["status"]) {
  const current = getStoredAppointments();
  const updated = current.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
  saveStoredAppointments(updated);

  // Sync update to server store for cross-device real-time sync
  fetch("/api/appointments", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status: newStatus }),
  }).catch(() => {});

  // Sync to Supabase DB if configured
  if (isSupabaseConfigured) {
    supabase
      .from("appointments")
      .update({ status: newStatus })
      .or(`id.eq.${id},booking_id.eq.${id}`)
      .then(() => {}, () => {});
  }
}

export function rescheduleAppointmentInStore(id: string, newDate: string, newTime: string) {
  const current = getStoredAppointments();
  const updated = current.map((a) =>
    a.id === id ? { ...a, date: newDate, time: newTime, status: "Scheduled" as const } : a
  );
  saveStoredAppointments(updated);

  fetch("/api/appointments", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, date: newDate, time: newTime, status: "Scheduled" }),
  }).catch(() => {});

  if (isSupabaseConfigured) {
    supabase
      .from("appointments")
      .update({ preferred_date: newDate, preferred_time: newTime, status: "Scheduled" })
      .or(`id.eq.${id},booking_id.eq.${id}`)
      .then(() => {}, () => {});
  }
}

export function saveAppointmentInStore(apt: Partial<Appointment> & { id: string }) {
  const current = getStoredAppointments();
  const idx = current.findIndex((a) => a.id === apt.id);
  if (idx !== -1) {
    current[idx] = { ...current[idx], ...apt };
  } else {
    current.unshift(apt as Appointment);
  }
  saveStoredAppointments(current);

  fetch("/api/appointments", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(apt),
  }).catch(() => {});
}

export function deleteAppointmentFromStore(id: string) {
  const current = getStoredAppointments();
  const target = current.find((a) => a.id === id);
  const updated = current.filter((a) => a.id !== id);
  saveStoredAppointments(updated);

  fetch("/api/appointments", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  }).catch(() => {});

  if (target) {
    const remainingForPatient = updated.filter(
      (a) => a.patientId === target.patientId || (target.patientEmail && a.patientEmail && a.patientEmail.toLowerCase() === target.patientEmail.toLowerCase())
    );
    if (remainingForPatient.length === 0) {
      const patients = getStoredPatients();
      const updatedPatients = patients.filter(
        (p) => p.id !== target.patientId && (target.patientEmail ? (p.email || "").toLowerCase() !== target.patientEmail.toLowerCase() : true)
      );
      saveStoredPatients(updatedPatients);
    } else {
      const patients = getStoredPatients();
      const updatedPatients = patients.map((p) => {
        if (p.id === target.patientId || (target.patientEmail && (p.email || "").toLowerCase() === target.patientEmail.toLowerCase())) {
          return { ...p, totalVisits: Math.max(1, p.totalVisits - 1) };
        }
        return p;
      });
      saveStoredPatients(updatedPatients);
    }
  }

  if (isSupabaseConfigured) {
    supabase
      .from("appointments")
      .delete()
      .or(`id.eq.${id},booking_id.eq.${id}`)
      .then(() => {}, () => {});
  }
}

export function deletePatientFromStore(patientId: string) {
  const patients = getStoredPatients();
  const targetPatient = patients.find((p) => p.id === patientId || p.email === patientId);
  const updatedPatients = patients.filter((p) => p.id !== patientId && p.email !== patientId);
  saveStoredPatients(updatedPatients);

  if (targetPatient) {
    const appointments = getStoredAppointments();
    const updatedAppointments = appointments.filter(
      (a) => a.patientId !== targetPatient.id && (targetPatient.email ? (a.patientEmail || "").toLowerCase() !== targetPatient.email.toLowerCase() : true)
    );
    saveStoredAppointments(updatedAppointments);
  }
}

export function addDoctorNoteToPatient(patientId: string, text: string, author: string = "Dr. Alexander Vance") {
  const patients = getStoredPatients();
  const updated = patients.map((p) => {
    if (p.id === patientId || p.email === patientId) {
      const newNote = {
        id: `note-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        author,
        text,
        isPrivate: false,
      };
      return { ...p, doctorNotes: [newNote, ...(p.doctorNotes || [])] };
    }
    return p;
  });
  saveStoredPatients(updated);
}

export function editDoctorNoteInPatient(patientId: string, noteId: string, text: string) {
  const patients = getStoredPatients();
  const updated = patients.map((p) => {
    if (p.id === patientId || p.email === patientId) {
      const updatedNotes = (p.doctorNotes || []).map((n) => (n.id === noteId ? { ...n, text } : n));
      return { ...p, doctorNotes: updatedNotes };
    }
    return p;
  });
  saveStoredPatients(updated);
}

export function deleteDoctorNoteFromPatient(patientId: string, noteId: string) {
  const patients = getStoredPatients();
  const updated = patients.map((p) => {
    if (p.id === patientId || p.email === patientId) {
      const filteredNotes = (p.doctorNotes || []).filter((n) => n.id !== noteId);
      return { ...p, doctorNotes: filteredNotes };
    }
    return p;
  });
  saveStoredPatients(updated);
}

// Helper: Public Website Contact Form Submission
export function addContactMessageFromWebsite(data: {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}) {
  const currentMessages = getStoredMessages();

  const newThread: MessageThread = {
    id: `MSG-${Math.floor(100 + Math.random() * 900)}`,
    patientId: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
    patientName: data.name,
    patientAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    lastMessage: data.message,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    unreadCount: 1,
    category: "General Query",
    isUrgent: true,
    messages: [
      {
        id: `m-${Date.now()}`,
        sender: "patient",
        text: data.message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]
  };

  currentMessages.unshift(newThread);
  saveStoredMessages(currentMessages);
  return newThread;
}

// Helper: Public Website Booking Submission & Supabase Sync
export function addAppointmentFromWebsite(data: {
  bookingId?: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  date?: string;
  time?: string;
  department?: string;
  reason?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other' | string;
  status?: string;
}) {
  const currentPatients = getStoredPatients();
  const currentAppointments = getStoredAppointments();

  const bookingCode = data.bookingId || `APT-${Math.floor(10000 + Math.random() * 90000)}`;

  // Avoid duplicate entries if already in store strictly by ID
  const existingIndex = currentAppointments.findIndex((a) => a.id === bookingCode);
  if (existingIndex !== -1) {
    currentAppointments[existingIndex] = {
      ...currentAppointments[existingIndex],
      patientName: data.patientName || currentAppointments[existingIndex].patientName,
      patientPhone: data.patientPhone || currentAppointments[existingIndex].patientPhone,
      patientEmail: data.patientEmail || currentAppointments[existingIndex].patientEmail,
      patientAge: data.age || currentAppointments[existingIndex].patientAge,
      patientGender: (data.gender as any) || currentAppointments[existingIndex].patientGender,
      department: data.department || currentAppointments[existingIndex].department,
      date: data.date || currentAppointments[existingIndex].date,
      time: data.time || currentAppointments[existingIndex].time,
      status: (data.status as any) || currentAppointments[existingIndex].status,
      reason: data.reason || currentAppointments[existingIndex].reason,
    };
    saveStoredAppointments(currentAppointments);
    return currentAppointments[existingIndex];
  }

  let patient = currentPatients.find(
    (p) => (data.patientEmail && p.email && p.email.toLowerCase() === data.patientEmail.toLowerCase()) || (data.patientPhone && p.phone === data.patientPhone)
  );

  if (!patient) {
    patient = {
      id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
      mrn: `MRN-${Math.floor(10000 + Math.random() * 90000)}`,
      name: data.patientName || "Guest Patient",
      age: data.age || 32,
      gender: (data.gender as any) || "Male",
      phone: data.patientPhone || "",
      email: data.patientEmail || "",
      bloodGroup: "O+",
      address: "Submitted via Website / Online Booking",
      disease: data.department || "General Consultation",
      lastVisit: data.date || new Date().toISOString().split("T")[0],
      totalVisits: 1,
      status: "Active",
      allergies: ["None Reported"],
      medications: [],
      conditions: [data.department || "General Consultation"],
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    };
    currentPatients.unshift(patient);
  } else {
    patient.totalVisits += 1;
    patient.lastVisit = data.date || new Date().toISOString().split("T")[0];
    if (data.department) patient.disease = data.department;
  }

  const nowStr = new Date().toISOString();
  const newAppointment: Appointment = {
    id: bookingCode,
    patientId: patient.id,
    patientName: data.patientName || "Guest Patient",
    patientPhone: data.patientPhone || "",
    patientEmail: data.patientEmail || "",
    patientAge: data.age || patient.age,
    patientGender: (data.gender as any) || patient.gender,
    doctorName: CLINIC_INFO.doctor.name.split(',')[0],
    department: data.department || "Cardiology",
    date: data.date || new Date().toISOString().split("T")[0],
    time: data.time || "10:00 AM",
    type: "In-Person",
    status: (data.status as any) || "Pending",
    reason: data.reason || "Website Patient Booking",
    avatar: patient.avatar,
    createdAt: nowStr
  };

  currentAppointments.unshift(newAppointment);
  saveStoredAppointments(currentAppointments);
  saveStoredPatients(currentPatients);
  return newAppointment;
}

// Fetch and sync all appointments directly from Supabase / Server API into Admin Store across all devices
export async function syncSupabaseAppointmentsToStore() {
  try {
    let rows: any[] = [];

    // 1. Fetch via API endpoint (always runs for cross-device multi-client sync)
    if (typeof window !== "undefined") {
      const res = await fetch("/api/appointments").catch(() => null);
      if (res && res.ok) {
        const json = await res.json().catch(() => null);
        if (json && json.appointments && Array.isArray(json.appointments)) {
          rows = json.appointments;
        }
      }
    }

    // 2. Fetch via Supabase JS Client if configured & merge missing rows
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from("appointments")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          data.forEach((sbRow) => {
            const bId = sbRow.booking_id || sbRow.id;
            const exists = rows.some((r) => (r.booking_id || r.id) === bId);
            if (!exists) {
              rows.unshift(sbRow);
            }
          });
        }
      } catch (sbErr) {
        console.warn("Supabase direct select:", sbErr);
      }
    }

    const currentLocal = getStoredAppointments();
    const serverIds = new Set<string>();

    rows.forEach((row) => {
      const bId = row.booking_id || row.id;
      if (bId) serverIds.add(bId);
      addAppointmentFromWebsite({
        bookingId: bId,
        patientName: row.name || row.patientName,
        patientPhone: row.phone || row.patientPhone,
        patientEmail: row.email || row.patientEmail,
        date: row.preferred_date || row.date,
        time: row.preferred_time || row.time,
        department: row.disease || row.department,
        reason: row.message || row.reason,
        age: row.age || row.patientAge,
        gender: row.gender || row.patientGender,
        status: row.status,
      });
    });

    // Purge local appointments that were deleted on the server across devices,
    // but ALWAYS protect recently booked local appointments (< 10 mins) so sync-in-flight is never wiped.
    if (serverIds.size > 0 && currentLocal.length > 0) {
      const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
      const reconciled = currentLocal.filter((localApt) => {
        if (!localApt.id || localApt.id.startsWith("APT-100")) return true;
        if (serverIds.has(localApt.id)) return true;
        if (localApt.createdAt) {
          const createdTime = new Date(localApt.createdAt).getTime();
          if (!isNaN(createdTime) && createdTime > tenMinutesAgo) {
            return true;
          }
        }
        return false;
      });
      if (reconciled.length !== currentLocal.length) {
        saveStoredAppointments(reconciled);
      }
    }

    notifyChange();
  } catch (err) {
    console.warn("Supabase Sync Error:", err);
  }
}

// React Hook for Realtime & Live Clinic Data across all devices
export function useLiveClinicData() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [messages, setMessages] = useState<MessageThread[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const refreshData = () => {
    setAppointments(getStoredAppointments());
    setPatients(getStoredPatients());
    setMessages(getStoredMessages());
    setIsLoaded(true);
  };

  useEffect(() => {
    refreshData();
    syncSupabaseAppointmentsToStore().then(() => refreshData());

    // Background sync polling every 3 seconds for instant cross-device synchronization
    const syncInterval = setInterval(() => {
      syncSupabaseAppointmentsToStore().then(() => refreshData());
    }, 3000);

    // 1. Storage & local broadcast listener
    const handleEvent = () => refreshData();
    if (typeof window !== "undefined") {
      window.addEventListener(EVENT_NAME, handleEvent);
      window.addEventListener("storage", handleEvent);
    }

    // 2. Supabase Realtime channel subscription with unique instance ID
    let channel: any = null;
    if (isSupabaseConfigured) {
      try {
        const channelId = `realtime-appointments-${Math.random().toString(36).substring(2, 9)}`;
        channel = supabase
          .channel(channelId)
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "appointments" },
            (payload) => {
              if (payload.eventType === "INSERT" && payload.new) {
                addAppointmentFromWebsite({
                  bookingId: payload.new.booking_id,
                  patientName: payload.new.name,
                  patientPhone: payload.new.phone,
                  patientEmail: payload.new.email,
                  date: payload.new.preferred_date,
                  time: payload.new.preferred_time,
                  department: payload.new.disease,
                  reason: payload.new.message,
                  age: payload.new.age,
                  gender: payload.new.gender,
                  status: payload.new.status,
                });
              }
              refreshData();
            }
          )
          .subscribe();
      } catch (err) {
        console.warn("Realtime subscription:", err);
      }
    }

    return () => {
      clearInterval(syncInterval);
      if (typeof window !== "undefined") {
        window.removeEventListener(EVENT_NAME, handleEvent);
        window.removeEventListener("storage", handleEvent);
      }
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return {
    appointments,
    setAppointments: (apts: Appointment[]) => {
      setAppointments(apts);
      saveStoredAppointments(apts);
    },
    patients,
    setPatients: (pats: Patient[]) => {
      setPatients(pats);
      saveStoredPatients(pats);
    },
    messages,
    setMessages: (msgs: MessageThread[]) => {
      setMessages(msgs);
      saveStoredMessages(msgs);
    },
    approveAppointment: (id: string) => updateAppointmentStatus(id, "Approved"),
    rejectAppointment: (id: string) => updateAppointmentStatus(id, "Rejected"),
    completeAppointment: (id: string) => updateAppointmentStatus(id, "Completed"),
    cancelAppointment: (id: string) => updateAppointmentStatus(id, "Cancelled"),
    rescheduleAppointment: (id: string, date: string, time: string) =>
      rescheduleAppointmentInStore(id, date, time),
    deleteAppointment: (id: string) => deleteAppointmentFromStore(id),
    deletePatient: (patientId: string) => deletePatientFromStore(patientId),
    isLoaded,
    refreshData
  };
}
