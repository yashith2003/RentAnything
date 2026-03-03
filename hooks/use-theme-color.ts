//RentAnything/hooks/use-theme-color.ts

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Returns a theme-aware color from the Colors object.
 * Currently uses a single palette, but supports future dark mode extension.
 */
export function useThemeColor(
  _props: { light?: string; dark?: string },
  colorName: keyof typeof Colors
) {
  const _theme = useColorScheme() ?? 'light';

  // For now, return from the shared Colors object
  return Colors[colorName];
}
