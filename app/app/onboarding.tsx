import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Dimensions, 
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Camera, Cpu, ShieldCheck } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
  {
    id: '1',
    titleKey: 'onboarding.slide1_title',
    descriptionKey: 'onboarding.slide1_desc',
    icon: Camera,
  },
  {
    id: '2',
    titleKey: 'onboarding.slide2_title',
    descriptionKey: 'onboarding.slide2_desc',
    icon: Cpu,
  },
  {
    id: '3',
    titleKey: 'onboarding.slide3_title',
    descriptionKey: 'onboarding.slide3_desc',
    icon: ShieldCheck,
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const flatListRef = useRef<FlatList>(null);
  const { setOnboardingFinished } = useAuth();
  const { t } = useTranslation();

  const handleNext = async () => {
    if (currentIndex < ONBOARDING_DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ 
        index: currentIndex + 1,
        animated: true 
      });
    } else {
      await setOnboardingFinished(true);
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = async () => {
    await setOnboardingFinished(true);
    router.replace('/(auth)/login');
  };

  const renderItem = ({ item }: { item: typeof ONBOARDING_DATA[0] }) => {
    const Icon = item.icon;
    return (
      <View style={[styles.slide, { width }]}>
        <View style={[styles.iconContainer, { backgroundColor: theme.primaryContainer }]}>
          <Icon size={120} color={theme.primary} strokeWidth={1.5} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[Typography.displaySmall, { color: theme.onSurface, textAlign: 'center' }]}>
            {t(item.titleKey)}
          </Text>
          <Text style={[Typography.bodyLarge, { color: theme.onSurfaceVariant, textAlign: 'center', marginTop: 16 }]}>
            {t(item.descriptionKey)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={[Typography.labelLarge, { color: theme.primary }]}>{t('onboarding.skip')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={ONBOARDING_DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const x = e.nativeEvent.contentOffset.x;
          setCurrentIndex(Math.round(x / width));
        }}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      <View style={styles.footer}>
        <View style={styles.pagination}>
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === currentIndex ? theme.primary : theme.outline,
                  width: index === currentIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <Button
          title={currentIndex === ONBOARDING_DATA.length - 1 ? t('onboarding.get_started') : t('onboarding.next')}
          onPress={handleNext}
          style={styles.nextButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    alignItems: 'flex-end',
  },
  skipButton: {
    padding: 8,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 240,
    height: 240,
    borderRadius: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  textContainer: {
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    width: '100%',
  },
});
