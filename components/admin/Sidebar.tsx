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
import { getCurrentClinicStatus, DEFAULT_CLINIC_STATUS, ClinicStatusInfo } from "@/lib/clinic-status";
import { useBusiness } from "@/hooks/useBusiness";

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export function Sidebar({ mobileOpen = false, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { appointments = [] } = useLiveClinicData();
  const { terms } = useBusiness();
  const [statusInfo, setStatusInfo] = useState<ClinicStatusInfo>(DEFAULT_CLINIC_STATUS);

  useEffect(() => {
    setStatusInfo(getCurrentClinicStatus());
    const interval = setInterval(() => {
      setStatusInfo(getCurrentClinicStatus());
    }, 30000);

    const handleUpdate = () => setStatusInfo(getCurrentClinicStatus());
    if (typeof window !== "undefined") {
      window.addEventListener("dc_store_updated", handleUpdate);
      window.addEventListener("storage", handleUpdate);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== "undefined") {
        window.removeEventListener("dc_store_updated", handleUpdate);
        window.removeEventListener("storage", handleUpdate);
      }
    };
  }, []);

  const activeAppointmentsCount = (appointments || []).length;

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
            <p className="text-[11px] text-slate-400 font-medium">{terms.facilityLabel} Operations</p>
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

      {/* Main Navigation Items */}
      <div className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Core Workspaces
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen?.(false)}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-teal-500/20 to-emerald-500/10 text-teal-300 border border-teal-500/30 shadow-md shadow-teal-500/5 font-semibold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4.5 h-4.5 transition-colors ${
                    isActive ? "text-teal-400" : "text-slate-400 group-hover:text-slate-200"
                  }`}
                />
                <span>{item.name}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Clinic Operating Hours Status Card */}
      <div className="p-3 border-t border-slate-800/80">
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Clinic Status</span>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  statusInfo.isOpen ? "bg-emerald-400 animate-pulse" : "bg-rose-500"
                }`}
              />
              <span
                className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${
                  statusInfo.isOpen
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                }`}
              >
                {statusInfo.badgeLabel}
              </span>
            </div>
          </div>

          <div className="text-xs font-bold text-white">{statusInfo.statusText}</div>
          <div className="text-[10px] text-slate-400 leading-relaxed truncate">{statusInfo.hoursText}</div>
        </div>
      </div>

      {/* User Footer Account Block */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"}
              alt={user?.name || "Doctor Admin"}
              className="w-9 h-9 rounded-full object-cover border border-slate-700 shadow-sm"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate flex items-center gap-1">
              <span>{user?.name || "Dr. Alexander Vance"}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            </div>
            <div className="text-[10px] text-slate-400 truncate">{user?.email || "admin@doctor.com"}</div>
          </div>
        </div>

        <button
          onClick={logout}
          className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
          title="Sign Out of Admin Portal"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Column */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen?.(false)}
          />
          <div className="relative flex-1 max-w-xs w-full bg-slate-900 z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
