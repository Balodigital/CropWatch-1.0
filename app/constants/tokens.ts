import { Platform } from 'react-native';

export const tokens = {
  colors: {
    // Primary (Green scales)
    primary50: '#eef8f3',
    primary100: '#dbf0e7',
    primary200: '#b8e0cc',
    primary300: '#8fccb0',
    primary400: '#6fc39e',
    primary500: '#2c6a4f', // Brand core
    primary600: '#21523c',
    primary700: '#183a2a',
    primary800: '#0f241b',
    primary900: '#08120d',

    // Neutrals
    neutral50: '#fafafa',
    neutral100: '#f5f5f5',
    neutral200: '#eeeeee',
    neutral300: '#e0e0e0',
    neutral400: '#bdbdbd',
    neutral500: '#9e9e9e',
    neutral600: '#757575',
    neutral700: '#616161',
    neutral800: '#424242',
    neutral900: '#212121',

    // Semantics
    error500: '#aa2222',
    error100: '#fce8e8',
    success500: '#3e8e41',
    success100: '#e9f5ea',
    warning500: '#cc9900',

    // Core Surfacing
    background: '#fafafa',
    surface: '#ffffff',
    text: '#1f1f1f',
    textSecondary: '#616161',
    border: '#e0e0e0',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },

  typography: {
    heading: {
      fontSize: 24,
      lineHeight: 32,
      fontWeight: '700' as const,
      fontFamily: 'Inter_600SemiBold',
    },
    title: {
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '600' as const,
      fontFamily: 'Inter_600SemiBold',
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
      fontFamily: 'Inter_400Regular',
    },
    caption: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
      fontFamily: 'Inter_400Regular',
    },
  },

  elevation: {
    level1: Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.18, shadowRadius: 1.0 },
      android: { elevation: 1 },
      default: {},
    }),
    level2: Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.20, shadowRadius: 1.41 },
      android: { elevation: 2 },
      default: {},
    }),
    level3: Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.24, shadowRadius: 2.22 },
      android: { elevation: 3 },
      default: {},
    }),
  }
};
