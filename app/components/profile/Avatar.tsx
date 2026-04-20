import React from 'react';
import { View, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { tokens } from '@/constants/tokens';
import { MaterialIcons } from '@expo/vector-icons';

interface AvatarProps {
  uri?: string | null;
  size?: number;
  loading?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ uri, size = 100, loading = false }) => {
  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      {loading ? (
        <ActivityIndicator color={tokens.colors.primary500} />
      ) : uri ? (
        <Image 
          source={{ uri }} 
          style={[styles.image, { borderRadius: size / 2 }]} 
        />
      ) : (
        <View style={[styles.placeholder, { backgroundColor: tokens.colors.neutral100, borderRadius: size / 2 }]}>
          <MaterialIcons name="person" size={size * 0.6} color={tokens.colors.neutral400} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: tokens.colors.neutral100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
