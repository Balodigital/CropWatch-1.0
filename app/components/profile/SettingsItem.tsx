import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { tokens } from '@/constants/tokens';
import { MaterialIcons } from '@expo/vector-icons';

interface SettingsItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showArrow?: boolean;
  destructive?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  onPress,
  rightElement,
  showArrow = true,
  destructive = false,
}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, destructive && styles.destructiveIconContainer]}>
        <MaterialIcons 
          name={icon} 
          size={24} 
          color={destructive ? tokens.colors.error500 : tokens.colors.primary500} 
        />
      </View>
      
      <View style={styles.content}>
        <Text style={[tokens.typography.title, styles.title, destructive && styles.destructiveText]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[tokens.typography.caption, styles.subtitle]}>
            {subtitle}
          </Text>
        )}
      </View>

      {rightElement}
      {showArrow && !rightElement && (
        <MaterialIcons name="chevron-right" size={24} color={tokens.colors.neutral400} />
      )}
    </TouchableOpacity>
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
  destructiveIconContainer: {
    backgroundColor: tokens.colors.error100,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: tokens.colors.text,
  },
  destructiveText: {
    color: tokens.colors.error500,
  },
  subtitle: {
    color: tokens.colors.textSecondary,
    marginTop: 2,
    fontSize: 13,
  },
});
