"use client";

import React from "react";
import Link from "next/link";
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  GraduationCap,
  Heart,
  ShieldCheck,
  Star,
  Stethoscope,
  Users,
  Calendar,
  Phone,
  ArrowRight
} from "lucide-react";
import { CLINIC_INFO, TESTIMONIALS } from "@/lib/data";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 space-y-16 pb-20">
      {/* 1. HERO BANNER */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <ScrollReveal direction="up" delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold uppercase tracking-wider">
                <GraduationCap className="w-4 h-4 text-teal-400" />
                Harvard Medical School Graduate
              </div>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.2}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-sky-400 to-cyan-300">{CLINIC_INFO.doctor.name}</span>
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.3}>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl">
                {CLINIC_INFO.doctor.title} with over {CLINIC_INFO.doctor.experienceYears} years of dedicated clinical practice. Pioneering compassionate, evidence-based cardiovascular care and personalized treatments.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="up" delay={0.4}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-2xl font-black text-teal-400 block font-mono">{CLINIC_INFO.doctor.experienceYears}+ Yrs</span>
                  <span className="text-xs text-slate-400 font-medium">Clinical Experience</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-2xl font-black text-sky-400 block font-mono">{CLINIC_INFO.doctor.patientsTreated}</span>
                  <span className="text-xs text-slate-400 font-medium">Patients Treated</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 col-span-2 sm:col-span-1">
                  <span className="text-2xl font-black text-emerald-400 block font-mono">99.4%</span>
                  <span className="text-xs text-slate-400 font-medium">Satisfaction Rate</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-5 relative">
            <ScrollReveal direction="left" delay={0.3}>
              <div className="relative mx-auto max-w-md">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-teal-500 to-sky-500 opacity-30 blur-lg" />
                <img
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=600&auto=format&fit=crop&q=80"
                  alt={CLINIC_INFO.doctor.name}
                  className="relative rounded-3xl object-cover shadow-2xl border-2 border-slate-700 w-full h-[450px]"
                />
                <div className="absolute -bottom-6 -left-6 bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-xl flex items-center gap-3">
                  <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-xl">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-white block">Board Certified FACC</span>
                    <span className="text-[11px] text-slate-400">Fellow of American College of Cardiology</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

        </div>
      </section>

      {/* 2. BIOGRAPHY & PHILOSOPHY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <ScrollReveal direction="right">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-bold text-xs">
                <Heart className="w-3.5 h-3.5 text-sky-600" />
                Care Philosophy
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                "Patient-Centered Healthcare Built on Precision & Empathy"
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {CLINIC_INFO.doctor.bio}
              </p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {CLINIC_INFO.doctor.philosophy}
              </p>

              <div className="space-y-3 pt-2">
                {[
                  "Comprehensive Cardiovascular Risk Screening",
                  "Advanced Non-Invasive Cardiac Imaging & Diagnostics",
                  "Tailored Lifestyle & Preventive Care Protocols",
                  "Direct 24/7 Physician Communication Channel"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-slate-700 text-sm font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" delay={0.2}>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Clinical Rigor</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Adhering strictly to ACC/AHA guidelines for treatment accuracy and patient safety.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Trust & Confidentiality</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Encrypted medical records and strict HIPAA compliance across all digital portals.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-md space-y-3 col-span-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Academic & Research Leadership</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Author of over 25 published peer-reviewed studies in major cardiology journals, focusing on early preventive intervention.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3. EDUCATION & MILESTONES */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <ScrollReveal direction="up">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-black tracking-tight">Education & Career Milestones</h2>
              <p className="text-sm text-slate-400">
                A lifetime dedicated to medical excellence and academic training.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                year: "2004",
                title: "Doctor of Medicine (M.D.)",
                inst: "Harvard Medical School",
                desc: "Graduated with honors in Cardiovascular Pathophysiology."
              },
              {
                year: "2008",
                title: "Cardiology Residency & Fellowship",
                inst: "Johns Hopkins Hospital",
                desc: "Chief Fellow in Interventional Cardiology & Cardiac Imaging."
              },
              {
                year: "2012 - Present",
                title: "Medical Director & Founder",
                inst: "AuraHealth Clinic",
                desc: "Established premiere cardiovascular & preventive healthcare center."
              }
            ].map((milestone, idx) => (
              <ScrollReveal key={idx} direction="up" delay={idx * 0.15}>
                <div className="p-6 rounded-3xl bg-slate-800/80 border border-slate-700 space-y-3 relative hover:border-teal-500/50 transition-colors">
                  <span className="text-xs font-mono font-bold text-teal-400 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 inline-block">
                    {milestone.year}
                  </span>
                  <h3 className="text-lg font-bold text-white">{milestone.title}</h3>
                  <p className="text-xs font-semibold text-sky-300">{milestone.inst}</p>
                  <p className="text-xs text-slate-400 leading-relaxed">{milestone.desc}</p>
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
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Ready to Schedule Your Consultation?</h2>
              <p className="text-sm text-sky-100 max-w-xl">
                Experience world-class cardiovascular and preventive medical care with Dr. Evelyn Reed.
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
