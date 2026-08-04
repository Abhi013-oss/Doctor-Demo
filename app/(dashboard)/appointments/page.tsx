import { AppointmentList } from "@/features/appointments/AppointmentList";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Appointments | Console",
  description: "Manage client bookings and appointments",
};

export default function AppointmentsPage() {
  return <AppointmentList />;
}
