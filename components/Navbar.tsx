"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Calendar, Menu, X, Clock, HeartPulse, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CLINIC_INFO } from "@/lib/data";
import { getCurrentClinicStatus, DEFAULT_CLINIC_STATUS, ClinicStatusInfo } from "@/lib/clinic-status";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "About Doctor", href: "/about" },
  { name: "Specializations", href: "/specializations" },
  { name: "Treatments & Tech", href: "/treatments" },
  { name: "Contact & FAQs", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [statusInfo, setStatusInfo] = useState<ClinicStatusInfo>(DEFAULT_CLINIC_STATUS);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    setStatusInfo(getCurrentClinicStatus());
    const interval = setInterval(() => {
      setStatusInfo(getCurrentClinicStatus());
    }, 30000);

    const handleUpdate = () => setStatusInfo(getCurrentClinicStatus());
    window.addEventListener("dc_store_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearInterval(interval);
      window.removeEventListener("dc_store_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Top Notification / Hotline Ribbon */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
            <span
              className={`flex items-center gap-1.5 font-semibold ${
                statusInfo.isOpen
                  ? "text-emerald-400"
                  : statusInfo.badgeColor === "rose"
                  ? "text-rose-400"
                  : "text-amber-400"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  statusInfo.isOpen ? "bg-emerald-400 animate-ping" : "bg-amber-400"
                } inline-block`}
              ></span>
              {statusInfo.statusText}
            </span>
            <span className="hidden md:inline-block text-slate-700">|</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-sky-400" /> {statusInfo.hoursText}
            </span>
            <span className="hidden lg:inline-block text-slate-700">|</span>
            <span className="hidden lg:flex items-center gap-1 text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" /> Harvard Trained Physician
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${CLINIC_INFO.emergencyPhone}`}
              className="flex items-center gap-1.5 text-rose-300 hover:text-rose-200 font-bold transition"
            >
              <Phone className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>24/7 Emergency: {CLINIC_INFO.emergencyPhone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar Container */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "glass-nav shadow-lg py-2.5"
            : "bg-white/95 backdrop-blur-md py-3.5 border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-teal-500 to-emerald-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-sky-700 transition">
                Aura<span className="text-sky-600">Health</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest font-bold text-slate-500">
                Medical & Surgical Clinic
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1.5 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/60">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? "text-sky-900 font-extrabold shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 bg-white rounded-xl shadow-sm border border-slate-200/80 -z-10"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${CLINIC_INFO.phone}`}
              className="hidden xl:flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-700 hover:text-sky-700 hover:bg-sky-50 rounded-xl transition"
            >
              <Phone className="w-4 h-4 text-sky-600" />
              <span>{CLINIC_INFO.phone}</span>
            </a>

            <Link
              href="/booking"
              className="group relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <Calendar className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Book Appointment</span>
            </Link>
          </div>

          {/* Mobile Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/booking"
              className="sm:hidden px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-sky-600 shadow"
            >
              Book
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition focus:outline-none"
              aria-label="Toggle mobile navigation"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-2xl overflow-hidden"
            >
              <div className="flex flex-col gap-1.5">
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        isActive
                          ? "text-sky-700 bg-sky-50 font-extrabold border border-sky-200/80"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-3">
                <a
                  href={`tel:${CLINIC_INFO.phone}`}
                  className="flex items-center justify-center gap-2 py-3 text-slate-800 font-bold bg-slate-100 rounded-xl text-xs"
                >
                  <Phone className="w-4 h-4 text-sky-600" />
                  <span>Call Clinic: {CLINIC_INFO.phone}</span>
                </a>

                <Link
                  href="/booking"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-600 to-teal-600 shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment Now</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
