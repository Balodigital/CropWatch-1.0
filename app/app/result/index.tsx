import { useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Diagnosis } from '@/lib/supabase';
import { OfflineStorage } from '@/lib/offline';

export default function ResultScreen() {
  const router = useRouter();
  const { diagnosis, cropType, image } = useLocalSearchParams<{
    diagnosis: string;
    cropType: string;
    image: string;
  }>();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

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
        return colors.success;
      case 'Moderate':
        return colors.warning;
      case 'Severe':
        return colors.error;
      default:
        return colors.textSecondary;
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Diagnosis Results</Text>
        <View style={styles.cropBadge}>
          <Text style={styles.cropIcon}>{getCropIcon(cropType || '')}</Text>
          <Text style={[styles.cropName, { color: colors.primary }]}>
            {cropType?.charAt(0).toUpperCase() + cropType?.slice(1)}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {diagnoses.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🤔</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Clear Diagnosis
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              We couldn't identify the issue clearly. Please try with a clearer
              photo or add more symptom description.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.summaryCard}>
              <View
                style={[
                  styles.primaryResult,
                  { backgroundColor: getSeverityBg(diagnoses[0].severity) },
                ]}
              >
                <Text style={styles.mostLikely}>Most Likely</Text>
                <Text style={[styles.diseaseName, { color: colors.text }]}>
                  {diagnoses[0].name}
                </Text>
                <View style={styles.severityRow}>
                  <View
                    style={[
                      styles.severityBadge,
                      { backgroundColor: getSeverityColor(diagnoses[0].severity) },
                    ]}
                  >
                    <Text style={styles.severityText}>
                      {diagnoses[0].severity}
                    </Text>
                  </View>
                  <Text style={[styles.confidenceText, { color: colors.textSecondary }]}>
                    {diagnoses[0].confidence}% confidence
                  </Text>
                </View>
              </View>
            </View>

            {diagnoses.length > 1 && (
              <Text style={[styles.otherResults, { color: colors.textSecondary }]}>
                Other possibilities:
              </Text>
            )}

            {diagnoses.slice(1).map((d, index) => (
              <View
                key={index}
                style={[styles.diagnosisCard, { backgroundColor: colors.surface }]}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, { color: colors.text }]}>
                    {d.name}
                  </Text>
                  <View
                    style={[
                      styles.miniSeverity,
                      { backgroundColor: getSeverityColor(d.severity) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.miniSeverityText,
                        { color: getSeverityColor(d.severity) },
                      ]}
                    >
                      {d.severity}
                    </Text>
                  </View>
                </View>
                <Text style={[styles.cardConfidence, { color: colors.textSecondary }]}>
                  {d.confidence}% confidence
                </Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.treatmentButton, { backgroundColor: colors.primary }]}
          onPress={() => handleViewTreatment(0)}
          disabled={diagnoses.length === 0}
        >
          <Text style={styles.treatmentButtonText}>
            View Treatment
          </Text>
        </TouchableOpacity>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.primary }]}
            onPress={() => handleViewPrevention(0)}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
              Prevention Tips
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.newScanButton, { backgroundColor: colors.surface }]}
            onPress={handleNewScan}
          >
            <Text style={styles.newScanIcon}>🔄</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function getCropIcon(cropType: string): string {
  const icons: Record<string, string> = {
    tomato: '🍅',
    cassava: '🫚',
    maize: '🌽',
    pepper: '🌶️',
    rice: '🍚',
    yam: '🍠',
    cowpea: '🫘',
    cocoa: '🍫',
  };
  return icons[cropType?.toLowerCase() || ''] || '🌱';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  cropBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cropIcon: {
    fontSize: 20,
    marginRight: 6,
  },
  cropName: {
    fontSize: 14,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  summaryCard: {
    marginBottom: 24,
  },
  primaryResult: {
    padding: 20,
    borderRadius: 16,
  },
  mostLikely: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    opacity: 0.8,
  },
  diseaseName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  severityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  confidenceText: {
    fontSize: 14,
  },
  otherResults: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  diagnosisCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
  miniSeverity: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  miniSeverityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  cardConfidence: {
    fontSize: 13,
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    padding: 16,
    gap: 12,
  },
  treatmentButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  treatmentButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  newScanButton: {
    width: 52,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  newScanIcon: {
    fontSize: 24,
  },
});
