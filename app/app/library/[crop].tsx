import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/constants/tokens';
import { AppHeader } from '@/components/ui/AppHeader';
import { CROP_IMAGES } from '@/lib/supabase';

const CROP_DETAILS: Record<string, {
  description: string;
  diseases: { name: string; symptoms: string; treatment: string }[];
  tips: string[];
}> = {
  tomato: {
    description: 'Tomatoes are one of the most widely cultivated vegetables in Nigeria. They are rich in vitamins A and C.',
    diseases: [
      {
        name: 'Early Blight',
        symptoms: 'Brown spots with concentric rings on leaves, starting from lower leaves.',
        treatment: 'Remove affected leaves. Apply neem oil spray or copper-based fungicide.'
      },
      {
        name: 'Septoria Leaf Spot',
        symptoms: 'Small dark spots with lighter centers on leaves.',
        treatment: 'Apply wood ash or neem oil spray. Ensure good air circulation.'
      },
      {
        name: 'Fusarium Wilt',
        symptoms: 'Yellowing and wilting starting from lower leaves, often one-sided.',
        treatment: 'Remove infected plants. Use resistant varieties for next planting.'
      }
    ],
    tips: [
      'Plant during dry season for best results',
      'Use stakes or cages to keep fruits off ground',
      'Water at the base to avoid leaf wetness'
    ]
  },
  cassava: {
    description: 'Cassava is a major staple crop in Nigeria, providing carbohydrates for millions. It is drought-resistant.',
    diseases: [
      {
        name: 'Cassava Mosaic Disease',
        symptoms: 'Twisted and mottled leaves with yellow and green patterns.',
        treatment: 'Rogue (remove and burn) infected plants immediately. Use disease-free stems.'
      },
      {
        name: 'Cassava Brown Streak Disease',
        symptoms: 'Brown lesions on stems, necrosis in roots.',
        treatment: 'Use resistant varieties. Remove infected plants.'
      },
      {
        name: 'Bacterial Blight',
        symptoms: 'Water-soaked angular leaf spots that turn brown.',
        treatment: 'Rogue infected plants. Practice crop rotation.'
      }
    ],
    tips: [
      'Use clean planting stakes from healthy plants',
      'Plant early at start of rainy season',
      'Cassava matures in 8-12 months'
    ]
  },
  maize: {
    description: 'Maize (corn) is Nigeria\'s most important cereal crop, used for food, feed, and industrial purposes.',
    diseases: [
      {
        name: 'Maize Streak Virus',
        symptoms: 'White to yellowish streaking on leaves.',
        treatment: 'Remove infected plants. No cure for infected crops.'
      },
      {
        name: 'Northern Leaf Blight',
        symptoms: 'Large cigar-shaped grayish-green lesions.',
        treatment: 'Apply neem oil or fungicide. Use resistant varieties.'
      },
      {
        name: 'Fall Armyworm',
        symptoms: 'Large irregular holes in leaves, frass (droppings) in whorl.',
        treatment: 'Apply neem oil spray. Hand-pick worms in severe cases.'
      }
    ],
    tips: [
      'Plant early with first rains',
      'Intercrop with legumes for nitrogen fixation',
      'Harvest when tassels turn brown'
    ]
  },
  pepper: {
    description: 'Pepper is widely cultivated in Nigeria for its pungent fruits used in cooking and condiments.',
    diseases: [
      {
        name: 'Anthracnose',
        symptoms: 'Sunken dark lesions on fruits, often with pink spore masses.',
        treatment: 'Remove infected fruits. Apply neem oil or copper fungicide.'
      },
      {
        name: 'Bacterial Leaf Spot',
        symptoms: 'Small brown spots on leaves, leading to defoliation.',
        treatment: 'Remove infected leaves. Avoid overhead watering.'
      },
      {
        name: 'Pepper Mosaic Virus',
        symptoms: 'Mottled yellow and green patterns on leaves.',
        treatment: 'Remove infected plants. Control aphid vectors.'
      }
    ],
    tips: [
      'Bell peppers need 60-90 days to mature',
      'Habanero peppers are more disease resistant',
      'Support plants with stakes to prevent fruit rot'
    ]
  },
  rice: {
    description: 'Rice is a major staple food in Nigeria. Upland and lowland varieties are grown across the country.',
    diseases: [
      {
        name: 'Rice Blast',
        symptoms: 'Diamond-shaped lesions with grey centers on leaves.',
        treatment: 'Apply neem oil or fungicide. Avoid excessive nitrogen.'
      },
      {
        name: 'Bacterial Leaf Blight',
        symptoms: 'Yellowing to white streaks from leaf tips down.',
        treatment: 'Use certified seeds. Apply balanced fertilizers.'
      },
      {
        name: 'Sheath Blight',
        symptoms: 'Greenish-grey oval lesions on leaf sheaths.',
        treatment: 'Reduce plant density. Apply fungicide if severe.'
      }
    ],
    tips: [
      'Use improved seed varieties',
      'Maintain proper water management',
      'Apply nitrogen in split doses'
    ]
  },
  yam: {
    description: 'Yam is a crucial staple crop in Nigeria, with the country being one of the world\'s largest producers.',
    diseases: [
      {
        name: 'Yam Anthracnose',
        symptoms: 'Blackening of vines and dark sunken spots on leaves.',
        treatment: 'Apply neem oil spray. Remove infected plant parts.'
      },
      {
        name: 'Yam Mosaic Virus',
        symptoms: 'Chlorotic mottling and mosaic patterns on leaves.',
        treatment: 'Use healthy seed yams. Control aphid vectors.'
      },
      {
        name: 'Dry Rot',
        symptoms: 'Internal decay of tubers, often starting from cut surfaces.',
        treatment: 'Use healthy planting material. Cure tubers before storage.'
      }
    ],
    tips: [
      'Use healthy seed yams from trusted sources',
      'Plant at start of rainy season',
      'Harvest carefully to avoid tuber damage'
    ]
  },
  cowpea: {
    description: 'Cowpea (black-eyed peas) is a nitrogen-fixing legume important for food security and soil health.',
    diseases: [
      {
        name: 'Cercospora Leaf Spot',
        symptoms: 'Red-brown circular spots on leaves.',
        treatment: 'Apply neem oil. Remove infected leaves.'
      },
      {
        name: 'Cowpea Rust',
        symptoms: 'Small reddish-brown pustules on leaves and stems.',
        treatment: 'Use resistant varieties. Apply sulfur-based fungicide.'
      },
      {
        name: 'Cowpea Mosaic Virus',
        symptoms: 'Mottled light and dark green patterns on leaves.',
        treatment: 'Remove infected plants. Control aphid vectors.'
      }
    ],
    tips: [
      'Plant early to avoid peak disease pressure',
      'Space plants well for air circulation',
      'Cowpea improves soil fertility'
    ]
  },
  cocoa: {
    description: 'Cocoa is a major export crop in Nigeria, grown primarily in the southern rainforest regions.',
    diseases: [
      {
        name: 'Black Pod Disease',
        symptoms: 'Brown/black rotting pods starting from the stalk.',
        treatment: 'Remove infected pods. Apply copper-based spray if severe.'
      },
      {
        name: 'Cocoa Swollen Shoot Virus',
        symptoms: 'Swelling of stems and roots, leaf discoloration.',
        treatment: 'Remove and destroy infected trees. No cure available.'
      },
      {
        name: 'Witches\' Broom',
        symptoms: 'Mass of abnormal shoot growth, often broom-like.',
        treatment: 'Prune infected branches. Remove severely affected trees.'
      }
    ],
    tips: [
      'Shade trees help reduce pod rot',
      'Regular harvesting prevents disease spread',
      'Prune regularly for good air circulation'
    ]
  }
};

