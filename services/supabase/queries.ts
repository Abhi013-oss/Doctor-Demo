import { supabase, isSupabaseConfigured } from "./client";
import { AppointmentRecord, ContactMessageRecord } from "../../types";

export async function fetchSupabaseAppointments(): Promise<{ data: AppointmentRecord[] | null; error: string | null }> {
  if (!isSupabaseConfigured) return { data: null, error: "Supabase not configured" };

  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: data as AppointmentRecord[], error: null };
}

export async function fetchSupabaseContactMessages(): Promise<{ data: ContactMessageRecord[] | null; error: string | null }> {
  if (!isSupabaseConfigured) return { data: null, error: "Supabase not configured" };

  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data: data as ContactMessageRecord[], error: null };
}
