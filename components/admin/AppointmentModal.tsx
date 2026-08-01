"use client";

import React, { useState } from "react";
import { Calendar, CheckCircle } from "lucide-react";
import { Appointment } from "@/types";
import { INITIAL_PATIENTS } from "@/constants/default-data";
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
  const [patientId, setPatientId] = useState(initialData?.patientId || INITIAL_PATIENTS[0].id);
  const [doctorName, setDoctorName] = useState(initialData?.doctorName || "Dr. Alexander Vance");
  const [department, setDepartment] = useState(initialData?.department || "Cardiology");
  const [date, setDate] = useState(initialData?.date || "2026-07-31");
  const [time, setTime] = useState(initialData?.time || "10:00 AM");
  const [type, setType] = useState<Appointment["type"]>(initialData?.type || "In-Person");
  const [reason, setReason] = useState(initialData?.reason || "");
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [status, setStatus] = useState<Appointment["status"]>(initialData?.status || "Scheduled");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedPatient = INITIAL_PATIENTS.find((p) => p.id === patientId) || INITIAL_PATIENTS[0];

    onSave({
      id: initialData?.id || `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      patientPhone: selectedPatient.phone,
      patientEmail: selectedPatient.email,
      patientAge: selectedPatient.age,
      patientGender: selectedPatient.gender,
      doctorName,
      department,
      date,
      time,
      type,
      status,
      reason: reason || "General Consultation",
      notes,
      avatar: selectedPatient.avatar,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? `Edit ${terms.bookingLabel}` : `Schedule New ${terms.bookingLabel}`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Patient Selection */}
        <Select
          label={`Select ${terms.clientLabel} *`}
          value={patientId}
          onChange={(e) => setPatientId(e.target.value)}
          options={INITIAL_PATIENTS.map((p) => ({
            label: `${p.name} (${p.mrn}) — ${p.phone}`,
            value: p.id,
          }))}
        />

        {/* Doctor & Department */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label={`Assigned ${terms.providerLabel}`}
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            required
          />
          <Select
            label="Department / Category"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            options={[
              { label: "Cardiology", value: "Cardiology" },
              { label: "Neurology", value: "Neurology" },
              { label: "Orthopedics", value: "Orthopedics" },
              { label: "Dermatology", value: "Dermatology" },
              { label: "General Practice", value: "General Practice" },
            ]}
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Date *"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            label="Time Slot *"
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="e.g. 10:30 AM"
            required
          />
        </div>

        {/* Type & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Consultation Type"
            value={type}
            onChange={(e) => setType(e.target.value as Appointment["type"])}
            options={[
              { label: "In-Person Clinic", value: "In-Person" },
              { label: "Telehealth Video", value: "Telehealth" },
              { label: "Follow-up", value: "Follow-up" },
              { label: "Emergency", value: "Emergency" },
            ]}
          />
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Appointment["status"])}
            options={[
              { label: "Scheduled", value: "Scheduled" },
              { label: "Waiting / Checked In", value: "Waiting" },
              { label: "In Progress", value: "In Progress" },
              { label: "Completed", value: "Completed" },
              { label: "Cancelled", value: "Cancelled" },
            ]}
          />
        </div>

        {/* Reason */}
        <Input
          label="Reason for Visit *"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Routine Consultation & Assessment"
          required
        />

        {/* Notes */}
        <Textarea
          label="Notes (Optional)"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add symptoms, pre-visit instructions or internal notes..."
        />

        <div className="pt-3 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" leftIcon={<CheckCircle className="w-4 h-4" />}>
            {initialData ? `Update ${terms.bookingLabel}` : "Confirm Schedule"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
