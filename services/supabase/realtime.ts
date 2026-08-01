import { supabase, isSupabaseConfigured } from "./client";
import { SupabaseRealtimePayload } from "../../types";

export function subscribeToAppointmentsRealtime(callback: (payload: SupabaseRealtimePayload) => void) {
  if (!isSupabaseConfigured) return null;

  const channelId = `realtime-appointments-${Math.random().toString(36).substring(2, 9)}`;

  return supabase
    .channel(channelId)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "appointments" },
      (payload) => callback(payload as unknown as SupabaseRealtimePayload)
    )
    .subscribe();
}
