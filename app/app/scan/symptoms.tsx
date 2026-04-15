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
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SymptomsScreen() {
  const router = useRouter();
  const { image, cropType } = useLocalSearchParams<{
    image: string;
    cropType: string;
  }>();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const characterCount = description.length;
  const isValid = description.length === 0 || description.length >= 5;

  const handleAnalyze = async () => {
    if (!isValid) return;

    setIsSubmitting(true);
    router.replace({
      pathname: '/scan/analyzing',
      params: { image, cropType, description },
    });
  };

  const skipDescription = () => {
    setIsSubmitting(true);
    router.replace({
      pathname: '/scan/analyzing',
      params: { image, cropType, description: '' },
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={[styles.backButton, { color: colors.text }]}>Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Symptoms</Text>
          <View style={{ width: 60 }} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.cropBadge, { backgroundColor: colors.primaryLight + '20' }]}>
            <Text style={styles.cropIcon}>
              {getCropIcon(cropType || '')}
            </Text>
            <Text style={[styles.cropName, { color: colors.primary }]}>
              {cropType?.charAt(0).toUpperCase() + cropType?.slice(1)} Selected
            </Text>
          </View>

          <Text style={[styles.label, { color: colors.text }]}>
            {t('describe_symptom')}
          </Text>

          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colors.surface,
                borderColor: !isValid ? colors.error : colors.textSecondary + '30',
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="e.g., leaves are turning yellow with brown spots..."
              placeholderTextColor={colors.textSecondary}
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
                    ? colors.error
                    : characterCount >= 450
                    ? colors.warning
                    : colors.textSecondary,
                },
              ]}
            >
              {characterCount}/500
            </Text>
            {!isValid && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                Description must be at least 5 characters
              </Text>
            )}
          </View>

          <View style={styles.tipsContainer}>
            <Text style={[styles.tipsTitle, { color: colors.text }]}>
              Tips for better diagnosis:
            </Text>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                Describe the color changes you see
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                Mention which parts are affected (leaves, stems, fruit)
              </Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                Note when you first noticed the problem
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={skipDescription}
          >
            <Text style={[styles.skipText, { color: colors.textSecondary }]}>
              Skip description
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.analyzeButton,
              {
                backgroundColor: colors.primary,
                opacity: isSubmitting ? 0.7 : 1,
              },
            ]}
            onPress={handleAnalyze}
            disabled={isSubmitting}
          >
            <Text style={styles.analyzeButtonText}>
              {isSubmitting ? 'Preparing...' : 'Analyze'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  return icons[cropType.toLowerCase()] || '🌱';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
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
  cropBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  cropIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  cropName: {
    fontSize: 14,
    fontWeight: '600',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  input: {
    padding: 16,
    fontSize: 16,
    minHeight: 150,
  },
  characterCount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 24,
  },
  countText: {
    fontSize: 12,
  },
  errorText: {
    fontSize: 12,
  },
  tipsContainer: {
    marginBottom: 24,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 14,
    marginRight: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  skipButton: {
    alignSelf: 'center',
    padding: 12,
  },
  skipText: {
    fontSize: 14,
  },
  footer: {
    padding: 16,
  },
  analyzeButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
