import { DashboardOverview } from "@/features/dashboard/DashboardOverview";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard | Operations Console",
  description: "Operations console dashboard",
};

export default function DashboardPage() {
  return <DashboardOverview />;
}
