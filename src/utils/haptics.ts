import * as Haptics from 'expo-haptics';

import { getDb } from '@/db/client';

export function triggerHaptic(
  type: 'light' | 'medium' | 'heavy' = 'medium',
) {
  const row = getDb().getFirstSync<{ value: string }>(
    "SELECT value FROM settings WHERE key = 'haptics'",
  );
  if (row?.value === 'false') return;

  const impact = {
    light: Haptics.ImpactFeedbackStyle.Light,
    medium: Haptics.ImpactFeedbackStyle.Medium,
    heavy: Haptics.ImpactFeedbackStyle.Heavy,
  }[type];

  Haptics.impactAsync(impact);
}
