"use client";

import React, { useState } from "react";
import { Calendar, CheckCircle } from "lucide-react";
import { Appointment } from "@/types";
import { useLiveClinicData } from "@/lib/store";
import { Modal, Button, Input, Select, Textarea } from "../ui";
import { useBusiness } from "@/hooks/useBusiness";

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Partial<Appointment>) => void;
  initialData?: Appointment | null;
}

export function AppointmentModal({ isOpen, onClose, onSave, initialData }: AppointmentModalProps) {
  const { terms } = useBusiness();
  const { patients = [] } = useLiveClinicData();

  const safePatients = (patients || []).filter((p) => p && typeof p === "object" && p.id);
  const firstPatientId = safePatients[0]?.id || "";

  const [patientId, setPatientId] = useState(initialData?.patientId || firstPatientId);
  const [doctorName, setDoctorName] = useState(initialData?.doctorName || "Dr. Alexander Vance");
  const [department, setDepartment] = useState(initialData?.department || "Cardiology");
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState(initialData?.time || "10:00 AM");
  const [type, setType] = useState<Appointment["type"]>(initialData?.type || "In-Person");
  const [reason, setReason] = useState(initialData?.reason || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [status, setStatus] = useState<Appointment["status"]>(initialData?.status || "Scheduled");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPatient = safePatients.find((p) => p.id === patientId) || safePatients[0];

    onSave({
      id: initialData?.id || `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: selectedPatient?.id || "PAT-001",
      patientName: selectedPatient?.name || "Guest Patient",
      patientPhone: selectedPatient?.phone || "",
      patientEmail: selectedPatient?.email || "",
      patientAge: selectedPatient?.age || 30,
      patientGender: selectedPatient?.gender || "Other",
      doctorName,
      department,
      date,
      time,
      type,
      status,
      reason: reason || "General Consultation",
      notes,
      avatar: selectedPatient?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit ${terms.bookingLabel}` : `Schedule New ${terms.bookingLabel}`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Select {terms.clientLabel}
          </label>
          <Select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            options={
              safePatients.length > 0
                ? safePatients.map((p) => ({
                    value: p.id,
                    label: `${p.name} (${p.mrn || p.id})`,
                  }))
                : [{ value: "", label: "No registered patients (Guest mode)" }]
            }
          />
        </div>

        {/* Doctor & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Provider Name"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            required
          />
          <Input
            label="Department / Specialty"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            required
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            label="Time Slot"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. 10:30 AM"
            required
          />
        </div>

        {/* Type & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Visit Type"
            value={type}
            onChange={(e) => setType(e.target.value as Appointment["type"])}
            options={[
              { value: "In-Person", label: "In-Person Visit" },
              { value: "Telehealth", label: "Telehealth Consultation" },
              { value: "Follow-up", label: "Follow-up Care" },
            ]}
          />
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Appointment["status"])}
            options={[
              { value: "Pending", label: "Pending Approval" },
              { value: "Scheduled", label: "Scheduled" },
              { value: "Approved", label: "Approved" },
              { value: "Completed", label: "Completed" },
              { value: "Cancelled", label: "Cancelled" },
            ]}
          />
        </div>

        {/* Reason for Visit */}
        <Textarea
          label="Primary Reason / Chief Concern"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Brief summary of consultation request..."
          rows={2}
        />

        {/* Notes */}
        <Textarea
          label="Internal Doctor Notes (Optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Internal notes visible to medical staff..."
          rows={2}
        />

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" leftIcon={<CheckCircle className="w-4 h-4" />}>
            Save {terms.bookingLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
