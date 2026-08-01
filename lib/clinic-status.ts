import { getStoredClinicSettings } from "./store";

export interface ClinicStatusInfo {
  isOpen: boolean;
  statusText: string;
  badgeColor: "emerald" | "amber" | "rose" | "slate";
  badgeLabel: string;
  subtext: string;
  hoursText: string;
}

export const DEFAULT_CLINIC_STATUS: ClinicStatusInfo = {
  isOpen: true,
  statusText: "Clinic Open",
  badgeColor: "emerald",
  badgeLabel: "Live",
  subtext: "Accepting appointments & live consultation updates.",
  hoursText: "Mon - Fri: 8:00 AM - 8:00 PM"
};

/**
 * Computes dynamic real-time clinic operating status based on
 * current time, operating hours, weekly off, holidays, lunch break, and emergency closure settings.
 */
export function getCurrentClinicStatus(): ClinicStatusInfo {
  if (typeof window === "undefined") {
    return DEFAULT_CLINIC_STATUS;
  }

  const settings = getStoredClinicSettings();
  const now = new Date();

  // 1. Emergency Closure Check
  if (settings.emergencyClosure) {
    return {
      isOpen: false,
      statusText: "Emergency Closure",
      badgeColor: "rose",
      badgeLabel: "Closed",
      subtext: settings.emergencyMessage || "Temporarily closed for emergency maintenance.",
      hoursText: "Emergency Maintenance"
    };
  }

  // 2. Day of Week Check
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const currentDayName = daysOfWeek[now.getDay()];

  // Check if today is a public holiday
  const todayHoliday = settings.publicHolidays?.find((h) => h.date === now.toISOString().split("T")[0]);
  if (todayHoliday) {
    return {
      isOpen: false,
      statusText: `Closed (${todayHoliday.name})`,
      badgeColor: "amber",
      badgeLabel: "Holiday",
      subtext: `Closed today for ${todayHoliday.name}.`,
      hoursText: "Public Holiday"
    };
  }

  const daySchedule = settings.workingHours?.find((d) => d.day === currentDayName);

  if (!daySchedule || !daySchedule.isOpen || settings.weeklyOff?.includes(currentDayName)) {
    return {
      isOpen: false,
      statusText: "Closed Today",
      badgeColor: "amber",
      badgeLabel: "Off Day",
      subtext: `Clinic is closed on ${currentDayName}s.`,
      hoursText: `Closed on ${currentDayName}s`
    };
  }

  // Parse open & close times (e.g., "08:00 AM" and "08:00 PM")
  const parseTimeString = (timeStr: string) => {
    if (!timeStr || timeStr === "Closed") return null;
    const match = timeStr.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return null;
    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const ampm = match[3].toUpperCase();
    if (ampm === "PM" && hours < 12) hours += 12;
    if (ampm === "AM" && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = parseTimeString(daySchedule.openTime) ?? 8 * 60; // 8:00 AM default
  const closeMinutes = parseTimeString(daySchedule.closeTime) ?? 20 * 60; // 8:00 PM default

  const lunchStart = parseTimeString(settings.lunchBreak?.start) ?? 13 * 60; // 1:00 PM
  const lunchEnd = parseTimeString(settings.lunchBreak?.end) ?? 14 * 60; // 2:00 PM

  // 3. Lunch Break Check
  if (currentMinutes >= lunchStart && currentMinutes < lunchEnd) {
    return {
      isOpen: false,
      statusText: "Lunch Break",
      badgeColor: "amber",
      badgeLabel: "Break",
      subtext: `Afternoon break (${settings.lunchBreak.start} - ${settings.lunchBreak.end}). Reopening soon.`,
      hoursText: `${daySchedule.openTime} - ${daySchedule.closeTime}`
    };
  }

  // 4. Working Hours Check
  if (currentMinutes >= openMinutes && currentMinutes < closeMinutes) {
    return {
      isOpen: true,
      statusText: "Clinic Open",
      badgeColor: "emerald",
      badgeLabel: "Live",
      subtext: "Accepting appointments & live consultation updates.",
      hoursText: `${daySchedule.openTime} - ${daySchedule.closeTime}`
    };
  }

  // 5. Outside Operating Hours (e.g. night)
  return {
    isOpen: false,
    statusText: "Closed for the Day",
    badgeColor: "slate",
    badgeLabel: "Closed",
    subtext: `Operating hours: ${daySchedule.openTime} - ${daySchedule.closeTime}. Reopening tomorrow at 8:00 AM.`,
    hoursText: `${daySchedule.openTime} - ${daySchedule.closeTime}`
  };
}
