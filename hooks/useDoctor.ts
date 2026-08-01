"use client";

import { CLINIC_INFO } from "../constants/default-data";
import { getStoredClinicSettings } from "../lib/store";
import { useEffect, useState } from "react";

export function useDoctor() {
  const [providerInfo, setProviderInfo] = useState({
    name: CLINIC_INFO.doctor.name,
    title: CLINIC_INFO.doctor.title,
    qualifications: CLINIC_INFO.doctor.qualifications,
    experienceYears: CLINIC_INFO.doctor.experienceYears,
    patientsTreated: CLINIC_INFO.doctor.patientsTreated,
    bio: CLINIC_INFO.doctor.bio,
    avatarUrl: CLINIC_INFO.doctor.bio,
  });

  useEffect(() => {
    const settings = getStoredClinicSettings();
    if (settings) {
      setProviderInfo((prev) => ({
        ...prev,
        name: settings.doctorName || prev.name,
        qualifications: settings.qualification || prev.qualifications,
        experienceYears: settings.experienceYears || prev.experienceYears,
        avatarUrl: settings.avatarUrl || prev.avatarUrl,
      }));
    }
  }, []);

  return {
    provider: providerInfo,
    doctor: providerInfo, // Backward compatibility alias
    clinic: CLINIC_INFO,
  };
}
