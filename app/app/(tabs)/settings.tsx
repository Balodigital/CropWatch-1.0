import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  Linking,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/constants/tokens';
import { useAuth } from '@/context/AuthContext';

import { SettingsItem } from '@/components/profile/SettingsItem';
import { SettingsSection } from '@/components/profile/SettingsSection';
import { ToggleItem } from '@/components/profile/ToggleItem';
import { Avatar } from '@/components/profile/Avatar';
import { MaterialIcons } from '@expo/vector-icons';
import { ConfirmationModal } from '@/components/ui/ConfirmationModal';
import { AppHeader } from '@/components/ui/AppHeader';

export default function SettingsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { user, profile, signOut, signOutAllDevices, deactivateAccount } = useAuth();
  
  const [notifications, setNotifications] = useState(true);
  const [biometricLock, setBiometricLock] = useState(false);
  
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [signOutAllModalVisible, setSignOutAllModalVisible] = useState(false);

  const currentLanguage = i18n.language;

  const handleLogout = async () => {
    try {
      setLogoutModalVisible(false);
      await signOut();
      // Global guard in _layout.tsx will handle redirection to login
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleSignOutAll = async () => {
    try {
      setSignOutAllModalVisible(false);
      await signOutAllDevices();
      // Global guard in _layout.tsx will handle redirection to login
    } catch (error) {
      console.error('Sign out all error:', error);
      Alert.alert('Error', 'Failed to sign out of all devices. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader title={t('tabs.settings')} showBack={false} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
      {/* Profile Header Section */}
      <View style={styles.profileHeaderCard}>
        <SettingsSection>
          <Pressable 
            onPress={() => router.push('/profile/edit')}
            style={({ pressed }) => [styles.profileRow, { opacity: pressed ? 0.7 : 1 }]}
          >
            <Avatar 
              uri={profile?.avatar_url || user?.user_metadata?.avatar_url} 
              size={60} 
            />
            <View style={styles.profileInfo}>
              <Text style={[tokens.typography.title, styles.profileName]}>
                {profile?.full_name || user?.user_metadata?.full_name || 'CropWatch User'}
              </Text>
              <Text style={[tokens.typography.caption, styles.profileEmail]}>
                {user?.email}
              </Text>
            </View>
            <View style={styles.editIconContainer}>
              <MaterialIcons name="edit" size={20} color={tokens.colors.primary500} />
            </View>
          </Pressable>
        </SettingsSection>
      </View>

      {/* Appearance & Notifications */}
      <SettingsSection title={t('settings.preferences')}>
        <ToggleItem
          icon="notifications-none"
          title={t('settings.notifications')}
          value={notifications}
          onValueChange={setNotifications}
        />
      </SettingsSection>

      {/* Security Options */}
      <SettingsSection title={t('settings.security')}>
        <ToggleItem
          icon="fingerprint"
          title={t('settings.biometric_lock')}
          subtitle={t('settings.biometric_subtitle')}
          value={biometricLock}
          onValueChange={setBiometricLock}
        />
        <SettingsItem
          icon="lock-outline"
          title={t('settings.change_password')}
          onPress={() => router.push('/profile/change-password')}
        />
      </SettingsSection>

      {/* Privacy Settings */}
      <SettingsSection title={t('settings.privacy')}>
        <SettingsItem
          icon="security"
          title={t('settings.permissions')}
          subtitle={t('settings.permissions_subtitle')}
          onPress={() => router.push('/profile/permissions')}
        />
      </SettingsSection>

      {/* Regional Section */}
      <SettingsSection title={t('settings.regional')}>
        <SettingsItem
          icon="language"
          title={t('settings.language')}
          value={currentLanguage === 'en' ? 'English' : 'Pidgin'}
          onPress={() => router.push('/profile/language')}
        />
      </SettingsSection>

      {/* Help & Support */}
      <SettingsSection title={t('settings.support')}>
        <SettingsItem
          icon="help-outline"
          title={t('settings.faq')}
          onPress={() => Linking.openURL('https://cropwatch.app/faq')}
        />
        <SettingsItem
          icon="headset-mic"
          title={t('settings.contact')}
          onPress={() => Linking.openURL('mailto:support@cropwatch.app')}
        />
        <SettingsItem
          icon="description"
          title={t('settings.terms')}
          onPress={() => Linking.openURL('https://cropwatch.app/privacy')}
        />
      </SettingsSection>

      {/* Account Control */}
      <SettingsSection title={t('settings.account_control')}>
        <SettingsItem
          icon="devices"
          title={t('settings.sign_out_all')}
          onPress={() => setSignOutAllModalVisible(true)}
        />
      </SettingsSection>

      {/* Logout Section */}
      <SettingsSection>
        <SettingsItem
          icon="logout"
          title={t('common.logout')}
          onPress={() => setLogoutModalVisible(true)}
          destructive
          showChevron={false}
        />
      </SettingsSection>

      <View style={styles.footer}>
        <Text style={styles.versionText}>{t('settings.version')}</Text>
        <Pressable onPress={() => Alert.alert('Update', 'You are using the latest version.')}>
          <Text style={[styles.footerText, { color: tokens.colors.primary500 }]}>{t('settings.check_updates')}</Text>
        </Pressable>
        <Text style={styles.footerText}>
          Made with 💚 for Nigerian Farmers
        </Text>
      </View>

      {/* Confirmation Modals */}
      <ConfirmationModal
        visible={logoutModalVisible}
        title={t('modals.logout_title')}
        message={t('modals.logout_message')}
        confirmLabel={t('common.logout')}
        onConfirm={handleLogout}
        onClose={() => setLogoutModalVisible(false)}
        isDestructive
      />

      <ConfirmationModal
        visible={signOutAllModalVisible}
        title={t('modals.sign_out_all_title')}
        message={t('modals.sign_out_all_message')}
        confirmLabel={t('settings.sign_out_all')}
        onConfirm={handleSignOutAll}
        onClose={() => setSignOutAllModalVisible(false)}
      />
      </ScrollView>
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
  contentContainer: {
    padding: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xxl,
  },
  profileHeaderCard: {
    marginTop: tokens.spacing.sm,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.surface,
  },
  profileInfo: {
    flex: 1,
    marginLeft: tokens.spacing.md,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  profileEmail: {
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  editIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: tokens.colors.primary50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: tokens.spacing.xl,
    alignItems: 'center',
    gap: 6,
  },
  versionText: {
    ...tokens.typography.caption,
    color: tokens.colors.textSecondary,
    fontSize: 12,
  },
  footerText: {
    ...tokens.typography.caption,
    color: '#666666',
    fontSize: 11,
  },
});
