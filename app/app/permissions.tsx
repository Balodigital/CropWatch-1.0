import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function PermissionsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);

  const requestPermissions = async () => {
    try {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      setCameraPermission(cameraStatus === 'granted');
      
      if (cameraStatus !== 'granted') {
        Alert.alert(
          t('permissions.required'),
          t('camera_permission'),
          [{ text: 'OK' }]
        );
        return;
      }

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Permission error:', error);
      router.replace('/(tabs)');
    }
  };

  const skipPermissions = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight + '20' }]}>
          <Text style={styles.icon}>📷</Text>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{t('permissions.title')}</Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {t('camera_permission')}
        </Text>

        <View style={styles.permissionsList}>
          <PermissionItem
            icon="📸"
            title={t('permissions.camera')}
            description={t('permissions.camera_desc')}
            colors={colors}
          />
          <PermissionItem
            icon="📁"
            title={t('permissions.library')}
            description={t('permissions.library_desc')}
            colors={colors}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={requestPermissions}
            activeOpacity={0.8}
          >
            <Text style={styles.primaryButtonText}>{t('permissions.allow')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.primary }]}
            onPress={skipPermissions}
            activeOpacity={0.8}
          >
            <Text style={[styles.secondaryButtonText, { color: colors.primary }]}>
              {t('permissions.skip')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

function PermissionItem({
  icon,
  title,
  description,
  colors
}: {
  icon: string;
  title: string;
  description: string;
  colors: typeof Colors.light;
}) {
  return (
    <View style={[styles.permissionItem, { backgroundColor: colors.surface }]}>
      <Text style={styles.permissionIcon}>{icon}</Text>
      <View style={styles.permissionTextContainer}>
        <Text style={[styles.permissionTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.permissionDescription, { color: colors.textSecondary }]}>
          {description}
        </Text>
      </View>
    </View>
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
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
    lineHeight: 24,
  },
  permissionsList: {
    width: '100%',
    gap: 12,
    marginBottom: 40,
  },
  permissionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  permissionIcon: {
    fontSize: 28,
    marginRight: 16,
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 13,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  secondaryButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
});
