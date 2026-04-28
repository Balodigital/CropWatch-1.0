import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { StyleSheet, View, Text, ScrollView, Pressable, Image, Platform, TextInput, TouchableOpacity } from 'react-native';
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

  useFocusEffect(
    useCallback(() => {
      loadPendingCount();
    }, [])
  );

  const loadPendingCount = async () => {
    const count = await OfflineStorage.getPendingCount();
    setPendingCount(count);
  };

  const handleStartScan = () => {
    router.push('/scan/camera');
  };

  const handleViewResult = (crop: string, status: string) => {
    const dummyDiagnosis = status === 'healthy' ? [] : [
      {
        name: `${crop} Blight`,
        confidence: 0.85,
        severity: status === 'infected' ? 'Severe' : 'Moderate',
        treatment: `Apply recommended fungicides and ensure proper spacing for better airflow.`,
        prevention: `Use disease-resistant seeds and practice crop rotation.`
      }
    ];

    router.push({
      pathname: '/result',
      params: {
        diagnosis: JSON.stringify(dummyDiagnosis),
        cropType: crop,
        image: crop.toLowerCase(),
      }
    });
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name;
  const firstName = displayName?.split(' ')[0] || 'Farmer';

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerTopRow}>
          <Text style={[styles.greetingText, { color: tokens.colors.success500 }]}>Hi {firstName},</Text>
          <TouchableOpacity style={styles.notificationBtn}>
            <MaterialIcons name="notifications-none" size={28} color={tokens.colors.text} />
            <View style={[styles.notificationDot, { backgroundColor: tokens.colors.success500 }]} />
          </TouchableOpacity>
        </View>

        <View style={styles.brandingHeader}>
          <Text style={[styles.welcomeToText, { color: tokens.colors.primary800 }]}>Welcome to</Text>
          <Text style={[styles.welcomeBrandText, { color: '#2C6A4F' }]}>CropWatch</Text>
          <Text style={[styles.welcomeSubtitleText, { color: tokens.colors.textSecondary }]}>
            {t('dashboard.hero_desc').replace(' and ', '\nand ')}
          </Text>
        </View>

        <SearchBar />
        <PendingScansCard 
          count={pendingCount} 
          onPress={() => router.push('/scan/pending')} 
        />

        <View style={styles.actionsSection}>
          <Text style={[styles.sectionTitle, { color: tokens.colors.text, marginBottom: 12 }]}>
            {t('dashboard.quick_actions')}
          </Text>
          <View style={styles.actionsGrid}>
            <QuickActionCard
              icon="photo-camera"
              title={t('dashboard.actions.scan_title')}
              description={t('dashboard.actions.scan_desc')}
              bgToken="success95"
              iconColor={tokens.colors.primary500}
              arrowBg={tokens.colors.success80}
              onPress={handleStartScan}
            />
            <QuickActionCard
              icon="collections-bookmark"
              title={t('dashboard.actions.library_title')}
              description={t('dashboard.actions.library_desc')}
              bgToken="warning95"
              iconColor={tokens.colors.warning500}
              arrowBg={tokens.colors.warning80}
              arrowIconColor="#997300"
              onPress={() => router.push('/library')}
            />
            <QuickActionCard
              icon="lock-outline"
              title={t('dashboard.actions.chat_title')}
              description={t('dashboard.actions.chat_desc').replace(' ', '\n')}
              isPremium
              bgToken="accent95"
              iconColor={tokens.colors.accent50}
              arrowBg={tokens.colors.accent80}
              arrowIconColor={tokens.colors.accent700}
              onPress={() => {}}
            />
            <QuickActionCard
              icon="lightbulb-outline"
              title={t('dashboard.actions.tips_title')}
              description={t('dashboard.actions.tips_desc')}
              bgToken="tertiary95"
              iconColor={tokens.colors.tertiary700}
              arrowBg={tokens.colors.tertiary80}
              arrowIconColor={tokens.colors.tertiary700}
              onPress={() => router.push('/tips')}
            />
          </View>
        </View>

        <View style={styles.insightSection}>
          <Text style={[styles.sectionTitle, { color: tokens.colors.text, marginBottom: 12 }]}>
            {t('dashboard.weather.title')}
          </Text>
          <InsightCard 
            text={t('dashboard.weather.advice')}
            highlight={t('dashboard.weather.highlight')}
            onPress={() => {}}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function InsightCard({ text, highlight, onPress }: { text: string, highlight?: string, onPress: () => void }) {
  return (
    <Pressable onPress={onPress}>
      <Card style={[styles.insightCard, { backgroundColor: tokens.colors.secondary95 }]} elevation="level1">
        <View style={[styles.insightIconContainer, { backgroundColor: tokens.colors.surface }]}>
          <MaterialIcons name="info" size={24} color={tokens.colors.primary500} />
        </View>
        <View style={styles.insightTextContainer}>
          <Text style={[styles.insightText, { color: tokens.colors.text }]}>
            {text}
          </Text>
          {highlight && (
            <Text style={[styles.insightHighlight, { color: tokens.colors.primary500 }]}>
              {highlight}
            </Text>
          )}
        </View>
        <MaterialIcons name="chevron-right" size={24} color={tokens.colors.primary500} style={{ marginLeft: tokens.spacing.sm }} />
      </Card>
    </Pressable>
  );
}

