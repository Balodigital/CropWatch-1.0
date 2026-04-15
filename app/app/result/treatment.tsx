import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Diagnosis } from '@/lib/supabase';

export default function TreatmentScreen() {
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

  const treatments = parseTreatments(currentDiagnosis?.treatment || '');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Treatment</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.diagnosisCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.diseaseName, { color: colors.text }]}>
            {currentDiagnosis?.name}
          </Text>
          <View
            style={[
              styles.severityBadge,
              {
                backgroundColor:
                  currentDiagnosis?.severity === 'Severe'
                    ? colors.error
                    : currentDiagnosis?.severity === 'Moderate'
                    ? colors.warning
                    : colors.success,
              },
            ]}
          >
            <Text style={styles.severityText}>{currentDiagnosis?.severity}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Recommended Treatments
        </Text>

        <View style={styles.priorityNote}>
          <Text style={styles.priorityIcon}>💡</Text>
          <Text style={[styles.priorityText, { color: colors.textSecondary }]}>
            We prioritize locally available, affordable solutions before
            commercial chemicals
          </Text>
        </View>

        {treatments.map((treatment, idx) => (
          <View
            key={idx}
            style={[styles.treatmentCard, { backgroundColor: colors.surface }]}
          >
            <View style={styles.treatmentHeader}>
              <Text style={styles.treatmentNumber}>{idx + 1}</Text>
              <View style={styles.treatmentInfo}>
                <Text style={[styles.treatmentTitle, { color: colors.text }]}>
                  {treatment.name}
                </Text>
                <Text style={[styles.treatmentType, { color: colors.primary }]}>
                  {treatment.type}
                </Text>
              </View>
            </View>
            <Text style={[styles.treatmentDesc, { color: colors.textSecondary }]}>
              {treatment.description}
            </Text>
            {treatment.application && (
              <View style={styles.applicationContainer}>
                <Text style={[styles.applicationLabel, { color: colors.text }]}>
                  How to apply:
                </Text>
                <Text
                  style={[styles.applicationText, { color: colors.textSecondary }]}
                >
                  {treatment.application}
                </Text>
              </View>
            )}
          </View>
        ))}

        <View style={[styles.warningCard, { backgroundColor: colors.warning + '15' }]}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <View style={styles.warningContent}>
            <Text style={[styles.warningTitle, { color: colors.text }]}>
              Important
            </Text>
            <Text style={[styles.warningText, { color: colors.textSecondary }]}>
              Always test on a small area first. If symptoms persist or worsen,
              consult an agricultural extension officer.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.doneButton, { backgroundColor: colors.primary }]}
          onPress={() => router.replace('/(tabs)')}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
  diagnosisCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  diseaseName: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  priorityNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    marginBottom: 16,
  },
  priorityIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  priorityText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  treatmentCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  treatmentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  treatmentNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2c6a4f',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '600',
    marginRight: 12,
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
    marginBottom: 8,
  },
  applicationContainer: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
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
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  warningIcon: {
    fontSize: 24,
    marginRight: 12,
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
