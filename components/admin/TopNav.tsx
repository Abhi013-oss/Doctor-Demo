"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  Plus,
  Menu,
  User,
  LogOut,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronDown
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import Link from "next/link";

interface TopNavProps {
  onOpenMobileSidebar?: () => void;
  onOpenCommandPalette?: () => void;
  onOpenNewAppointment?: () => void;
}

export function TopNav({
  onOpenMobileSidebar,
  onOpenCommandPalette,
  onOpenNewAppointment
}: TopNavProps) {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const notifications = [
    {
      id: "1",
      title: "Urgent Patient Aura Alert",
      desc: "Marcus Sterling reported aura 15m prior to consultation.",
      time: "10 mins ago",
      unread: true,
      type: "urgent"
    },
    {
      id: "2",
      title: "New Appointment Scheduled",
      desc: "Chloe Bennett booked a Telehealth slot for tomorrow 10:00 AM.",
      time: "45 mins ago",
      unread: true,
      type: "info"
    },
    {
      id: "3",
      title: "Lab Pathology Result Ready",
      desc: "Amanda White dermal biopsy results uploaded.",
      time: "2 hours ago",
      unread: false,
      type: "success"
    }
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-20 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 md:px-6 flex items-center justify-between">
      {/* Left section: Mobile Toggle & Quick Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 text-xs font-medium transition-all shadow-inner group"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-teal-400 transition-colors" />
          <span className="truncate">Search patients, MRN, appointments (Press Ctrl + K)...</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700 ml-auto">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right section: Quick Actions, Notifications, Profile */}
      <div className="flex items-center gap-2.5 md:gap-3.5">
        {/* Quick Action Button */}
        {onOpenNewAppointment && (
          <button
            onClick={onOpenNewAppointment}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">New Appointment</span>
          </button>
        )}

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserDropdown(false);
            }}
            className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400 ring-4 ring-slate-900 animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-white">Notifications</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {unreadCount} New
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-teal-400 hover:underline"
                >
                  Mark all as read
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`p-3.5 hover:bg-slate-800/50 transition-colors flex gap-3 ${
                      n.unread ? "bg-slate-800/20" : ""
                    }`}
                  >
                    <div className="mt-0.5">
                      {n.type === "urgent" ? (
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                      ) : n.type === "success" ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <Clock className="w-5 h-5 text-cyan-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-100">{n.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{n.desc}</p>
                      <span className="text-[10px] text-slate-500 mt-1 block font-mono">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-center">
                <Link
                  href="/messages"
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center justify-center gap-1"
                >
                  View Messages & Activity Log <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"}
              alt={user?.name || "Admin Avatar"}
              className="w-8 h-8 rounded-lg object-cover border border-teal-500/40"
            />
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3.5 border-b border-slate-800 bg-slate-950/40">
                <p className="text-xs font-bold text-white truncate">{user?.name || "Dr. Alexander Vance"}</p>
                <p className="text-[11px] text-teal-400 truncate">{user?.email || "admin@doctorclinic.com"}</p>
              </div>

              <div className="p-1.5 space-y-0.5">
                <Link
                  href="/settings"
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Clinic Settings
                </Link>
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
