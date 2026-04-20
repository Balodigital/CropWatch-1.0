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

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  success?: boolean;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
}

export const Input: FC<InputProps> = ({
  label,
  error,
  success,
  isPassword = false,
  containerStyle,
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
        <TextInput
          style={[
            styles.input, 
            tokens.typography.body, 
            { color: tokens.colors.text }
          ]}
          placeholderTextColor={tokens.colors.neutral400}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
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
              hitSlop={12} // Extends touch target to meet Material 48px standard
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
      {error && (
        <Text style={[tokens.typography.caption, { color: tokens.colors.error500, marginTop: tokens.spacing.xs }]}>
          {error}
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
    minHeight: 56, // Material 3 standard min height for inputs
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
