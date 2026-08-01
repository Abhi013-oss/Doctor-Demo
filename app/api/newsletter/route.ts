import { NextResponse } from "next/server";
import { subscribeNewsletter, isSupabaseConfigured } from "@/lib/supabase";

function sanitizeInput(str: unknown): string {
  if (typeof str !== "string") return "";
  return str.replace(/[&<>"']/g, "").trim();
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

    const { email } = body;
    const cleanEmail = sanitizeInput(email).toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const { error: dbError } = await subscribeNewsletter(cleanEmail);

    if (dbError) {
      console.error("Supabase Database Error [newsletter]:", dbError);
      return NextResponse.json(
        { success: false, message: "Failed to subscribe email. Please try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Successfully subscribed to newsletter insights!",
        supabaseSynced: isSupabaseConfigured,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("API /api/newsletter Error:", error);
    return NextResponse.json(
      { success: false, message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
