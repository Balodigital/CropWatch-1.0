import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { tokens } from '@/constants/tokens';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { StrengthMeter } from '@/components/auth/StrengthMeter';
import { usePasswordValidation } from '@/hooks/use-password-validation';
import { supabase } from '@/lib/supabase';
import { AppHeader } from '@/components/ui/AppHeader';

export default function ChangePasswordScreen() {
  const router = useRouter();
  const { session } = useAuth();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { strength, isValid } = usePasswordValidation(newPassword);

  const handleChangePassword = async () => {
    if (!currentPassword) {
      Alert.alert('Error', 'Current password is required');
      return;
    }

    if (!isValid) {
      Alert.alert('Error', 'New password does not meet requirements');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Supabase handles password updates via updateUser
      // Note: Supabase doesn't strictly require the old password for updateUser,
      // but it's a security best practice to verify it if possible.
      // However, Supabase Auth API for updating password only takes the new password.
      // If we want to verify the old password, we'd need to re-authenticate first.
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      Alert.alert('Success', 'Password updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <AppHeader title="Change Password" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.form}>
          <Input
            label="Current Password"
            placeholder="Enter current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            icon="lock"
          />

          <View style={styles.divider} />
          
          <Input
            label="New Password"
            placeholder="Enter new password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            icon="lock"
          />

          <StrengthMeter strength={strength} />

          <Input
            label="Confirm New Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            icon="lock"
          />
        </View>

        <View style={styles.footer}>
          <Button 
            title="Update Password" 
            onPress={handleChangePassword} 
            loading={loading}
            disabled={!isValid || !newPassword || !confirmPassword || newPassword !== confirmPassword}
            style={styles.saveButton}
          />
          <Button 
            title="Cancel" 
            onPress={() => router.back()} 
            variant="ghost"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  form: {
    gap: tokens.spacing.md,
  },
  divider: {
    height: tokens.spacing.lg,
  },
  footer: {
    marginTop: tokens.spacing.xxl,
    gap: tokens.spacing.sm,
  },
  saveButton: {
    width: '100%',
  },
});
