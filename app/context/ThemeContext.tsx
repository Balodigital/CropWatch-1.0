import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  colorScheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@cropwatch_theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

  useEffect(() => {
    // Load persisted theme
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (e) {
        console.error('Failed to load theme', e);
      }
    };
    loadTheme();
  }, []);

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (e) {
      console.error('Failed to save theme', e);
    }
  };

  // Determine the actual color scheme to use
  const colorScheme = themeMode === 'system' 
    ? (deviceColorScheme ?? 'light') 
    : themeMode;

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, colorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
