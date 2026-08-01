"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/admin/Sidebar";
import { TopNav } from "@/components/admin/TopNav";
import { CommandPalette } from "@/components/admin/CommandPalette";
import { AppointmentModal } from "@/components/admin/AppointmentModal";
import { ToastProvider } from "@/components/admin/ToastProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row overflow-x-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        {/* Main Content Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Top Navigation */}
          <TopNav
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            onOpenCommandPalette={() => setCommandPaletteOpen(true)}
            onOpenNewAppointment={() => setAppointmentModalOpen(true)}
          />

          {/* Page View Body */}
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-8">
            {children}
          </main>
        </div>

        {/* Global Command Palette Search Dialog */}
        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
        />

        {/* Quick Schedule Appointment Modal */}
        <AppointmentModal
          isOpen={appointmentModalOpen}
          onClose={() => setAppointmentModalOpen(false)}
          onSave={(newApt) => {
            console.log("Created appointment:", newApt);
          }}
        />
      </div>
    </ToastProvider>
  );
}
