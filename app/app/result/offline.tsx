import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { tokens } from '@/constants/tokens';
import { AppHeader } from '@/components/ui/AppHeader';

import { OfflineStorage } from '@/lib/offline';
import { API_BASE_URL, syncPendingScans } from '@/lib/api';
import { useEffect, useState } from 'react';

export default function OfflineResultScreen() {
  const router = useRouter();
  const [isInternetOnline, setIsInternetOnline] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const { pendingScanId, cropType } = useLocalSearchParams<{
    pendingScanId: string;
    cropType: string;
  }>();

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    const online = await OfflineStorage.isOnline();
    setIsInternetOnline(online);
  };

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      const { synced, failed } = await syncPendingScans();
      if (synced > 0) {
        Alert.alert(
          "Success", 
          "Your scan has been synced! You can view it in your history.",
          [{ text: "Go to History", onPress: () => router.replace('/(tabs)/history') }]
        );
      } else {
        const isServerUp = await OfflineStorage.checkServerHealth(API_BASE_URL);
        if (!isServerUp) {
          Alert.alert(
            "Connection Failed",
            `Still could not reach the server at:\n${API_BASE_URL.replace('/api', '')}\n\nPlease check if your tunnel is running.`
          );
        } else {
          Alert.alert("Error", "Server is reachable but sync failed. Please try again later.");
        }
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred during retry.");
    } finally {
      setIsRetrying(false);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title={isInternetOnline ? "Server Issue" : "Offline Mode"} />
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: tokens.colors.warning100 }]}>
          <Text style={styles.icon}>📡</Text>
        </View>

        <Text style={[styles.title, { color: tokens.colors.text }]}>
          {isInternetOnline ? "Connection Lost" : "Saved for Later"}
        </Text>
        <Text style={[styles.subtitle, { color: tokens.colors.textSecondary }]}>
          {isInternetOnline 
            ? "We couldn't reach our diagnosis server. Your scan is saved and will be processed when the link is restored."
            : "Your scan has been saved and will be processed automatically when you're back online."}
        </Text>

        <View style={[styles.infoCard, { backgroundColor: tokens.colors.surface }]}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <Text style={[styles.infoValue, { color: tokens.colors.warning500 }]}>
              Pending
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Crop</Text>
            <Text style={[styles.infoValue, { color: tokens.colors.text }]}>
              {cropType?.charAt(0).toUpperCase() + cropType?.slice(1)}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Endpoint</Text>
            <Text style={[styles.infoValue, { color: tokens.colors.textSecondary, fontSize: 10 }]} numberOfLines={1}>
              {API_BASE_URL.replace('/api', '')}
            </Text>
          </View>
        </View>

        <View style={styles.tips}>
          <Text style={styles.tipIcon}>💡</Text>
          <Text style={[styles.tipText, { color: tokens.colors.textSecondary }]}>
            If you are online, the diagnosis server might be temporarily down or the link has changed.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.retryButton, { borderColor: tokens.colors.primary500 }]}
          onPress={handleRetry}
          disabled={isRetrying}
        >
          {isRetrying ? (
            <ActivityIndicator color={tokens.colors.primary500} size="small" />
          ) : (
            <Text style={[styles.retryButtonText, { color: tokens.colors.primary500 }]}>Try Reconnecting Now</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: tokens.colors.primary500 }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
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
  infoCard: {
    width: '100%',
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.xl,
    ...tokens.elevation.level1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: tokens.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: tokens.colors.border,
  },
  infoLabel: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  tips: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.primary50,
    borderRadius: tokens.radius.md,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: tokens.spacing.md,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    padding: tokens.spacing.md,
    paddingBottom: tokens.spacing.xxl,
    gap: tokens.spacing.sm,
  },
  retryButton: {
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: tokens.spacing.xs,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  button: {
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
