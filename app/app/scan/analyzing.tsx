import { useEffect, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/constants/tokens';
import { submitDiagnosis } from '@/lib/api';
import { OfflineStorage } from '@/lib/offline';
import { AppHeader } from '@/components/ui/AppHeader';
import { optimizeImageForUpload } from '@/lib/images';

export default function AnalyzingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { image, cropType, description, pendingId } = useLocalSearchParams<{
    image: string;
    cropType: string;
    description?: string;
    pendingId?: string;
  }>();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    pulseAnimation.start();
    rotateAnimation.start();

    return () => {
      pulseAnimation.stop();
      rotateAnimation.stop();
    };
  }, []);

  useEffect(() => {
    runAnalysis();
  }, []);

  const runAnalysis = async () => {
    try {
      // Optimize image here if it's a URI (not already base64)
      let finalImage = image || '';
      if (finalImage && !finalImage.startsWith('data:image/')) {
        finalImage = await optimizeImageForUpload(finalImage);
      }

      const result = await submitDiagnosis(
        finalImage,
        description || '',
        cropType || ''
      );

      if (result.success && pendingId) {
        await OfflineStorage.removePendingScan(pendingId);
      }

      if (result.success) {
        if (result.offline) {
          router.replace({
            pathname: '/result/offline',
            params: {
              pendingScanId: result.pendingScanId,
              cropType,
            },
          });
        } else {
          router.replace({
            pathname: '/result',
            params: {
              diagnosis: JSON.stringify(result.diagnosis),
              cropType,
              image,
            },
          });
        }
      } else {
        router.replace({
          pathname: '/result/error',
          params: {
            error: result.error || t('common.error'),
          },
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      router.replace({
        pathname: '/result/error',
        params: {
            error: t('result.analysis_error'),
        },
      });
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <AppHeader title={t('scan.analyzing')} />
      <View style={styles.content}>
        <View style={styles.animationContainer}>
          <Animated.View
            style={[
              styles.outerRing,
              {
                backgroundColor: tokens.colors.primary50,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.innerRing,
              {
                backgroundColor: tokens.colors.primary50,
                transform: [{ rotate }],
              },
            ]}
          />
          <View style={[styles.centerIcon, { backgroundColor: tokens.colors.primary500 }]}>
            <Text style={styles.leafIcon}>🍃</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: tokens.colors.text }]}>{t('analyzing.status')}</Text>
        <Text style={[styles.subtitle, { color: tokens.colors.textSecondary }]}>
          {t('analyzing.desc')}
        </Text>

        <View style={styles.stepsContainer}>
          <StepItem
            step="1"
            text={t('analyzing.step_1')}
            isActive={true}
          />
          <StepItem
            step="2"
            text={t('analyzing.step_2')}
            isActive={true}
          />
          <StepItem
            step="3"
            text={t('analyzing.step_3')}
            isActive={false}
          />
        </View>
      </View>
    </View>
  );
}

function StepItem({
  step,
  text,
  isActive,
}: {
  step: string;
  text: string;
  isActive: boolean;
}) {
  return (
    <View style={styles.stepItem}>
      <View
        style={[
          styles.stepCircle,
          {
            backgroundColor: isActive ? tokens.colors.primary500 : tokens.colors.neutral200,
          },
        ]}
      >
        <Text
          style={[
            styles.stepText,
            { color: isActive ? tokens.colors.surface : tokens.colors.textSecondary },
          ]}
        >
          {step}
        </Text>
      </View>
      <Text
        style={[
          styles.stepLabel,
          { color: isActive ? tokens.colors.text : tokens.colors.textSecondary },
        ]}
      >
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
  },
  animationContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  outerRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: tokens.radius.full,
  },
  innerRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: tokens.colors.primary600,
  },
  centerIcon: {
    width: 80,
    height: 80,
    borderRadius: tokens.radius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...tokens.elevation.level2,
  },
  leafIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: tokens.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: tokens.spacing.xxl,
  },
  stepsContainer: {
    width: '100%',
    gap: tokens.spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.sm,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepLabel: {
    fontSize: 16,
  },
});
