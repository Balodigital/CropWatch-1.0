import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  ViewStyle, 
  TextStyle,
  Platform,
  View
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface ButtonProps {
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

export const Button: React.FC<ButtonProps> = ({
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
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  const getBackgroundColor = () => {
    if (disabled) return theme.surfaceVariant;
    switch (variant) {
      case 'primary': return theme.primary;
      case 'secondary': return theme.secondary;
      case 'outline':
      case 'ghost': return 'transparent';
      default: return theme.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.muted;
    switch (variant) {
      case 'primary': return theme.onPrimary;
      case 'secondary': return theme.onSecondary;
      case 'outline': return theme.primary;
      case 'ghost': return theme.primary;
      default: return theme.onPrimary;
    }
  };

  const getBorderColor = () => {
    if (disabled) return theme.outline;
    if (variant === 'outline') return theme.primary;
    return 'transparent';
  };

  const getHeight = () => {
    switch (size) {
      case 'small': return 40;
      case 'medium': return 52;
      case 'large': return 60;
      default: return 52;
    }
  };

  const getPaddingHorizontal = () => {
    switch (size) {
      case 'small': return 16;
      case 'medium': return 24;
      case 'large': return 32;
      default: return 24;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1.5 : 0,
          height: getHeight(),
          paddingHorizontal: getPaddingHorizontal(),
          borderRadius: 12,
          opacity: disabled ? 0.5 : 1,
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
              Typography.labelLarge,
              { color: getTextColor(), fontWeight: '600' },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        cursor: 'pointer',
      }
    }),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
});
