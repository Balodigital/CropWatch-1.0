import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/constants/tokens';
import { Diagnosis } from '@/lib/supabase';
import { AppHeader } from '@/components/ui/AppHeader';

export default function PreventionScreen() {
  const router = useRouter();
  const { diagnosis, index, cropType } = useLocalSearchParams<{
    diagnosis: string;
    index: string;
    cropType: string;
  }>();
  const { t } = useTranslation();

  const diagnoses: Diagnosis[] = diagnosis ? JSON.parse(diagnosis) : [];
  const currentIndex = parseInt(index || '0', 10);
  const currentDiagnosis = diagnoses[currentIndex] || diagnoses[0];

  const preventionTips = parsePrevention(currentDiagnosis?.prevention || '', cropType || '');

  return (
    <View style={styles.container}>
      <AppHeader title={t('prevention')} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.diseaseCard, { backgroundColor: tokens.colors.surface }]}>
          <Text style={[styles.diseaseLabel, { color: tokens.colors.textSecondary }]}>
            Preventing
          </Text>
          <Text style={[styles.diseaseName, { color: tokens.colors.text }]}>
            {currentDiagnosis?.name}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: tokens.colors.text }]}>
          Season-to-Season Prevention Tips
        </Text>

        <View style={styles.timelineContainer}>
          {preventionTips.map((tip, idx) => (
            <View key={idx} style={styles.tipItem}>
              <View style={styles.timeline}>
                <View style={[styles.timelineDot, { backgroundColor: tokens.colors.primary500 }]} />
                {idx < preventionTips.length - 1 && (
                  <View style={[styles.timelineLine, { backgroundColor: tokens.colors.neutral200 }]} />
                )}
              </View>
              <View style={[styles.tipCard, { backgroundColor: tokens.colors.surface }]}>
                <Text style={[styles.tipPhase, { color: tokens.colors.primary500 }]}>
                  {tip.phase}
                </Text>
                <Text style={[styles.tipTitle, { color: tokens.colors.text }]}>
                  {tip.title}
                </Text>
                <Text style={[styles.tipDesc, { color: tokens.colors.textSecondary }]}>
                  {tip.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.seasonCard, { backgroundColor: tokens.colors.primary50 }]}>
          <Text style={styles.seasonIcon}>🌱</Text>
          <View style={styles.seasonContent}>
            <Text style={[styles.seasonTitle, { color: tokens.colors.text }]}>
              Track Your Progress
            </Text>
            <Text style={[styles.seasonText, { color: tokens.colors.textSecondary }]}>
              Use the History tab to keep track of issues throughout the season
              and learn from past patterns.
            </Text>
          </View>
        </View>

        <View style={[styles.alertCard, { backgroundColor: tokens.colors.error50 }]}>
          <Text style={styles.alertIcon}>🚨</Text>
          <View style={styles.alertContent}>
            <Text style={[styles.alertTitle, { color: tokens.colors.error500 }]}>
              Act Early
            </Text>
            <Text style={[styles.alertText, { color: tokens.colors.textSecondary }]}>
              Most crop diseases spread rapidly. Early detection and treatment
              can save up to 80% of your harvest.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.doneButton, { backgroundColor: tokens.colors.primary500 }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.doneButtonText}>Got It</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface PreventionTip {
  phase: string;
  title: string;
  description: string;
}

function parsePrevention(preventionText: string, cropType: string): PreventionTip[] {
  const baseTips: PreventionTip[] = [
    {
      phase: 'Before Planting',
      title: 'Start with Healthy Seeds',
      description:
        'Use disease-free seeds or seedlings from trusted sources. Consider seed treatment with hot water or fungicides.',
    },
    {
      phase: 'During Growth',
      title: 'Regular Monitoring',
      description:
        'Inspect your crops at least twice a week. Check under leaves and at plant bases where problems often start.',
    },
    {
      phase: 'During Growth',
      title: 'Proper Spacing',
      description:
        'Space plants adequately to ensure good air circulation. This reduces humidity that promotes fungal growth.',
    },
    {
      phase: 'Any Time',
      title: 'Remove Infected Plants',
      description:
        'Immediately remove and destroy (burn or bury) severely infected plants to prevent spread.',
    },
    {
      phase: 'After Harvest',
      title: 'Clean Up Debris',
      description:
        'Remove all plant residues from the field. Many diseases survive winter in leftover plant material.',
    },
    {
      phase: 'Next Season',
      title: 'Crop Rotation',
      description:
        'Avoid planting the same crop in the same spot for 2-3 years. This breaks disease cycles.',
    },
  ];

  return baseTips;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: tokens.spacing.md,
    paddingBottom: tokens.spacing.xxl,
  },
  diseaseCard: {
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.xl,
    ...tokens.elevation.level1,
  },
  diseaseLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: tokens.spacing.lg,
  },
  timelineContainer: {
    marginBottom: tokens.spacing.xl,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  timeline: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 18,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  tipCard: {
    flex: 1,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    marginLeft: tokens.spacing.md,
    marginBottom: tokens.spacing.md,
    ...tokens.elevation.level1,
  },
  tipPhase: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  tipDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  seasonCard: {
    flexDirection: 'row',
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.md,
  },
  seasonIcon: {
    fontSize: 32,
    marginRight: tokens.spacing.md,
  },
  seasonContent: {
    flex: 1,
  },
  seasonTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  seasonText: {
    fontSize: 13,
    lineHeight: 18,
  },
  alertCard: {
    flexDirection: 'row',
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: tokens.spacing.md,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    padding: tokens.spacing.md,
    paddingBottom: tokens.spacing.xxl,
  },
  doneButton: {
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
