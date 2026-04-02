import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

const HAPTICS_KEY = 'settings:haptics';

export function useHapticsSetting() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(HAPTICS_KEY).then((val) => {
      if (val !== null) setEnabled(val === 'true');
    });
  }, []);

  const toggle = useCallback(async () => {
    const next = !enabled;
    setEnabled(next);
    await AsyncStorage.setItem(HAPTICS_KEY, String(next));
  }, [enabled]);

  return { hapticsEnabled: enabled, toggleHaptics: toggle };
}
