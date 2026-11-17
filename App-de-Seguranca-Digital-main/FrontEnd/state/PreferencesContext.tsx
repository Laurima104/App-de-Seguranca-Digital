import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';

export type Preferences = {
  fontScale: 0.9 | 1 | 1.1 | 1.2;
  highContrast: boolean;
  theme: 'dark' | 'light';
  notifyStreak: boolean;
  notifyEducation: boolean;
  notifyAchievements: boolean;
};

const defaults: Preferences = { fontScale: 1, highContrast: false, theme: 'dark', notifyStreak: false, notifyEducation: false, notifyAchievements: false };
type PreferencesContextValue = {
  preferences: Preferences;
  updatePreferences: (updates: Partial<Preferences>) => void;
};
const PreferencesContext = createContext<PreferencesContextValue | null>(null);
const fileUri = `${FileSystem.documentDirectory ?? ''}preferences.json`;

export function PreferencesProvider({ children }: React.PropsWithChildren) {
  const [preferences, setPreferences] = useState(defaults);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const info = await FileSystem.getInfoAsync(fileUri);
        if (info.exists) {
          const saved = JSON.parse(await FileSystem.readAsStringAsync(fileUri)) as Partial<Preferences>;
          if (active) setPreferences({ ...defaults, ...saved });
        }
      } catch {
        // A missing or unreadable preferences file leaves the safe defaults in place.
      } finally {
        if (active) setHydrated(true);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!hydrated || !FileSystem.documentDirectory) return;
    FileSystem.writeAsStringAsync(fileUri, JSON.stringify(preferences)).catch(() => undefined);
  }, [preferences, hydrated]);

  const value = useMemo(() => ({
    preferences,
    updatePreferences: (updates: Partial<Preferences>) => setPreferences(current => ({ ...current, ...updates })),
  }), [preferences]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences deve ser usado dentro de PreferencesProvider.');
  return context;
}
