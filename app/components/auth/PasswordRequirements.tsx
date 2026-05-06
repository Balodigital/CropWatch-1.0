import React from 'react';
import { View, Text, StyleSheet, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PasswordRequirement } from '@/hooks/use-password-validation';
import { useTranslation } from 'react-i18next';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface PasswordRequirementsProps {
  requirements: PasswordRequirement[];
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ requirements }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const { t } = useTranslation();

  const unmetRequirements = requirements.filter(req => !req.met);

  React.useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [unmetRequirements.length]);

  if (unmetRequirements.length === 0) return null;

  return (
    <View style={styles.container}>
      {unmetRequirements.map((req) => (
        <View key={req.id} style={styles.row}>
          <View style={styles.iconContainer}>
            <View style={[styles.dot, { backgroundColor: theme.muted }]} />
          </View>
          <Text 
            style={[
              Typography.bodySmall, 
              { color: theme.onSurfaceVariant }
            ]}
          >
            {t(req.label)}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconContainer: {
    width: 20,
    alignItems: 'center',
    marginRight: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
