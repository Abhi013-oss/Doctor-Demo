/**
  Formats an ISO string or Date into a human readable date string.
 */
export function formatDate(dateString: string | Date | undefined | null): string {
  if (!dateString) return "";
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
  Formats a date string into a standard short date format (YYYY-MM-DD).
 */
export function formatISOShortDate(date: Date = new Date()): string {
  return date.toISOString().split("T")[0];
}

/**
  Formats a time string into 12-hour AM/PM time.
 */
export function formatTime(timeStr?: string): string {
  if (!timeStr) return "";
  return timeStr.trim();
}

/**
  Formats date and time together.
 */
export function formatDateTime(dateStr?: string, timeStr?: string): string {
  const d = formatDate(dateStr);
  const t = formatTime(timeStr);
  if (d && t) return `${d} at ${t}`;
  return d || t || "";
}

/**
  Generates a unique booking reference ID (e.g. APT-89213).
 */
export function generateBookingId(prefix: string = "APT"): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${randomNum}`;
}
