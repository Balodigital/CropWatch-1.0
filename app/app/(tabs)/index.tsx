import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { OfflineStorage } from '@/lib/offline';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    loadPendingCount();
  }, []);

  const loadPendingCount = async () => {
    const count = await OfflineStorage.getPendingCount();
    setPendingCount(count);
  };

  const handleStartScan = () => {
    router.push('/scan/camera');
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.heroSection}>
        <View style={[styles.heroCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.heroEmoji}>🌱</Text>
          <Text style={styles.heroTitle}>{t('welcome')}</Text>
          <Text style={styles.heroSubtitle}>
            Identify crop diseases early and protect your harvest
          </Text>
          <TouchableOpacity
            style={[styles.scanButton, { backgroundColor: '#fff' }]}
            onPress={handleStartScan}
            activeOpacity={0.8}
          >
            <Text style={styles.scanButtonText}>{t('scan_leaf')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {pendingCount > 0 && (
        <View style={[styles.pendingCard, { backgroundColor: colors.warning + '20' }]}>
          <Text style={styles.pendingIcon}>📡</Text>
          <View style={styles.pendingContent}>
            <Text style={[styles.pendingTitle, { color: colors.text }]}>
              {pendingCount} pending scan{pendingCount > 1 ? 's' : ''}
            </Text>
            <Text style={[styles.pendingText, { color: colors.textSecondary }]}>
              Will sync when you're back online
            </Text>
          </View>
        </View>
      )}

      <View style={styles.quickActions}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <QuickActionCard
            icon="📸"
            title="Scan Leaf"
            description="Take a photo"
            onPress={handleStartScan}
            colors={colors}
          />
          <QuickActionCard
            icon="📚"
            title="Crop Library"
            description="Learn about crops"
            onPress={() => router.push('/library')}
            colors={colors}
          />
          <QuickActionCard
            icon="📋"
            title="History"
            description="Past diagnoses"
            onPress={() => router.push('/history')}
            colors={colors}
          />
          <QuickActionCard
            icon="💡"
            title="Tips"
            description="Farming advice"
            onPress={() => {}}
            colors={colors}
          />
        </View>
      </View>

      <View style={styles.tipsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('prevention')}</Text>
        <View style={[styles.tipCard, { backgroundColor: colors.surface }]}>
          <Text style={styles.tipIcon}>🌿</Text>
          <View style={styles.tipContent}>
            <Text style={[styles.tipTitle, { color: colors.text }]}>
              Early Detection Matters
            </Text>
            <Text style={[styles.tipText, { color: colors.textSecondary }]}>
              Regular leaf scanning can prevent up to 80% of crop losses
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  onPress,
  colors
}: {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  colors: typeof Colors.light;
}) {
  return (
    <TouchableOpacity
      style={[styles.actionCard, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.actionIcon}>{icon}</Text>
      <Text style={[styles.actionTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.actionDesc, { color: colors.textSecondary }]}>{description}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  heroSection: {
    marginBottom: 20,
  },
  heroCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginBottom: 20,
  },
  scanButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 30,
  },
  scanButtonText: {
    color: '#2c6a4f',
    fontSize: 18,
    fontWeight: '600',
  },
  pendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  pendingIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  pendingContent: {
    flex: 1,
  },
  pendingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  pendingText: {
    fontSize: 14,
  },
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '47%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 12,
  },
  tipsSection: {
    marginBottom: 20,
  },
  tipCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tipIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
