"use client";

import { useLiveClinicData } from "../lib/store";
import { Appointment, AppointmentStatus } from "../types";

export function useAppointments() {
  const {
    appointments = [],
    setAppointments,
    approveAppointment,
    rejectAppointment,
    completeAppointment,
    cancelAppointment,
    rescheduleAppointment,
    deleteAppointment,
    isLoaded,
    refreshData,
  } = useLiveClinicData();

  const safeAppointments = (appointments || []).filter((apt) => apt && typeof apt === "object" && apt.id);

  const getAppointmentsByStatus = (status: AppointmentStatus) => {
    return safeAppointments.filter((apt) => apt?.status === status);
  };

  const getTodayAppointments = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    return safeAppointments.filter((apt) => apt?.date === todayStr);
  };

  return {
    appointments: safeAppointments,
    setAppointments,
    getAppointmentsByStatus,
    getTodayAppointments,
    approveAppointment,
    rejectAppointment,
    completeAppointment,
    cancelAppointment,
    rescheduleAppointment,
    deleteAppointment,
    isLoaded,
    refreshData,
  };
}
