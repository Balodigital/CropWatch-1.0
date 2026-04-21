import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { tokens } from '@/constants/tokens';
import { AppHeader } from '@/components/ui/AppHeader';
import { useTranslation } from 'react-i18next';

export default function ErrorResultScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { error } = useLocalSearchParams<{ error: string }>();

  const handleRetry = () => {
    router.replace('/scan/camera');
  };

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <AppHeader title={t('result.analysis_error_title')} />
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: tokens.colors.error50 }]}>
          <Text style={styles.icon}>❌</Text>
        </View>

        <Text style={[styles.title, { color: tokens.colors.text }]}>
          {t('result.analysis_failed')}
        </Text>
        <Text style={[styles.subtitle, { color: tokens.colors.textSecondary }]}>
          {error || t('result.generic_error')}
        </Text>

        <View style={[styles.errorCard, { backgroundColor: tokens.colors.error50 }]}>
          <Text style={styles.errorIcon}>💡</Text>
          <View style={styles.errorContent}>
            <Text style={[styles.errorTitle, { color: tokens.colors.text }]}>
              {t('result.try_tips')}
            </Text>
            <Text style={[styles.errorText, { color: tokens.colors.textSecondary }]}>
              {t('result.error_tips')}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: tokens.colors.primary500 }]}
          onPress={handleRetry}
        >
          <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.homeButton, { borderColor: tokens.colors.primary500 }]}
          onPress={handleGoHome}
        >
          <Text style={[styles.homeButtonText, { color: tokens.colors.primary500 }]}>
            {t('common.go_home')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  content: {
    flex: 1,
    padding: tokens.spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: tokens.radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: tokens.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: tokens.spacing.xxl,
    lineHeight: 24,
  },
  errorCard: {
    flexDirection: 'row',
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    width: '100%',
  },
  errorIcon: {
    fontSize: 20,
    marginRight: tokens.spacing.md,
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: tokens.spacing.sm,
  },
  errorText: {
    fontSize: 13,
    lineHeight: 22,
  },
  footer: {
    padding: tokens.spacing.md,
    paddingBottom: tokens.spacing.xxl,
    gap: tokens.spacing.md,
  },
  retryButton: {
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    paddingVertical: tokens.spacing.md - 2,
    borderRadius: tokens.radius.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
