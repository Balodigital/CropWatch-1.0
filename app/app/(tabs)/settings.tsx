import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { OfflineStorage } from '@/lib/offline';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);

  const currentLanguage = i18n.language;

  const handleLanguageChange = () => {
    const newLang = currentLanguage === 'en' ? 'pcm' : 'en';
    Alert.alert(
      'Change Language',
      `Switch to ${newLang === 'en' ? 'English' : 'Nigerian Pidgin'}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Switch',
          onPress: async () => {
            await i18n.changeLanguage(newLang);
            await OfflineStorage.saveUserPreferences({
              language: newLang,
              hasCompletedOnboarding: true,
            });
          },
        },
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Clear History',
      'This will delete all your scan history and cached diagnoses. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await OfflineStorage.clearAll();
            Alert.alert('Success', 'History cleared successfully');
          },
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Export your scan history as a PDF report?',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Account
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <SettingItem
            icon="🌐"
            title="Language"
            value={currentLanguage === 'en' ? 'English' : 'Nigerian Pidgin'}
            onPress={handleLanguageChange}
            colors={colors}
          />
          <SettingItem
            icon="🔔"
            title="Notifications"
            hasSwitch
            switchValue={notifications}
            onSwitchChange={setNotifications}
            colors={colors}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Data & Storage
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <SettingItem
            icon="📴"
            title="Offline Mode"
            subtitle="Store scans for later processing"
            hasSwitch
            switchValue={offlineMode}
            onSwitchChange={setOfflineMode}
            colors={colors}
          />
          <SettingItem
            icon="📤"
            title="Export Data"
            subtitle="Download your scan history"
            onPress={handleExportData}
            colors={colors}
          />
          <SettingItem
            icon="🗑️"
            title="Clear History"
            subtitle="Delete all scan records"
            onPress={handleClearHistory}
            colors={colors}
            destructive
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          Support
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <SettingItem
            icon="❓"
            title="Help Center"
            onPress={() => {}}
            colors={colors}
          />
          <SettingItem
            icon="📧"
            title="Contact Us"
            onPress={() => {}}
            colors={colors}
          />
          <SettingItem
            icon="⭐"
            title="Rate App"
            onPress={() => {}}
            colors={colors}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          About
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <SettingItem
            icon="📜"
            title="Terms of Service"
            onPress={() => {}}
            colors={colors}
          />
          <SettingItem
            icon="🔒"
            title="Privacy Policy"
            onPress={() => {}}
            colors={colors}
          />
          <SettingItem
            icon="ℹ️"
            title="Version"
            value="1.0.0"
            colors={colors}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          Made with 💚 for Nigerian Farmers
        </Text>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>
          © 2024 CropWatch
        </Text>
      </View>
    </ScrollView>
  );
}

function SettingItem({
  icon,
  title,
  subtitle,
  value,
  hasSwitch,
  switchValue,
  onSwitchChange,
  onPress,
  colors,
  destructive,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  value?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  colors: typeof Colors.light;
  destructive?: boolean;
}) {
  const content = (
    <View style={styles.settingItem}>
      <Text style={styles.settingIcon}>{icon}</Text>
      <View style={styles.settingContent}>
        <Text
          style={[
            styles.settingTitle,
            { color: destructive ? colors.error : colors.text },
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {hasSwitch && onSwitchChange && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#ddd', true: colors.primaryLight }}
          thumbColor={switchValue ? colors.primary : '#f4f4f4'}
        />
      )}
      {value && (
        <Text style={[styles.settingValue, { color: colors.textSecondary }]}>
          {value}
        </Text>
      )}
      {!hasSwitch && !value && <Text style={styles.chevron}>›</Text>}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#eee',
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  settingValue: {
    fontSize: 14,
  },
  chevron: {
    fontSize: 20,
    color: '#ccc',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    marginBottom: 4,
  },
});
