import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, Pressable, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/constants/tokens';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function PreviewScreen() {
  const router = useRouter();
  const { image } = useLocalSearchParams<{ image: string }>();
  const { t } = useTranslation();

  const handleContinue = () => {
    router.replace({
      pathname: '/scan/crop-select',
      params: { image },
    });
  };

  const handleRetake = () => {
    router.back();
  };

  if (!image) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <MaterialIcons name="error-outline" size={64} color={tokens.colors.neutral400} style={{ marginBottom: tokens.spacing.md }} />
        <Text style={[tokens.typography.title, { color: tokens.colors.text }]}>No image captured</Text>
        <Button 
          title="Go Back"
          onPress={handleRetake}
          variant="outline"
          style={{ marginTop: tokens.spacing.lg, minWidth: 200 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          onPress={() => router.back()} 
          hitSlop={12}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <MaterialIcons name="arrow-back" size={24} color={tokens.colors.text} />
        </Pressable>
        <Text style={[tokens.typography.title, { color: tokens.colors.text }]}>Preview</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.imageContainer}>
        <Image source={{ uri: image }} style={styles.previewImage} />
      </View>

      <Card style={styles.tipContainer} elevation="level1">
        <MaterialIcons name="lightbulb" size={24} color={tokens.colors.warning500} style={{ marginRight: tokens.spacing.md }} />
        <Text style={[tokens.typography.body, { color: tokens.colors.textSecondary, flex: 1 }]}>
          Make sure the leaf is clearly visible and well-lit for the most accurate AI diagnosis.
        </Text>
      </Card>

      <View style={styles.buttonContainer}>
        <Button
          title="Retake"
          onPress={handleRetake}
          variant="outline"
          style={{ flex: 1 }}
        />
        <Button
          title="Continue"
          onPress={handleContinue}
          variant="primary"
          icon={<MaterialIcons name="check" size={20} color={tokens.colors.surface} />}
          style={{ flex: 2 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: tokens.spacing.md,
  },
  imageContainer: {
    flex: 1,
    padding: tokens.spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: tokens.radius.xl,
    resizeMode: 'cover',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
    padding: tokens.spacing.md,
    backgroundColor: tokens.colors.warning500 + '15', // subtle warning background
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: tokens.spacing.lg,
    gap: tokens.spacing.md,
    paddingBottom: tokens.spacing.xxl,
  },
});
