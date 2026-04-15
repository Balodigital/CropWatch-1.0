import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

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
  const { crop } = useLocalSearchParams<{ crop: string }>();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const cropData = CROP_DETAILS[crop?.toLowerCase() || ''];

  if (!cropData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text }}>Crop not found</Text>
      </SafeAreaView>
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backButton, { color: colors.text }]}>← Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.titleCard, { backgroundColor: colors.primary }]}>
          <Text style={styles.cropIcon}>{getCropIcon(crop || '')}</Text>
          <Text style={styles.cropName}>
            {crop?.charAt(0).toUpperCase() + crop?.slice(1)}
          </Text>
          <Text style={styles.cropDescription}>{cropData.description}</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Common Diseases
        </Text>

        {cropData.diseases.map((disease, idx) => (
          <View
            key={idx}
            style={[styles.diseaseCard, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.diseaseName, { color: colors.text }]}>
              {disease.name}
            </Text>
            <View style={styles.diseaseSection}>
              <Text style={[styles.diseaseLabel, { color: colors.primary }]}>
                Symptoms
              </Text>
              <Text style={[styles.diseaseText, { color: colors.textSecondary }]}>
                {disease.symptoms}
              </Text>
            </View>
            <View style={styles.diseaseSection}>
              <Text style={[styles.diseaseLabel, { color: colors.primary }]}>
                Treatment
              </Text>
              <Text style={[styles.diseaseText, { color: colors.textSecondary }]}>
                {disease.treatment}
              </Text>
            </View>
          </View>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Farming Tips
        </Text>

        <View style={[styles.tipsCard, { backgroundColor: colors.surface }]}>
          {cropData.tips.map((tip, idx) => (
            <View key={idx} style={styles.tipItem}>
              <Text style={styles.tipBullet}>•</Text>
              <Text style={[styles.tipText, { color: colors.textSecondary }]}>
                {tip}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  titleCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  cropIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  cropName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  cropDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  diseaseCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  diseaseSection: {
    marginBottom: 8,
  },
  diseaseLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  diseaseText: {
    fontSize: 13,
    lineHeight: 18,
  },
  tipsCard: {
    padding: 16,
    borderRadius: 12,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 14,
    marginRight: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
});
