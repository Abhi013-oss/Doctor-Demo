"use client";

import React, { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Patient } from "@/types";
import { Modal, Button, Input, Select, Textarea } from "../ui";
import { useBusiness } from "@/hooks/useBusiness";

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (patient: Patient) => void;
}

export function PatientModal({ isOpen, onClose, onSave }: PatientModalProps) {
  const { terms } = useBusiness();
  const [name, setName] = useState("");
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Female");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [address, setAddress] = useState("");
  const [allergies, setAllergies] = useState("");
  const [medications, setMedications] = useState("");
  const [conditions, setConditions] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: Patient = {
      id: `PAT-${Math.floor(800 + Math.random() * 200)}`,
      mrn: `MRN-${Math.floor(90800 + Math.random() * 900)}`,
      name: name || `New ${terms.clientLabel}`,
      age: Number(age) || 30,
      gender,
      phone: phone || "+1 (555) 000-0000",
      email: email || "client@example.com",
      bloodGroup,
      address: address || "City Center",
      lastVisit: new Date().toISOString().split("T")[0],
      totalVisits: 1,
      status: "Active",
      allergies: allergies ? allergies.split(",").map((s) => s.trim()) : ["None Reported"],
      medications: medications ? medications.split(",").map((s) => s.trim()) : [],
      conditions: conditions ? conditions.split(",").map((s) => s.trim()) : ["General Audit"],
      notes,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
    };

    onSave(newPatient);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Register New ${terms.clientLabel}`}
      subtitle={`Create new electronic profile & ${terms.recordLabel}`}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <Input
          label="Full Legal Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Jessica Taylor"
          required
        />

        {/* Age, Gender & Blood Group */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Age *"
            type="number"
            min="0"
            max="120"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            required
          />
          <Select
            label="Gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as "Male" | "Female" | "Other")}
            options={[
              { label: "Female", value: "Female" },
              { label: "Male", value: "Male" },
              { label: "Other", value: "Other" },
            ]}
          />
          <Select
            label="Blood Group / Info"
            value={bloodGroup}
            onChange={(e) => setBloodGroup(e.target.value)}
            options={[
              { label: "A+", value: "A+" },
              { label: "A-", value: "A-" },
              { label: "B+", value: "B+" },
              { label: "B-", value: "B-" },
              { label: "O+", value: "O+" },
              { label: "O-", value: "O-" },
              { label: "AB+", value: "AB+" },
              { label: "AB-", value: "AB-" },
            ]}
          />
        </div>

        {/* Contact Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Phone Number *"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 000-0000"
            required
          />
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="client@example.com"
          />
        </div>

        {/* Address */}
        <Input
          label="Residential Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Full home or mailing address"
        />

        {/* Allergies & Conditions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Known Allergies / Restrictions (Comma separated)"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            placeholder="e.g. Penicillin, Latex"
          />
          <Input
            label="Active Medical / Profile Conditions"
            value={conditions}
            onChange={(e) => setConditions(e.target.value)}
            placeholder="e.g. Hypertension, Asthma"
          />
        </div>

        {/* Medications */}
        <Input
          label="Current Medications / Preferences"
          value={medications}
          onChange={(e) => setMedications(e.target.value)}
          placeholder="e.g. Lisinopril 10mg, Multivitamins"
        />

        {/* Notes */}
        <Textarea
          label={`Initial ${terms.recordLabel} Notes`}
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Key observations or intake remarks..."
        />

        <div className="pt-3 flex items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" type="submit" leftIcon={<CheckCircle className="w-4 h-4" />}>
            Save Record
          </Button>
        </div>
      </form>
    </Modal>
  );
}
