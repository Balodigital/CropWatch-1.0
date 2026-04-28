import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { tokens } from '@/constants/tokens';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ 
  title, 
  showBack = true,
  rightElement
}) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.outerContainer, { paddingTop: insets.top }]}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {showBack && (
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.backButton}
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back-ios" size={20} color={tokens.colors.primary500} />
            </TouchableOpacity>
          )}
          <Text style={[tokens.typography.heading, styles.title]}>{title}</Text>
        </View>
        <View style={styles.rightSection}>
          {rightElement}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: tokens.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  container: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.lg,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: tokens.spacing.sm,
    backgroundColor: tokens.colors.primary50,
  },
  title: {
    color: tokens.colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
});
