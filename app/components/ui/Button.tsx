import React, { FC } from 'react';
import { 
  Pressable, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle,
  Platform,
  View
} from 'react-native';
import { tokens } from '@/constants/tokens';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return tokens.colors.neutral200;
    switch (variant) {
      case 'primary': return tokens.colors.primary500;
      case 'secondary': return tokens.colors.neutral100;
      case 'outline':
      case 'ghost': return 'transparent';
      default: return tokens.colors.primary500;
    }
  };

  const getTextColor = () => {
    if (disabled) return tokens.colors.neutral400;
    switch (variant) {
      case 'primary': return tokens.colors.surface;
      case 'secondary': return tokens.colors.text;
      case 'outline': return tokens.colors.primary500;
      case 'ghost': return tokens.colors.primary500;
      default: return tokens.colors.surface;
    }
  };

  const getHeight = () => {
    switch (size) {
      case 'small': return 40; // Material allows 40px for dense UIs
      case 'medium': return 48; // Material standard touch target
      case 'large': return 56; // Material prominent touch target
      default: return 48;
    }
  };

  const getPaddingHorizontal = () => {
    switch (size) {
      case 'small': return tokens.spacing.md;
      case 'medium': return tokens.spacing.lg;
      case 'large': return tokens.spacing.xl;
      default: return tokens.spacing.lg;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      android_ripple={{ color: tokens.colors.neutral300, borderless: false }}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: variant === 'outline' ? (disabled ? tokens.colors.neutral300 : tokens.colors.primary500) : 'transparent',
          borderWidth: variant === 'outline' ? 1.5 : 0,
          minHeight: Math.max(48, getHeight()), // Minimum 48px touch target enforcement
          paddingHorizontal: getPaddingHorizontal(),
          paddingVertical: 12,
          borderRadius: tokens.radius.lg,
          opacity: pressed && Platform.OS === 'ios' ? 0.7 : (disabled ? 0.6 : 1),
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <View style={styles.content}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              tokens.typography.title,
              { color: getTextColor(), fontFamily: 'Inter_600SemiBold', fontSize: size === 'small' ? 14 : 16 },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Ensures ripple doesn't bleed past radius
    ...tokens.elevation.level1, // Subtle resting elevation
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: tokens.spacing.sm,
  },
});
