import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ErrorResultScreen() {
  const router = useRouter();
  const { error } = useLocalSearchParams<{ error: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleRetry = () => {
    router.replace('/scan/camera');
  };

  const handleGoHome = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.error + '20' }]}>
          <Text style={styles.icon}>❌</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          Analysis Failed
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {error || 'Something went wrong while analyzing your scan.'}
        </Text>

        <View style={[styles.errorCard, { backgroundColor: colors.error + '10' }]}>
          <Text style={styles.errorIcon}>💡</Text>
          <View style={styles.errorContent}>
            <Text style={[styles.errorTitle, { color: colors.text }]}>
              Try these tips:
            </Text>
            <Text style={[styles.errorText, { color: colors.textSecondary }]}>
              • Take a clearer photo with good lighting{'\n'}
              • Ensure the leaf is in focus{'\n'}
              • Include both healthy and affected areas{'\n'}
              • Add a description of what you see
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={handleRetry}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.homeButton, { borderColor: colors.primary }]}
          onPress={handleGoHome}
        >
          <Text style={[styles.homeButtonText, { color: colors.primary }]}>
            Go to Home
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  errorCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    width: '100%',
  },
  errorIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  errorContent: {
    flex: 1,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 13,
    lineHeight: 22,
  },
  footer: {
    padding: 16,
    gap: 12,
  },
  retryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
