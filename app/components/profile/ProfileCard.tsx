import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { tokens } from '@/constants/tokens';
import { Avatar } from './Avatar';
import { Card } from '../ui/Card';

interface ProfileCardProps {
  name?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ name, email, avatarUrl }) => {
  return (
    <Card style={styles.card} elevation="level1">
      <Avatar uri={avatarUrl} size={80} />
      <View style={styles.content}>
        <Text style={[tokens.typography.title, styles.name]}>
          {name || 'CropWatch User'}
        </Text>
        <Text style={[tokens.typography.caption, styles.email]}>
          {email || 'No email provided'}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.surface,
  },
  content: {
    marginLeft: tokens.spacing.lg,
    flex: 1,
  },
  name: {
    color: tokens.colors.text,
    marginBottom: tokens.spacing.xs,
  },
  email: {
    color: tokens.colors.textSecondary,
  },
});
