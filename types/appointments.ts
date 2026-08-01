export type AppointmentStatus =
  | "Pending"
  | "Approved"
  | "Completed"
  | "Cancelled"
  | "Rejected"
  | "Scheduled"
  | "Waiting"
  | "In Progress";

export type AppointmentType = "In-Person" | "Telehealth" | "Follow-up" | "Emergency";

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: number;
  patientGender: "Male" | "Female" | "Other";
  doctorName: string;
  department: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  avatar?: string;
  createdAt?: string;
}

export interface AppointmentRecord {
  booking_id: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: string;
  disease: string;
  preferred_date: string;
  preferred_time: string;
  message?: string;
  status?: string;
}

export interface CreateAppointmentInput {
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  date?: string;
  time?: string;
  department?: string;
  reason?: string;
  age?: number;
  gender?: "Male" | "Female" | "Other";
}
