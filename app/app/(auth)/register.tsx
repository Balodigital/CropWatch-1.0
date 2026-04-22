import React, { useState, useEffect } from 'react';
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
import { signUp } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { StrengthMeter } from '@/components/auth/StrengthMeter';
import { PasswordRequirements } from '@/components/auth/PasswordRequirements';
import { SuccessOverlay } from '@/components/auth/SuccessOverlay';
import { usePasswordValidation } from '@/hooks/use-password-validation';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft } from 'lucide-react-native';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const router = useRouter();
  const { setOnboardingFinished } = useAuth();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const { requirements, strength, isValid: passwordValid } = usePasswordValidation(password);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const formValid = fullName.trim().length > 0 && emailValid && passwordValid;

  const handleSignUp = async () => {
    if (!formValid) return;

    setLoading(true);
    try {
      const { error } = await signUp(email, password, { full_name: fullName });
      if (error) {
        Alert.alert('Sign Up Failed', error);
      } else {
        setShowSuccess(true);
      }
    } catch (err: any) {
      Alert.alert('Sign Up Failed', 'An unexpected error occurred.');
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
            onPress={async () => {
              await setOnboardingFinished(false);
              router.replace('/');
            }} 
            style={styles.backButton}
          >
            <ChevronLeft size={24} color={theme.primary} />
            <Text style={[Typography.labelLarge, { color: theme.primary, marginLeft: 4 }]}>Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[Typography.headlineLarge, { color: theme.onSurface }]}>
              Create Account
            </Text>
            <Text style={[Typography.bodyLarge, { color: theme.onSurfaceVariant, marginTop: 8 }]}>
              Join CropWatch and start protecting your harvest
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              success={fullName.trim().length > 2}
            />
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              success={emailValid}
            />
            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              isPassword
              success={passwordValid}
            />
            
            <StrengthMeter strength={strength} />
            <PasswordRequirements requirements={requirements} />

            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={loading}
              disabled={!formValid}
              style={styles.registerButton}
            />

            <View style={styles.footer}>
              <Text style={[Typography.bodyMedium, { color: theme.onSurfaceVariant }]}>
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={[Typography.labelLarge, { color: theme.primary, fontWeight: '700' }]}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessOverlay 
        visible={showSuccess} 
        onClose={() => {
          setShowSuccess(false);
          router.replace('/(auth)/login');
        }}
      />
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
    marginBottom: 40,
  },
  form: {
    flex: 1,
  },
  registerButton: {
    width: '100%',
    marginTop: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 32,
  },
});
