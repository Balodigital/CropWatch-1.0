import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInputProps,
  ViewStyle
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  isPassword = false,
  containerStyle,
  ...props
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[Typography.labelMedium, { color: theme.onSurfaceVariant, marginBottom: 8 }]}>
          {label}
        </Text>
      )}
      <View 
        style={[
          styles.inputContainer, 
          { 
            backgroundColor: theme.surface,
            borderColor: error ? theme.error : (isFocused ? theme.primary : theme.outline),
            borderWidth: isFocused || error ? 1.5 : 1,
          }
        ]}
      >
        <TextInput
          style={[
            styles.input, 
            Typography.bodyLarge, 
            { color: theme.onSurface }
          ]}
          placeholderTextColor={theme.muted}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />
        {isPassword && (
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconContainer}
          >
            {showPassword ? (
              <EyeOff size={20} color={theme.onSurfaceVariant} />
            ) : (
              <Eye size={20} color={theme.onSurfaceVariant} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={[Typography.bodySmall, { color: theme.error, marginTop: 4 }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  iconContainer: {
    padding: 8,
  },
});
