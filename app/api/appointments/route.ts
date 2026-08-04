import { NextResponse } from "next/server";
import { generateBookingId } from "@/utils/date";
import { insertAppointment, isSupabaseConfigured, supabase } from "@/lib/supabase";
import { sendAppointmentEmails, isResendConfigured } from "@/lib/email";

// Server-side persistent in-memory appointments store for cross-device synchronization
const GLOBAL_SERVER_APPOINTMENTS: Array<Record<string, unknown>> = [];

function sanitizeInput(str: unknown): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .trim();
}

/**
 * GET /api/appointments
 * Fetches all persistent appointments from Supabase + Central Server Store so ANY device (laptop, phone, desktop)
 * logged into the Admin Panel gets the complete, synced patient & appointment directory.
 */
export async function GET() {
  try {
    const allAppointments: Array<Record<string, unknown>> = [...GLOBAL_SERVER_APPOINTMENTS];

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
      { success: false, message: "Failed to fetch appointments", appointments: GLOBAL_SERVER_APPOINTMENTS },
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

    const { name, phone, email, age, gender, disease, date, time, message } = body;

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

    const bookingId = generateBookingId();

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
      status: "Confirmed",
      created_at: new Date().toISOString()
    };

    // Save into server central memory store for immediate cross-device sync
    const exists = GLOBAL_SERVER_APPOINTMENTS.some((a) => a.booking_id === bookingId);
    if (!exists) {
      GLOBAL_SERVER_APPOINTMENTS.unshift(appointmentPayload);
    }

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
