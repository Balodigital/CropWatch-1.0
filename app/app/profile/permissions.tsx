import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Linking, Platform } from 'react-native';
import { tokens } from '@/constants/tokens';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { AppHeader } from '@/components/ui/AppHeader';

export default function PermissionsScreen() {
  const openSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  };

  const PermissionRow = ({ icon, title, subtitle, enabled }: any) => (
    <View style={styles.row}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={24} color={tokens.colors.primary500} />
      </View>
      <View style={styles.content}>
        <Text style={[tokens.typography.title, styles.title]}>{title}</Text>
        <Text style={[tokens.typography.caption, styles.subtitle]}>{subtitle}</Text>
      </View>
      <Switch value={enabled} disabled trackColor={{ false: tokens.colors.neutral300, true: tokens.colors.primary200 }} />
    </View>
  );

  return (
    <View style={styles.container}>
      <AppHeader title="App Permissions" />
      <ScrollView contentContainerStyle={styles.contentContainer}>
      <Text style={[tokens.typography.body, styles.description]}>
        CropWatch requires these permissions to function correctly. You can manage them in your device settings.
      </Text>

      <View style={styles.section}>
        <PermissionRow 
          icon="camera-alt" 
          title="Camera" 
          subtitle="Required for scanning crops" 
          enabled={true} 
        />
        <PermissionRow 
          icon="photo-library" 
          title="Gallery" 
          subtitle="Used to upload crop images" 
          enabled={true} 
        />
        <PermissionRow 
          icon="notifications" 
          title="Notifications" 
          subtitle="Get alerts for scan results" 
          enabled={true} 
        />
      </View>

      <View style={styles.footer}>
        <Button 
          title="Open Device Settings" 
          onPress={openSettings} 
          variant="outline"
          icon={<MaterialIcons name="settings" size={20} color={tokens.colors.primary500} />}
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
  },
  description: {
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.xl,
  },
  section: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
    ...tokens.elevation.level1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: tokens.colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.primary50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    color: tokens.colors.text,
    fontSize: 16,
  },
  subtitle: {
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    marginTop: tokens.spacing.xxl,
  },
});
