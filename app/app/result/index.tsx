import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/constants/tokens';
import { Diagnosis } from '@/lib/supabase';
import { AppHeader } from '@/components/ui/AppHeader';
import { OfflineStorage } from '@/lib/offline';
import { CROP_IMAGES } from '@/lib/supabase';

export default function ResultScreen() {
  const router = useRouter();
  const { diagnosis, cropType, image } = useLocalSearchParams<{
    diagnosis: string;
    cropType: string;
    image: string;
  }>();
  const { t } = useTranslation();

  const diagnoses: Diagnosis[] = diagnosis ? JSON.parse(diagnosis) : [];

  useEffect(() => {
    if (diagnoses.length > 0) {
      const topDiagnosis = diagnoses[0];
      const scanId = `scan_${Date.now()}`;
      OfflineStorage.cacheDiagnosis(scanId, diagnoses);
    }
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Mild':
        return tokens.colors.success500;
      case 'Moderate':
        return tokens.colors.warning500;
      case 'Severe':
        return tokens.colors.error500;
      default:
        return tokens.colors.textSecondary;
    }
  };

  const getSeverityBg = (severity: string) => {
    const color = getSeverityColor(severity);
    return color + '20';
  };

  const handleNewScan = () => {
    router.replace('/scan/camera');
  };

  const handleViewTreatment = (index: number) => {
    router.push({
      pathname: '/result/treatment',
      params: { diagnosis, index: index.toString(), cropType },
    });
  };

  const handleViewPrevention = (index: number) => {
    router.push({
      pathname: '/result/prevention',
      params: { diagnosis, index: index.toString(), cropType },
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader 
        title={t('result.title')} 
        showBack={false}
        rightElement={
          <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
            <Text style={{ color: tokens.colors.primary500, fontWeight: '700', paddingRight: 10 }}>Done</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {diagnoses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🤔</Text>
            <Text style={[styles.emptyTitle, { color: tokens.colors.text }]}>
              {t('result.empty_title')}
            </Text>
            <Text style={[styles.emptyText, { color: tokens.colors.textSecondary }]}>
              {t('result.empty_desc')}
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.summaryCard}>
              <View
                style={[
                  styles.primaryResult,
                  { 
                    backgroundColor: diagnoses[0]?.severity?.toLowerCase() === 'severe' 
                      ? tokens.colors.error98 
                      : tokens.colors.neutral98 
                  },
                ]}
              >
                <Text style={[styles.mostLikely, { color: tokens.colors.error30 }]}>
                  {t('result.most_likely')}
                </Text>
                
                <View style={styles.diseaseHeaderRow}>
                  <Text style={[styles.diseaseName, { color: tokens.colors.text }]}>
                    {diagnoses[0].name}
                  </Text>
                  <View
                    style={[
                      styles.severityBadgeMain,
                      { backgroundColor: getSeverityColor(diagnoses[0].severity) },
                    ]}
                  >
                    <Text style={styles.severityText}>
                      {diagnoses[0].severity}
                    </Text>
                  </View>
                </View>

                <View style={styles.confidenceSection}>
                  <Text style={[styles.confidenceText, { color: tokens.colors.textSecondary }]}>
                    {diagnoses[0].confidence}% {t('result.confidence')}
                  </Text>
                  <Text style={[styles.microcopy, { color: tokens.colors.textSecondary }]}>
                    {t('result.based_on_image')}
                  </Text>
                </View>
              </View>
            </View>

            {diagnoses.length > 1 && (
              <Text style={[styles.otherResults, { color: tokens.colors.textSecondary }]}>
                {t('result.others')}
              </Text>
            )}

            {diagnoses.slice(1).map((d, index) => (
              <View
                key={index}
                style={[styles.diagnosisCard, { backgroundColor: tokens.colors.surface }]}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: tokens.colors.text }]}>
                    {d.name}
                  </Text>
                  <View
                    style={[
                      styles.severityBadgeSmall,
                      { backgroundColor: getSeverityColor(d.severity) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.severityTextSmall,
                        { color: getSeverityColor(d.severity) },
                      ]}
                    >
                      {d.severity}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.cardConfidence, { color: tokens.colors.textSecondary }]}>
                  {d.confidence}% {t('result.confidence')}
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: tokens.colors.primary500 }]}
          onPress={() => handleViewTreatment(0)}
          disabled={diagnoses.length === 0}
        >
          <Text style={styles.primaryButtonText}>
            {t('result.view_treatment')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: tokens.colors.primary500 }]}
          onPress={() => handleViewPrevention(0)}
        >
          <Text style={[styles.secondaryButtonText, { color: tokens.colors.primary500 }]}>
            {t('result.prevention_tips')}
          </Text>
        </TouchableOpacity>


      </View>
    </View>
  );
}

// getCropIcon removed in favor of centralized images

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  cropBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    backgroundColor: tokens.colors.primary50,
    borderRadius: tokens.radius.full,
  },
  miniImageContainer: {
    width: 20,
    height: 20,
    borderRadius: tokens.radius.full,
    marginRight: 4,
    overflow: 'hidden',
  },
  miniCropImage: {
    width: '100%',
    height: '100%',
  },
  cropName: {
    fontSize: 12,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: tokens.spacing.md,
    paddingBottom: tokens.spacing.xxl,
  },
  summaryCard: {
    marginBottom: tokens.spacing.xl,
  },
  primaryResult: {
    padding: tokens.spacing.lg,
    borderRadius: tokens.radius.lg,
    ...tokens.elevation.level1,
  },
  diseaseHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: tokens.spacing.sm,
  },
  mostLikely: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
    opacity: 0.9,
  },
  diseaseName: {
    fontSize: 24,
    fontWeight: '700',
    flex: 1,
    marginRight: tokens.spacing.sm,
  },
  severityBadgeMain: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 6,
    borderRadius: tokens.radius.md,
  },
  severityText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  confidenceSection: {
    marginTop: tokens.spacing.xs,
  },
  confidenceText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  microcopy: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  otherResults: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: tokens.spacing.md,
  },
  diagnosisCard: {
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.md,
    ...tokens.elevation.level1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  severityBadgeSmall: {
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: tokens.radius.sm,
  },
  severityTextSmall: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardConfidence: {
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    padding: tokens.spacing.xxl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: tokens.spacing.md,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: tokens.spacing.sm,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    padding: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xxl,
    backgroundColor: tokens.colors.background,
  },
  primaryButton: {
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    marginBottom: tokens.spacing.md,
    ...tokens.elevation.level2,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    borderWidth: 2,
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
