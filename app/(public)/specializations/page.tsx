"use client";

import React from "react";
import Link from "next/link";
import {
  HeartPulse,
  Activity,
  ShieldCheck,
  Stethoscope,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Sparkles,
  Zap,
  Microscope,
  FileCheck
} from "lucide-react";
import { CLINIC_INFO, SPECIALIZATIONS, TREATMENTS } from "@/lib/data";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function SpecializationsPage() {
  return (
    <div className="min-h-screen bg-slate-50 space-y-16 pb-20">
      {/* 1. HERO BANNER */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold uppercase tracking-wider">
              <Stethoscope className="w-4 h-4 text-sky-400" />
              Clinical Expertise & Specializations
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
              Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">Cardiovascular & Internal Medicine</span> Specializations
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Combining world-class clinical diagnostics, cutting-edge technology, and patient-first care plans across core specialty domains.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. SPECIALIZATION DOMAINS LIST */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12">
          {SPECIALIZATIONS.map((spec, idx) => (
            <ScrollReveal key={spec.title} direction="up" delay={idx * 0.1}>
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-xl hover:shadow-2xl transition-all grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group">
                <div className="lg:col-span-8 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-xl group-hover:bg-sky-600 group-hover:text-white transition-colors">
                      0{idx + 1}
                    </span>
                    <h2 className="text-2xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                      {spec.title}
                    </h2>
                  </div>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    {spec.shortDesc || spec.fullDesc}
                  </p>

                  <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Individualized Treatment Strategy</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>Non-Invasive Diagnostic Monitoring</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col justify-center items-start lg:items-end gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinical Focus</span>
                  <div className="flex flex-wrap gap-2 lg:justify-end">
                    <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">ACC Guidelines</span>
                    <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">Evidence Based</span>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">24/7 Monitoring</span>
                  </div>
                  <Link
                    href="/booking"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs text-center transition-colors flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Consult Doctor</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 3. CORE SERVICES GRID */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-black tracking-tight">Clinical Services & Interventions</h2>
              <p className="text-sm text-slate-400">
                Precision diagnostics, preventive protocols, and outpatient cardiovascular therapies.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TREATMENTS.map((treatment, idx) => (
              <ScrollReveal key={treatment.id || treatment.name} direction="up" delay={idx * 0.1}>
                <div className="p-6 rounded-3xl bg-slate-800/60 border border-slate-700/80 hover:border-teal-500/50 transition-all space-y-3 h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{treatment.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{treatment.description}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-mono text-teal-300">
                    <span>Evidence Based</span>
                    <Link href="/booking" className="hover:text-white font-bold flex items-center gap-1">
                      Book <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
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
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Need Specialized Medical Advice?</h2>
              <p className="text-sm text-sky-100 max-w-xl">
                Book a consultation to evaluate your cardiovascular health and receive a customized treatment plan.
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
