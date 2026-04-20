import { useRouter } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { CROPS_DATA } from '@/lib/supabase';

const CROP_IMAGES: Record<string, any> = {
  tomato: require('@/assets/images/crops/tomato.png'),
  cassava: require('@/assets/images/crops/cassava.png'),
  maize: require('@/assets/images/crops/maize.png'),
  pepper: require('@/assets/images/crops/pepper.png'),
  rice: require('@/assets/images/crops/rice.png'),
  yam: require('@/assets/images/crops/yam.png'),
  cowpea: require('@/assets/images/crops/cowpea.png'),
  cocoa: require('@/assets/images/crops/cocoa.png'),
};

export default function LibraryScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCrops = CROPS_DATA.filter(crop =>
    crop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            {
              backgroundColor: colors.surface,
              color: colors.text,
              borderColor: colors.textSecondary + '30',
            },
          ]}
          placeholder="Search crops..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Supported Crops ({filteredCrops.length})
        </Text>

        {filteredCrops.map((crop) => (
          <TouchableOpacity
            key={crop.id}
            style={[styles.cropCard, { backgroundColor: colors.surface }]}
            onPress={() => router.push(`/library/${crop.dataset_context}`)}
            activeOpacity={0.7}
          >
            <View style={[styles.imageContainer, { backgroundColor: colors.surfaceVariant }]}>
              <Image 
                source={CROP_IMAGES[crop.dataset_context] || { uri: crop.image }} 
                style={styles.cropImage}
                resizeMode="contain"
              />
            </View>
            <View style={styles.cropContent}>
              <Text style={[styles.cropName, { color: colors.text }]}>{crop.name}</Text>
              <Text style={[styles.cropContext, { color: colors.textSecondary }]}>
                {getCropDescription(crop.dataset_context)}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <View style={styles.infoContent}>
            <Text style={[styles.infoTitle, { color: colors.text }]}>
              More Crops Coming Soon
            </Text>
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
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
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  searchInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  cropCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
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
    color: '#999',
  },
  infoCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#f0f8ff',
    borderRadius: 12,
    marginTop: 12,
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
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
