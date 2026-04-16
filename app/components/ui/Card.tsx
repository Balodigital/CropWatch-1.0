import React, { FC, ReactNode } from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { tokens } from '@/constants/tokens';

export interface CardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  elevation?: 'level1' | 'level2' | 'level3';
}

export const Card: FC<CardProps> = ({ children, style, elevation = 'level1' }) => {
  return (
    <View style={[styles.card, tokens.elevation[elevation], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.lg,
    marginVertical: tokens.spacing.sm,
  },
});
