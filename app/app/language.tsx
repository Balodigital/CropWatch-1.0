import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OfflineStorage } from '@/lib/offline';

export default function LanguageScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleLanguageSelect = async (lang: string) => {
    await i18n.changeLanguage(lang);
    await OfflineStorage.saveUserPreferences({
      language: lang,
      hasCompletedOnboarding: true,
    });
    router.replace('/permissions');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Choose Your Language</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Choose your preferred language
        </Text>

        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={[
              styles.languageOption,
              {
                backgroundColor: colors.surface,
                borderColor: colors.primary,
                borderWidth: 2,
              },
            ]}
            onPress={() => handleLanguageSelect('en')}
            activeOpacity={0.8}
          >
            <Text style={styles.flagIcon}>🇬🇧</Text>
            <View style={styles.languageTextContainer}>
              <Text style={[styles.languageName, { color: colors.text }]}>English</Text>
              <Text style={[styles.languageNative, { color: colors.textSecondary }]}>
                For formal communication
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.languageOption,
              {
                backgroundColor: colors.surface,
                borderColor: colors.secondary,
              },
            ]}
            onPress={() => handleLanguageSelect('pcm')}
            activeOpacity={0.8}
          >
            <Text style={styles.flagIcon}>🇳🇬</Text>
            <View style={styles.languageTextContainer}>
              <Text style={[styles.languageName, { color: colors.text }]}>Nigerian Pidgin</Text>
              <Text style={[styles.languageNative, { color: colors.textSecondary }]}>
                Wetin you go yarn for farm
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 48,
  },
  optionsContainer: {
    gap: 16,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  flagIcon: {
    fontSize: 48,
    marginRight: 16,
  },
  languageTextContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  languageNative: {
    fontSize: 14,
  },
});
