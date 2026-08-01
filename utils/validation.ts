/**
  Validates email format using standard regex.
 */
export function validateEmail(email: string): boolean {
  if (!email) return false;
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

/**
  Validates phone number has minimum required digits.
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return false;
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7;
}

/**
  Validates booking payload fields.
 */
export function validateBookingForm(data: {
  patientName?: string;
  patientEmail?: string;
  patientPhone?: string;
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  if (!data.patientName || data.patientName.trim().length < 2) {
    errors.patientName = "Full name is required (minimum 2 characters).";
  }

  if (!data.patientEmail || !validateEmail(data.patientEmail)) {
    errors.patientEmail = "A valid email address is required.";
  }

  if (!data.patientPhone || !validatePhone(data.patientPhone)) {
    errors.patientPhone = "A valid contact phone number is required.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