export default function CropDetailScreen() {
  const router = useRouter();
  const { crop, image, name } = useLocalSearchParams<{ 
    crop: string; 
    image: string;
    name: string;
  }>();
  const { t } = useTranslation();

  const cropData = CROP_DETAILS[crop?.toLowerCase() || ''];
  const cropTitle = crop ? crop.charAt(0).toUpperCase() + crop.slice(1) : 'Crop Detail';

  if (!cropData) {
    return (
      <View style={styles.container}>
        <AppHeader title="Crop Not Found" />
        <View style={styles.centerContent}>
          <Text style={[tokens.typography.body, { color: tokens.colors.text }]}>Crop not found</Text>
        </View>
      </View>
    );
  }

  const getCropIcon = (c: string) => {
    const icons: Record<string, string> = {
      tomato: '🍅', cassava: '🫚', maize: '🌽', pepper: '🌶️',
      rice: '🍚', yam: '🍠', cowpea: '🫘', cocoa: '🍫'
    };
    return icons[c.toLowerCase()] || '🌱';
  };

  return (
    <View style={styles.container}>
      <AppHeader title={cropTitle} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.titleCard, { backgroundColor: tokens.colors.surface }]}>
          <View style={[styles.imageContainer, { backgroundColor: tokens.colors.primary50 }]}>
            <Image 
              source={(() => {
                if (image) {
                  if (typeof image === 'string') {
                    if (image.startsWith('http')) {
                      return { uri: image };
                    }
                    const assetId = parseInt(image, 10);
                    if (!isNaN(assetId)) {
                      return assetId;
                    }
                  }
                }
                // Fallback to centralized images
                return CROP_IMAGES[crop?.toLowerCase() || ''] || { uri: 'https://via.placeholder.com/400' };
              })()} 
              style={styles.cropImage}
              resizeMode="contain"
            />
          </View>
          <Text style={[styles.cropName, { color: tokens.colors.text }]}>
            {name || (crop ? crop.charAt(0).toUpperCase() + crop.slice(1) : 'Crop Detail')}
          </Text>
          <Text style={[styles.cropDescription, { color: tokens.colors.textSecondary }]}>{cropData.description}</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: tokens.colors.text }]}>
          Common Diseases
        </Text>

        {cropData.diseases.map((disease, idx) => (
          <View
            key={idx}
            style={[styles.diseaseCard, { backgroundColor: tokens.colors.surface }]}
          >
            <Text style={[styles.diseaseName, { color: tokens.colors.text }]}>
              {disease.name}
            </Text>
            <View style={styles.diseaseSection}>
              <Text style={[styles.diseaseLabel, { color: tokens.colors.primary500 }]}>
                Symptoms
              </Text>
              <Text style={[styles.diseaseText, { color: tokens.colors.textSecondary }]}>
                {disease.symptoms}
              </Text>
            </View>
            <View style={styles.diseaseSection}>
              <Text style={[styles.diseaseLabel, { color: tokens.colors.primary500 }]}>
                Treatment
              </Text>
              <Text style={[styles.diseaseText, { color: tokens.colors.textSecondary }]}>
                {disease.treatment}
              </Text>
            </View>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { color: tokens.colors.text }]}>
          Farming Tips
        </Text>

        <View style={[styles.tipsCard, { backgroundColor: tokens.colors.surface }]}>
          {cropData.tips.map((tip, idx) => (
            <View key={idx} style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={[styles.tipText, { color: tokens.colors.textSecondary }]}>
                {tip}
              </Text>
            </View>
          ))}
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: tokens.spacing.md,
    paddingBottom: tokens.spacing.xxl,
  },
  titleCard: {
    padding: tokens.spacing.xl,
    borderRadius: tokens.radius.lg,
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
    ...tokens.elevation.level1,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.md,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.sm,
  },
  cropImage: {
    width: '100%',
    height: '100%',
    aspectRatio: 1,
  },
  cropName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: tokens.spacing.xs,
  },
  cropDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: tokens.spacing.sm,
  },
  diseaseCard: {
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.md,
    backgroundColor: tokens.colors.surface,
    ...tokens.elevation.level1,
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: tokens.spacing.sm,
  },
  diseaseSection: {
    marginBottom: tokens.spacing.sm,
  },
  diseaseLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    color: tokens.colors.primary500,
  },
  diseaseText: {
    fontSize: 13,
    lineHeight: 18,
    color: tokens.colors.textSecondary,
  },
  tipsCard: {
    padding: tokens.spacing.md,
    borderRadius: tokens.radius.md,
    backgroundColor: tokens.colors.surface,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: tokens.spacing.sm,
  },
  tipBullet: {
    fontSize: 14,
    marginRight: tokens.spacing.sm,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: tokens.colors.textSecondary,
  },
});
