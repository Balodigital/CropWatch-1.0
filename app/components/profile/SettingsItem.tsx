import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { tokens } from '@/constants/tokens';
import { MaterialIcons } from '@expo/vector-icons';

interface SettingsItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  showChevron?: boolean;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  icon,
  title,
  subtitle,
  value,
  onPress,
  destructive = false,
  showChevron = true,
  rightIcon,
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { opacity: pressed ? 0.7 : 1 }
      ]}
      disabled={!onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: destructive ? tokens.colors.error50 : tokens.colors.primary50 }]}>
        <MaterialIcons 
          name={icon} 
          size={22} 
          color={destructive ? tokens.colors.error500 : tokens.colors.primary500} 
        />
      </View>
      
      <View style={styles.content}>
        <Text style={[tokens.typography.title, styles.title, destructive && { color: tokens.colors.error500 }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[tokens.typography.caption, styles.subtitle]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.rightContainer}>
        {value && (
          <Text style={[tokens.typography.caption, styles.value]}>{value}</Text>
        )}
        {rightIcon ? (
          <MaterialIcons name={rightIcon} size={24} color={destructive ? tokens.colors.error500 : tokens.colors.neutral400} />
        ) : showChevron && onPress ? (
          <MaterialIcons name="chevron-right" size={24} color={tokens.colors.neutral400} />
        ) : null}
      </View>
    </Pressable>
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
    minHeight: 64,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.md,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: tokens.colors.text,
  },
  subtitle: {
    color: tokens.colors.textSecondary,
    marginTop: 2,
    fontSize: 13,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    color: tokens.colors.textSecondary,
    marginRight: tokens.spacing.xs,
  },
});
