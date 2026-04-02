import { Colors } from '@/constants/theme';
import { useThemeSetting } from '@/hooks/use-theme-setting';

export function useTheme() {
  const { resolvedScheme } = useThemeSetting();
  return Colors[resolvedScheme];
}
