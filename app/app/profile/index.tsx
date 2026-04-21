import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/constants/tokens';
import { useAuth } from '@/context/AuthContext';
import { ProfileCard } from '@/components/profile/ProfileCard';
import { SettingsItem } from '@/components/profile/SettingsItem';
import { Button } from '@/components/ui/Button';
import { AppHeader } from '@/components/ui/AppHeader';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, profile, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out of CropWatch?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await signOut();
              router.replace('/(auth)/login');
            } catch (error) {
              Alert.alert('Error', 'Failed to log out. Please try again.');
            } finally {
              setLoading(false);
            }
          }
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Profile" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
      <ProfileCard 
        name={profile?.full_name || user?.user_metadata?.full_name} 
        email={user?.email}
        avatarUrl={profile?.avatar_url || user?.user_metadata?.avatar_url}
      />

      <View style={styles.section}>
        <Text style={[tokens.typography.caption, styles.sectionTitle]}>PERSONAL INFORMATION</Text>
        <View style={styles.sectionContent}>
          <SettingsItem 
            icon="edit" 
            title="Edit Profile" 
            subtitle="Update name, email and phone"
            onPress={() => router.push('/profile/edit')}
          />
          <SettingsItem 
            icon="lock" 
            title="Change Password" 
            subtitle="Secure your account"
            onPress={() => router.push('/profile/change-password')}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[tokens.typography.caption, styles.sectionTitle]}>ACCOUNT SETTINGS</Text>
        <View style={styles.sectionContent}>
          <SettingsItem 
            icon="notifications" 
            title="Notifications" 
            subtitle="Manage app alerts"
            onPress={() => router.push('/(tabs)/settings')}
          />
          <SettingsItem 
            icon="language" 
            title="App Language" 
            value={profile?.language_pref === 'pcm' ? 'Nigerian Pidgin' : 'English'}
            onPress={() => router.push('/(tabs)/settings')}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Logout" 
          onPress={handleLogout} 
          variant="outline"
          loading={loading}
          style={styles.logoutButton}
          textStyle={{ color: tokens.colors.error500 }}
        />
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
    paddingBottom: tokens.spacing.xxl,
  },
  section: {
    marginTop: tokens.spacing.xl,
  },
  sectionTitle: {
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.sm,
    marginLeft: tokens.spacing.xs,
    letterSpacing: 1,
  },
  sectionContent: {
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
    backgroundColor: tokens.colors.surface,
    ...tokens.elevation.level1,
  },
  footer: {
    marginTop: tokens.spacing.xxl,
  },
  logoutButton: {
    borderColor: tokens.colors.error500,
  },
});
