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
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { signIn } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChevronLeft, Sprout } from 'lucide-react-native';

export default function LoginScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const insets = useSafeAreaInsets();
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
        Alert.alert(t('auth.login_failed'), error);
      } else {
        router.replace('/(tabs)');
      }
    } catch (err: any) {
      Alert.alert(t('auth.login_failed'), t('auth.unexpected_error'));
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
            onPress={() => router.back()} 
            style={styles.backButton}
          >
            <ChevronLeft size={24} color={theme.primary} />
            <Text style={[Typography.labelLarge, { color: theme.primary, marginLeft: 4 }]}>{t('common.back')}</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: theme.primaryContainer }]}>
              <Sprout size={32} color={theme.primary} />
            </View>
            <Text style={[styles.headline, Typography.headlineLarge, { color: theme.onSurface }]}>
              {t('auth.welcome_back')}
            </Text>
            <Text style={[Typography.bodyLarge, { color: theme.onSurfaceVariant, marginTop: 8, textAlign: 'center' }]}>
              {t('auth.sign_in_desc')}
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              label={t('auth.email_label')}
              placeholder={t('auth.email_label')}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              success={emailValid}
            />
            <Input
              label={t('auth.password_label')}
              placeholder={t('auth.password_label')}
              value={password}
              onChangeText={setPassword}
              isPassword
            />

            <TouchableOpacity 
              onPress={() => router.push('/(auth)/forgot-password')}
              style={styles.forgotPassword}
            >
              <Text style={[Typography.labelLarge, { color: theme.primary }]}>
                {t('auth.forgot_password')}
              </Text>
            </TouchableOpacity>

            <Button
              title={t('auth.login')}
              onPress={handleSignIn}
              loading={loading}
              disabled={!formValid}
              style={styles.loginButton}
            />

            <View style={styles.footer}>
              <Text style={[Typography.bodyMedium, { color: theme.onSurfaceVariant }]}>
                {t('auth.no_account')}{' '}
              </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={[Typography.labelLarge, { color: theme.primary, fontWeight: '700' }]}>
                  {t('auth.sign_up')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
