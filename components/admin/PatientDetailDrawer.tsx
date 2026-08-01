"use client";

import React, { useState } from "react";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  AlertTriangle,
  Pill,
  Heart,
  Plus,
  Edit2,
  Trash2,
  Lock,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";
import { Patient } from "@/types";
import {
  useLiveClinicData,
  addDoctorNoteToPatient,
  editDoctorNoteInPatient,
  deleteDoctorNoteFromPatient,
} from "@/lib/store";
import { useToast } from "./ToastProvider";
import { Button, Textarea, Badge } from "../ui";
import { useBusiness } from "@/hooks/useBusiness";

interface PatientDetailDrawerProps {
  patient: Patient | null;
  onClose: () => void;
  onOpenSchedule?: (patient: Patient) => void;
}

export function PatientDetailDrawer({ patient, onClose, onOpenSchedule }: PatientDetailDrawerProps) {
  const { appointments, refreshData } = useLiveClinicData();
  const { toast } = useToast();
  const { terms } = useBusiness();

  const [activeTab, setActiveTab] = useState<"profile" | "timeline" | "notes">("profile");
  const [newNoteText, setNewNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState("");

  if (!patient) return null;

  const patientAppointments = appointments.filter(
    (a) => a.patientId === patient.id || a.patientEmail.toLowerCase() === patient.email.toLowerCase()
  );

  const upcomingAppts = patientAppointments.filter(
    (a) => a.status === "Approved" || a.status === "Pending" || a.status === "Scheduled" || a.status === "Waiting"
  );
  const completedAppts = patientAppointments.filter((a) => a.status === "Completed");
  const cancelledAppts = patientAppointments.filter((a) => a.status === "Cancelled" || a.status === "Rejected");

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    addDoctorNoteToPatient(patient.id, newNoteText);
    setNewNoteText("");
    refreshData();
    toast("Note Added", `Private note saved to ${terms.clientLabel} record`, "success");
  };

  const handleEditNoteSubmit = (noteId: string) => {
    if (!editingNoteText.trim()) return;

    editDoctorNoteInPatient(patient.id, noteId, editingNoteText);
    setEditingNoteId(null);
    setEditingNoteText("");
    refreshData();
    toast("Note Updated", "Saved note changes", "info");
  };

  const handleDeleteNote = (noteId: string) => {
    deleteDoctorNoteFromPatient(patient.id, noteId);
    refreshData();
    toast("Note Deleted", "Removed private note", "warning");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" onClick={onClose} />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-2xl bg-slate-900 border-l border-slate-800 shadow-2xl z-10 flex flex-col h-full animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={patient.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt={patient.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/40 shadow-lg shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{patient.name}</h2>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-teal-400 border border-slate-700">
                  {patient.mrn}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
                <span>{patient.age} yrs • {patient.gender}</span>
                <span>•</span>
                <span className="font-bold text-teal-300">Info: {patient.bloodGroup}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Ribbons */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-800/80 bg-slate-950/20 text-xs font-bold">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "profile"
                ? "border-teal-400 text-teal-300 bg-slate-800/50"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            {terms.clientLabel} Info
          </button>

          <button
            onClick={() => setActiveTab("timeline")}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "timeline"
                ? "border-teal-400 text-teal-300 bg-slate-800/50"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            {terms.bookingLabel} Timeline ({patientAppointments.length})
          </button>

          <button
            onClick={() => setActiveTab("notes")}
            className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 ${
              activeTab === "notes"
                ? "border-teal-400 text-teal-300 bg-slate-800/50"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            Private Notes ({patient.doctorNotes?.length || 0})
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: PROFILE */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Status</span>
                  <Badge variant="emerald">{patient.status}</Badge>
                </div>
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Visits</span>
                  <span className="text-sm font-bold text-white">{patient.totalVisits} Consultations</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 text-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Last Visit</span>
                  <span className="text-xs font-mono font-semibold text-slate-200">{patient.lastVisit}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 space-y-1">
                <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block">
                  Primary Focus / Condition
                </span>
                <p className="text-sm font-bold text-white">
                  {patient.disease || patient.conditions?.[0] || "General Audit"}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact & Demographics</h4>
                <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>{patient.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>{patient.address}</span>
                  </div>
                </div>
              </div>

              {patient.allergies?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Allergy / Restriction Warnings
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, i) => (
                      <Badge key={i} variant="amber">
                        ⚠️ {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {patient.conditions?.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" /> Profile Conditions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {patient.conditions.map((cond, i) => (
                      <Badge key={i} variant="teal">
                        • {cond}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TIMELINE */}
          {activeTab === "timeline" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  <Clock3 className="w-4 h-4" /> Upcoming Visits ({upcomingAppts.length})
                </h4>
                {upcomingAppts.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                    No upcoming visits scheduled.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {upcomingAppts.map((apt) => (
                      <div key={apt.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">{apt.department}</div>
                          <div className="text-slate-400 mt-0.5">
                            {apt.date} at {apt.time} • Assigned: {apt.doctorName}
                          </div>
                        </div>
                        <Badge variant="teal">{apt.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Completed Consultations ({completedAppts.length})
                </h4>
                {completedAppts.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 rounded-xl bg-slate-800/30 border border-slate-800">
                    No completed visits on file yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {completedAppts.map((apt) => (
                      <div key={apt.id} className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-200">{apt.department}</div>
                          <div className="text-slate-400 mt-0.5">
                            {apt.date} • &quot;{apt.reason}&quot;
                          </div>
                        </div>
                        <Badge variant="emerald">Completed</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: NOTES */}
          {activeTab === "notes" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <Lock className="w-4 h-4 shrink-0" />
                <span>
                  <strong>Confidential Notes Console</strong> — Internal to Admin Panel only.
                </span>
              </div>

              <form onSubmit={handleAddNote} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
                <Textarea
                  label="Add Internal Clinical Note"
                  rows={3}
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Enter internal observations, notes, or plan..."
                  required
                />
                <Button variant="primary" size="sm" type="submit" leftIcon={<Plus className="w-4 h-4" />} className="ml-auto">
                  Save Note
                </Button>
              </form>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Notes History ({patient.doctorNotes?.length || 0})
                </h4>

                {!patient.doctorNotes || patient.doctorNotes.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-4 text-center">No notes recorded yet.</p>
                ) : (
                  <div className="space-y-3">
                    {patient.doctorNotes.map((note) => (
                      <div key={note.id} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-3 relative">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold text-white">{note.author}</span>
                            <span className="text-[10px] text-slate-400 font-mono">• {note.date}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingNoteId(note.id);
                                setEditingNoteText(note.text);
                              }}
                              className="p-1 text-slate-400 hover:text-teal-300"
                              title="Edit Note"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteNote(note.id)}
                              className="p-1 text-slate-400 hover:text-rose-400"
                              title="Delete Note"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {editingNoteId === note.id ? (
                          <div className="space-y-2 pt-1">
                            <Textarea
                              rows={3}
                              value={editingNoteText}
                              onChange={(e) => setEditingNoteText(e.target.value)}
                            />
                            <div className="flex justify-end gap-2">
                              <Button variant="secondary" size="sm" type="button" onClick={() => setEditingNoteId(null)}>
                                Cancel
                              </Button>
                              <Button variant="primary" size="sm" type="button" onClick={() => handleEditNoteSubmit(note.id)}>
                                Save Changes
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-slate-300 leading-relaxed">&quot;{note.text}&quot;</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center gap-3">
          {onOpenSchedule && (
            <Button
              variant="primary"
              onClick={() => {
                onClose();
                onOpenSchedule(patient);
              }}
              leftIcon={<Calendar className="w-4 h-4" />}
              className="flex-1"
            >
              Schedule Visit
            </Button>
          )}
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Close File
          </Button>
        </div>
      </div>
    </div>
  );
}
