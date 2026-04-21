import React from 'react';
import { StyleSheet, View, Text, Pressable, Platform } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { tokens } from '@/constants/tokens';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  leftAction?: React.ReactNode;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = true,
  onBack,
  rightAction,
  leftAction,
}) => {
  const router = useRouter();
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        {showBack ? (
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => [
              styles.backButton,
              { opacity: pressed ? 0.7 : 1 }
            ]}
          >
            <MaterialIcons name="arrow-back" size={24} color={tokens.colors.text} />
          </Pressable>
        ) : (
          leftAction
        )}
      </View>

      <View style={styles.titleContainer}>
        {title && (
          <Text style={[tokens.typography.title, styles.title]} numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>

      <View style={styles.rightContainer}>
        {rightAction}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Platform.OS === 'ios' ? 44 : 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.background,
    paddingHorizontal: tokens.spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: tokens.colors.border,
  },
  leftContainer: {
    width: 40,
    justifyContent: 'center',
  },
  backButton: {
    padding: tokens.spacing.xs,
    marginLeft: -tokens.spacing.xs,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: tokens.colors.text,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
