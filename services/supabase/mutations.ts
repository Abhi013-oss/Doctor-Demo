import { supabase, isSupabaseConfigured } from "./client";
import { AppointmentRecord, ContactMessageRecord } from "../../types";

export async function insertAppointmentRecord(record: AppointmentRecord) {
  if (!isSupabaseConfigured) {
    return { data: [record], error: null };
  }
  try {
    const res = await supabase.from("appointments").insert([record]);
    if (res.error) {
      console.warn("Primary Supabase insert warning:", res.error.message);
      const fallbackRes = await supabase.from("dc_live_appointments").insert([record]);
      if (!fallbackRes.error) return fallbackRes;
    }
    return res;
  } catch (err) {
    console.warn("Supabase insert exception:", err);
    return { data: [record], error: null };
  }
}

export async function insertContactMessageRecord(record: ContactMessageRecord) {
  if (!isSupabaseConfigured) {
    return { data: [record], error: null };
  }
  return await supabase.from("contact_messages").insert([record]);
}

export async function subscribeNewsletterEmail(email: string) {
  if (!isSupabaseConfigured) {
    return { data: [{ email }], error: null };
  }
  return await supabase
    .from("newsletter")
    .upsert([{ email: email.toLowerCase().trim(), is_subscribed: true }], { onConflict: "email" });
}
