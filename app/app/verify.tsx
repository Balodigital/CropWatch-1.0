import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import * as Linking from 'expo-linking';
import { Typography } from '@/constants/Typography';
import { CheckCircle2, AlertCircle } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function VerifyScreen() {
  const router = useRouter();
  const { session: authSession, refreshProfile } = useAuth();
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  useEffect(() => {
    const handleDeepLink = async () => {
      const url = await Linking.getInitialURL();
      if (url) {
        await processUrl(url);
      } else {
        // If no initial URL, check if we already have a session
        if (authSession) {
          setVerifying(false);
        } else {
          // If we've been here for a few seconds and still no session, show error or redirect
          const timer = setTimeout(() => {
            if (!authSession) {
              setVerifying(false);
              setError("We couldn't verify your session. Please try logging in.");
            }
          }, 5000);
          return () => clearTimeout(timer);
        }
      }
    };

    const processUrl = async (url: string) => {
      const { queryParams } = Linking.parse(url);
      
      // Supabase sends access_token and refresh_token in the URL fragment (#) or query params
      // expo-linking parse might put them in queryParams or we might need to extract them manually if they are in the fragment
      
      if (url.includes('access_token')) {
        const params: any = {};
        url.split('#')[1]?.split('&').forEach(part => {
          const [key, value] = part.split('=');
          params[key] = value;
        });

        if (params.access_token && params.refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: params.access_token,
            refresh_token: params.refresh_token,
          });

          if (sessionError) {
            setError(sessionError.message);
          } else {
            await refreshProfile();
          }
        }
      }
      setVerifying(false);
    };

    handleDeepLink();

    const subscription = Linking.addEventListener('url', (event) => {
      processUrl(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (authSession && !verifying) {
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [authSession, verifying]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {authSession ? (
          <>
            <View style={[styles.iconContainer, { backgroundColor: theme.success + '20' }]}>
              <CheckCircle2 size={64} color={theme.success} />
            </View>
            <Text style={[Typography.headlineMedium, { color: theme.onSurface, textAlign: 'center', marginTop: 24 }]}>
              Email Verified!
            </Text>
            <Text style={[Typography.bodyLarge, { color: theme.onSurfaceVariant, textAlign: 'center', marginTop: 12 }]}>
              Taking you to your dashboard...
            </Text>
          </>
        ) : error ? (
          <>
            <View style={[styles.iconContainer, { backgroundColor: theme.error + '20' }]}>
              <AlertCircle size={64} color={theme.error} />
            </View>
            <Text style={[Typography.headlineSmall, { color: theme.onSurface, textAlign: 'center', marginTop: 24 }]}>
              Verification Failed
            </Text>
            <Text style={[Typography.bodyLarge, { color: theme.onSurfaceVariant, textAlign: 'center', marginTop: 12, marginBottom: 32 }]}>
              {error}
            </Text>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={() => router.replace('/(auth)/login')}
            >
              <Text style={[Typography.labelLarge, { color: theme.onPrimary }]}>Back to Login</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[Typography.headlineSmall, { color: theme.onSurface, textAlign: 'center', marginTop: 24 }]}>
              Verifying your email...
            </Text>
            <Text style={[Typography.bodyLarge, { color: theme.onSurfaceVariant, textAlign: 'center', marginTop: 12 }]}>
              Please wait a moment while we confirm your account.
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
});
