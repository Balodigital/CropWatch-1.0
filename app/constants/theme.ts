/**
 * CropWatch Theme
 * Strictly derived from tokens.css
 */

export const Colors = {
  light: {
    primary: '#2c6a4f', // --ref-color-primary-key-color
    onPrimary: '#ffffff', // --sys-color-primary-roles-on-primary
    primaryContainer: '#dbf0e7', // --ref-color-primary-primary90
    onPrimaryContainer: '#2d6c51', // --sys-color-primary-roles-on-primary-container
    
    secondary: '#618e3e', // --ref-color-secondary-secondary40
    onSecondary: '#ffffff',
    
    tertiary: '#aca120', // --ref-color-tertiary-tertiary40
    onTertiary: '#ffffff',
    
    error: '#aa2222', // --ref-color-error-error40
    onError: '#ffffff',
    
    background: '#fafafa', // --ref-color-neutral-neutral98
    onBackground: '#1f1f1f', // --ref-color-neutral-neutral10
    
    surface: '#ffffff', // --ref-color-neutral-neutral100
    onSurface: '#1f1f1f',
    surfaceVariant: '#e6e6e6', // --ref-color-neutral-variant-neutral90
    onSurfaceVariant: '#4c4c4c', // --ref-color-neutral-variant-neutral30
    
    outline: '#808080', // --ref-color-neutral-variant-neutral50
    
    success: '#3e8e41', // --ref-color-success-success40
    warning: '#cc9900', // --ref-color-warning-warning40
    accent: '#a34829', // --ref-color-accent-accent40
    
    muted: '#9e9e9e', // --ref-color-neutral-neutral60
  },
  dark: {
    primary: '#6fc39e', // dim primary
    onPrimary: '#0f241b',
    primaryContainer: '#1e4836',
    onPrimaryContainer: '#dbf0e7',
    
    secondary: '#94c171',
    onSecondary: '#182310',
    
    tertiary: '#dfd453',
    onTertiary: '#2b2808',
    
    error: '#eeaaaa',
    onError: '#551111',
    
    background: '#1f1f1f',
    onBackground: '#ebebeb',
    
    surface: '#383838',
    onSurface: '#ebebeb',
    surfaceVariant: '#4c4c4c',
    onSurfaceVariant: '#cccccc',
    
    outline: '#999999',
    
    success: '#71c174',
    warning: '#ffcc33',
    accent: '#d67b5c',
    
    muted: '#858585',
  },
};

export type ThemeColors = typeof Colors.light;
