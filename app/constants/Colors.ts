/**
 * CropWatch Colors
 * Directly mapped from design-tokens.tokens.json 
 */

const primaryKey = '#2C6A4F';
const secondaryKey = '#72A749';
const tertiaryKey = '#DFD453';

const success = '#4CAF50'; // Mild Severity
const warning = '#E0A800'; // Moderate Severity
const error = '#AA2222';   // Severe Severity
const accent = '#C05530';

const neutralDark = '#121212';
const neutralVariant = '#474747';
const white = '#FFFFFF';

export const Colors = {
  light: {
    primary: primaryKey,
    secondary: secondaryKey,
    tertiary: tertiaryKey,
    text: neutralDark,
    textVariant: neutralVariant,
    background: '#F8FCFA', // From primary98 token
    surface: white,
    tint: primaryKey,
    icon: neutralVariant,
    tabIconDefault: neutralVariant,
    tabIconSelected: primaryKey,
    
    // Status
    success,
    warning,
    error,
    accent,
  },
  dark: {
    primary: primaryKey,
    secondary: secondaryKey,
    tertiary: tertiaryKey,
    text: white,
    textVariant: '#A4A4A4', // Lighter variant for dark mode readability
    background: neutralDark,
    surface: '#1E1E1E',
    tint: primaryKey,
    icon: '#A4A4A4',
    tabIconDefault: '#A4A4A4',
    tabIconSelected: primaryKey,
    
    // Status
    success,
    warning,
    error,
    accent,
  },
};
