"use client";

import { useLiveClinicData } from "../lib/store";
import { Appointment, AppointmentStatus } from "../types";

export function useAppointments() {
  const {
    appointments,
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

  const getAppointmentsByStatus = (status: AppointmentStatus) => {
    return appointments.filter((apt) => apt.status === status);
  };

  const getTodayAppointments = () => {
    const todayStr = new Date().toISOString().split("T")[0];
    return appointments.filter((apt) => apt.date === todayStr);
  };

  return {
    appointments,
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
