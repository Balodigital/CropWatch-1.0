/**
 * CropWatch Theme
 * Strictly derived from tokens.css
 */

export const Colors = {
  light: {
    primary: '#2c6a4f',
    onPrimary: '#ffffff',
    primaryContainer: '#dbf0e7',
    onPrimaryContainer: '#2d6c51',
    
    secondary: '#618e3e',
    onSecondary: '#ffffff',
    
    tertiary: '#aca120',
    onTertiary: '#ffffff',
    
    error: '#aa2222',
    onError: '#ffffff',
    
    background: '#fafafa',
    onBackground: '#1f1f1f',
    
    surface: '#ffffff',
    onSurface: '#1f1f1f',
    surfaceVariant: '#e6e6e6',
    onSurfaceVariant: '#4c4c4c',
    
    outline: '#808080',
    
    success: '#3e8e41',
    warning: '#cc9900',
    accent: '#a34829',
    
    muted: '#9e9e9e',
    
    // Legacy mappings for compatibility
    text: '#1f1f1f',
    textSecondary: '#4c4c4c',
    tabIconSelected: '#2c6a4f',
    tabIconDefault: '#808080',
    primaryLight: '#dbf0e7',
    icon: '#4c4c4c',
    tint: '#2c6a4f',
  },
  dark: {
    primary: '#6fc39e',
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
    
    // Legacy mappings for compatibility
    text: '#ebebeb',
    textSecondary: '#cccccc',
    tabIconSelected: '#6fc39e',
    tabIconDefault: '#999999',
    primaryLight: '#1e4836',
    icon: '#cccccc',
    tint: '#6fc39e',
  },
};

export type ThemeColors = typeof Colors.light;
