import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { tokens } from '@/constants/tokens';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  elevation?: keyof typeof tokens.elevation;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style,
  elevation = 'level1'
}) => {
  return (
    <View style={[
      styles.card, 
      tokens.elevation[elevation],
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    overflow: 'hidden',
  },
});
