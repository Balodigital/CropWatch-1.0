import { useEffect, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet, View, Text, Animated, Easing } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { submitDiagnosis } from '@/lib/api';

export default function AnalyzingScreen() {
  const router = useRouter();
  const { image, cropType, description } = useLocalSearchParams<{
    image: string;
    cropType: string;
    description?: string;
  }>();
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
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
      const result = await submitDiagnosis(
        image || '',
        description || '',
        cropType || ''
      );

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
            error: result.error || 'Unknown error occurred',
          },
        });
      }
    } catch (error) {
      console.error('Analysis error:', error);
      router.replace({
        pathname: '/result/error',
        params: {
          error: 'Failed to analyze. Please try again.',
        },
      });
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.animationContainer}>
          <Animated.View
            style={[
              styles.outerRing,
              {
                backgroundColor: colors.primary + '20',
                transform: [{ scale: pulseAnim }],
              },
            ]}
          />
          <Animated.View
            style={[
              styles.innerRing,
              {
                backgroundColor: colors.primary + '40',
                transform: [{ rotate }],
              },
            ]}
          />
          <View style={[styles.centerIcon, { backgroundColor: colors.primary }]}>
            <Text style={styles.leafIcon}>🍃</Text>
          </View>
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Analyzing...</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Our AI is examining your crop leaf
        </Text>

        <View style={styles.stepsContainer}>
          <StepItem
            step="1"
            text="Processing image"
            isActive={true}
            colors={colors}
          />
          <StepItem
            step="2"
            text="Identifying symptoms"
            isActive={true}
            colors={colors}
          />
          <StepItem
            step="3"
            text="Matching diseases"
            isActive={false}
            colors={colors}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

function StepItem({
  step,
  text,
  isActive,
  colors,
}: {
  step: string;
  text: string;
  isActive: boolean;
  colors: typeof Colors.light;
}) {
  return (
    <View style={styles.stepItem}>
      <View
        style={[
          styles.stepCircle,
          {
            backgroundColor: isActive ? colors.primary : colors.textSecondary + '30',
          },
        ]}
      >
        <Text
          style={[
            styles.stepText,
            { color: isActive ? '#fff' : colors.textSecondary },
          ]}
        >
          {step}
        </Text>
      </View>
      <Text
        style={[
          styles.stepLabel,
          { color: isActive ? colors.text : colors.textSecondary },
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
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  animationContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  outerRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  innerRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#2c6a4f',
  },
  centerIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leafIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 48,
  },
  stepsContainer: {
    width: '100%',
    gap: 16,
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
    marginRight: 12,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '600',
  },
  stepLabel: {
    fontSize: 16,
  },
});
