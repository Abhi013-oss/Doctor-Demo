"use client";

import React, { useEffect, useState } from "react";
import { Search, X, Calendar, User, ArrowRight } from "lucide-react";
import { Appointment, Patient } from "@/lib/admin-data";
import { useLiveClinicData } from "@/lib/store";
import { useRouter } from "next/navigation";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPatient?: (patient: Patient) => void;
  onSelectAppointment?: (apt: Appointment) => void;
}

export function CommandPalette({ isOpen, onClose, onSelectPatient, onSelectAppointment }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const { appointments = [], patients = [] } = useLiveClinicData();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const safeQuery = (query || "").toLowerCase();

  const filteredPatients = (patients || []).filter((p) => {
    if (!p || typeof p !== "object") return false;
    return (
      (p.name || "").toLowerCase().includes(safeQuery) ||
      (p.mrn || "").toLowerCase().includes(safeQuery) ||
      (p.phone || "").includes(safeQuery)
    );
  });

  const filteredAppointments = (appointments || []).filter((a) => {
    if (!a || typeof a !== "object") return false;
    return (
      (a.patientName || "").toLowerCase().includes(safeQuery) ||
      (a.id || "").toLowerCase().includes(safeQuery) ||
      (a.doctorName || "").toLowerCase().includes(safeQuery) ||
      (a.department || "").toLowerCase().includes(safeQuery)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 select-none">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Search Modal */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-800 bg-slate-950/50">
          <Search className="w-5 h-5 text-teal-400 shrink-0" />
          <input
            type="text"
            placeholder="Search patients, MRN, appointments (Press Esc to close)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-3 py-4 bg-transparent text-white text-sm focus:outline-none placeholder-slate-500"
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Patients Section */}
          {filteredPatients.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-teal-400" />
                <span>Patients ({filteredPatients.length})</span>
              </div>
              <div className="space-y-1">
                {filteredPatients.slice(0, 4).map((patient) => (
                  <button
                    key={patient.id}
                    onClick={() => {
                      if (onSelectPatient) onSelectPatient(patient);
                      router.push("/patients");
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 text-left transition group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={patient.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
                        alt={patient.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors">
                          {patient.name} <span className="font-mono text-[10px] text-teal-400 font-bold ml-1">{patient.mrn}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{patient.phone} • {patient.disease || "General Care"}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Appointments Section */}
          {filteredAppointments.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Appointments ({filteredAppointments.length})</span>
              </div>
              <div className="space-y-1">
                {filteredAppointments.slice(0, 4).map((apt) => (
                  <button
                    key={apt.id}
                    onClick={() => {
                      if (onSelectAppointment) onSelectAppointment(apt);
                      router.push("/appointments");
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-800/80 text-left transition group"
                  >
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-teal-300 transition-colors flex items-center gap-2">
                        <span>{apt.patientName}</span>
                        <span className="font-mono text-[10px] text-teal-400 font-bold">{apt.id}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {apt.date} • {apt.time} • <strong className="text-slate-300">{apt.department}</strong>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredPatients.length === 0 && filteredAppointments.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching patients or appointments found for &quot;{query}&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
