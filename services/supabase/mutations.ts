import { supabase, isSupabaseConfigured } from "./client";
import { AppointmentRecord, ContactMessageRecord } from "../../types";

export async function insertAppointmentRecord(record: AppointmentRecord) {
  if (!isSupabaseConfigured) {
    return { data: [record], error: null };
  }
  return await supabase.from("appointments").insert([record]);
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
