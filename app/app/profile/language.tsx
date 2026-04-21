import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/constants/tokens';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { AppHeader } from '@/components/ui/AppHeader';

export default function LanguageSelectionScreen() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const languages = [
    { code: 'en', name: t('settings.lang_en'), nativeName: 'English' },
    { code: 'pcm', name: t('settings.lang_pcm'), nativeName: 'Pidgin' },
  ];

  const handleLanguageSelect = async (code: string) => {
    try {
      await i18n.changeLanguage(code);
      await AsyncStorage.setItem('@cropwatch_language', code);
      
      // Update Supabase profile if logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ language_pref: code })
          .eq('id', user.id);
      }
    } catch (error) {
      console.error('Error changing language', error);
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title={t('settings.language')} />
      <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text style={[tokens.typography.body, styles.description]}>
        {t('settings.lang_description')}
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
    </View>
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
