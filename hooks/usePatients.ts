"use client";

import { useLiveClinicData, addDoctorNoteToPatient, editDoctorNoteInPatient, deleteDoctorNoteFromPatient } from "../lib/store";
import { Patient } from "../types";

export function usePatients() {
  const { patients, setPatients, deletePatient, isLoaded, refreshData } = useLiveClinicData();

  const getPatientById = (patientId: string): Patient | undefined => {
    return patients.find((p) => p.id === patientId || p.email.toLowerCase() === patientId.toLowerCase());
  };

  const addNote = (patientId: string, text: string, author?: string) => {
    addDoctorNoteToPatient(patientId, text, author);
  };

  const editNote = (patientId: string, noteId: string, text: string) => {
    editDoctorNoteInPatient(patientId, noteId, text);
  };

  const deleteNote = (patientId: string, noteId: string) => {
    deleteDoctorNoteFromPatient(patientId, noteId);
  };

  return {
    patients,
    setPatients,
    getPatientById,
    deletePatient,
    addNote,
    editNote,
    deleteNote,
    isLoaded,
    refreshData,
  };
}
