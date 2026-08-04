"use client";

import React, { useState } from "react";
import { addContactMessageFromWebsite } from "@/lib/store";
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock, HelpCircle } from "lucide-react";
import { CLINIC_INFO, FAQS } from "@/lib/data";
import { ScrollReveal } from "@/components/ScrollReveal";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    addContactMessageFromWebsite({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message
    });

    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    }).catch(() => {});

    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 space-y-16 pb-20">
      {/* 1. HERO BANNER */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white pt-20 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <ScrollReveal direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold uppercase tracking-wider">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              Get in Touch
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white max-w-3xl mx-auto">
              Contact & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400">Patient Support</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Have questions about appointments, insurance coverage, or clinical services? Reach out directly to our administration team.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* 2. FORM & CONTACT CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Info Card */}
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal direction="right">
              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Clinic Contact Info</h2>
                
                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <MapPin className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Medical Facility Address</span>
                      <span className="text-slate-300 leading-relaxed">{CLINIC_INFO.address}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <Phone className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Primary Desk Phone</span>
                      <span className="text-slate-300 font-mono">{CLINIC_INFO.phone}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Official Email</span>
                      <span className="text-slate-300">{CLINIC_INFO.email}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                    <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Working Hours</span>
                      <span className="text-slate-300">Mon - Fri: 8:00 AM - 8:00 PM</span>
                      <span className="text-slate-400 block text-[11px]">Sat: 9:00 AM - 5:00 PM | Sun: Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <ScrollReveal direction="left" delay={0.2}>
              <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200/80 space-y-6">
                {submitted ? (
                  <div className="text-center space-y-4 py-12">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Message Received!</h3>
                    <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                      Thank you for contacting AuraHealth Medical Clinic. Our administration team has logged your inquiry and will reach out within 24 hours.
                    </p>
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: "", email: "", phone: "", subject: "General Inquiry", message: "" });
                      }}
                      className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Send an Inquiry</h2>
                      <p className="text-xs text-slate-500">Fill out the form below and we will contact you directly.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. John Doe"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. john@example.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone Number</label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. +1 (555) 000-0000"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-sky-500 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject</label>
                        <select
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
                        >
                          <option value="General Inquiry">General Inquiry</option>
                          <option value="Appointment Question">Appointment Question</option>
                          <option value="Insurance & Billing">Insurance & Billing</option>
                          <option value="Medical Records Request">Medical Records Request</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message *</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Write your inquiry or question here..."
                        className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry</span>
                    </button>
                  </form>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. FREQUENTLY ASKED QUESTIONS (FAQS) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
              <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl font-black text-slate-900">Common Patient Questions</h2>
          </div>
        </ScrollReveal>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.08}>
              <div className="rounded-2xl bg-white border border-slate-200/80 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaqIdx(openFaqIdx === idx ? null : idx)}
                  className="w-full p-4 text-left font-bold text-slate-900 text-xs sm:text-sm flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <span className="text-lg font-mono font-bold text-teal-600">{openFaqIdx === idx ? "−" : "+"}</span>
                </button>
                {openFaqIdx === idx && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
