import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Sprout } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function SplashScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { session, hasFinishedOnboarding } = useAuth();
  const { t } = useTranslation();
  
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.9);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      // Force user to onboarding if they haven't finished it
      // @ts-ignore
      if (!hasFinishedOnboarding) {
        router.replace('/onboarding');
      } else if (!session) {
        router.replace('/(auth)/login');
      } else {
        router.replace('/(tabs)');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [hasFinishedOnboarding, session]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View style={{ 
        opacity: fadeAnim, 
        transform: [{ scale: scaleAnim }],
        alignItems: 'center' 
      }}>
        <View style={[styles.logoContainer, { backgroundColor: theme.primaryContainer }]}>
          <Sprout size={64} color={theme.primary} />
        </View>
        <Text style={[Typography.displaySmall, { color: theme.primary, marginTop: 24 }]}>
          CropWatch
        </Text>
        <Text style={[Typography.bodyLarge, { color: theme.onSurfaceVariant, marginTop: 8 }]}>
          {t('splash.subtitle')}
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
