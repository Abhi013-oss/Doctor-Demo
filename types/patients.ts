export type PatientStatus =
  | "Active"
  | "New"
  | "Returning"
  | "Follow-up Required"
  | "Critical"
  | "Discharged";

export interface DoctorNote {
  id: string;
  author: string;
  date: string;
  text: string;
  isPrivate: boolean;
}

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: "Male" | "Female" | "Other";
  phone: string;
  email: string;
  bloodGroup: string;
  address: string;
  disease?: string;
  lastVisit: string;
  nextAppointment?: string;
  totalVisits: number;
  status: PatientStatus;
  allergies: string[];
  medications: string[];
  conditions: string[];
  notes?: string;
  doctorNotes?: DoctorNote[];
  avatar?: string;
}
