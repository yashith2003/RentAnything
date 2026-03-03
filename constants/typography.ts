//RentAnything/constants/typography.ts

/**
 * Typography Constants
 * Centralized typography system for consistent text styling across the app.
 * Using a modern scale for a premium, clean look.
 */

export const FontSize = {
  /** 32px - Large Headings (Hero) */
  xxxl: 32,
  
  /** 24px - Section Titles */
  xxl: 24,
  
  /** 20px - Semi-Large Headings */
  xl: 20,
  
  /** 18px - Sub-Headings */
  lg: 18,
  
  /** 16px - Base Body Text */
  base: 16,
  
  /** 14px - Secondary Body / Medium Text */
  md: 14,
  
  /** 12px - Small Text / Captions */
  sm: 12,
  
  /** 10px - Tiny / Micro labels */
  xs: 10,
};

export const FontWeight = {
  /** 700 - Use for primary headlines */
  bold: '700' as const,
  
  /** 600 - Use for section headers and button labels */
  semiBold: '600' as const,
  
  /** 500 - Use for emphasis within body text or secondary buttons */
  medium: '500' as const,
  
  /** 400 - Default body text weight */
  regular: '400' as const,
  
  /** 300 - Decorative or subtle text */
  light: '300' as const,
};

export const LetterSpacing = {
  tighter: -0.5,
  tight: -0.2,
  normal: 0,
  wide: 0.2,
  wider: 0.5,
};

export const LineHeight = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
};

/**
 * Common Typography Presets
 * Can be used as spread objects in style sheets
 */
export const Typography = {
  h1: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    letterSpacing: LetterSpacing.tight,
    lineHeight: FontSize.xxxl * LineHeight.tight,
  },
  h2: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    letterSpacing: LetterSpacing.tight,
    lineHeight: FontSize.xxl * LineHeight.tight,
  },
  h3: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.semiBold,
    letterSpacing: LetterSpacing.tight,
    lineHeight: FontSize.xl * LineHeight.tight,
  },
  h4: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semiBold,
    letterSpacing: LetterSpacing.tight,
    lineHeight: FontSize.lg * LineHeight.tight,
  },
  bodyLarge: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.base * LineHeight.normal,
  },
  bodyMedium: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.md * LineHeight.normal,
  },
  bodySmall: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    lineHeight: FontSize.sm * LineHeight.normal,
  },
  caption: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    lineHeight: FontSize.xs * LineHeight.tight,
  },
  button: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semiBold,
    textTransform: 'none' as const,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: '#333333',
  },
};