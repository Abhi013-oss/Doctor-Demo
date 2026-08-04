import { NextResponse } from "next/server";
import { generateBookingId } from "@/utils/date";
import { insertAppointment, isSupabaseConfigured, supabase } from "@/lib/supabase";
import { sendAppointmentEmails, isResendConfigured } from "@/lib/email";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const FILE_PATH = path.join(DATA_DIR, "server_appointments.json");

function loadServerAppointments(): Array<Record<string, unknown>> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(FILE_PATH)) {
      const content = fs.readFileSync(FILE_PATH, "utf-8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn("Failed to load server appointments file:", err);
  }
  return [];
}

function saveServerAppointments(data: Array<Record<string, unknown>>) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.warn("Failed to save server appointments file:", err);
  }
}

function sanitizeInput(str: unknown): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .trim();
}

/**
 * GET /api/appointments
 * Fetches all persistent appointments from Supabase + Central Server Store so ANY device (laptop, phone, desktop)
 * logged into the Admin Panel gets the complete, synced patient & appointment directory.
 */
export async function GET() {
  try {
    const fileAppointments = loadServerAppointments();
    const allAppointments: Array<Record<string, unknown>> = [...fileAppointments];

    if (isSupabaseConfigured) {
      try {
        // Try querying primary appointments table
        let { data, error } = await supabase
          .from("appointments")
          .select("*")
          .order("created_at", { ascending: false });

        // Fallback query if table name is dc_live_appointments
        if (error || !data || data.length === 0) {
          const fallbackRes = await supabase
            .from("dc_live_appointments")
            .select("*")
            .order("created_at", { ascending: false });
          if (!fallbackRes.error && fallbackRes.data) {
            data = fallbackRes.data;
            error = null;
          }
        }

        if (!error && data && data.length > 0) {
          // Merge Supabase rows into allAppointments without duplicates
          data.forEach((row) => {
            const bId = row.booking_id || row.id;
            const exists = allAppointments.some((a) => (a.booking_id || a.id) === bId);
            if (!exists) {
              allAppointments.unshift(row);
            }
          });
        }
      } catch (sbErr) {
        console.warn("Supabase fetch in GET /api/appointments:", sbErr);
      }
    }

    return NextResponse.json({
      success: true,
      count: allAppointments.length,
      appointments: allAppointments,
      supabaseSynced: isSupabaseConfigured
    });
  } catch (err: unknown) {
    console.error("GET /api/appointments Error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch appointments", appointments: loadServerAppointments() },
      { status: 500 }
    );
  }
}

/**
 * POST /api/appointments
 * Inserts a new patient appointment into Supabase database and server store for cross-device sync.
 */
