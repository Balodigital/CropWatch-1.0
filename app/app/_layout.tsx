import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Load i18n instance
import '../i18n';

// Load Inter Fonts
import { 
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold 
} from '@expo-google-fonts/inter';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AuthProvider, useAuth } from '@/context/AuthContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { loading, session, hasFinishedOnboarding } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if ((fontsLoaded || fontError) && !loading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, loading]);

  // Global Route Guard
  useEffect(() => {
    if (loading || (!fontsLoaded && !fontError)) return;

    const isSplash = segments[0] === 'splash';
    const inOnboardingGroup = segments[0] === '(onboarding)';
    const inAuthGroup = segments[0] === '(auth)';

    // Let the splash screen finish its 3-second timeout natively
    if (isSplash) return;

    if (!hasFinishedOnboarding) {
      // Force user to onboarding if they haven't finished it
      // @ts-ignore
      if (!inOnboardingGroup) router.replace('/(onboarding)/index');
    } else if (!session) {
      // Force user to login if they have no active session
      if (!inAuthGroup) router.replace('/(auth)/login');
    } else {
      // If fully authenticated, don't let them sit on login/onboarding
      if (inAuthGroup || inOnboardingGroup) router.replace('/(tabs)');
    }
  }, [loading, fontsLoaded, fontError, session, hasFinishedOnboarding, segments]);

  if ((!fontsLoaded && !fontError) || loading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Protected Group */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Onboarding Flow */}
        <Stack.Screen name="splash" options={{ animation: 'fade' }} />
        <Stack.Screen name="(onboarding)" options={{ gestureEnabled: false }} />
        
        {/* Auth Flow */}
        <Stack.Screen name="(auth)" options={{ presentation: 'card' }} />
        
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal', headerShown: true }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
