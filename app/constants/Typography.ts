import { StyleSheet } from 'react-native';

/**
 * CropWatch Typography
 * Strictly derived from tokens.css
 */

export const Typography = StyleSheet.create({
  // Display
  displayLarge: { fontFamily: 'Inter_500Medium', fontSize: 57, lineHeight: 64, letterSpacing: -2.28 },
  displayMedium: { fontFamily: 'Inter_500Medium', fontSize: 48, lineHeight: 52, letterSpacing: -1.92 },
  displaySmall: { fontFamily: 'Inter_500Medium', fontSize: 36, lineHeight: 44, letterSpacing: -0.72 },
  
  // Headline
  headlineLarge: { fontFamily: 'Inter_600SemiBold', fontSize: 32, lineHeight: 40, letterSpacing: -0.48 },
  headlineMedium: { fontFamily: 'Inter_600SemiBold', fontSize: 28, lineHeight: 36, letterSpacing: -0.336 },
  headlineSmall: { fontFamily: 'Inter_500Medium', fontSize: 24, lineHeight: 32, letterSpacing: -0.24 },
  
  // Title
  titleLarge: { fontFamily: 'Inter_600SemiBold', fontSize: 22, lineHeight: 28, letterSpacing: -0.187 },
  titleMedium: { fontFamily: 'Inter_600SemiBold', fontSize: 16, lineHeight: 24, letterSpacing: -0.08 },
  titleSmall: { fontFamily: 'Inter_500Medium', fontSize: 14, lineHeight: 20, letterSpacing: -0.14 },
  
  // Body
  bodyLarge: { fontFamily: 'Inter_400Regular', fontSize: 16, lineHeight: 24, letterSpacing: 0.5 },
  bodyMedium: { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, letterSpacing: 0.035 },
  bodySmall: { fontFamily: 'Inter_400Regular', fontSize: 12, lineHeight: 16, letterSpacing: 0.048 },
  
  // Label
  labelLarge: { fontFamily: 'Inter_500Medium', fontSize: 14, lineHeight: 20, letterSpacing: 0.014 },
  labelMedium: { fontFamily: 'Inter_500Medium', fontSize: 12, lineHeight: 16, letterSpacing: 0.06 },
  labelSmall: { fontFamily: 'Inter_500Medium', fontSize: 11, lineHeight: 16, letterSpacing: 0 },
});
