import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/constants/tokens';
import { Diagnosis } from '@/lib/supabase';
import { AppHeader } from '@/components/ui/AppHeader';

export default function TreatmentScreen() {
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

  const treatments = parseTreatments(currentDiagnosis?.treatment || '');

  return (
    <View style={styles.container}>
      <AppHeader title="Treatment" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.diagnosisCard, { backgroundColor: tokens.colors.surface }]}>
          <Text style={[styles.diseaseName, { color: tokens.colors.text }]}>
            {currentDiagnosis?.name}
          </Text>
          <View
            style={[
              styles.severityBadge,
              {
                backgroundColor:
                  currentDiagnosis?.severity === 'Severe'
                    ? tokens.colors.error500
                    : currentDiagnosis?.severity === 'Moderate'
                    ? tokens.colors.warning500
                    : tokens.colors.success500,
              },
            ]}
          >
            <Text style={styles.severityText}>{currentDiagnosis?.severity}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: tokens.colors.text }]}>
          Recommended Treatments
        </Text>

        <View style={styles.priorityNote}>
          <Text style={styles.priorityIcon}>💡</Text>
          <Text style={[styles.priorityText, { color: tokens.colors.textSecondary }]}>
            We prioritize locally available, affordable solutions before
            commercial chemicals
          </Text>
        </View>

        {treatments.map((treatment, idx) => (
          <View
            key={idx}
            style={[styles.treatmentCard, { backgroundColor: tokens.colors.surface }]}
          >
            <View style={styles.treatmentHeader}>
              <Text style={styles.treatmentNumber}>{idx + 1}</Text>
              <View style={styles.treatmentInfo}>
                <Text style={[styles.treatmentTitle, { color: tokens.colors.text }]}>
                  {treatment.name}
                </Text>
                <Text style={[styles.treatmentType, { color: tokens.colors.primary500 }]}>
                  {treatment.type}
                </Text>
              </View>
            </View>
            <Text style={[styles.treatmentDesc, { color: tokens.colors.textSecondary }]}>
              {treatment.description}
            </Text>
            {treatment.application && (
              <View style={styles.applicationContainer}>
                <Text style={[styles.applicationLabel, { color: tokens.colors.text }]}>
                  How to apply:
                </Text>
                <Text
                  style={[styles.applicationText, { color: tokens.colors.textSecondary }]}
                >
                  {treatment.application}
                </Text>
              </View>
            )}
          </View>
        ))}

        <View style={[styles.warningCard, { backgroundColor: tokens.colors.warning50 }]}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <View style={styles.warningContent}>
            <Text style={[styles.warningTitle, { color: tokens.colors.text }]}>
              Important
            </Text>
            <Text style={[styles.warningText, { color: tokens.colors.textSecondary }]}>
              Always test on a small area first. If symptoms persist or worsen,
              consult an agricultural extension officer.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.doneButton, { backgroundColor: tokens.colors.primary500 }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

interface Treatment {
  name: string;
  type: string;
  description: string;
  application?: string;
}

function parseTreatments(treatmentText: string): Treatment[] {
  const localRemedies: Treatment[] = [
    {
      name: 'Neem Oil Spray',
      type: '🌿 Organic',
      description:
        'A natural pesticide that works against many fungal and bacterial issues.',
      application:
        'Mix 5ml neem oil with 1L water. Spray on affected leaves every 7 days.',
    },
    {
      name: 'Wood Ash',
      type: '🌿 Organic',
      description:
        'Natural fungicide that also provides potassium to the soil.',
      application:
        'Dust affected areas lightly. Repeat after rain.',
    },
  ];

  const chemicalRemedies: Treatment[] = [
    {
      name: 'Copper-Based Fungicide',
      type: '💊 Chemical',
      description:
        'Effective against fungal and bacterial diseases. Use when organic methods fail.',
      application:
        'Follow package instructions. Apply in early morning or evening.',
    },
  ];

  if (treatmentText.toLowerCase().includes('neem') || treatmentText.toLowerCase().includes('organic')) {
    return [...localRemedies, ...chemicalRemedies];
  }

  return localRemedies;
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
  diagnosisCard: {
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...tokens.elevation.level1,
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: 4,
    borderRadius: tokens.radius.full,
  },
  severityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: tokens.spacing.md,
  },
  priorityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.primary50,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.md,
  },
  priorityIcon: {
    fontSize: 16,
    marginRight: tokens.spacing.xs,
  },
  priorityText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  treatmentCard: {
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.md,
    ...tokens.elevation.level1,
  },
  treatmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: tokens.spacing.sm,
  },
  treatmentNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: tokens.colors.primary600,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '600',
    marginRight: tokens.spacing.md,
  },
  treatmentInfo: {
    flex: 1,
  },
  treatmentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  treatmentType: {
    fontSize: 12,
    fontWeight: '500',
  },
  treatmentDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: tokens.spacing.sm,
  },
  applicationContainer: {
    backgroundColor: tokens.colors.neutral100,
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.sm,
  },
  applicationLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  applicationText: {
    fontSize: 13,
    lineHeight: 18,
  },
  warningCard: {
    flexDirection: 'row',
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    marginTop: tokens.spacing.sm,
  },
  warningIcon: {
    fontSize: 24,
    marginRight: tokens.spacing.md,
  },
  warningContent: {
    flex: 1,
  },
  warningTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  warningText: {
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
