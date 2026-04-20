import React, { useState, FC } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  Pressable, 
  TextInputProps,
  ViewStyle
} from 'react-native';
import { tokens } from '@/constants/tokens';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react-native';
import { MaterialIcons } from '@expo/vector-icons';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  success?: boolean;
  isPassword?: boolean;
  icon?: keyof typeof MaterialIcons.glyphMap;
  containerStyle?: ViewStyle;
  helperText?: string;
}

export const Input: FC<InputProps> = ({
  label,
  error,
  success,
  isPassword = false,
  icon,
  containerStyle,
  helperText,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const getBorderColor = () => {
    if (error) return tokens.colors.error500;
    if (success) return tokens.colors.success500;
    if (isFocused) return tokens.colors.primary500;
    return tokens.colors.border;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[tokens.typography.title, { color: tokens.colors.textSecondary, marginBottom: tokens.spacing.sm, fontSize: 14 }]}>
          {label}
        </Text>
      )}
      <View 
        style={[
          styles.inputContainer, 
          { 
            backgroundColor: tokens.colors.surface,
            borderColor: getBorderColor(),
            borderWidth: isFocused || error || success ? 2 : 1,
          }
        ]}
      >
        {icon && (
          <View style={styles.leftIcon}>
            <MaterialIcons name={icon} size={20} color={isFocused ? tokens.colors.primary500 : tokens.colors.neutral400} />
          </View>
        )}
        <TextInput
          style={[
            styles.input, 
            tokens.typography.body, 
            { color: tokens.colors.text }
          ]}
          placeholderTextColor={tokens.colors.neutral400}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={(isPassword || props.secureTextEntry) && !showPassword}
          {...props}
        />
        <View style={styles.rightIcons}>
          {success && !isPassword && (
            <View style={styles.iconContainer}>
              <CheckCircle2 size={20} color={tokens.colors.success500} />
            </View>
          )}
          {isPassword && (
            <Pressable 
              onPress={() => setShowPassword(!showPassword)}
              hitSlop={12}
              style={({ pressed }) => [styles.iconContainer, { opacity: pressed ? 0.7 : 1 }]}
            >
              {showPassword ? (
                <EyeOff size={20} color={tokens.colors.neutral500} />
              ) : (
                <Eye size={20} color={tokens.colors.neutral500} />
              )}
            </Pressable>
          )}
        </View>
      </View>
      {(error || helperText) && (
        <Text style={[tokens.typography.caption, { color: error ? tokens.colors.error500 : tokens.colors.textSecondary, marginTop: tokens.spacing.xs }]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: tokens.spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: tokens.radius.lg,
    paddingHorizontal: tokens.spacing.md,
    minHeight: 56,
  },
  leftIcon: {
    marginRight: tokens.spacing.sm,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingVertical: tokens.spacing.sm,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: tokens.spacing.sm,
  },
  iconContainer: {
    padding: tokens.spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
