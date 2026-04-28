import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const { requirements, strength, isValid: passwordValid } = usePasswordValidation(password);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const formValid = fullName.trim().length > 0 && emailValid && passwordValid;

  const handleSignUp = async () => {
    if (!formValid) return;

    setLoading(true);
    try {
      const { error } = await signUp(email, password, { full_name: fullName });
      if (error) {
        Alert.alert(t('auth.register_failed'), error);
      } else {
        setShowSuccess(true);
      }
    } catch (err: any) {
      Alert.alert(t('auth.register_failed'), t('auth.unexpected_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 20 }]} showsVerticalScrollIndicator={false}>
          <TouchableOpacity 
            onPress={async () => {
              await setOnboardingFinished(false);
              router.replace('/');
            }} 
            style={styles.backButton}
          >
            <ChevronLeft size={24} color={theme.primary} />
            <Text style={[Typography.labelLarge, { color: theme.primary, marginLeft: 4 }]}>{t('common.back')}</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[Typography.headlineLarge, { color: theme.onSurface }]}>
              {t('auth.register_title')}
            </Text>
            <Text style={[Typography.bodyLarge, { color: theme.onSurfaceVariant, marginTop: 8 }]}>
              {t('auth.register_desc')}
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label={t('auth.full_name_label')}
              placeholder={t('auth.full_name_placeholder')}
              value={fullName}
              onChangeText={setFullName}
              success={fullName.trim().length > 2}
            />
            <Input
              label={t('auth.email_label')}
              placeholder={t('auth.email_placeholder')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              success={emailValid}
            />
            <Input
              label={t('auth.password_label')}
              placeholder={t('auth.password_placeholder')}
              value={password}
              onChangeText={setPassword}
              isPassword
              success={passwordValid}
            />
            
            <StrengthMeter strength={strength} />
            <PasswordRequirements requirements={requirements} />

            <Button
              title={t('auth.register_title')}
              onPress={handleSignUp}
              loading={loading}
              disabled={!formValid}
              style={styles.registerButton}
            />

            <View style={styles.footer}>
              <Text style={[Typography.bodyMedium, { color: theme.onSurfaceVariant }]}>
                {t('auth.have_account')}{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={[Typography.labelLarge, { color: theme.primary, fontWeight: '700' }]}>
                  {t('auth.login')}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
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
