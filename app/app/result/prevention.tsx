import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Diagnosis } from '@/lib/supabase';

export default function PreventionScreen() {
  const router = useRouter();
  const { diagnosis, index, cropType } = useLocalSearchParams<{
    diagnosis: string;
    index: string;
    cropType: string;
  }>();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const diagnoses: Diagnosis[] = diagnosis ? JSON.parse(diagnosis) : [];
  const currentIndex = parseInt(index || '0', 10);
  const currentDiagnosis = diagnoses[currentIndex] || diagnoses[0];

  const preventionTips = parsePrevention(currentDiagnosis?.prevention || '', cropType || '');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{t('prevention')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.diseaseCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.diseaseLabel, { color: colors.textSecondary }]}>
            Preventing
          </Text>
          <Text style={[styles.diseaseName, { color: colors.text }]}>
            {currentDiagnosis?.name}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Season-to-Season Prevention Tips
        </Text>

        <View style={styles.timelineContainer}>
          {preventionTips.map((tip, idx) => (
            <View key={idx} style={styles.tipItem}>
              <View style={styles.timeline}>
                <View style={[styles.timelineDot, { backgroundColor: colors.primary }]} />
                {idx < preventionTips.length - 1 && (
                  <View style={[styles.timelineLine, { backgroundColor: colors.textSecondary + '30' }]} />
                )}
              </View>
              <View style={[styles.tipCard, { backgroundColor: colors.surface }]}>
                <Text style={[styles.tipPhase, { color: colors.primary }]}>
                  {tip.phase}
                </Text>
                <Text style={[styles.tipTitle, { color: colors.text }]}>
                  {tip.title}
                </Text>
                <Text style={[styles.tipDesc, { color: colors.textSecondary }]}>
                  {tip.description}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={[styles.seasonCard, { backgroundColor: colors.secondary + '20' }]}>
          <Text style={styles.seasonIcon}>🌱</Text>
          <View style={styles.seasonContent}>
            <Text style={[styles.seasonTitle, { color: colors.text }]}>
              Track Your Progress
            </Text>
            <Text style={[styles.seasonText, { color: colors.textSecondary }]}>
              Use the History tab to keep track of issues throughout the season
              and learn from past patterns.
            </Text>
          </View>
        </View>

        <View style={[styles.alertCard, { backgroundColor: colors.error + '10' }]}>
          <Text style={styles.alertIcon}>🚨</Text>
          <View style={styles.alertContent}>
            <Text style={[styles.alertTitle, { color: colors.error }]}>
              Act Early
            </Text>
            <Text style={[styles.alertText, { color: colors.textSecondary }]}>
              Most crop diseases spread rapidly. Early detection and treatment
              can save up to 80% of your harvest.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.doneButton, { backgroundColor: colors.primary }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.doneButtonText}>Got It</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  diseaseCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
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
    marginBottom: 20,
  },
  timelineContainer: {
    marginBottom: 24,
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
    padding: 16,
    borderRadius: 12,
    marginLeft: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  seasonIcon: {
    fontSize: 32,
    marginRight: 12,
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
    padding: 16,
    borderRadius: 12,
  },
  alertIcon: {
    fontSize: 24,
    marginRight: 12,
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
    padding: 16,
  },
  doneButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
