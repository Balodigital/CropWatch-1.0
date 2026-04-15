/**
 * CropWatch Theme
 * Uses colors from design-tokens.tokens.json
 */

import { Platform } from 'react-native';

const primaryKey = '#2c6a4f';
const primaryLight = '#4bb486';
const primaryDark = '#0f241b';
const secondaryKey = '#72a749';
const tertiaryKey = '#dfd453';

export const Colors = {
  light: {
    primary: primaryKey,
    primaryLight: primaryLight,
    primaryDark: primaryDark,
    secondary: secondaryKey,
    tertiary: tertiaryKey,
    text: '#121212',
    textSecondary: '#474747',
    background: '#F8FCFA',
    surface: '#FFFFFF',
    tint: primaryKey,
    icon: '#474747',
    tabIconDefault: '#474747',
    tabIconSelected: primaryKey,
    
    success: '#4caf50',
    warning: '#e0a800',
    error: '#aa2222',
    accent: '#c05530',
  },
  dark: {
    primary: primaryKey,
    primaryLight: primaryLight,
    primaryDark: primaryDark,
    secondary: secondaryKey,
    tertiary: tertiaryKey,
    text: '#FFFFFF',
    textSecondary: '#A4A4A4',
    background: '#121212',
    surface: '#1E1E1E',
    tint: primaryKey,
    icon: '#A4A4A4',
    tabIconDefault: '#A4A4A4',
    tabIconSelected: primaryKey,
    
    success: '#4caf50',
    warning: '#e0a800',
    error: '#aa2222',
    accent: '#c05530',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
