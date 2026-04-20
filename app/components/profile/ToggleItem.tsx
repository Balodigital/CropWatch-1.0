import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { tokens } from '@/constants/tokens';
import { MaterialIcons } from '@expo/vector-icons';

interface ToggleItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

export const ToggleItem: React.FC<ToggleItemProps> = ({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={24} color={tokens.colors.primary500} />
      </View>
      
      <View style={styles.content}>
        <Text style={[tokens.typography.title, styles.title]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[tokens.typography.caption, styles.subtitle]}>
            {subtitle}
          </Text>
        )}
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: tokens.colors.neutral300, true: tokens.colors.primary200 }}
        thumbColor={value ? tokens.colors.primary500 : tokens.colors.neutral100}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.lg,
    backgroundColor: tokens.colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: tokens.colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: tokens.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
    backgroundColor: tokens.colors.primary50,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: tokens.colors.text,
  },
  subtitle: {
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
});
