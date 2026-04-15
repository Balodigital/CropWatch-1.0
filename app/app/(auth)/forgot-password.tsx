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
import { resetPassword } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChevronLeft, Mail, CheckCircle2 } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleResetRequest = async () => {
    if (!emailValid) return;

    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        Alert.alert('Error', error);
      } else {
        setIsSent(true);
      }
    } catch (err: any) {
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (isSent) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.successContainer}>
          <View style={[styles.iconContainer, { backgroundColor: theme.success + '20' }]}>
            <CheckCircle2 size={48} color={theme.success} strokeWidth={2.5} />
          </View>
          <Text style={[Typography.headlineSmall, { color: theme.onSurface, marginTop: 24, textAlign: 'center' }]}>
            Check Your Email
          </Text>
          <Text style={[Typography.bodyLarge, { color: theme.onSurfaceVariant, marginTop: 12, textAlign: 'center', marginBottom: 40 }]}>
            We've sent password reset instructions to {email}. Please check your inbox and follow the link to reset your password.
          </Text>
          <Button
            title="Back to Sign In"
            onPress={() => router.replace('/(auth)/login')}
            style={{ width: '100%' }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <ChevronLeft size={24} color={theme.primary} />
            <Text style={[Typography.labelLarge, { color: theme.primary, marginLeft: 4 }]}>Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[Typography.headlineLarge, { color: theme.onSurface }]}>
              Forgot Password
            </Text>
            <Text style={[Typography.bodyLarge, { color: theme.onSurfaceVariant, marginTop: 8 }]}>
              Enter your email and we'll send you a secure link to reset your password.
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label="Email Address"
              placeholder="Enter your registered email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
              success={emailValid}
            />

            <Button
              title="Send Reset Link"
              onPress={handleResetRequest}
              loading={loading}
              disabled={!emailValid}
              icon={<Mail size={18} color={theme.onPrimary} />}
              style={styles.resetButton}
            />
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
    marginBottom: 40,
  },
  form: {
    flex: 1,
  },
  resetButton: {
    width: '100%',
    marginTop: 24,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
