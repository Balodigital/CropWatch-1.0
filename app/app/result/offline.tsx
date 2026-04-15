import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OfflineResultScreen() {
  const router = useRouter();
  const { pendingScanId, cropType } = useLocalSearchParams<{
    pendingScanId: string;
    cropType: string;
  }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.warning + '20' }]}>
          <Text style={styles.icon}>📡</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          Saved for Later
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your scan has been saved and will be processed automatically when
          you're back online.
        </Text>

        <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={[styles.infoValue, { color: colors.warning }]}>
              Pending
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Crop</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>
              {cropType?.charAt(0).toUpperCase() + cropType?.slice(1)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Scan ID</Text>
            <Text style={[styles.infoValue, { color: colors.textSecondary }]}>
              {pendingScanId?.slice(0, 12)}...
            </Text>
          </View>
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={[styles.tipText, { color: colors.textSecondary }]}>
            Make sure to open the app when you have internet connection to sync
            your pending scans.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
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
  infoCard: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  tips: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    padding: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
