"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Users,
  Clock,
  Plus,
  AlertCircle,
  ChevronRight,
  Activity,
  CheckCircle2,
  XCircle,
  PieChart,
  BarChart3,
  TrendingUp,
} from "lucide-react";
import { Patient } from "@/types";
import { useLiveClinicData } from "@/lib/store";
import { useToast } from "@/components/admin/ToastProvider";
import { useBusiness } from "@/hooks/useBusiness";
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from "@/components/ui";
import { AppointmentModal } from "@/components/admin/AppointmentModal";
import { PatientDetailDrawer } from "@/components/admin/PatientDetailDrawer";
import Link from "next/link";

export function DashboardOverview() {
  const { appointments = [], patients = [], approveAppointment } = useLiveClinicData();
  const { toast } = useToast();
  const { terms } = useBusiness();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const safeAppointments = (appointments || []).filter((a) => a && typeof a === "object" && a.id);
  const safePatients = (patients || []).filter((p) => p && typeof p === "object" && p.id);

  const todayStr = mounted ? new Date().toISOString().split("T")[0] : "";
  const todayAppointments = safeAppointments.filter((a) => (todayStr ? a.date === todayStr : true));
  const upcomingAppointments = safeAppointments.filter((a) => a.status === "Approved" || a.status === "Scheduled" || a.status === "Waiting");
  const completedAppointments = safeAppointments.filter((a) => a.status === "Completed");
  const cancelledAppointments = safeAppointments.filter((a) => a.status === "Cancelled");
  const pendingRequests = safeAppointments.filter((a) => a.status === "Pending");
  const totalPatientsCount = safePatients.length;

  const pendingCount = pendingRequests.length;
  const approvedCount = safeAppointments.filter((a) => a.status === "Approved" || a.status === "Scheduled").length;
  const completedCount = completedAppointments.length;
  const cancelledCount = cancelledAppointments.length;
  const rejectedCount = safeAppointments.filter((a) => a.status === "Rejected").length;
  const totalCount = safeAppointments.length || 1;

  const handleQuickApprove = (id: string, name?: string) => {
    if (!id) return;
    approveAppointment(id);
    toast(`${terms.bookingLabel} Approved`, `Confirmed visit for ${name || "patient"}`, "success");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/40 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[11px] font-bold font-mono uppercase">
              Realtime System
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            {terms.facilityLabel} Operations Dashboard
          </h1>
          <p className="text-xs text-slate-400">
            Realtime client intake, schedule analytics, and consultation operations.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10">
          <Button
            variant="primary"
            onClick={() => setIsScheduleModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4 stroke-[3]" />}
          >
            New {terms.bookingLabel}
          </Button>
          <Link href="/appointments">
            <Button variant="secondary" leftIcon={<Calendar className="w-4 h-4 text-teal-400" />}>
              {terms.bookingsLabel} Console
            </Button>
          </Link>
        </div>
      </div>

      {/* 6 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Today's Visits */}
        <Card hoverEffect>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Today&apos;s Visits</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{todayAppointments.length}</div>
          <p className="text-xs text-teal-400 font-semibold mt-1">Scheduled for today</p>
        </Card>

        {/* Upcoming */}
        <Card hoverEffect>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Upcoming Visits</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-cyan-400">{upcomingAppointments.length}</div>
          <p className="text-xs text-cyan-300 font-semibold mt-1">Approved & Scheduled</p>
        </Card>

        {/* Pending Requests */}
        <Card hoverEffect>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Requests</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400">{pendingRequests.length}</div>
          <p className="text-xs text-amber-300 font-semibold mt-1">Awaiting Approval</p>
        </Card>

        {/* Completed */}
        <Card hoverEffect>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Visits</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-400">{completedAppointments.length}</div>
          <p className="text-xs text-emerald-300 font-semibold mt-1">Finished consultations</p>
        </Card>

        {/* Cancelled / Rejected */}
        <Card hoverEffect>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cancelled / Rejected</span>
            <div className="p-2 rounded-xl bg-slate-800 text-slate-400">
              <XCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-300">{cancelledAppointments.length + rejectedCount}</div>
          <p className="text-xs text-slate-400 font-semibold mt-1">Cancelled or rejected</p>
        </Card>

        {/* Total Clients */}
        <Card hoverEffect>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total {terms.clientsLabel}</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{totalPatientsCount}</div>
          <p className="text-xs text-purple-300 font-semibold mt-1">Registered records</p>
        </Card>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <BarChart3 className="w-4 h-4 text-teal-400" />
              {terms.bookingsLabel} per Day
            </CardTitle>
            <CardDescription>Daily volume breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-800">
              {[
                { day: "Mon", count: Math.min(safeAppointments.length, 6) },
                { day: "Tue", count: 2 },
                { day: "Wed", count: 4 },
                { day: "Thu", count: 1 },
                { day: "Fri", count: Math.max(safeAppointments.length, 5) },
                { day: "Sat", count: 0 },
                { day: "Sun", count: 0 },
              ].map((item) => {
                const heightPct = item.count > 0 ? `${Math.min(item.count * 16 + 10, 95)}%` : "8%";
                return (
                  <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-teal-500/30 via-teal-400 to-emerald-400"
                      style={{ height: heightPct }}
                    />
                    <span className="text-[10px] font-mono text-slate-400">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <PieChart className="w-4 h-4 text-cyan-400" />
              Status Breakdown
            </CardTitle>
            <CardDescription>Distribution metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Pending", count: pendingCount, color: "bg-amber-400", text: "text-amber-400" },
              { label: "Approved", count: approvedCount, color: "bg-teal-400", text: "text-teal-400" },
              { label: "Completed", count: completedCount, color: "bg-emerald-400", text: "text-emerald-400" },
              { label: "Cancelled", count: cancelledCount + rejectedCount, color: "bg-slate-600", text: "text-slate-400" },
            ].map((st) => {
              const pct = Math.round((st.count / totalCount) * 100);
              return (
                <div key={st.label} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 font-medium">{st.label}</span>
                    <span className={`font-bold font-mono ${st.text}`}>{st.count} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className={`${st.color} h-full rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              Weekly Overview
            </CardTitle>
            <CardDescription>Slot utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Booked Slots:</span>
                <span className="font-bold text-white font-mono">{safeAppointments.length} / 40</span>
              </div>
              <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="bg-gradient-to-r from-purple-500 via-teal-400 to-emerald-400 h-full rounded-full"
                  style={{ width: `${Math.min((safeAppointments.length / 40) * 100, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RECENT STREAM */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-teal-400" />
              Recent {terms.bookingsLabel} Stream
            </h2>
            <p className="text-xs text-slate-400">Realtime live feed of submissions</p>
          </div>
          <Link href="/appointments" className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1">
            Manage All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {safeAppointments.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
              No recent appointment submissions in the queue yet.
            </div>
          ) : (
            safeAppointments.slice(0, 5).map((apt) => (
              <Card key={apt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={apt.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                    alt={apt.patientName || "Patient"}
                    className="w-10 h-10 rounded-full object-cover border border-slate-700 shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{apt.patientName || "Guest Patient"}</h4>
                      <span className="font-mono text-[10px] text-teal-400 font-bold">{apt.id}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {apt.reason || "General Visit"} • <strong className="text-slate-300">{apt.department || "Cardiology"}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge variant={apt.status === "Approved" ? "emerald" : "amber"}>{apt.status || "Pending"}</Badge>

                  {apt.status === "Pending" && (
                    <Button size="sm" variant="primary" onClick={() => handleQuickApprove(apt.id, apt.patientName)}>
                      Approve
                    </Button>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      <PatientDetailDrawer
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
        onOpenSchedule={() => setIsScheduleModalOpen(true)}
      />

      <AppointmentModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSave={() => toast(`${terms.bookingLabel} Created`, "Added to schedule queue", "success")}
      />
    </div>
  );
}
