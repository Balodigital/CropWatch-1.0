import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/constants/tokens';
import { CROPS_DATA, CROP_IMAGES } from '@/lib/supabase';
import { AppHeader } from '@/components/ui/AppHeader';

export default function LibraryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCrops = CROPS_DATA.filter(crop =>
    crop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <AppHeader title={t('tabs.library')} showBack={false} />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search crops..."
          placeholderTextColor={tokens.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: tokens.colors.text }]}>
          Supported Crops ({filteredCrops.length})
        </Text>

        {filteredCrops.map((crop) => (
          <TouchableOpacity
            key={crop.id}
            style={[styles.cropCard, { backgroundColor: tokens.colors.surface }]}
            onPress={() => router.push({
              pathname: `/library/${crop.dataset_context}`,
              params: { 
                image: crop.asset || crop.image,
                name: crop.name
              }
            })}
            activeOpacity={0.7}
          >
            <View style={[styles.imageContainer, { backgroundColor: tokens.colors.primary50 }]}>
              <Image 
                source={CROP_IMAGES[crop.dataset_context] || { uri: crop.image }} 
                style={styles.cropImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.cropContent}>
              <Text style={[styles.cropName, { color: tokens.colors.text }]}>{crop.name}</Text>
              <Text style={[styles.cropContext, { color: tokens.colors.textSecondary }]}>
                {getCropDescription(crop.dataset_context)}
              </Text>
            </View>
            <Text style={[styles.chevron, { color: tokens.colors.neutral400 }]}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={[styles.infoCard, { backgroundColor: tokens.colors.primary50 }]}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: tokens.colors.text }]}>
              More Crops Coming Soon
            </Text>
            <Text style={[styles.infoText, { color: tokens.colors.textSecondary }]}>
              We're constantly adding support for more crops. Stay updated with our latest releases.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function getCropDescription(cropType: string): string {
  const descriptions: Record<string, string> = {
    tomato: 'Early Blight, Septoria Leaf Spot, Fusarium Wilt',
    cassava: 'Cassava Mosaic Disease, Brown Streak Disease',
    maize: 'Maize Streak Virus, Northern Leaf Blight, Fall Armyworm',
    pepper: 'Anthracnose, Bacterial Leaf Spot, Mosaic Virus',
    rice: 'Rice Blast, Bacterial Leaf Blight, Sheath Blight',
    yam: 'Yam Anthracnose, Mosaic Virus, Dry Rot',
    cowpea: 'Cercospora Leaf Spot, Rust, Mosaic Virus',
    cocoa: 'Black Pod Disease, Swollen Shoot Virus, Witches Broom',
  };
  return descriptions[cropType] || 'Common diseases in Nigeria';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  searchContainer: {
    padding: tokens.spacing.md,
    paddingBottom: tokens.spacing.xs,
  },
  searchInput: {
    height: 48,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.md,
    fontSize: 16,
    borderWidth: 1,
    backgroundColor: tokens.colors.surface,
    color: tokens.colors.text,
    borderColor: tokens.colors.border,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: tokens.spacing.md,
    paddingTop: tokens.spacing.xs,
    paddingBottom: tokens.spacing.xxl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: tokens.spacing.sm,
  },
  cropCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.sm,
    borderRadius: tokens.radius.lg,
    marginBottom: tokens.spacing.md,
    ...tokens.elevation.level1,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: tokens.radius.md,
    marginRight: tokens.spacing.md,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xs,
  },
  cropImage: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
  },
  cropContent: {
    flex: 1,
  },
  cropName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cropContext: {
    fontSize: 13,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 24,
  },
  infoCard: {
    flexDirection: 'row',
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    marginTop: tokens.spacing.md,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: tokens.spacing.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