export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request payload.",
        },
        { status: 400 }
      );
    }

    const { name, phone, email, age, gender, disease, date, time, message, bookingId: incomingBookingId, booking_id: altBookingId, status: incomingStatus } = body;

    const errors: Record<string, string> = {};

    const cleanName = sanitizeInput(name);
    if (!cleanName || cleanName.length < 2) {
      errors.name = "Full name must be at least 2 characters.";
    } else if (cleanName.length > 100) {
      errors.name = "Full name cannot exceed 100 characters.";
    }

    const cleanPhone = sanitizeInput(phone);
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      errors.phone = "Please enter a valid contact phone number (7-15 digits).";
    }

    const cleanEmail = sanitizeInput(email).toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    const ageNum = Number(age);
    if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      errors.age = "Please enter a valid age between 1 and 120.";
    }

    const cleanGender = sanitizeInput(gender);
    if (!cleanGender) {
      errors.gender = "Please select a gender option.";
    }

    const cleanDisease = sanitizeInput(disease);
    if (!cleanDisease) {
      errors.disease = "Please specify condition or service requested.";
    }

    const cleanDate = sanitizeInput(date);
    if (!cleanDate) {
      errors.date = "Please select a preferred date.";
    }

    const cleanTime = sanitizeInput(time);
    if (!cleanTime) {
      errors.time = "Please select a preferred time slot.";
    }

    const cleanMessage = sanitizeInput(message);

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed. Please review the highlighted fields.",
          errors,
        },
        { status: 400 }
      );
    }

    const rawBookingId = sanitizeInput(incomingBookingId || altBookingId);
    const bookingId = rawBookingId || generateBookingId();
    const cleanStatus = sanitizeInput(incomingStatus) || "Pending";

    const appointmentPayload = {
      booking_id: bookingId,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      age: ageNum,
      gender: cleanGender,
      disease: cleanDisease,
      preferred_date: cleanDate,
      preferred_time: cleanTime,
      message: cleanMessage,
      status: cleanStatus,
      created_at: new Date().toISOString()
    };

    // Save into server central store for immediate cross-device sync
    const currentList = loadServerAppointments();
    const existsIndex = currentList.findIndex(
      (a) => a.booking_id === bookingId || a.id === bookingId
    );
    if (existsIndex === -1) {
      currentList.unshift(appointmentPayload);
    } else {
      currentList[existsIndex] = {
        ...currentList[existsIndex],
        ...appointmentPayload,
      };
    }
    saveServerAppointments(currentList);

    // Save into Supabase database
    const { error: dbError } = await insertAppointment(appointmentPayload);

    if (dbError) {
      console.error("Supabase Database Error [appointments]:", dbError);
    }

    const emailResult = await sendAppointmentEmails(appointmentPayload);

    return NextResponse.json(
      {
        success: true,
        bookingId,
        message: `Appointment successfully scheduled! Reference ID: ${bookingId}.`,
        appointment: appointmentPayload,
        supabaseSynced: isSupabaseConfigured,
        resendSynced: isResendConfigured,
        emailDeliveryStatus: emailResult,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("API /api/appointments Internal Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "An internal server error occurred.",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/appointments
 * Updates an appointment (status, date, time, department, notes) across all devices
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      id,
      bookingId,
      booking_id,
      status,
      date,
      preferred_date,
      time,
      preferred_time,
      disease,
      department,
      doctorName,
      reason,
      notes,
    } = body || {};

    const targetId = sanitizeInput(id || bookingId || booking_id);

    if (!targetId) {
      return NextResponse.json(
        { success: false, message: "Appointment ID is required." },
        { status: 400 }
      );
    }

    const currentList = loadServerAppointments();
    const index = currentList.findIndex(
      (a) => a.booking_id === targetId || a.id === targetId
    );

    const patchObj: Record<string, unknown> = {};
    if (status) patchObj.status = sanitizeInput(status);
    if (date || preferred_date) {
      const cleanD = sanitizeInput(date || preferred_date);
      patchObj.preferred_date = cleanD;
      patchObj.date = cleanD;
    }
    if (time || preferred_time) {
      const cleanT = sanitizeInput(time || preferred_time);
      patchObj.preferred_time = cleanT;
      patchObj.time = cleanT;
    }
    if (disease || department) {
      const cleanDept = sanitizeInput(disease || department);
      patchObj.disease = cleanDept;
      patchObj.department = cleanDept;
    }
    if (doctorName) patchObj.doctorName = sanitizeInput(doctorName);
    if (reason) patchObj.reason = sanitizeInput(reason);
    if (notes) patchObj.notes = sanitizeInput(notes);

    let updatedRecord: Record<string, unknown>;
    if (index !== -1) {
      currentList[index] = {
        ...currentList[index],
        ...patchObj,
      };
      updatedRecord = currentList[index];
    } else {
      patchObj.booking_id = targetId;
      patchObj.created_at = new Date().toISOString();
      currentList.unshift(patchObj);
      updatedRecord = patchObj;
    }

    saveServerAppointments(currentList);

    if (isSupabaseConfigured) {
      try {
        const sbUpdateData: Record<string, unknown> = {};
        if (patchObj.status) sbUpdateData.status = patchObj.status;
        if (patchObj.preferred_date) sbUpdateData.preferred_date = patchObj.preferred_date;
        if (patchObj.preferred_time) sbUpdateData.preferred_time = patchObj.preferred_time;
        if (patchObj.disease) sbUpdateData.disease = patchObj.disease;

        await supabase
          .from("appointments")
          .update(sbUpdateData)
          .or(`id.eq.${targetId},booking_id.eq.${targetId}`);
      } catch (err) {
        console.warn("Supabase update in PATCH /api/appointments:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Appointment ${targetId} updated successfully.`,
      appointment: updatedRecord,
    });
  } catch (err: unknown) {
    console.error("PATCH /api/appointments Error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update appointment" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/appointments
 * Deletes an appointment across all devices
 */
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    let targetId = url.searchParams.get("id") || url.searchParams.get("bookingId");

    if (!targetId) {
      try {
        const body = await request.json();
        targetId = body.id || body.bookingId || body.booking_id;
      } catch {}
    }

    const cleanId = sanitizeInput(targetId);
    if (!cleanId) {
      return NextResponse.json(
        { success: false, message: "Appointment ID is required." },
        { status: 400 }
      );
    }

    const currentList = loadServerAppointments();
    const removeIndex = currentList.findIndex(
      (a) => a.booking_id === cleanId || a.id === cleanId
    );

    if (removeIndex !== -1) {
      currentList.splice(removeIndex, 1);
      saveServerAppointments(currentList);
    }

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from("appointments")
          .delete()
          .or(`id.eq.${cleanId},booking_id.eq.${cleanId}`);
      } catch (err) {
        console.warn("Supabase delete in DELETE /api/appointments:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Appointment ${cleanId} deleted successfully.`,
      deletedId: cleanId,
    });
  } catch (err: unknown) {
    console.error("DELETE /api/appointments Error:", err);
    return NextResponse.json(
      { success: false, message: "Failed to delete appointment" },
      { status: 500 }
    );
  }
}
