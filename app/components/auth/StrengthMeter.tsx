import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StrengthLevel } from '@/hooks/use-password-validation';
import { useTranslation } from 'react-i18next';

interface StrengthMeterProps {
  strength: StrengthLevel;
}

export const StrengthMeter: React.FC<StrengthMeterProps> = ({ strength }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { t } = useTranslation();

  const getStrengthConfig = () => {
    switch (strength) {
      case 'Weak':
        return { color: theme.error, percentage: 33, label: t('auth.password.weak') };
      case 'Medium':
        return { color: theme.warning, percentage: 66, label: t('auth.password.medium') };
      case 'Strong':
        return { color: theme.success, percentage: 100, label: t('auth.password.strong') };
      default:
        return { color: theme.muted, percentage: 0, label: '' };
    }
  };

  const config = getStrengthConfig();

  if (!strength) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[Typography.labelSmall, { color: theme.onSurfaceVariant }]}>
          {t('auth.password.strength_label')}
        </Text>
        <Text style={[Typography.labelSmall, { color: config.color, fontWeight: '700' }]}>
          {config.label}
        </Text>
      </View>
      <View style={[styles.barContainer, { backgroundColor: theme.surfaceVariant }]}>
        <View 
          style={[
            styles.bar, 
            { 
              backgroundColor: config.color, 
              width: `${config.percentage}%` 
            }
          ]} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  barContainer: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 2,
  },
});
