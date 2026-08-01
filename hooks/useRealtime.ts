"use client";

import { useEffect } from "react";
import { subscribeToAppointmentsRealtime } from "../services/supabase/realtime";
import { SupabaseRealtimePayload } from "../types";

export function useRealtime(onAppointmentChange?: (payload: SupabaseRealtimePayload) => void) {
  useEffect(() => {
    if (!onAppointmentChange) return;

    const subscription = subscribeToAppointmentsRealtime(onAppointmentChange);

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [onAppointmentChange]);
}
