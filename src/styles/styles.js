// src/styles/styles.js

import { StyleSheet } from 'react-native';

const colors = {
  primary: '#E5C990',  // amber color
  background: '#1E1E1E',
  cardBg: 'rgba(48, 48, 48, 0.8)',
  cardHighlight: 'rgba(229, 201, 144, 0.25)',
  textPrimary: '#FFFFFF',  // white text
  textSecondary: '#FFFFFF', // changed from gray to white
  textAccent: '#E5C990',    // amber accent text
  buttonText: '#000000',    // black text on buttons
  success: '#65B741',       // success color
};

const fontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

const spacing = {
  xs: 4,
  sm: 8,
  base: 16,
  lg: 24,
  xl: 32,
};

const borderRadius = {
  sm: 8,
  base: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

const fontWeights = {
  normal: 'normal',
  medium: '500',
  semibold: '600',
  bold: 'bold',
};

export const appStyles = StyleSheet.create({
  // Layout styles
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    paddingTop: 0, // Will be adjusted for status bar height
  },
  scrollContent: {
    padding: spacing.base,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  
  // Card styles
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: borderRadius.xl,
    padding: spacing.base,
    marginBottom: spacing.base,
    overflow: 'hidden',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.cardHighlight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  sessionCard: {
    backgroundColor: 'rgba(70, 70, 70, 0.5)',
    borderRadius: borderRadius.base,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },

  // Text styles
  textPrimary: {
    color: colors.textPrimary,
  },
  textSecondary: {
    color: colors.textSecondary,
  },
  textAccent: {
    color: colors.textAccent,
  },
  textBold: {
    fontWeight: fontWeights.bold,
  },
  textSemibold: {
    fontWeight: fontWeights.semibold,
  },
  textMedium: {
    fontWeight: fontWeights.medium,
  },
  textXs: {
    fontSize: fontSizes.xs,
  },
  textSm: {
    fontSize: fontSizes.sm,
  },
  textBase: {
    fontSize: fontSizes.base,
  },
  textLg: {
    fontSize: fontSizes.lg,
  },
  textXl: {
    fontSize: fontSizes.xl,
  },
  text2Xl: {
    fontSize: fontSizes['2xl'],
  },
  text3Xl: {
    fontSize: fontSizes['3xl'],
  },
  text4Xl: {
    fontSize: fontSizes['4xl'],
  },
  textCenter: {
    textAlign: 'center',
  },

  // Button styles
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  buttonText: {
    color: colors.buttonText,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.base,
  },

  // Util styles
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  mt1: { marginTop: spacing.xs },
  mt2: { marginTop: spacing.sm },
  mt4: { marginTop: spacing.base },
  mb1: { marginBottom: spacing.xs },
  mb2: { marginBottom: spacing.sm },
  mb4: { marginBottom: spacing.base },
  mr2: { marginRight: spacing.sm },
  mr3: { marginRight: spacing.base - 4 },

  // Streak specific
  streakDot: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
  },
  streakDotActive: {
    backgroundColor: colors.primary,
  },
  streakDotToday: {
    borderWidth: 2,
    borderColor: colors.textSecondary,
    backgroundColor: 'rgba(70, 70, 70, 1)',
  },
});

export { colors };