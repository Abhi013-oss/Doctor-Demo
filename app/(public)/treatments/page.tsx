"use client";

import React from "react";
import Link from "next/link";
import {
  Cpu,
  Activity,
  ShieldCheck,
  Zap,
  Microscope,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Sparkles,
  Stethoscope,
  HeartPulse
} from "lucide-react";
import { CLINIC_INFO, TECHNOLOGIES, TREATMENTS } from "@/lib/data";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function TreatmentsPage() {
  return (
    <div className="min-h-screen bg-slate-50 space-y-16 pb-20">
      {/* 1. HERO BANNER */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-teal-400" />
              State-of-the-Art Medical Technology
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
              Treatments & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-sky-400 to-cyan-300">Advanced Diagnostic Tech</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Empowering medical precision with next-generation cardiac imaging, non-invasive diagnostic suites, and personalized therapeutic interventions.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. ADVANCED TECH GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Cutting-Edge Medical Equipment</h2>
          <p className="text-sm text-slate-600">
            Our clinic is equipped with hospital-grade, non-invasive diagnostic technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TECHNOLOGIES.map((item, idx) => (
            <ScrollReveal key={item.id || item.name} direction="up" delay={idx * 0.1}>
              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-lg hover:shadow-2xl transition-all space-y-4 flex flex-col justify-between group">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-2xl group-hover:bg-sky-600 group-hover:text-white transition-colors">
                    <Microscope className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>High Accuracy & Resolution</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Instant Digital Report Generation</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 3. DIAGNOSTIC WORKFLOW STEP BY STEP */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-black tracking-tight">The Patient Treatment Workflow</h2>
              <p className="text-sm text-slate-400">
                From initial diagnostic screening to ongoing long-term wellness.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Comprehensive Intake", desc: "Detailed medical history review and physical exam." },
              { step: "02", title: "Diagnostic Testing", desc: "ECG, 3D Echo, or specialized lab evaluations." },
              { step: "03", title: "Custom Care Plan", desc: "Personalized medication, therapy, or lifestyle plan." },
              { step: "04", title: "Continuous Monitoring", desc: "Follow-up visits and 24/7 patient portal support." }
            ].map((st, idx) => (
              <ScrollReveal key={st.step} direction="up" delay={idx * 0.12}>
                <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700 space-y-3 relative hover:border-teal-500/50 transition-colors">
                  <span className="text-2xl font-black font-mono text-teal-400">{st.step}</span>
                  <h3 className="text-base font-bold text-white">{st.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Schedule Your Diagnostic Assessment</h2>
              <p className="text-sm text-sky-100 max-w-xl">
                Get access to advanced cardiac diagnostics and expert care with Dr. Evelyn Reed.
              </p>
            </div>
            <Link
              href="/booking"
              className="px-6 py-3.5 rounded-2xl bg-white text-slate-950 font-bold text-xs hover:bg-slate-100 transition-transform transform hover:scale-105 shadow-lg flex items-center gap-2 shrink-0"
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              Book Appointment Now
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
