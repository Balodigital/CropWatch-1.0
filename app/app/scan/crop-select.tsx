import { useState } from 'react';
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
import { CROPS_DATA } from '@/lib/supabase';

export default function CropSelectScreen() {
  const router = useRouter();
  const { image } = useLocalSearchParams<{ image: string }>();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [selectedCrop, setSelectedCrop] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedCrop) {
      router.replace({
        pathname: '/scan/symptoms',
        params: { image, cropType: selectedCrop },
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.text }]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>{t('select_crop')}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Select the type of crop you are scanning
        </Text>

        <View style={styles.cropsGrid}>
          {CROPS_DATA.map((crop) => (
            <TouchableOpacity
              key={crop.id}
              style={[
                styles.cropCard,
                {
                  backgroundColor: colors.surface,
                  borderColor:
                    selectedCrop === crop.dataset_context
                      ? colors.primary
                      : 'transparent',
                  borderWidth: selectedCrop === crop.dataset_context ? 3 : 0,
                },
              ]}
              onPress={() => setSelectedCrop(crop.dataset_context)}
              activeOpacity={0.7}
            >
              <Text style={styles.cropIcon}>{crop.image}</Text>
              <Text style={[styles.cropName, { color: colors.text }]}>
                {crop.name}
              </Text>
              {selectedCrop === crop.dataset_context && (
                <View style={[styles.checkmark, { backgroundColor: colors.primary }]}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            {
              backgroundColor: selectedCrop
                ? colors.primary
                : colors.textSecondary + '40',
            },
          ]}
          onPress={handleContinue}
          disabled={!selectedCrop}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
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
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  cropsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cropCard: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cropIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '600',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  footer: {
    padding: 16,
  },
  continueButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
