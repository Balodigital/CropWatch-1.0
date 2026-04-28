import { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/constants/tokens';
import { AppHeader } from '@/components/ui/AppHeader';
import { CROP_IMAGES } from '@/lib/supabase';
import { Image } from 'react-native';

export default function SymptomsScreen() {
  const router = useRouter();
  const { image, cropType } = useLocalSearchParams<{
    image: string;
    cropType: string;
  }>();
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const characterCount = description.length;
  const isValid = description.length === 0 || description.length >= 5;

  const handleAnalyze = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    router.push({
      pathname: '/scan/analyzing',
      params: { image, cropType, description },
    });
  };

  const skipDescription = () => {
    setIsSubmitting(true);
    router.push({
      pathname: '/scan/analyzing',
      params: { image, cropType, description: '' },
    });
  };

  return (
    <View style={styles.container}>
      <AppHeader title={t('scan.symptoms')} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.cropBadge, { backgroundColor: tokens.colors.primary50 }]}>
            <View style={styles.imageContainer}>
              <Image 
                source={CROP_IMAGES[cropType || ''] || { uri: 'https://via.placeholder.com/40' }} 
                style={styles.cropImage}
                resizeMode="contain"
              />
            </View>
            <Text style={[styles.cropName, { color: tokens.colors.primary500 }]}>
              {cropType?.charAt(0).toUpperCase() + cropType?.slice(1)} {t('common.confirm')}
            </Text>
          </View>

          <Text style={[styles.label, { color: tokens.colors.text }]}>
            {t('scan.describe_symptom')}
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: tokens.colors.surface,
                borderColor: !isValid ? tokens.colors.error500 : tokens.colors.border,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: tokens.colors.text }]}
              placeholder={t('scan.placeholder')}
              placeholderTextColor={tokens.colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
            />
          </View>

          <View style={styles.characterCount}>
            <Text
              style={[
                styles.countText,
                {
                  color: !isValid
                    ? tokens.colors.error500
                    : characterCount >= 450
                    ? tokens.colors.warning500
                    : tokens.colors.textSecondary,
                },
              ]}
            >
              {characterCount}/500
            </Text>
            {!isValid && (
              <Text style={[styles.errorText, { color: tokens.colors.error500 }]}>
                {t('scan.char_limit_error')}
              </Text>
            )}
          </View>

          <View style={styles.tipsContainer}>
            <Text style={[styles.tipsTitle, { color: tokens.colors.text }]}>
              {t('scan.tips_title')}
            </Text>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={[styles.tipText, { color: tokens.colors.textSecondary }]}>
                {t('scan.tip_colors')}
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={[styles.tipText, { color: tokens.colors.textSecondary }]}>
                {t('scan.tip_parts')}
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={[styles.tipText, { color: tokens.colors.textSecondary }]}>
                {t('scan.tip_time')}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={skipDescription}
          >
            <Text style={[styles.skipText, { color: tokens.colors.textSecondary }]}>
              {t('scan.skip_desc')}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.analyzeButton,
              {
                backgroundColor: tokens.colors.primary500,
                opacity: isSubmitting ? 0.7 : 1,
              },
            ]}
            onPress={handleAnalyze}
            disabled={isSubmitting}
          >
            <Text style={styles.analyzeButtonText}>
              {isSubmitting ? t('scan.preparing') : t('scan.analyze_btn')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// getCropIcon removed in favor of centralized images

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: tokens.spacing.md,
    paddingBottom: tokens.spacing.xxl,
  },
  cropBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.radius.full,
    marginBottom: tokens.spacing.lg,
  },
  imageContainer: {
    width: 24,
    height: 24,
    borderRadius: tokens.radius.full,
    marginRight: tokens.spacing.xs,
    overflow: 'hidden',
  },
  cropImage: {
    width: '100%',
    height: '100%',
  },
  cropName: {
    fontSize: 14,
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: tokens.spacing.md,
  },
  inputContainer: {
    borderRadius: tokens.radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  input: {
    padding: tokens.spacing.md,
    fontSize: 16,
    minHeight: 150,
  },
  characterCount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: tokens.spacing.xs,
    marginBottom: tokens.spacing.lg,
  },
  countText: {
    fontSize: 12,
  },
  errorText: {
    fontSize: 12,
  },
  tipsContainer: {
    marginBottom: tokens.spacing.lg,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: tokens.spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: tokens.spacing.xs,
  },
  tipBullet: {
    fontSize: 14,
    marginRight: tokens.spacing.xs,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  skipButton: {
    alignSelf: 'center',
    padding: tokens.spacing.md,
  },
  skipText: {
    fontSize: 14,
  },
  footer: {
    padding: tokens.spacing.md,
    paddingBottom: tokens.spacing.xxl,
  },
  analyzeButton: {
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
