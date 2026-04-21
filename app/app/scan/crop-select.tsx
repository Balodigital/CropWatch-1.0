import { useState } from 'react';
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
import { CROPS_DATA } from '@/lib/supabase';
import { AppHeader } from '@/components/ui/AppHeader';

export default function CropSelectScreen() {
  const router = useRouter();
  const { image } = useLocalSearchParams<{ image: string }>();
  const { t } = useTranslation();
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
    <View style={styles.container}>
      <AppHeader title={t('scan.crop_select')} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.subtitle, { color: tokens.colors.textSecondary }]}>
          {t('scan.crop_select')}
        </Text>

        <View style={styles.cropsGrid}>
          {CROPS_DATA.map((crop) => (
            <TouchableOpacity
              key={crop.id}
              style={[
                styles.cropCard,
                {
                  backgroundColor: tokens.colors.surface,
                  borderColor:
                    selectedCrop === crop.dataset_context
                      ? tokens.colors.primary500
                      : 'transparent',
                  borderWidth: selectedCrop === crop.dataset_context ? 3 : 0,
                },
              ]}
              onPress={() => setSelectedCrop(crop.dataset_context)}
              activeOpacity={0.7}
            >
              <View style={[styles.imageContainer, { backgroundColor: tokens.colors.primary50 }]}>
                <Image 
                  source={crop.asset || { uri: crop.image }} 
                  style={styles.cropImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={[styles.cropName, { color: tokens.colors.text }]}>
                {crop.name}
              </Text>
              {selectedCrop === crop.dataset_context && (
                <View style={[styles.checkmark, { backgroundColor: tokens.colors.primary500 }]}>
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
                ? tokens.colors.primary500
                : tokens.colors.neutral300,
            },
          ]}
          onPress={handleContinue}
          disabled={!selectedCrop}
        >
          <Text style={styles.continueText}>{t('common.next')}</Text>
        </TouchableOpacity>
      </View>
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
  scrollContent: {
    padding: tokens.spacing.md,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: tokens.spacing.lg,
  },
  cropsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
  },
  cropCard: {
    width: '47%',
    padding: tokens.spacing.lg,
    borderRadius: tokens.radius.lg,
    alignItems: 'center',
    position: 'relative',
    ...tokens.elevation.level1,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.sm,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xs,
  },
  cropImage: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
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
    padding: tokens.spacing.md,
    paddingBottom: tokens.spacing.xxl,
  },
  continueButton: {
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
