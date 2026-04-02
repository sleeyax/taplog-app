import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';

const HAPTICS_KEY = 'settings:haptics';

export async function triggerHaptic(
  type: 'light' | 'medium' | 'heavy' = 'medium',
) {
  const val = await AsyncStorage.getItem(HAPTICS_KEY);
  if (val === 'false') return;

  const impact = {
    light: Haptics.ImpactFeedbackStyle.Light,
    medium: Haptics.ImpactFeedbackStyle.Medium,
    heavy: Haptics.ImpactFeedbackStyle.Heavy,
  }[type];

  await Haptics.impactAsync(impact);
}
