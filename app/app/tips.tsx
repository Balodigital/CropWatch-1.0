import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput,
  SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { tokens } from '@/constants/tokens';
import { AppHeader } from '@/components/ui/AppHeader';
import { useTranslation } from 'react-i18next';

// --- Types ---
type Category = 'All' | 'Prevention' | 'Soil Health' | 'Watering' | 'Pest Control' | 'Harvesting';

interface Tip {
  id: string;
  title: string;
  description: string;
  category: Category;
  icon: keyof typeof MaterialIcons.glyphMap;
  relevance?: string;
}

const CATEGORIES: Category[] = ['All', 'Prevention', 'Soil Health', 'Watering', 'Pest Control', 'Harvesting'];

// --- Components ---

const TipCard = ({ tip }: { tip: Tip }) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity style={styles.cardContainer} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={tip.icon} size={28} color={tokens.colors.primary500} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={1}>{tip.title}</Text>
        <Text style={styles.cardDescription} numberOfLines={2}>{tip.description}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.tagBadge}>
            <Text style={styles.tagText}>{t(`tips_screen.categories.${tip.category}`)}</Text>
          </View>
          {tip.relevance && (
            <Text style={styles.relevanceText}>{tip.relevance}</Text>
          )}
        </View>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={tokens.colors.neutral400} />
    </TouchableOpacity>
  );
};

export default function TipsScreen() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');

  const TIPS_DATA: Tip[] = useMemo(() => [
    {
      id: '1',
      title: t('tips_screen.tips.tip1_title'),
      description: t('tips_screen.tips.tip1_desc'),
      category: 'Watering',
      icon: 'water-drop',
      relevance: t('tips_screen.tips.tip1_rel'),
    },
    {
      id: '2',
      title: t('tips_screen.tips.tip2_title'),
      description: t('tips_screen.tips.tip2_desc'),
      category: 'Soil Health',
      icon: 'autorenew',
      relevance: t('tips_screen.tips.tip2_rel'),
    },
    {
      id: '3',
      title: t('tips_screen.tips.tip3_title'),
      description: t('tips_screen.tips.tip3_desc'),
      category: 'Prevention',
      icon: 'search',
    },
    {
      id: '4',
      title: t('tips_screen.tips.tip4_title'),
      description: t('tips_screen.tips.tip4_desc'),
      category: 'Pest Control',
      icon: 'bug-report',
    },
    {
      id: '5',
      title: t('tips_screen.tips.tip5_title'),
      description: t('tips_screen.tips.tip5_desc'),
      category: 'Soil Health',
      icon: 'grass',
      relevance: t('tips_screen.tips.tip5_rel'),
    },
    {
      id: '6',
      title: t('tips_screen.tips.tip6_title'),
      description: t('tips_screen.tips.tip6_desc'),
      category: 'Harvesting',
      icon: 'wb-sunny',
    },
  ], [t]);

  const filteredTips = useMemo(() => {
    return TIPS_DATA.filter((tip) => {
      const matchesSearch = 
        tip.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        tip.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || tip.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory, TIPS_DATA]);

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <MaterialIcons name="lightbulb-outline" size={64} color={tokens.colors.neutral300} />
      <Text style={styles.emptyStateTitle}>{t('tips_screen.empty_title')}</Text>
      <Text style={styles.emptyStateSubtext}>{t('tips_screen.empty_subtext')}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader title={t('tips_screen.title')} showBack={true} />
      
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <MaterialIcons name="search" size={24} color={tokens.colors.neutral600} />
            <TextInput
              style={styles.searchInput}
              placeholder={t('tips_screen.search_placeholder')}
              placeholderTextColor={tokens.colors.neutral500}
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={CATEGORIES}
            keyExtractor={(item) => item}
            contentContainerStyle={styles.categoriesList}
            renderItem={({ item }) => {
              const isSelected = item === selectedCategory;
              return (
                <TouchableOpacity
                  style={[
                    styles.categoryChip,
                    isSelected && styles.categoryChipSelected
                  ]}
                  onPress={() => setSelectedCategory(item)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.categoryText,
                    isSelected && styles.categoryTextSelected
                  ]}>
                    {t(`tips_screen.categories.${item}`)}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Tips List */}
        <FlatList
          data={filteredTips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => <TipCard tip={item} />}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  container: {
    flex: 1,
  },
  searchSection: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    backgroundColor: tokens.colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: tokens.colors.border,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.neutral100,
    borderRadius: tokens.radius.full,
    paddingHorizontal: tokens.spacing.md,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: tokens.spacing.sm,
    ...tokens.typography.body,
    color: tokens.colors.text,
  },
  categoriesSection: {
    backgroundColor: tokens.colors.background,
    paddingVertical: tokens.spacing.md,
  },
  categoriesList: {
    paddingHorizontal: tokens.spacing.lg,
    gap: tokens.spacing.sm,
  },
  categoryChip: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  categoryChipSelected: {
    backgroundColor: tokens.colors.primary500,
    borderColor: tokens.colors.primary500,
  },
  categoryText: {
    ...tokens.typography.caption,
    fontWeight: '500',
    color: tokens.colors.textSecondary,
  },
  categoryTextSelected: {
    color: tokens.colors.surface,
  },
  listContent: {
    paddingHorizontal: tokens.spacing.lg,
    paddingBottom: tokens.spacing.xxl,
    gap: tokens.spacing.md,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    ...tokens.elevation.level1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: tokens.radius.full,
    backgroundColor: tokens.colors.primary50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
  },
  cardContent: {
    flex: 1,
    marginRight: tokens.spacing.sm,
  },
  cardTitle: {
    ...tokens.typography.title,
    fontSize: 16,
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
  },
  cardDescription: {
    ...tokens.typography.body,
    fontSize: 14,
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.sm,
    flexWrap: 'wrap',
  },
  tagBadge: {
    backgroundColor: tokens.colors.neutral100,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 2,
    borderRadius: tokens.radius.sm,
  },
  tagText: {
    ...tokens.typography.caption,
    fontSize: 12,
    color: tokens.colors.neutral700,
    fontWeight: '500',
  },
  relevanceText: {
    ...tokens.typography.caption,
    fontSize: 12,
    color: tokens.colors.primary500,
    fontStyle: 'italic',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.xxl * 2,
    paddingHorizontal: tokens.spacing.xl,
  },
  emptyStateTitle: {
    ...tokens.typography.title,
    color: tokens.colors.text,
    marginTop: tokens.spacing.md,
    marginBottom: tokens.spacing.xs,
  },
  emptyStateSubtext: {
    ...tokens.typography.body,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
  },
});
