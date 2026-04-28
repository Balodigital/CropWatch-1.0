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
import { useTranslation } from 'react-i18next';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { t } = useTranslation();

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleResetRequest = async () => {
    if (!emailValid) return;

    setLoading(true);
    try {
      const { error } = await resetPassword(email);
      
      if (error) {
        Alert.alert(t('common.error'), error);
      } else {
        setIsSent(true);
      }
    } catch (err: any) {
      Alert.alert(t('common.error'), t('auth.unexpected_error'));
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
            {t('auth.forgot.check_email')}
          </Text>
          <Text style={[Typography.bodyLarge, { color: theme.onSurfaceVariant, marginTop: 12, textAlign: 'center', marginBottom: 40 }]}>
            {t('auth.forgot.check_email_desc', { email })}
          </Text>
          <Button
            title={t('auth.forgot.back_login')}
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
            <Text style={[Typography.labelLarge, { color: theme.primary, marginLeft: 4 }]}>{t('common.back')}</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[Typography.headlineLarge, { color: theme.onSurface }]}>
              {t('auth.forgot.title')}
            </Text>
            <Text style={[Typography.bodyLarge, { color: theme.onSurfaceVariant, marginTop: 8 }]}>
              {t('auth.forgot.desc')}
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label={t('auth.email_label')}
              placeholder={t('auth.forgot.email_placeholder')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoFocus
              success={emailValid}
            />

            <Button
              title={t('auth.forgot.send_link')}
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
