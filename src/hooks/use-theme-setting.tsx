import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

import { getDb } from '@/db/client';

export type ThemeMode = 'system' | 'light' | 'dark';

interface ThemeSettingContextValue {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  resolvedScheme: 'light' | 'dark';
}

const ThemeSettingContext = createContext<ThemeSettingContextValue>({
  themeMode: 'system',
  setThemeMode: () => {},
  resolvedScheme: 'light',
});

export function ThemeSettingProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    const row = getDb().getFirstSync<{ value: string }>(
      "SELECT value FROM settings WHERE key = 'theme'",
    );
    if (row && (row.value === 'light' || row.value === 'dark' || row.value === 'system')) {
      setThemeModeState(row.value);
    }
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    getDb().runSync(
      "INSERT OR REPLACE INTO settings (key, value) VALUES ('theme', ?)",
      mode,
    );
  }, []);

  const resolvedScheme: 'light' | 'dark' =
    themeMode === 'system'
      ? (systemScheme === 'dark' ? 'dark' : 'light')
      : themeMode;

  return (
    <ThemeSettingContext.Provider value={{ themeMode, setThemeMode, resolvedScheme }}>
      {children}
    </ThemeSettingContext.Provider>
  );
}

export function useThemeSetting() {
  return useContext(ThemeSettingContext);
}
