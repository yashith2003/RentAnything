//RentAnything/constants/spacing.ts

/**
 * Spacing Constants
 * Centralized spacing values for consistent layout across the app
 * Based on Tailwind's spacing scale (4px base unit)
 */

export const Spacing = {
  /* ================= Page Margins ================= */
  /** Standard horizontal page padding - 24px (px-6 in Tailwind) */
  pageHorizontal: 24,
  
  /** Vertical page padding */
  pageVertical: 16,
  
  /* ================= Component Spacing ================= */
  /** Extra small - 4px */
  xs: 4,
  
  /** Small - 8px */
  sm: 8,
  
  /** Medium - 12px */
  md: 12,
  
  /** Large - 16px */
  lg: 16,
  
  /** Extra large - 20px */
  xl: 20,
  
  /** 2X large - 24px */
  xxl: 24,
  
  /** 3X large - 32px */
  xxxl: 32,
  
  /* ================= Specific Use Cases ================= */
  /** Gap between cards/items in a grid */
  cardGap: 16,
  
  /** Section spacing (between major sections) */
  sectionGap: 24,
  
  /** Header height */
  headerHeight: 60,
  
  /** Bottom tab bar height */
  tabBarHeight: 65,
  
  /** Border radius for cards */
  borderRadiusCard: 16,
  
  /** Border radius for buttons */
  borderRadiusButton: 30,
  
  /** Border radius for inputs */
  borderRadiusInput: 12,
};

/**
 * Helper function to get Tailwind class name from spacing value
 * @param value - Spacing value in pixels
 * @returns Tailwind class name (e.g., 'px-6')
 */
export const getTailwindSpacing = (value: number): string => {
  const spacingMap: { [key: number]: string } = {
    4: '1',
    8: '2',
    12: '3',
    16: '4',
    20: '5',
    24: '6',
    32: '8',
    40: '10',
    48: '12',
  };
  
  return spacingMap[value] || '0';
};

/**
 * Common padding styles for reuse
 */
export const PaddingStyles = {
  /** Standard page padding: { paddingHorizontal: 24 } */
  page: {
    paddingHorizontal: Spacing.pageHorizontal,
  },
  
  /** Standard page padding with vertical: { paddingHorizontal: 24, paddingVertical: 16 } */
  pageWithVertical: {
    paddingHorizontal: Spacing.pageHorizontal,
    paddingVertical: Spacing.pageVertical,
  },
  
  /** Card padding: { padding: 16 } */
  card: {
    padding: Spacing.lg,
  },
  
  /** Section spacing: { marginBottom: 24 } */
  section: {
    marginBottom: Spacing.sectionGap,
  },
};