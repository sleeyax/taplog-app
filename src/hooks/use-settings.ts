import { useCallback, useEffect, useState } from 'react';

import { getDb } from '@/db/client';

export function useHapticsSetting() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const row = getDb().getFirstSync<{ value: string }>(
      "SELECT value FROM settings WHERE key = 'haptics'",
    );
    if (row) setEnabled(row.value === 'true');
  }, []);

  const toggle = useCallback(() => {
    const next = !enabled;
    setEnabled(next);
    getDb().runSync(
      "INSERT OR REPLACE INTO settings (key, value) VALUES ('haptics', ?)",
      String(next),
    );
  }, [enabled]);

  return { hapticsEnabled: enabled, toggleHaptics: toggle };
}
