import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PreviewScreen() {
  const router = useRouter();
  const { image } = useLocalSearchParams<{ image: string }>();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleContinue = () => {
    router.replace({
      pathname: '/scan/crop-select',
      params: { image },
    });
  };

  const handleRetake = () => {
    router.back();
  };

  if (!image) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>No image captured</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.text }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Preview</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.previewImage} />
      </View>

      <View style={styles.tipContainer}>
        <Text style={styles.tipIcon}>💡</Text>
        <Text style={[styles.tipText, { color: colors.textSecondary }]}>
          Make sure the leaf is clearly visible and well-lit for best results
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.retakeButton, { borderColor: colors.primary }]}
          onPress={handleRetake}
        >
          <Text style={[styles.retakeText, { color: colors.primary }]}>Retake</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: colors.primary }]}
          onPress={handleContinue}
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
  imageContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 16,
    resizeMode: 'contain',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  retakeButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
  },
  retakeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  continueButton: {
    flex: 2,
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
