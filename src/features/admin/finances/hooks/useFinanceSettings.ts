import { useState, useEffect } from 'react';
import { FinanceSettings } from '../types';

const SETTINGS_KEY = 'finance_global_settings_v1';

export const DEFAULT_SETTINGS: FinanceSettings = {
  electricityPrice: 0.85, // S/. per kWh (Lima avg)
  machineDepreciationRate: 0.50, // Legacy fallback
  machineDepreciationRateFdm: 0.50, // Default FDM
  machineDepreciationRateResin: 0.80, // Default Resin (Higher due to screen wear)
  materialCostFdm: 80, // S/. per kg
  materialCostResin: 180, // S/. per liter
  humanHourlyRate: 20, // S/. per hour target
  machines: []
};

export function useFinanceSettings() {
  const [settings, setSettings] = useState<FinanceSettings>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          return { ...DEFAULT_SETTINGS, ...parsed };
        } catch (e) {
          console.error("Error loading finance settings", e);
        }
      }
    }
    return DEFAULT_SETTINGS;
  });
  const [loading] = useState(false);

  const updateSettings = (newSettings: FinanceSettings) => {
    const settingsWithTimestamp = {
      ...newSettings,
      updatedAt: Date.now()
    };
    setSettings(settingsWithTimestamp);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsWithTimestamp));
    }
  };

  const importSettings = (newSettings: FinanceSettings) => {
    setSettings(newSettings);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    }
  };

  return { settings, updateSettings, importSettings, loading };
}
