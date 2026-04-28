import React, { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Dimensions,
  Alert,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { tokens } from '@/constants/tokens';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { AppHeader } from '@/components/ui/AppHeader';

const { width } = Dimensions.get('window');

export default function CameraScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing] = useState<CameraType>('back');
  const cameraRef = useRef<CameraView>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.8,
        });
        if (photo?.base64) {
          const base64Image = `data:image/jpeg;base64,${photo.base64}`;
          router.push({
            pathname: '/scan/preview',
            params: { image: base64Image },
          });
        }
      } catch (error) {
        Alert.alert(t('common.error'), t('scan.capture_error'));
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]?.base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      router.push({
        pathname: '/scan/preview',
        params: { image: base64Image },
      });
    }
  };

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: tokens.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[tokens.typography.body, { color: tokens.colors.text }]}>{t('scan.loading_system')}</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: tokens.colors.background }]}>
        <AppHeader title="" showBack />
        <View style={styles.permissionContainer}>
          <MaterialIcons name="camera-alt" size={80} color={tokens.colors.primary500} style={{ marginBottom: tokens.spacing.xl }} />
          <Text style={[tokens.typography.heading, { color: tokens.colors.text, marginBottom: tokens.spacing.md, textAlign: 'center' }]}>
            {t('scan.camera_req_title')}
          </Text>
          <Text style={[tokens.typography.body, { color: tokens.colors.textSecondary, textAlign: 'center', marginBottom: tokens.spacing.xxl, paddingHorizontal: tokens.spacing.xl }]}>
            {t('scan.camera_req_desc')}
          </Text>
          <Button 
            title={t('scan.grant_perm')} 
            onPress={requestPermission} 
            size="large"
            style={{ width: '100%', marginBottom: tokens.spacing.md }}
          />
          <Button 
            title={t('scan.upload_gallery')} 
            onPress={pickImage} 
            variant="outline"
            size="large"
            style={{ width: '100%' }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        <View style={styles.overlay}>
          <AppHeader 
            title={t('scan.title')} 
            showBack 
            rightElement={<View style={{ width: 40 }} />}
          />

          <View style={styles.frameContainer}>
            <View style={styles.frame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <Text style={styles.hintText}>
              {t('scan.camera_hint')}
            </Text>
          </View>

          <View style={styles.controls}>
            <Pressable
              style={({ pressed }) => [styles.galleryButtonLarge, { opacity: pressed ? 0.7 : 1 }]}
              onPress={pickImage}
              hitSlop={16}
            >
              <MaterialIcons name="photo-library" size={32} color={tokens.colors.surface} />
            </Pressable>
            
            <Pressable
              style={({ pressed }) => [
                styles.captureButton, 
                { opacity: pressed || isCapturing ? 0.6 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }
              ]}
              onPress={takePicture}
              disabled={isCapturing}
            >
              <View style={styles.captureButtonInner} />
            </Pressable>
            
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: tokens.spacing.lg,
  },
  closeButton: {
    width: 48,
    height: 48,
    borderRadius: tokens.radius.full,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  frameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    width: width * 0.8,
    height: width * 0.8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    borderRadius: tokens.radius.xl,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: tokens.colors.surface,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 5,
    borderLeftWidth: 5,
    borderTopLeftRadius: tokens.radius.xl,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 5,
    borderRightWidth: 5,
    borderTopRightRadius: tokens.radius.xl,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 5,
    borderLeftWidth: 5,
    borderBottomLeftRadius: tokens.radius.xl,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 5,
    borderRightWidth: 5,
    borderBottomRightRadius: tokens.radius.xl,
  },
  hintText: {
    color: tokens.colors.surface,
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    marginTop: tokens.spacing.xl,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: tokens.spacing.xxl,
    paddingHorizontal: tokens.spacing.lg,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: tokens.colors.surface,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: tokens.colors.surface,
  },
  galleryButtonLarge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 56,
    height: 56,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xxl,
  },
});
