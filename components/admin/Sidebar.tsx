"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  LogOut,
  Stethoscope,
  ShieldCheck,
  X,
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useLiveClinicData } from "@/lib/store";
import { CLINIC_INFO } from "@/lib/data";
import { getCurrentClinicStatus, ClinicStatusInfo } from "@/lib/clinic-status";
import { useBusiness } from "@/hooks/useBusiness";

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function Sidebar({ mobileOpen = false, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { appointments } = useLiveClinicData();
  const { terms } = useBusiness();
  const [statusInfo, setStatusInfo] = useState<ClinicStatusInfo>(getCurrentClinicStatus);

  useEffect(() => {
    setStatusInfo(getCurrentClinicStatus());
    const interval = setInterval(() => {
      setStatusInfo(getCurrentClinicStatus());
    }, 30000);

    const handleUpdate = () => setStatusInfo(getCurrentClinicStatus());
    window.addEventListener("dc_store_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      clearInterval(interval);
      window.removeEventListener("dc_store_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const activeAppointmentsCount = appointments.length;

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: terms.bookingsLabel,
      href: "/appointments",
      icon: Calendar,
      badge: activeAppointmentsCount > 0 ? `${activeAppointmentsCount} Today` : null,
    },
    {
      name: terms.clientsLabel,
      href: "/patients",
      icon: Users,
      badge: null,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      badge: null,
    },
  ];

  const content = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <Link
          href="/dashboard"
          onClick={() => setMobileOpen?.(false)}
          className="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 p-0.5 shadow-lg shadow-teal-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Stethoscope className="w-5.5 h-5.5 text-teal-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-white">AgencyConsole</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Admin
              </span>
            </div>
          </div>
        </Link>

        {/* Mobile close button */}
        {setMobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
          Main Console
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen?.(false)}
              className={`group relative flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-teal-500/20 via-teal-500/10 to-transparent text-white font-semibold border-l-4 border-teal-400 shadow-sm"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-teal-400" : "text-slate-400 group-hover:text-teal-300"
                  }`}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Dynamic Real-time Status Banner */}
        <div className="pt-6 px-2">
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-800/80 backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs font-medium text-slate-300 mb-2">
              <span
                className={`flex items-center gap-1.5 font-semibold ${
                  statusInfo.badgeColor === "emerald"
                    ? "text-emerald-400"
                    : statusInfo.badgeColor === "rose"
                    ? "text-rose-400"
                    : statusInfo.badgeColor === "amber"
                    ? "text-amber-400"
                    : "text-slate-400"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  {statusInfo.isOpen && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      statusInfo.badgeColor === "emerald"
                        ? "bg-emerald-500"
                        : statusInfo.badgeColor === "rose"
                        ? "bg-rose-500"
                        : statusInfo.badgeColor === "amber"
                        ? "bg-amber-500"
                        : "bg-slate-500"
                    }`}
                  ></span>
                </span>
                {statusInfo.statusText}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {statusInfo.badgeLabel}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {statusInfo.subtext}
            </p>
          </div>
        </div>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"}
              alt={user?.name || CLINIC_INFO.doctor.name.split(',')[0]}
              className="w-10 h-10 rounded-full object-cover border-2 border-teal-500/30 ring-2 ring-slate-900"
              suppressHydrationWarning
            />
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate" suppressHydrationWarning>
                {user?.name || CLINIC_INFO.doctor.name.split(',')[0]}
              </p>
              <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-teal-400 inline" />
                {user?.role || "Administrator"}
              </p>
            </div>
          </div>

          <button
            onClick={() => logout()}
            title="Logout of Admin"
            className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 z-30 shrink-0">
        {content}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen?.(false)}
          />
          <div className="relative flex-1 max-w-xs w-full h-full z-10 animate-in slide-in-from-left duration-300">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
