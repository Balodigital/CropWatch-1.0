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

export default function SettingsScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { user, profile, signOut, signOutAllDevices, deactivateAccount } = useAuth();
  
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [biometricLock, setBiometricLock] = useState(false);
  
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [signOutAllModalVisible, setSignOutAllModalVisible] = useState(false);

  const currentLanguage = i18n.language;

  const handleLogout = async () => {
    setLogoutModalVisible(false);
    await signOut();
    router.replace('/(auth)/login');
  };

  const handleSignOutAll = async () => {
    setSignOutAllModalVisible(false);
    await signOutAllDevices();
    router.replace('/(auth)/login');
  };

  return (
    <ScrollView
      style={styles.container}
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
      <SettingsSection title="Preferences">
        <ToggleItem
          icon="dark-mode"
          title="Dark Mode"
          value={darkMode}
          onValueChange={setDarkMode}
        />
        <ToggleItem
          icon="notifications-none"
          title="Notifications"
          value={notifications}
          onValueChange={setNotifications}
        />
      </SettingsSection>

      {/* Security Options */}
      <SettingsSection title="Security Options">
        <ToggleItem
          icon="fingerprint"
          title="Biometric Lock"
          subtitle="Fingerprint or Face Unlock"
          value={biometricLock}
          onValueChange={setBiometricLock}
        />
        <SettingsItem
          icon="lock-outline"
          title="Change Password"
          onPress={() => router.push('/profile/change-password')}
        />
      </SettingsSection>

      {/* Privacy Settings */}
      <SettingsSection title="Privacy Settings">
        <SettingsItem
          icon="security"
          title="App Permissions"
          subtitle="Manage camera, storage, etc."
          onPress={() => router.push('/profile/permissions')}
        />
      </SettingsSection>

      {/* Regional Section */}
      <SettingsSection title="Regional">
        <SettingsItem
          icon="language"
          title="Language"
          value={currentLanguage === 'en' ? 'English' : 'Pidgin'}
          onPress={() => router.push('/profile/language')}
        />
      </SettingsSection>

      {/* Help & Support */}
      <SettingsSection title="Help & Support">
        <SettingsItem
          icon="help-outline"
          title="FAQ"
          onPress={() => Linking.openURL('https://cropwatch.app/faq')}
        />
        <SettingsItem
          icon="headset-mic"
          title="Contact Support"
          onPress={() => Linking.openURL('mailto:support@cropwatch.app')}
        />
        <SettingsItem
          icon="description"
          title="Terms & Privacy Policy"
          onPress={() => Linking.openURL('https://cropwatch.app/privacy')}
        />
      </SettingsSection>

      {/* Account Control */}
      <SettingsSection title="Account Control">
        <SettingsItem
          icon="devices"
          title="Sign out of all devices"
          onPress={() => setSignOutAllModalVisible(true)}
        />
      </SettingsSection>

      {/* Logout Section */}
      <SettingsSection>
        <SettingsItem
          icon="logout"
          title="Logout"
          onPress={() => setLogoutModalVisible(true)}
          destructive
          showChevron={false}
        />
      </SettingsSection>

      <View style={styles.footer}>
        <Text style={styles.versionText}>App ver 2.0.1</Text>
        <Pressable onPress={() => Alert.alert('Update', 'You are using the latest version.')}>
          <Text style={[styles.footerText, { color: tokens.colors.primary500 }]}>Check for updates</Text>
        </Pressable>
        <Text style={styles.footerText}>
          Made with 💚 for Nigerian Farmers
        </Text>
      </View>

      {/* Confirmation Modals */}
      <ConfirmationModal
        visible={logoutModalVisible}
        title="Confirm Logout"
        message="Are you sure you want to log out of your account?"
        confirmLabel="Logout"
        onConfirm={handleLogout}
        onClose={() => setLogoutModalVisible(false)}
        isDestructive
      />

      <ConfirmationModal
        visible={signOutAllModalVisible}
        title="Sign Out Everywhere"
        message="This will log you out of all devices currently using this account."
        confirmLabel="Sign Out All"
        onConfirm={handleSignOutAll}
        onClose={() => setSignOutAllModalVisible(false)}
      />
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
    color: tokens.colors.neutral400,
    fontSize: 11,
  },
});
