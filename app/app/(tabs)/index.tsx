import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, ScrollView, Pressable, Image, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/constants/tokens';
import { OfflineStorage } from '@/lib/offline';
import { Card } from '@/components/ui/Card';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { AppHeader } from '@/components/ui/AppHeader';
import { Avatar } from '@/components/profile/Avatar';
import { CROP_IMAGES } from '@/lib/supabase';

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
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }} />
          <View style={styles.notificationWrapper}>
            <MaterialIcons name="notifications-none" size={28} color={tokens.colors.text} />
            <View style={[styles.notificationDot, { backgroundColor: tokens.colors.success500 }]} />
          </View>
        </View>

        <View style={styles.welcomeSection}>
          <Text style={[styles.greetingText, { color: tokens.colors.success500 }]}>
            Hi Farmer,
          </Text>
          <Text style={[styles.welcomeTo, { color: tokens.colors.primary500 }]}>
            Welcome to
          </Text>
          <View style={styles.welcomeTitleRow}>
            <Text style={[styles.welcomeTitle, { color: tokens.colors.primary800 }]}>
              CropWatch
            </Text>
          </View>
          <Text style={[styles.welcomeSubtitle, { color: tokens.colors.textSecondary }]}>
            Identify crop diseases early and protect your harvest.
          </Text>
        </View>

        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionTitle, { color: tokens.colors.text }]}>
            Quick Access
          </Text>
          <View style={styles.actionsGrid}>
            <QuickActionCard
              icon="photo-camera"
              title="Scan Leaf"
              description="Take a photo of a crop leaf"
              bgToken="success95"
              iconColor={tokens.colors.primary500}
              arrowBg={tokens.colors.success95}
              onPress={handleStartScan}
            />
            <QuickActionCard
              icon="collections-bookmark"
              title="Crop Library"
              description="Learn about different crops"
              bgToken="warning95"
              iconColor={tokens.colors.warning500}
              arrowBg={tokens.colors.warning95}
              onPress={() => router.push('/library')}
            />
            <QuickActionCard
              icon="lock-outline"
              title="Chat with Expert"
              description="Get personalized advice"
              isPremium
              bgToken="accent95"
              iconColor={tokens.colors.accent50}
              arrowBg={tokens.colors.accent95}
              onPress={() => {}}
            />
            <QuickActionCard
              icon="lightbulb-outline"
              title="Tips"
              description="Get helpful farming advice"
              bgToken="tertiary95"
              iconColor={tokens.colors.tertiary50}
              arrowBg={tokens.colors.tertiary95}
              onPress={() => {}}
            />
          </View>
        </View>

        <View style={styles.insightSection}>
          <Text style={[styles.sectionTitle, { color: tokens.colors.text }]}>
            Smart Insight
          </Text>
          <InsightCard 
            label="Smart Insight"
            text="Maize crops are more prone to leaf blight during humid conditions."
            highlight="Monitor closely this week."
            onPress={() => {}}
          />
        </View>

        <View style={styles.recentCropsSection}>
          <Text style={[styles.sectionTitle, { color: tokens.colors.text }]}>
            Your Recent Crops
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.cropsList}>
            <Pressable style={styles.addCropItem}>
              <View style={[styles.addCropCircle, { borderColor: tokens.colors.primary500 }]}>
                <MaterialIcons name="add" size={32} color={tokens.colors.primary500} />
              </View>
              <Text style={[styles.cropLabel, { color: tokens.colors.text }]}>Add Crop</Text>
            </Pressable>
            
            {['tomato', 'cassava', 'maize', 'pepper'].map((crop) => (
              <View key={crop} style={styles.cropItem}>
                <Image source={CROP_IMAGES[crop]} style={styles.cropImage} />
                <Text style={[styles.cropLabel, { color: tokens.colors.text }]}>
                  {crop.charAt(0).toUpperCase() + crop.slice(1)}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {pendingCount > 0 && (
          <Card style={[styles.pendingCard, { backgroundColor: tokens.colors.warning90 }]} elevation="level1">
            <MaterialIcons name="sync-problem" size={24} color={tokens.colors.warning500} style={{ marginRight: tokens.spacing.md }} />
            <View style={{ flex: 1 }}>
              <Text style={[tokens.typography.title, { color: tokens.colors.warning500, fontSize: 14 }]}>
                {pendingCount} {pendingCount > 1 ? t('dashboard.pending_scans') : t('dashboard.pending_scan')}
              </Text>
              <Text style={[tokens.typography.caption, { color: tokens.colors.textSecondary, fontSize: 12 }]}>
                {t('dashboard.sync_offline')}
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>
    </View>
  );
}

function InsightCard({ label, text, highlight, onPress }: { label: string, text: string, highlight?: string, onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Card style={[styles.insightCard, { backgroundColor: tokens.colors.secondary95 }]} elevation="level1">
        <View style={[styles.insightIconContainer, { backgroundColor: tokens.colors.surface }]}>
          <MaterialIcons name="eco" size={24} color={tokens.colors.primary500} />
        </View>
        <View style={styles.insightTextContainer}>
          <Text style={[styles.insightLabel, { color: tokens.colors.primary500 }]}>{label}</Text>
          <Text style={[styles.insightText, { color: tokens.colors.text }]}>
            {text} {highlight && <Text style={{ fontWeight: '700' }}>{highlight}</Text>}
          </Text>
        </View>
        <View style={[styles.insightAction, { backgroundColor: tokens.colors.surface }]}>
          <MaterialIcons name="chevron-right" size={24} color={tokens.colors.primary500} />
        </View>
      </Card>
    </Pressable>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  bgToken,
  iconColor,
  arrowBg,
  isPremium,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  bgToken: keyof typeof tokens.colors;
  iconColor: string;
  arrowBg: string;
  isPremium?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.actionCard,
        { backgroundColor: tokens.colors[bgToken] as string, opacity: pressed ? 0.9 : 1 }
      ]}
      onPress={onPress}
    >
      <MaterialIcons name={icon} size={32} color={iconColor} style={styles.actionIcon} />
      <Text style={[styles.actionTitle, { color: tokens.colors.text }]}>{title}</Text>
      
      {isPremium && (
        <View style={[styles.premiumBadge, { backgroundColor: tokens.colors.neutral200 }]}>
          <MaterialIcons name="stars" size={12} color={tokens.colors.accent50} />
          <Text style={[styles.premiumText, { color: tokens.colors.accent50 }]}>Premium</Text>
        </View>
      )}
      
      <Text style={[styles.actionDesc, { color: tokens.colors.textSecondary }]}>{description}</Text>
      
      <View style={[styles.actionArrow, { backgroundColor: tokens.colors.surface }]}>
        <MaterialIcons name="chevron-right" size={20} color={tokens.colors.text} />
      </View>
    </Pressable>
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
    padding: tokens.spacing.md,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: tokens.spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  notificationWrapper: {
    position: 'relative',
    padding: 4,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: tokens.colors.surface,
  },
  welcomeSection: {
    marginBottom: tokens.spacing.xl,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  welcomeTo: {
    fontSize: 28,
    fontWeight: '500',
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  welcomeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 42,
    fontWeight: '600',
    lineHeight: 48,
    letterSpacing: -1.5,
  },
  welcomeIcon: {
    marginLeft: tokens.spacing.sm,
    transform: [{ rotate: '15deg' }],
  },
  welcomeSubtitle: {
    fontSize: 16,
    lineHeight: 24,
    maxWidth: '85%',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.lg,
    borderRadius: tokens.radius.lg,
    borderWidth: 0,
  },
  insightIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
  },
  insightTextContainer: {
    flex: 1,
  },
  insightLabel: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
  },
  insightAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: tokens.spacing.sm,
  },
  quickActionsSection: {
    marginBottom: tokens.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: tokens.spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: tokens.spacing.md,
  },
  actionCard: {
    width: '47.5%',
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
    minHeight: 140,
    position: 'relative',
    ...tokens.elevation.level1,
  },
  actionIcon: {
    marginBottom: tokens.spacing.sm,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  actionDesc: {
    fontSize: 12,
    lineHeight: 16,
    paddingRight: 24,
  },
  actionArrow: {
    position: 'absolute',
    bottom: tokens.spacing.md,
    right: tokens.spacing.md,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '700',
    marginLeft: 2,
  },
  insightSection: {
    marginBottom: tokens.spacing.xl,
  },
  recentCropsSection: {
    marginBottom: tokens.spacing.lg,
  },
  cropsList: {
    paddingRight: tokens.spacing.md,
  },
  addCropItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  addCropCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  cropItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  cropImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginBottom: 8,
  },
  cropLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  pendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.md,
    marginTop: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.warning100,
  },
});

