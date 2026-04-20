import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/constants/tokens';
import { MaterialIcons } from '@expo/vector-icons';
import { OfflineStorage } from '@/lib/offline';

export default function LanguageSelectionScreen() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'pcm', name: 'Nigerian Pidgin', nativeName: 'Pidgin' },
  ];

  const handleLanguageSelect = async (code: string) => {
    await i18n.changeLanguage(code);
    await OfflineStorage.saveUserPreferences({
      language: code,
      hasCompletedOnboarding: true,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={[tokens.typography.body, styles.description]}>
        Choose your preferred language for the CropWatch app.
      </Text>

      <View style={styles.list}>
        {languages.map((lang) => (
          <Pressable
            key={lang.code}
            onPress={() => handleLanguageSelect(lang.code)}
            style={({ pressed }) => [
              styles.item,
              currentLanguage === lang.code && styles.selectedItem,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <View style={styles.itemInfo}>
              <Text style={[tokens.typography.title, styles.name]}>{lang.name}</Text>
              <Text style={[tokens.typography.caption, styles.nativeName]}>{lang.nativeName}</Text>
            </View>
            {currentLanguage === lang.code && (
              <MaterialIcons name="check-circle" size={24} color={tokens.colors.primary500} />
            )}
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  contentContainer: {
    padding: tokens.spacing.lg,
  },
  description: {
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.xl,
  },
  list: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
    ...tokens.elevation.level1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: tokens.colors.border,
  },
  selectedItem: {
    backgroundColor: tokens.colors.primary50,
  },
  itemInfo: {
    flex: 1,
  },
  name: {
    color: tokens.colors.text,
    fontSize: 16,
  },
  nativeName: {
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
});
