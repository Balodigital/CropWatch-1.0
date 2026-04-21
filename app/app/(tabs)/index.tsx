import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/constants/tokens';
import { OfflineStorage } from '@/lib/offline';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { AppHeader } from '@/components/ui/AppHeader';
import { Avatar } from '@/components/profile/Avatar';

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, profile } = useAuth();
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
    <View style={styles.container}>
      <AppHeader
        title="CropWatch"
        showBack={false}
        leftAction={
          <Pressable onPress={() => router.push('/profile')}>
            <Avatar 
              uri={profile?.avatar_url || user?.user_metadata?.avatar_url} 
              size={32} 
            />
          </Pressable>
        }
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.heroSection}>
        <Card style={[styles.heroCard, { backgroundColor: tokens.colors.primary500 }]} elevation="level2">
          <MaterialIcons name="eco" size={48} color={tokens.colors.surface} style={{ marginBottom: tokens.spacing.sm }} />
          <Text style={[tokens.typography.heading, { color: tokens.colors.surface, textAlign: 'center', marginBottom: tokens.spacing.xs }]}>
            {t('dashboard.welcome')}
          </Text>
          <Text style={[tokens.typography.body, { color: tokens.colors.primary100, textAlign: 'center', marginBottom: tokens.spacing.lg }]}>
            {t('dashboard.hero_desc')}
          </Text>
          <Button 
            title={t('dashboard.scan_leaf')} 
            onPress={handleStartScan}
            variant="secondary"
            size="large"
            icon={<MaterialIcons name="camera-alt" size={24} color={tokens.colors.primary500} />}
            style={{ width: '100%' }}
          />
        </Card>
      </View>

      {pendingCount > 0 && (
        <Card style={[styles.pendingCard, { backgroundColor: tokens.colors.warning500 + '15' }]} elevation="level1">
          <MaterialIcons name="sync-problem" size={32} color={tokens.colors.warning500} style={{ marginRight: tokens.spacing.md }} />
          <View style={styles.pendingContent}>
            <Text style={[tokens.typography.title, { color: tokens.colors.warning500 }]}>
              {pendingCount} {pendingCount > 1 ? t('dashboard.pending_scans') : t('dashboard.pending_scan')}
            </Text>
            <Text style={[tokens.typography.caption, { color: tokens.colors.textSecondary }]}>
              {t('dashboard.sync_offline')}
            </Text>
          </View>
        </Card>
      )}

      <View style={styles.quickActions}>
        <Text style={[tokens.typography.title, { color: tokens.colors.text, marginBottom: tokens.spacing.md }]}>
          {t('dashboard.quick_actions')}
        </Text>
        <View style={styles.actionsGrid}>
          <QuickActionCard
            icon="camera-alt"
            title={t('dashboard.scan_leaf')}
            description={t('dashboard.take_photo')}
            onPress={handleStartScan}
          />
          <QuickActionCard
            icon="library-books"
            title={t('tabs.library')}
            description={t('dashboard.learn_crops')}
            onPress={() => router.push('/library')}
          />
          <QuickActionCard
            icon="history"
            title={t('tabs.history')}
            description={t('dashboard.past_diagnoses')}
            onPress={() => router.push('/history')}
          />
          <QuickActionCard
            icon="lightbulb"
            title={t('dashboard.tips')}
            description={t('dashboard.farming_advice')}
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={styles.tipsSection}>
        <Text style={[tokens.typography.title, { color: tokens.colors.text, marginBottom: tokens.spacing.md }]}>
          {t('dashboard.tips_title')}
        </Text>
        <Card style={styles.tipCard} elevation="level1">
          <MaterialIcons name="healing" size={32} color={tokens.colors.success500} style={{ marginRight: tokens.spacing.md }} />
          <View style={styles.tipContent}>
            <Text style={[tokens.typography.title, { color: tokens.colors.text, marginBottom: tokens.spacing.xs }]}>
              {t('dashboard.early_detection')}
            </Text>
            <Text style={[tokens.typography.body, { color: tokens.colors.textSecondary }]}>
              {t('dashboard.early_detection_desc')}
            </Text>
          </View>
        </Card>
      </View>
      </ScrollView>
    </View>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.actionCardWrapper}>
      <Card style={styles.actionCardInner} elevation="level1">
        <Pressable
          style={({ pressed }) => [styles.actionPressable, { opacity: pressed ? 0.7 : 1 }]}
          onPress={onPress}
          android_ripple={{ color: tokens.colors.neutral200 }}
        >
          <View style={[styles.iconContainer, { backgroundColor: tokens.colors.primary50 }]}>
            <MaterialIcons name={icon} size={28} color={tokens.colors.primary500} />
          </View>
          <Text style={[tokens.typography.title, { color: tokens.colors.text, fontSize: 16, marginBottom: tokens.spacing.xs }]}>
            {title}
          </Text>
          <Text style={[tokens.typography.caption, { color: tokens.colors.textSecondary }]}>
            {description}
          </Text>
        </Pressable>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xxl,
  },
  heroSection: {
    marginBottom: tokens.spacing.lg,
  },
  heroCard: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl,
  },
  pendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
    borderWidth: 1,
    borderColor: tokens.colors.warning500 + '30',
  },
  pendingContent: {
    flex: 1,
  },
  quickActions: {
    marginBottom: tokens.spacing.xl,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
    justifyContent: 'space-between',
  },
  actionCardWrapper: {
    width: '48%',
  },
  actionCardInner: {
    padding: 0,
    overflow: 'hidden',
  },
  actionPressable: {
    padding: tokens.spacing.md,
    minHeight: 120,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: tokens.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.sm,
  },
  tipsSection: {
    marginBottom: tokens.spacing.lg,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipContent: {
    flex: 1,
  },
});
