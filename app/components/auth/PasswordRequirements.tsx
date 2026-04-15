import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Check, X } from 'lucide-react-native';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { PasswordRequirement } from '@/hooks/use-password-validation';

interface PasswordRequirementsProps {
  requirements: PasswordRequirement[];
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ requirements }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <View style={styles.container}>
      {requirements.map((req) => (
        <View key={req.id} style={styles.row}>
          <View style={styles.iconContainer}>
            {req.met ? (
              <Check size={14} color={theme.success} strokeWidth={3} />
            ) : (
              <View style={[styles.dot, { backgroundColor: theme.muted }]} />
            )}
          </View>
          <Text 
            style={[
              Typography.bodySmall, 
              { color: req.met ? theme.success : theme.onSurfaceVariant }
            ]}
          >
            {req.label}
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
