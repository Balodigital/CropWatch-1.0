import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { tokens } from '@/constants/tokens';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/profile/Avatar';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();
  
  const [fullName, setFullName] = useState(profile?.full_name || user?.user_metadata?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(profile?.phone_number || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || user?.user_metadata?.avatar_url || '');
  const [loading, setLoading] = useState(false);
  const [pickingImage, setPickingImage] = useState(false);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setPickingImage(true);
      try {
        const imageUri = result.assets[0].uri;
        // In a real app, you'd upload this to Supabase Storage first
        // For this implementation, we'll use the local URI or simulate an upload
        setAvatarUrl(imageUri);
      } catch (error) {
        Alert.alert('Error', 'Failed to pick image');
      } finally {
        setPickingImage(false);
      }
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Full name is required');
      return;
    }

    setLoading(true);
    try {
      // 1. Update Profile in DB
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          full_name: fullName,
          phone_number: phone,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // 2. Update User Metadata (optional but good for redundancy)
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: fullName, avatar_url: avatarUrl }
      });

      if (authError) throw authError;

      await refreshProfile();
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.avatarSection}>
          <Avatar uri={avatarUrl} size={120} loading={pickingImage} />
          <Button 
            title="Change Photo" 
            onPress={handlePickImage} 
            variant="ghost" 
            style={styles.changePhotoButton}
          />
        </View>

        <View style={styles.form}>
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            icon="person"
          />
          
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            editable={false}
            icon="email"
            helperText="Email cannot be changed currently"
          />

          <Input
            label="Phone Number"
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            icon="phone"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.footer}>
          <Button 
            title="Save Changes" 
            onPress={handleSave} 
            loading={loading}
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
  avatarSection: {
    alignItems: 'center',
    marginTop: tokens.spacing.xl,
    marginBottom: tokens.spacing.xxl,
  },
  changePhotoButton: {
    marginTop: tokens.spacing.sm,
  },
  form: {
    gap: tokens.spacing.md,
  },
  footer: {
    marginTop: tokens.spacing.huge,
    gap: tokens.spacing.sm,
  },
  saveButton: {
    width: '100%',
  },
});
