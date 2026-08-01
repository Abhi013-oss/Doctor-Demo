import { PatientList } from "@/features/patients/PatientList";

export const metadata = {
  title: "Clients | Console",
  description: "Manage client directory and profiles",
};

export default function PatientsPage() {
  return <PatientList />;
}
