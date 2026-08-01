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

// 1. Appointments Storage Helpers
export function getStoredAppointments(): Appointment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredAppointments(appointments: Appointment[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
    notifyChange();
  }
}

// 2. Patients Storage Helpers
export function getStoredPatients(): Patient[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PATIENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredPatients(patients: Patient[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
    notifyChange();
  }
}

// 3. Messages Storage Helpers
export function getStoredMessages(): MessageThread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStoredMessages(threads: MessageThread[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(threads));
    notifyChange();
  }
}

// ==========================================
// ENTERPRISE ACTION WORKFLOW FUNCTIONS
// ==========================================

export function updateAppointmentStatus(id: string, newStatus: Appointment['status']) {
  const current = getStoredAppointments();
  const updated = current.map((a) => (a.id === id ? { ...a, status: newStatus } : a));
  saveStoredAppointments(updated);
}

export function rescheduleAppointmentInStore(id: string, newDate: string, newTime: string) {
  const current = getStoredAppointments();
  const updated = current.map((a) =>
    a.id === id ? { ...a, date: newDate, time: newTime, status: "Approved" as const } : a
  );
  saveStoredAppointments(updated);
}

export function deleteAppointmentFromStore(id: string) {
  const current = getStoredAppointments();
  const target = current.find((a) => a.id === id);
  const updated = current.filter((a) => a.id !== id);
  saveStoredAppointments(updated);

  if (target) {
    const remainingForPatient = updated.filter(
      (a) => a.patientId === target.patientId || (target.patientEmail && a.patientEmail.toLowerCase() === target.patientEmail.toLowerCase())
    );

    const patients = getStoredPatients();
    if (remainingForPatient.length === 0) {
      // If 0 appointments remain for this patient, remove patient record automatically
      const updatedPatients = patients.filter(
        (p) => p.id !== target.patientId && (target.patientEmail ? p.email.toLowerCase() !== target.patientEmail.toLowerCase() : true)
      );
      saveStoredPatients(updatedPatients);
    } else {
      // Decrement patient visit count
      const updatedPatients = patients.map((p) => {
        if (p.id === target.patientId || (target.patientEmail && p.email.toLowerCase() === target.patientEmail.toLowerCase())) {
          return { ...p, totalVisits: Math.max(0, p.totalVisits - 1) };
        }
        return p;
      });
      saveStoredPatients(updatedPatients);
    }
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
      (a) => a.patientId !== targetPatient.id && a.patientEmail.toLowerCase() !== targetPatient.email.toLowerCase()
    );
    saveStoredAppointments(updatedAppointments);
  }
}

// Doctor Note Operations (Strictly Private to Admin Panel)
export function addDoctorNoteToPatient(patientId: string, text: string, author = CLINIC_INFO.doctor.name.split(',')[0]) {
  const patients = getStoredPatients();
  const updated = patients.map((p) => {
    if (p.id === patientId || p.email === patientId) {
      const existingNotes = p.doctorNotes || [];
      const newNote = {
        id: `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        author,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" }),
        text: text.trim(),
        isPrivate: true
      };
      return { ...p, doctorNotes: [newNote, ...existingNotes] };
    }
    return p;
  });
  saveStoredPatients(updated);
}

export function editDoctorNoteInPatient(patientId: string, noteId: string, newText: string) {
  const patients = getStoredPatients();
  const updated = patients.map((p) => {
    if (p.id === patientId || p.email === patientId) {
      const updatedNotes = (p.doctorNotes || []).map((n) =>
        n.id === noteId ? { ...n, text: newText.trim(), date: `${n.date} (Edited)` } : n
      );
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

// Helper: Public Website Booking Submission
export function addAppointmentFromWebsite(data: {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  date?: string;
  time?: string;
  department?: string;
  reason?: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
}) {
  const currentPatients = getStoredPatients();
  const currentAppointments = getStoredAppointments();

  let patient = currentPatients.find(
    (p) => p.email.toLowerCase() === data.patientEmail.toLowerCase() || p.phone === data.patientPhone
  );

  if (!patient) {
    patient = {
      id: `PAT-${Math.floor(1000 + Math.random() * 9000)}`,
      mrn: `MRN-${Math.floor(10000 + Math.random() * 90000)}`,
      name: data.patientName,
      age: data.age || 32,
      gender: data.gender || "Other",
      phone: data.patientPhone,
      email: data.patientEmail,
      bloodGroup: "O+",
      address: "Submitted via Main Website",
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
    saveStoredPatients(currentPatients);
  } else {
    patient.totalVisits += 1;
    patient.lastVisit = data.date || new Date().toISOString().split("T")[0];
    if (data.department) patient.disease = data.department;
    saveStoredPatients(currentPatients);
  }

  const nowStr = new Date().toISOString();
  const newAppointment: Appointment = {
    id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
    patientId: patient.id,
    patientName: data.patientName,
    patientPhone: data.patientPhone,
    patientEmail: data.patientEmail,
    patientAge: data.age || patient.age,
    patientGender: data.gender || patient.gender,
    doctorName: CLINIC_INFO.doctor.name.split(',')[0],
    department: data.department || "Cardiology",
    date: data.date || new Date().toISOString().split("T")[0],
    time: data.time || "10:00 AM",
    type: "In-Person",
    status: "Pending",
    reason: data.reason || "Website Patient Booking",
    avatar: patient.avatar,
    createdAt: nowStr
  };

  currentAppointments.unshift(newAppointment);
  saveStoredAppointments(currentAppointments);
  return newAppointment;
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

// React Hook for Realtime & Live Clinic Data
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

    // 1. Storage & local broadcast listener
    const handleEvent = () => refreshData();
    window.addEventListener(EVENT_NAME, handleEvent);
    window.addEventListener("storage", handleEvent);

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
                  patientName: payload.new.name,
                  patientPhone: payload.new.phone,
                  patientEmail: payload.new.email,
                  date: payload.new.preferred_date,
                  time: payload.new.preferred_time,
                  department: payload.new.disease,
                  reason: payload.new.message
                });
              } else {
                refreshData();
              }
            }
          )
          .subscribe();
      } catch (err) {
        console.warn("Realtime subscription:", err);
      }
    }

    return () => {
      window.removeEventListener(EVENT_NAME, handleEvent);
      window.removeEventListener("storage", handleEvent);
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
