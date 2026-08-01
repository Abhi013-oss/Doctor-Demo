"use client";

import React, { useEffect, useState } from "react";
import { Search, X, Calendar, User, ArrowRight } from "lucide-react";
import { INITIAL_APPOINTMENTS, INITIAL_PATIENTS, Appointment, Patient } from "@/lib/admin-data";
import { useRouter } from "next/navigation";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPatient?: (patient: Patient) => void;
  onSelectAppointment?: (apt: Appointment) => void;
}

export function CommandPalette({ isOpen, onClose, onSelectPatient, onSelectAppointment }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
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
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredPatients = INITIAL_PATIENTS.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.mrn.toLowerCase().includes(query.toLowerCase()) ||
      p.phone.includes(query)
  );

  const filteredAppointments = INITIAL_APPOINTMENTS.filter(
    (a) =>
      a.patientName.toLowerCase().includes(query.toLowerCase()) ||
      a.id.toLowerCase().includes(query.toLowerCase()) ||
      a.doctorName.toLowerCase().includes(query.toLowerCase()) ||
      a.department.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity" onClick={onClose} />

      {/* Search Modal */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-800 bg-slate-950/50">
          <Search className="w-5 h-5 text-teal-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patients by name, MRN, phone, or appointment..."
            className="w-full py-4 px-3 bg-transparent text-white text-sm focus:outline-none placeholder:text-slate-500"
          />
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Results Area */}
        <div className="max-h-96 overflow-y-auto p-4 space-y-6">
          {/* Patients Section */}
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <User className="w-3.5 h-3.5 text-teal-400" />
              Patients ({filteredPatients.length})
            </div>
            {filteredPatients.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-1 px-2">No matching patients found.</p>
            ) : (
              <div className="space-y-1">
                {filteredPatients.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onClose();
                      if (onSelectPatient) onSelectPatient(p);
                      else router.push("/patients");
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-100 group-hover:text-teal-300">{p.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">
                            {p.mrn}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{p.phone} • {p.bloodGroup} • {p.conditions.join(", ")}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-teal-400 transition-all transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Appointments Section */}
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              Appointments ({filteredAppointments.length})
            </div>
            {filteredAppointments.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-1 px-2">No matching appointments found.</p>
            ) : (
              <div className="space-y-1">
                {filteredAppointments.slice(0, 4).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => {
                      onClose();
                      if (onSelectAppointment) onSelectAppointment(a);
                      else router.push("/appointments");
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-800/70 transition-colors text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-400 flex items-center justify-center font-mono text-xs font-bold">
                        {a.time.split(" ")[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-100 group-hover:text-cyan-300">{a.patientName}</span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-teal-500/20 text-teal-300 rounded font-semibold">
                            {a.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">{a.reason} — {a.doctorName}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-cyan-400 transition-all transform group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 flex items-center justify-end text-[11px] text-slate-400 font-mono">
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
}
