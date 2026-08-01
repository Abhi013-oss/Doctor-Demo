import { NextResponse } from "next/server";
import { insertContactMessage, isSupabaseConfigured } from "@/lib/supabase";

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

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON request payload." },
        { status: 400 }
      );
    }

    const { name, email, phone, subject, message } = body;

    const cleanName = sanitizeInput(name);
    if (!cleanName || cleanName.length < 2) {
      return NextResponse.json(
        { success: false, message: "Name must be at least 2 characters." },
        { status: 400 }
      );
    }

    const cleanEmail = sanitizeInput(email).toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const cleanPhone = sanitizeInput(phone);
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{7,15}$/;
    if (!cleanPhone || !phoneRegex.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid phone number (7-15 digits)." },
        { status: 400 }
      );
    }

    const cleanSubject = sanitizeInput(subject) || "General Inquiry";
    const cleanMessage = sanitizeInput(message);
    if (!cleanMessage || cleanMessage.length < 5) {
      return NextResponse.json(
        { success: false, message: "Message must be at least 5 characters long." },
        { status: 400 }
      );
    }

    if (cleanMessage.length > 2000) {
      return NextResponse.json(
        { success: false, message: "Message text cannot exceed 2000 characters." },
        { status: 400 }
      );
    }

    const contactPayload = {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      subject: cleanSubject,
      message: cleanMessage,
      status: "Unread",
    };

    const { error: dbError } = await insertContactMessage(contactPayload);

    if (dbError) {
      console.error("Supabase Database Error [contact_messages]:", dbError);
      return NextResponse.json(
        { success: false, message: "Failed to save message due to a database error." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your message has been saved. Our administration team will contact you shortly.",
        supabaseSynced: isSupabaseConfigured,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("API /api/contact Error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
