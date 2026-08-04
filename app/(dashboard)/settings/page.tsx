import { SettingsConsole } from "@/features/settings/SettingsConsole";

export const metadata = {
  title: "Settings | Operations Console",
  description: "Configure clinic rules, security, and preferences",
};

export default function SettingsPage() {
  return <SettingsConsole />;
}
