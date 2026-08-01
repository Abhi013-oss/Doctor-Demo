"use client";

import { useEffect, useState } from "react";
import { getStoredClinicSettings, saveStoredClinicSettings } from "../lib/store";
import { ClinicSettings } from "../types";

export function useSettings() {
  const [settings, setSettingsState] = useState<ClinicSettings>(getStoredClinicSettings());

  useEffect(() => {
    setSettingsState(getStoredClinicSettings());
  }, []);

  const updateSettings = (newSettings: ClinicSettings) => {
    setSettingsState(newSettings);
    saveStoredClinicSettings(newSettings);
  };

  return {
    settings,
    updateSettings,
  };
}
