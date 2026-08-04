"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Stethoscope, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/components/admin/AuthProvider";
import { DEMO_ADMIN_USER } from "@/lib/supabase";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    // Ensure clean state initialization
    setErrorMsg("");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg("Please enter both email address and password.");
      return;
    }

    setErrorMsg("");
    setIsSubmitting(true);

    try {
      // 1. Save session user object to local storage
      const sessionUser = {
        ...DEMO_ADMIN_USER,
        email: email.trim() || DEMO_ADMIN_USER.email
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("doctor_admin_user", JSON.stringify(sessionUser));
      }

      // 2. Trigger auth login helper
      const res = await login(email.trim(), password);

      if (res && !res.success && res.error) {
        setErrorMsg(res.error);
        setIsSubmitting(false);
        return;
      }

      // 3. Smooth SPA navigation to dashboard
      router.push("/dashboard");
    } catch {
      router.push("/dashboard");
    }
  };

  const handleDemoLogin = () => {
    setEmail(DEMO_ADMIN_USER.email);
    setPassword("admin123");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* Background Decorative Glow Effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 space-y-3">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 p-0.5 shadow-xl shadow-teal-500/20 group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-teal-400 group-hover:rotate-12 transition-transform duration-300" />
            </div>
          </div>
          <div className="text-left">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span>AgencyConsole</span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Admin Portal
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Healthcare Operations Management</p>
          </div>
        </Link>
      </div>

      {/* Main Login Card Container */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              Sign in to Operations Console
            </h2>
            <p className="text-xs text-slate-400">
              Access real-time patient appointments, schedules, and clinical records.
            </p>
          </div>

          {/* Quick Fill Demo Banner */}
          <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-between gap-3">
            <div className="text-xs">
              <div className="font-bold text-teal-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                Quick Admin Credentials
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Email: {DEMO_ADMIN_USER.email}
              </div>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="px-2.5 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] transition-colors shrink-0"
            >
              Auto-Fill
            </button>
          </div>

          {/* Error Message Box */}
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-rose-300 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Admin Email Address</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@doctor.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white text-xs placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Password</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoComplete="off"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white text-xs placeholder-slate-500 outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Back Link */}
          <div className="pt-2 text-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-teal-400 transition-colors inline-flex items-center gap-1"
            >
              ← Back to Patient Portal Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
