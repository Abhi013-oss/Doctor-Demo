import { AppointmentList } from "@/features/appointments/AppointmentList";

export const metadata = {
  title: "Appointments | Operations Console",
  description: "Manage client consultations and appointments",
};

export default function AppointmentsPage() {
  return <AppointmentList />;
}
