export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: "Medical Director" | "Attending Physician" | "Clinic Administrator" | "Nurse Practitioner" | "General Administrator";
  avatar: string;
  department: string;
}

export interface Specialization {
  id: string;
  title: string;
  iconName: string;
  shortDesc: string;
  fullDesc: string;
  conditions: string[];
  features: string[];
  gradient: string;
}

export interface Treatment {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: string;
  recoveryTime: string;
  keyBenefits: string[];
  isPopular?: boolean;
}

export interface TechItem {
  id: string;
  name: string;
  category: string;
  description: string;
  highlight: string;
  specs: string[];
  icon: string;
}

export interface Testimonial {
  id: string;
  patientName: string;
  age: number;
  location: string;
  treatment: string;
  rating: number;
  date: string;
  quote: string;
  story: string;
  verified: boolean;
  avatarUrl: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: "facilities" | "operating-theater" | "technology" | "patient-care" | "doctor";
  imageUrl: string;
  description: string;
}

export interface FAQItem {
  id: string;
  category: "General" | "Appointments" | "Insurance & Payment" | "Treatments";
  question: string;
  answer: string;
}

export interface PublicHoliday {
  id: string;
  name: string;
  date: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface WorkingHourDay {
  day: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

export interface ClinicSettings {
  // 1. Clinic Profile
  clinicName: string;
  doctorName: string;
  qualification: string;
  specialization: string;
  experienceYears: number;
  avatarUrl: string;
  coverImageUrl: string;
  logoUrl: string;

  // 2. Information & Contact
  address: string;
  googleMapsUrl: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  website: string;
  whatsappNumber: string;

  // 3. Appointment & Booking Settings
  consultationFee: number;
  slotDurationMinutes: number;
  bufferTimeMinutes: number;
  maxBookingsPerDay: number;
  workingHours: WorkingHourDay[];
  lunchBreak: {
    start: string;
    end: string;
  };
  slotIntervalMinutes: number;
  autoApproval: boolean;

  // 4. Holiday & Operations
  weeklyOff: string;
  publicHolidays: PublicHoliday[];
  vacationStart: string;
  vacationEnd: string;
  emergencyClosure: boolean;
  emergencyMessage: string;

  // 5. Notifications
  emailNotifications: boolean;
  whatsappNotifications: boolean;
  reminder24h: boolean;
  reminder2h: boolean;

  // 6. Branding
  primaryColor: string;
  secondaryColor: string;
  faviconUrl: string;

  // 7. Security
  twoFactorEnabled: boolean;
  activeSessions: ActiveSession[];
}

export interface BusinessStatusInfo {
  isOpen: boolean;
  statusText: string;
  badgeColor: "emerald" | "amber" | "rose" | "slate";
  badgeLabel: string;
  subtext: string;
  hoursText: string;
}
