"use client";

import { useState } from "react";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Stethoscope,
  Sparkles,
  ShieldCheck,
  Copy,
  Check
} from "lucide-react";
import { SPECIALIZATIONS } from "@/lib/data";
import { addAppointmentFromWebsite } from "@/lib/store";

interface AppointmentFormProps {
  compact?: boolean;
  className?: string;
  defaultSpecialization?: string;
}

export default function AppointmentForm({
  compact = false,
  className = "",
  defaultSpecialization = "",
}: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    age: "",
    gender: "Male",
    disease: defaultSpecialization || SPECIALIZATIONS[0].title,
    date: "",
    time: "Morning (09:00 AM - 12:00 PM)",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<{
    bookingId: string;
    message: string;
    details: typeof formData;
  } | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Minimum date is today
  const todayStr = new Date().toISOString().split("T")[0];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = "Please enter patient's full name (min 2 characters).";
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      newErrors.phone = "Please enter a valid phone number (at least 8 digits).";
    }

    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    const ageNum = Number(formData.age);
    if (!formData.age || isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
      newErrors.age = "Please enter a valid age (1 - 120).";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select gender.";
    }

    if (!formData.disease) {
      newErrors.disease = "Please select a disease or specialty.";
    }

    if (!formData.date) {
      newErrors.date = "Please select your preferred appointment date.";
    } else {
      const selected = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) {
        newErrors.date = "Appointment date cannot be in the past.";
      }
    }

    if (!formData.time) {
      newErrors.time = "Please select a time slot.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      // Synchronously record appointment in real-time store for Admin Dashboard visibility
      const createdApt = addAppointmentFromWebsite({
        patientName: formData.name.trim(),
        patientPhone: formData.phone.trim(),
        patientEmail: formData.email.trim(),
        date: formData.date,
        time: formData.time,
        department: formData.disease,
        reason: formData.message || "General Consultation Request"
      });

      // API Call for Supabase / Email Notification
      await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }).catch(() => {});

      setSubmitSuccess({
        bookingId: createdApt.id,
        message: `Appointment successfully scheduled! Your reference ID is ${createdApt.id}. Our clinic care team will call ${formData.phone} shortly to confirm your slot.`,
        details: { ...formData },
      });

      // Reset form
      setFormData({
        name: "",
        phone: "",
        email: "",
        age: "",
        gender: "Male",
        disease: SPECIALIZATIONS[0].title,
        date: "",
        time: "Morning (09:00 AM - 12:00 PM)",
        message: "",
      });
    } catch (err) {
      console.error("Booking error:", err);
      setErrors({ general: "An error occurred while processing your booking." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyBookingId = () => {
    if (submitSuccess?.bookingId) {
      navigator.clipboard.writeText(submitSuccess.bookingId);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Form Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-slate-200/80 relative overflow-hidden">
        {/* Decorative Top Accent Gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500"></div>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-sky-700 font-semibold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-teal-500" />
            <span>Priority Online Scheduling</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Book Your Consultation
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Fill out the patient details below. You will receive an instant confirmation ID.
          </p>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Row 1: Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Patient Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Patient Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-slate-50 border ${
                    errors.name ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-sky-200 focus:border-sky-500"
                  } focus:outline-none focus:ring-4 focus:bg-white transition`}
                />
              </div>
              {errors.name && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.name}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  placeholder="e.g. +1 (555) 000-1234"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-slate-50 border ${
                    errors.phone ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-sky-200 focus:border-sky-500"
                  } focus:outline-none focus:ring-4 focus:bg-white transition`}
                />
              </div>
              {errors.phone && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.phone}</p>}
            </div>
          </div>

          {/* Row 2: Email, Age, Gender */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Email */}
            <div className="md:col-span-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-slate-50 border ${
                    errors.email ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-sky-200 focus:border-sky-500"
                  } focus:outline-none focus:ring-4 focus:bg-white transition`}
                />
              </div>
              {errors.email && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.email}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Age <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 35"
                min="1"
                max="120"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl text-sm bg-slate-50 border ${
                  errors.age ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-sky-200 focus:border-sky-500"
                } focus:outline-none focus:ring-4 focus:bg-white transition`}
              />
              {errors.age && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.age}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:ring-sky-200 focus:border-sky-500 focus:outline-none focus:ring-4 focus:bg-white transition"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              {errors.gender && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.gender}</p>}
            </div>
          </div>

          {/* Row 3: Disease / Specialization */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Medical Specialization / Condition <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Stethoscope className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <select
                value={formData.disease}
                onChange={(e) => setFormData({ ...formData, disease: e.target.value })}
                className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-slate-50 border ${
                  errors.disease ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-sky-200 focus:border-sky-500"
                } focus:outline-none focus:ring-4 focus:bg-white transition`}
              >
                <option value="">-- Select Specialization / Consultation Type --</option>
                <option value="General Cardiovascular Audit">General Cardiovascular Audit</option>
                {SPECIALIZATIONS.map((spec) => (
                  <option key={spec.id} value={spec.title}>
                    {spec.title}
                  </option>
                ))}
                <option value="Executive Longevity Health Package">Executive Longevity Health Package</option>
                <option value="Other Medical Inquiry">Other Specialty Consultation</option>
              </select>
            </div>
            {errors.disease && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.disease}</p>}
          </div>

          {/* Row 4: Date & Time Slot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Preferred Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Preferred Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="date"
                  min={todayStr}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-slate-50 border ${
                    errors.date ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-sky-200 focus:border-sky-500"
                  } focus:outline-none focus:ring-4 focus:bg-white transition`}
                />
              </div>
              {errors.date && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.date}</p>}
            </div>

            {/* Preferred Time */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Preferred Time Slot <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-slate-50 border ${
                    errors.time ? "border-rose-400 focus:ring-rose-200" : "border-slate-200 focus:ring-sky-200 focus:border-sky-500"
                  } focus:outline-none focus:ring-4 focus:bg-white transition`}
                >
                  <option value="Morning (09:00 AM - 12:00 PM)">Morning (09:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (12:00 PM - 04:00 PM)">Afternoon (12:00 PM - 04:00 PM)</option>
                  <option value="Evening (04:00 PM - 08:00 PM)">Evening (04:00 PM - 08:00 PM)</option>
                </select>
              </div>
              {errors.time && <p className="text-xs text-rose-600 mt-1.5 font-medium">{errors.time}</p>}
            </div>
          </div>

          {/* Row 5: Additional Message */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Message / Symptoms / Medical History (Optional)
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              <textarea
                rows={compact ? 2 : 3}
                placeholder="Briefly describe your medical concerns, current medications, or specific questions for Dr. Reed..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-slate-50 border border-slate-200 focus:ring-sky-200 focus:border-sky-500 focus:outline-none focus:ring-4 focus:bg-white transition"
              ></textarea>
            </div>
          </div>

          {/* Submit Button & Trust Notice */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-base text-white bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform active:scale-98 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing Appointment...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-5 h-5" />
                  <span>Confirm & Book Appointment</span>
                </>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Your medical data is 100% confidential & HIPAA compliant. Zero wait times.</span>
            </div>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {submitSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center relative overflow-hidden">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-2">
              Appointment Scheduled
            </span>

            <h3 className="text-2xl font-extrabold text-slate-900">
              Booking Confirmed!
            </h3>

            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {submitSuccess.message}
            </p>

            {/* Reference ID Card */}
            <div className="my-6 p-4 rounded-2xl bg-sky-50/80 border border-sky-200 flex flex-col items-center gap-2">
              <span className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
                Booking Reference ID
              </span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black tracking-widest text-sky-900 font-mono">
                  {submitSuccess.bookingId}
                </span>
                <button
                  onClick={copyBookingId}
                  className="p-2 rounded-lg bg-white border border-sky-300 text-sky-700 hover:bg-sky-100 transition flex items-center gap-1 text-xs font-semibold"
                  title="Copy Reference ID"
                >
                  {copiedId ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Details Summary */}
            <div className="text-left text-xs bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 mb-6 text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-1">
                <span className="font-semibold text-slate-500">Patient:</span>
                <span className="font-bold text-slate-900">{submitSuccess.details.name} ({submitSuccess.details.age} yrs, {submitSuccess.details.gender})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1 pt-1">
                <span className="font-semibold text-slate-500">Phone:</span>
                <span className="font-bold text-slate-900">{submitSuccess.details.phone}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-1 pt-1">
                <span className="font-semibold text-slate-500">Department:</span>
                <span className="font-bold text-sky-700">{submitSuccess.details.disease}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-semibold text-slate-500">Requested Slot:</span>
                <span className="font-bold text-slate-900">{submitSuccess.details.date} ({submitSuccess.details.time.split(" ")[0]})</span>
              </div>
            </div>

            <button
              onClick={() => setSubmitSuccess(null)}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-slate-900 hover:bg-slate-800 shadow transition"
            >
              Done & Return
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
