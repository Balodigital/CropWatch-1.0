import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { signIn } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChevronLeft, Sprout } from 'lucide-react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const formValid = emailValid && password.length > 0;

  const handleSignIn = async () => {
    if (!formValid) return;

    setLoading(true);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        Alert.alert('Sign In Failed', error);
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      Alert.alert('Sign In Failed', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <ChevronLeft size={24} color={theme.primary} />
            <Text style={[Typography.labelLarge, { color: theme.primary, marginLeft: 4 }]}>Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: theme.primaryContainer }]}>
              <Sprout size={32} color={theme.primary} />
            </View>
            <Text style={[styles.headline, Typography.headlineLarge, { color: theme.onSurface }]}>
              Welcome Back
            </Text>
            <Text style={[Typography.bodyLarge, { color: theme.onSurfaceVariant, marginTop: 8, textAlign: 'center' }]}>
              Sign in to continue monitoring your crops and getting AI diagnoses.
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              success={emailValid}
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              isPassword
            />

            <TouchableOpacity 
              onPress={() => router.push('/(auth)/forgot-password')}
              style={styles.forgotPassword}
            >
              <Text style={[Typography.labelLarge, { color: theme.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleSignIn}
              loading={loading}
              disabled={!formValid}
              style={styles.loginButton}
            />

            <View style={styles.footer}>
              <Text style={[Typography.bodyMedium, { color: theme.onSurfaceVariant }]}>
                Don't have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={[Typography.labelLarge, { color: theme.primary, fontWeight: '700' }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    marginLeft: -8,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  headline: {
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 32,
  },
  loginButton: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
});
