"use client";

import React, { useState, useEffect } from "react";
import {
  MapPin,
  Clock,
  CalendarDays,
  Bell,
  Palette,
  Shield,
  Save,
  Plus,
  Trash2,
  AlertTriangle,
  Lock,
  Globe,
  User,
  Image as ImageIcon,
  Database,
} from "lucide-react";
import { ClinicSettings, PublicHoliday } from "@/types";
import { getStoredClinicSettings, saveStoredClinicSettings } from "@/lib/store";
import { useToast } from "@/components/admin/ToastProvider";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useBusiness } from "@/hooks/useBusiness";
import { Button, Input, Select, Textarea, Card, Badge } from "@/components/ui";

type SettingsTab =
  | "profile"
  | "info"
  | "appointments"
  | "holidays"
  | "notifications"
  | "branding"
  | "security";

export function SettingsConsole() {
  const { toast } = useToast();
  const { terms } = useBusiness();

  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [settings, setSettings] = useState<ClinicSettings>(getStoredClinicSettings());

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [newHoliday, setNewHoliday] = useState({ name: "", date: "" });

  useEffect(() => {
    setSettings(getStoredClinicSettings());
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredClinicSettings(settings);
    toast("Settings Saved", "Configuration updated successfully", "success");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      toast("Validation Error", "Password must be at least 6 characters long", "error");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast("Password Mismatch", "New password and confirmation do not match", "error");
      return;
    }

    toast("Password Updated", "Security credentials updated successfully", "success");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHoliday.name || !newHoliday.date) return;

    const holiday: PublicHoliday = {
      id: `hol-${Date.now()}`,
      name: newHoliday.name.trim(),
      date: newHoliday.date,
    };

    const updated = { ...settings, publicHolidays: [...settings.publicHolidays, holiday] };
    setSettings(updated);
    saveStoredClinicSettings(updated);
    setNewHoliday({ name: "", date: "" });
    toast("Holiday Added", `Added ${holiday.name} to calendar`, "success");
  };

  const handleRemoveHoliday = (id: string) => {
    const updated = {
      ...settings,
      publicHolidays: settings.publicHolidays.filter((h) => h.id !== id),
    };
    setSettings(updated);
    saveStoredClinicSettings(updated);
    toast("Holiday Removed", "Deleted holiday entry", "info");
  };

  const handleRevokeSession = (sessionId: string) => {
    const updated = {
      ...settings,
      activeSessions: settings.activeSessions.filter((s) => s.id !== sessionId),
    };
    setSettings(updated);
    saveStoredClinicSettings(updated);
    toast("Session Revoked", "Logged out device session", "warning");
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "profile", label: `${terms.facilityLabel} Profile`, icon: User },
    { id: "info", label: "Location & Contact", icon: MapPin },
    { id: "appointments", label: `${terms.bookingLabel} Rules`, icon: Clock },
    { id: "holidays", label: "Holiday Management", icon: CalendarDays },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "branding", label: "Branding & Theme", icon: Palette },
    { id: "security", label: "Security & Sessions", icon: Shield },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">{terms.facilityLabel} Settings</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure {terms.providerLabel.toLowerCase()} credentials, operating rules, holidays, branding, and security.
          </p>
        </div>

        <Button variant="primary" size="sm" onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
          Save Changes
        </Button>
      </div>

      {/* Main Settings Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Tabs Navigation */}
        <div className="w-full lg:w-64 space-y-1.5 shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold text-left transition-all cursor-pointer ${
                  isActive
                    ? "bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20"
                    : "bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Form Panel */}
        <div className="flex-1 p-6 lg:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
          {/* TAB 1: PROFILE */}
          {activeTab === "profile" && (
            <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-white">{terms.providerLabel} & Facility Profile</h3>
                <p className="text-xs text-slate-400">Qualifications, credentials, and media assets.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Facility Name"
                  value={settings.clinicName}
                  onChange={(e) => setSettings({ ...settings, clinicName: e.target.value })}
                  required
                />
                <Input
                  label={`${terms.providerLabel} Full Name`}
                  value={settings.doctorName}
                  onChange={(e) => setSettings({ ...settings, doctorName: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Qualifications"
                  value={settings.qualification}
                  onChange={(e) => setSettings({ ...settings, qualification: e.target.value })}
                />
                <Input
                  label="Specialization"
                  value={settings.specialization}
                  onChange={(e) => setSettings({ ...settings, specialization: e.target.value })}
                />
                <Input
                  label="Experience (Years)"
                  type="number"
                  value={settings.experienceYears}
                  onChange={(e) => setSettings({ ...settings, experienceYears: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-teal-400" />
                  Media & Asset Images
                </h4>

                <Input
                  label="Profile Picture URL"
                  type="url"
                  value={settings.avatarUrl}
                  onChange={(e) => setSettings({ ...settings, avatarUrl: e.target.value })}
                />
                <Input
                  label="Cover Image URL"
                  type="url"
                  value={settings.coverImageUrl}
                  onChange={(e) => setSettings({ ...settings, coverImageUrl: e.target.value })}
                />
                <Input
                  label="Logo URL"
                  type="url"
                  value={settings.logoUrl}
                  onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="primary" type="submit" leftIcon={<Save className="w-4 h-4" />}>
                  Save Profile
                </Button>
              </div>
            </form>
          )}

          {/* TAB 2: LOCATION & CONTACT */}
          {activeTab === "info" && (
            <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-white">Location & Contact Details</h3>
              </div>

              <Input
                label="Physical Address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />

              <Input
                label="Google Maps URL"
                type="url"
                value={settings.googleMapsUrl}
                onChange={(e) => setSettings({ ...settings, googleMapsUrl: e.target.value })}
                icon={<Globe className="w-3.5 h-3.5 text-teal-400" />}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Primary Phone"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                />
                <Input
                  label="Emergency / Urgent Phone"
                  value={settings.emergencyPhone}
                  onChange={(e) => setSettings({ ...settings, emergencyPhone: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Email"
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                />
                <Input
                  label="Website URL"
                  type="url"
                  value={settings.website}
                  onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                />
                <Input
                  label="WhatsApp Number"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="primary" type="submit" leftIcon={<Save className="w-4 h-4" />}>
                  Save Information
                </Button>
              </div>
            </form>
          )}

          {/* TAB 3: APPOINTMENT RULES */}
          {activeTab === "appointments" && (
            <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-white">{terms.bookingLabel} & Schedule Rules</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Consultation Fee ($)"
                  type="number"
                  value={settings.consultationFee}
                  onChange={(e) => setSettings({ ...settings, consultationFee: Number(e.target.value) })}
                />
                <Select
                  label="Slot Duration"
                  value={settings.slotDurationMinutes}
                  onChange={(e) => setSettings({ ...settings, slotDurationMinutes: Number(e.target.value) })}
                  options={[
                    { label: "15 Minutes", value: 15 },
                    { label: "30 Minutes", value: 30 },
                    { label: "45 Minutes", value: 45 },
                    { label: "60 Minutes", value: 60 },
                  ]}
                />
                <Select
                  label="Buffer Time"
                  value={settings.bufferTimeMinutes}
                  onChange={(e) => setSettings({ ...settings, bufferTimeMinutes: Number(e.target.value) })}
                  options={[
                    { label: "5 Minutes", value: 5 },
                    { label: "10 Minutes", value: 10 },
                    { label: "15 Minutes", value: 15 },
                  ]}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="primary" type="submit" leftIcon={<Save className="w-4 h-4" />}>
                  Save Rules
                </Button>
              </div>
            </form>
          )}

          {/* TAB 4: HOLIDAYS */}
          {activeTab === "holidays" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-white">Holiday & Emergency Closure</h3>
              </div>

              <form onSubmit={handleAddHoliday} className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-teal-400" /> Add Public Holiday / Closure Date
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    placeholder="Holiday Name"
                    value={newHoliday.name}
                    onChange={(e) => setNewHoliday({ ...newHoliday, name: e.target.value })}
                    required
                  />
                  <Input
                    type="date"
                    value={newHoliday.date}
                    onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                    required
                  />
                </div>
                <Button variant="primary" size="sm" type="submit" className="ml-auto">
                  Add Date
                </Button>
              </form>

              <div className="space-y-2">
                {settings.publicHolidays.map((h) => (
                  <div key={h.id} className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{h.name}</span>
                      <span className="text-slate-400 font-mono text-[11px] block">{h.date}</span>
                    </div>
                    <button onClick={() => handleRemoveHoliday(h.id)} className="p-1.5 text-slate-500 hover:text-rose-400">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: NOTIFICATIONS */}
          {activeTab === "notifications" && (
            <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-white">Notifications & Reminders</h3>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Email Notifications</h4>
                    <p className="text-[11px] text-slate-400">Dispatch confirmation emails</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                    className="w-5 h-5 rounded bg-slate-900 border-slate-700 text-teal-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="primary" type="submit" leftIcon={<Save className="w-4 h-4" />}>
                  Save Notifications
                </Button>
              </div>
            </form>
          )}

          {/* TAB 6: BRANDING */}
          {activeTab === "branding" && (
            <form onSubmit={handleSave} className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-white">Branding & Theme Colors</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Primary Color"
                  value={settings.primaryColor}
                  onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                />
                <Input
                  label="Secondary Color"
                  value={settings.secondaryColor}
                  onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                />
              </div>

              <div className="pt-4 flex justify-end">
                <Button variant="primary" type="submit" leftIcon={<Save className="w-4 h-4" />}>
                  Save Theme
                </Button>
              </div>
            </form>
          )}

          {/* TAB 7: SECURITY */}
          {activeTab === "security" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-base font-bold text-white">Security & Active Sessions</h3>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-teal-400" />
                  <div>
                    <h4 className="text-xs font-bold text-white">Supabase Authentication Engine</h4>
                    <p className="text-[11px] text-slate-400">Postgres RLS session protection</p>
                  </div>
                </div>
                <Badge variant={isSupabaseConfigured ? "emerald" : "amber"}>
                  {isSupabaseConfigured ? "Connected" : "Mock Mode"}
                </Badge>
              </div>

              <form onSubmit={handlePasswordSubmit} className="p-4 rounded-2xl bg-slate-800/50 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Change Password</h4>
                <Input
                  type="password"
                  label="Current Password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                />
                <Input
                  type="password"
                  label="New Password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                />
                <Input
                  type="password"
                  label="Confirm New Password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                />
                <Button variant="primary" size="sm" type="submit" className="ml-auto">
                  Update Password
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
