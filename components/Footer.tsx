"use client";

import { useState } from "react";
import Link from "next/link";
import { HeartPulse, MapPin, Phone, Mail, Clock, ShieldCheck, Award, ArrowUpRight, Send, CheckCircle2, Loader2 } from "lucide-react";
import { CLINIC_INFO } from "@/lib/data";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setMessage("Subscribed!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "Failed to subscribe.");
      }
    } catch (err) {
      console.error("Newsletter error:", err);
      setStatus("error");
      setMessage("Subscription error.");
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Callout Ribbon */}
        <div className="mb-12 p-8 rounded-3xl bg-gradient-to-r from-sky-950 via-slate-850 to-teal-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h4 className="text-lg font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-5 h-5 text-sky-400" />
              <span>AuraHealth Longevity & Medical Bulletin</span>
            </h4>
            <p className="text-xs text-slate-400">
              Receive monthly evidence-based medical articles, heart health guides, and clinic updates.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2">
            <input
              type="email"
              required
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-72 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-sky-400 hover:bg-sky-300 transition flex items-center justify-center gap-1.5 shrink-0"
            >
              {status === "loading" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : status === "success" ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Subscribed</span>
                </>
              ) : (
                <>
                  <span>Subscribe</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Clinic Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center text-white shadow-md">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">
                  Aura<span className="text-sky-400">Health</span>
                </span>
                <span className="block text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  Medical & Surgical Clinic
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Providing patient-centered, technology-driven cardiovascular and internal medicine care led by Dr. Evelyn Reed, M.D., FACC.
            </p>
            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Board Certified in Cardiovascular Disease & Internal Med</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Top Physician Award Winner (2020 - 2026)</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white text-base font-semibold tracking-wide mb-4">Quick Navigation</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-sky-400 transition flex items-center gap-1 group">
                  <span>About Dr. Evelyn Reed</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link href="/specializations" className="hover:text-sky-400 transition flex items-center gap-1 group">
                  <span>Medical Specializations</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link href="/treatments" className="hover:text-sky-400 transition flex items-center gap-1 group">
                  <span>Treatments & Procedures</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link href="/technology" className="hover:text-sky-400 transition flex items-center gap-1 group">
                  <span>Advanced Technology</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="hover:text-sky-400 transition flex items-center gap-1 group">
                  <span>Patient Testimonials</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-sky-400 transition flex items-center gap-1 group">
                  <span>Clinic Photo Tour</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-sky-400 transition font-medium text-sky-300 flex items-center gap-1 group">
                  <span>Book Appointment Online</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Operating Hours */}
          <div>
            <h3 className="text-white text-base font-semibold tracking-wide mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Clinic Operating Hours</span>
            </h3>
            <ul className="space-y-3 text-sm">
              {CLINIC_INFO.hours.map((h, i) => (
                <li key={i} className="border-b border-slate-800 pb-2">
                  <span className="block font-medium text-slate-200">{h.days}</span>
                  <span className="text-xs text-sky-400">{h.time}</span>
                </li>
              ))}
            </ul>
            <div className="mt-4 p-3 bg-rose-950/40 border border-rose-800/50 rounded-xl">
              <span className="text-xs font-semibold text-rose-300 block">Emergency Helpline (24/7)</span>
              <a href={`tel:${CLINIC_INFO.emergencyPhone}`} className="text-sm font-bold text-rose-200 hover:underline">
                {CLINIC_INFO.emergencyPhone}
              </a>
            </div>
          </div>

          {/* Col 4: Contact & Location */}
          <div>
            <h3 className="text-white text-base font-semibold tracking-wide mb-4">Contact Info</h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-xs leading-relaxed">{CLINIC_INFO.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`tel:${CLINIC_INFO.phone}`} className="text-slate-200 hover:text-white transition">
                  {CLINIC_INFO.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${CLINIC_INFO.email}`} className="text-slate-200 hover:text-white transition">
                  {CLINIC_INFO.email}
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <Link
                href="/booking"
                className="w-full inline-flex items-center justify-center py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 shadow transition"
              >
                Schedule Consultation
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} AuraHealth Medical Clinic. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Patient Rights</span>
            <span className="hover:text-slate-300 cursor-pointer">HIPAA Compliance</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
