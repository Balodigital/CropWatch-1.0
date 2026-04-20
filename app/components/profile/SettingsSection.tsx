import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens } from '@/constants/tokens';

interface SettingsSectionProps {
  title?: string;
  children: React.ReactNode;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => {
  return (
    <View style={styles.container}>
      {title && (
        <Text style={[tokens.typography.caption, styles.title]}>
          {title.toUpperCase()}
        </Text>
      )}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: tokens.spacing.xl,
  },
  title: {
    color: tokens.colors.textSecondary,
    marginBottom: tokens.spacing.sm,
    marginLeft: tokens.spacing.xs,
    letterSpacing: 1,
    fontWeight: '600',
  },
  content: {
    borderRadius: tokens.radius.lg,
    overflow: 'hidden',
    backgroundColor: tokens.colors.surface,
    ...tokens.elevation.level1,
  },
});
