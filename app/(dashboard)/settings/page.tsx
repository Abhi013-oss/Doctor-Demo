import { SettingsConsole } from "@/features/settings/SettingsConsole";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Settings | Operations Console",
  description: "Facility operations and account settings",
};

export default function SettingsPage() {
  return <SettingsConsole />;
}
