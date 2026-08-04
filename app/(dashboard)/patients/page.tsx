import { PatientList } from "@/features/patients/PatientList";

export const metadata = {
  title: "Patients Directory | Operations Console",
  description: "Manage patient electronic health records",
};

export default function PatientsPage() {
  return <PatientList />;
}