function SearchBar() {
  const { t } = useTranslation();
  return (
    <View style={styles.searchSection}>
      <View style={[styles.searchBar, { backgroundColor: tokens.colors.neutral200 }]}>
        <MaterialIcons name="search" size={24} color={tokens.colors.neutral700} />
        <TextInput
          placeholder={t('dashboard.search_placeholder')}
          placeholderTextColor={tokens.colors.neutral700}
          style={styles.searchInput}
        />
      </View>
    </View>
  );
}

function PendingScansCard({ count, onPress }: { count: number, onPress: () => void }) {
  const { t } = useTranslation();
  if (count === 0) return null;
  
  return (
    <View style={styles.pendingSection}>
      <TouchableOpacity 
        style={[styles.pendingCard, { backgroundColor: '#FAEFEB' }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.pendingIconContainer}>
          <MaterialIcons name="sync" size={24} color="#CC5A33" />
        </View>
        <View style={styles.pendingTextContainer}>
          <Text style={[styles.pendingTitle, { color: 'rgba(0,0,0,0.8)' }]}>
            {count} {count === 1 ? t('dashboard.pending_scan') : t('dashboard.pending_scans')}
          </Text>
          <Text style={[styles.pendingSub, { color: 'rgba(0,0,0,0.6)' }]}>
            {t('dashboard.sync_offline')}
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#CC5A33" />
      </TouchableOpacity>
    </View>
  );
}

function ScanItem({ crop, status, time, image, onPress }: { 
  crop: string, 
  status: 'healthy' | 'pending' | 'infected', 
  time: string, 
  image: any,
  onPress: () => void 
}) {
  const getStatusStyle = () => {
    switch (status) {
      case 'healthy': return { bg: tokens.colors.success95, text: tokens.colors.success500 };
      case 'pending': return { bg: tokens.colors.warning95, text: tokens.colors.warning500 };
      case 'infected': return { bg: tokens.colors.accent95, text: tokens.colors.accent700 };
    }
  };
  const statusStyle = getStatusStyle();

  return (
    <TouchableOpacity style={styles.scanItemCard} onPress={onPress}>
      <View style={[styles.scanImageContainer, { backgroundColor: tokens.colors.neutral100 }]}>
        <Image source={image} style={styles.scanImage} />
      </View>
      <Text style={[styles.scanCropName, { color: tokens.colors.text }]}>{crop}</Text>
      <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
        <Text style={[styles.statusText, { color: statusStyle.text }]}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Text>
      </View>
      <Text style={[styles.scanTime, { color: tokens.colors.textSecondary }]}>{time}</Text>
    </TouchableOpacity>
  );
}

function AddScanItem({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  return (
    <TouchableOpacity 
      style={[styles.addScanCard, { borderColor: tokens.colors.success500 }]} 
      onPress={onPress}
    >
      <View style={[styles.addScanIconCircle, { backgroundColor: tokens.colors.success95 }]}>
        <MaterialIcons name="photo-camera" size={24} color={tokens.colors.primary500} />
      </View>
      <Text style={[styles.addScanTitle, { color: tokens.colors.success500 }]}>{t('dashboard.scan_new')}</Text>
      <Text style={[styles.addScanSub, { color: tokens.colors.textSecondary }]}>{t('dashboard.start_new_scan')}</Text>
    </TouchableOpacity>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  bgToken,
  iconColor,
  arrowBg,
  arrowIconColor,
  isPremium,
  onPress,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  bgToken: keyof typeof tokens.colors;
  iconColor: string;
  arrowBg: string;
  arrowIconColor?: string;
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
      <View style={styles.actionTopContent}>
        <View style={{ alignSelf: 'flex-start', position: 'relative' }}>
          <MaterialIcons name={icon} size={32} color={iconColor} style={styles.actionIcon} />
          {isPremium && (
            <View style={styles.premiumBadge}>
              <MaterialIcons name="stars" size={10} color={tokens.colors.accent50} />
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
        </View>
        <Text style={[styles.actionTitle, { color: tokens.colors.text }]}>{title}</Text>
      </View>
      
      <View style={styles.actionBottomRow}>
        <Text style={[styles.actionDesc, { color: tokens.colors.textSecondary }]}>{description}</Text>
        <View style={[styles.actionArrow, { backgroundColor: arrowBg }]}>
          <MaterialIcons name="chevron-right" size={20} color={arrowIconColor || tokens.colors.text} />
        </View>
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
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  notificationBtn: {
    position: 'relative',
    padding: 4,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: tokens.colors.surface,
  },
  brandingHeader: {
    marginBottom: tokens.spacing.xl,
  },
  welcomeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  welcomeToText: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
    marginBottom: 2,
  },
  welcomeBrandText: {
    fontSize: 42,
    fontWeight: '700',
    lineHeight: 48,
    letterSpacing: -1,
    marginBottom: 8,
  },
  welcomeSubtitleText: {
    fontSize: 16,
    lineHeight: 24,
    color: tokens.colors.textSecondary,
    maxWidth: '90%',
  },
  searchSection: {
    marginBottom: tokens.spacing.xl,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 54,
    borderRadius: 27,
    paddingHorizontal: tokens.spacing.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: tokens.spacing.sm,
    fontSize: 14,
  },
  searchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingSection: {
    marginBottom: tokens.spacing.xl,
  },
  pendingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
  },
  pendingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
  },
  pendingTextContainer: {
    flex: 1,
  },
  pendingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  pendingSub: {
    fontSize: 12,
    lineHeight: 16,
  },
  actionsSection: {
    marginBottom: tokens.spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
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
    minHeight: 150,
    justifyContent: 'space-between',
    ...tokens.elevation.level1,
  },
  actionTopContent: {
    flex: 1,
  },
  actionIcon: {
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  actionBottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  actionDesc: {
    fontSize: 12,
    lineHeight: 16,
    flex: 1,
    marginRight: tokens.spacing.xs,
  },
  actionArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    position: 'absolute',
    top: 0,
    left: 38,
    borderWidth: 1,
    borderColor: tokens.colors.surface,
    ...tokens.elevation.level1,
  },
  premiumText: {
    fontSize: 9,
    fontWeight: '600',
    color: tokens.colors.accent50,
    marginLeft: 2,
  },
  insightSection: {
    marginBottom: 0,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
  },
  insightIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
  },
  insightTextContainer: {
    flex: 1,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 2,
  },
  insightHighlight: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400',
  },
  recentScansSection: {
    marginBottom: tokens.spacing.lg,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
  },
  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  scansList: {
    paddingRight: tokens.spacing.md,
  },
  addScanCard: {
    width: 130,
    height: 175,
    borderRadius: tokens.radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
    padding: tokens.spacing.sm,
  },
  addScanIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  addScanTitle: {
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  addScanSub: {
    fontSize: 11,
    textAlign: 'center',
  },
  scanItemCard: {
    width: 130,
    height: 175,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    alignItems: 'center',
    marginRight: tokens.spacing.md,
    padding: tokens.spacing.sm,
    // Add subtle shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  scanImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  scanImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scanCropName: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  scanTime: {
    fontSize: 10,
  },
});

