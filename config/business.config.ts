export type BusinessVertical =
  | "doctor"
  | "dentist"
  | "hospital"
  | "gym"
  | "salon"
  | "restaurant"
  | "interior_designer"
  | "school"
  | "real_estate";

export interface VerticalTermConfig {
  providerLabel: string;      // Doctor / Dentist / Trainer / Stylist / Chef / Designer / Teacher / Agent
  providersLabel: string;     // Doctors / Dentists / Trainers / Stylists / Chefs / Designers / Teachers / Agents
  clientLabel: string;        // Patient / Member / Client / Guest / Student / Buyer
  clientsLabel: string;       // Patients / Members / Clients / Guests / Students / Buyers
  bookingLabel: string;       // Appointment / Session / Booking / Reservation / Consultation / Viewing
  bookingsLabel: string;      // Appointments / Sessions / Bookings / Reservations / Consultations / Viewings
  facilityLabel: string;      // Clinic / Center / Gym / Salon / Restaurant / Studio / School / Agency
  recordLabel: string;        // Medical Record / Dental Chart / Training Log / Style History / Guest Preference / Project File / Student File / Property Log
}

export const VERTICAL_CONFIGS: Record<BusinessVertical, VerticalTermConfig> = {
  doctor: {
    providerLabel: "Doctor",
    providersLabel: "Doctors",
    clientLabel: "Patient",
    clientsLabel: "Patients",
    bookingLabel: "Appointment",
    bookingsLabel: "Appointments",
    facilityLabel: "Clinic & Medical Center",
    recordLabel: "Medical Record",
  },
  dentist: {
    providerLabel: "Dentist",
    providersLabel: "Dentists",
    clientLabel: "Patient",
    clientsLabel: "Patients",
    bookingLabel: "Appointment",
    bookingsLabel: "Appointments",
    facilityLabel: "Dental Clinic",
    recordLabel: "Dental Chart",
  },
  hospital: {
    providerLabel: "Physician",
    providersLabel: "Physicians",
    clientLabel: "Patient",
    clientsLabel: "Patients",
    bookingLabel: "Appointment",
    bookingsLabel: "Appointments",
    facilityLabel: "Hospital & Medical Center",
    recordLabel: "Patient File",
  },
  gym: {
    providerLabel: "Fitness Trainer",
    providersLabel: "Trainers",
    clientLabel: "Member",
    clientsLabel: "Members",
    bookingLabel: "Training Session",
    bookingsLabel: "Training Sessions",
    facilityLabel: "Fitness Club & Gym",
    recordLabel: "Fitness Log",
  },
  salon: {
    providerLabel: "Stylist",
    providersLabel: "Stylists",
    clientLabel: "Client",
    clientsLabel: "Clients",
    bookingLabel: "Booking",
    bookingsLabel: "Bookings",
    facilityLabel: "Beauty Salon & Spa",
    recordLabel: "Style Profile",
  },
  restaurant: {
    providerLabel: "Head Chef / Host",
    providersLabel: "Hospitality Team",
    clientLabel: "Guest",
    clientsLabel: "Guests",
    bookingLabel: "Reservation",
    bookingsLabel: "Reservations",
    facilityLabel: "Restaurant & Lounge",
    recordLabel: "Dining Preference",
  },
  interior_designer: {
    providerLabel: "Interior Designer",
    providersLabel: "Designers",
    clientLabel: "Client",
    clientsLabel: "Clients",
    bookingLabel: "Design Consultation",
    bookingsLabel: "Consultations",
    facilityLabel: "Design Studio",
    recordLabel: "Project Brief",
  },
  school: {
    providerLabel: "Instructor / Teacher",
    providersLabel: "Faculty",
    clientLabel: "Student",
    clientsLabel: "Students",
    bookingLabel: "Class Session",
    bookingsLabel: "Class Sessions",
    facilityLabel: "Academy & School",
    recordLabel: "Student Profile",
  },
  real_estate: {
    providerLabel: "Real Estate Agent",
    providersLabel: "Agents",
    clientLabel: "Client / Buyer",
    clientsLabel: "Clients & Buyers",
    bookingLabel: "Property Viewing",
    bookingsLabel: "Property Viewings",
    facilityLabel: "Realty Agency",
    recordLabel: "Property Interest Log",
  },
};

/**
 * Gets the current active vertical configuration based on environment variables or default fallback.
 */
export function getActiveVertical(): BusinessVertical {
  const envVertical = (process.env.NEXT_PUBLIC_AGENCY_VERTICAL || process.env.NEXT_PUBLIC_BUSINESS_TYPE || "doctor").toLowerCase();
  if (envVertical in VERTICAL_CONFIGS) {
    return envVertical as BusinessVertical;
  }
  return "doctor";
}

export function getActiveVerticalTerms(): VerticalTermConfig {
  return VERTICAL_CONFIGS[getActiveVertical()];
}
