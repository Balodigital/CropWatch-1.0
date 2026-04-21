import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { Text, Pressable, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/theme';
import { tokens } from '@/constants/tokens';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/AuthContext';
import { Avatar } from '@/components/profile/Avatar';

function TabIcon({ icon }: { icon: string }) {
  const iconMap: Record<string, string> = {
    home: '🏠',
    library: '📚',
    history: '📋',
    settings: '⚙️',
  };
  return <Text style={{ fontSize: 24 }}>{iconMap[icon]}</Text>;
}

function HeaderAvatar() {
  const router = useRouter();
  const { user, profile } = useAuth();
  
  return (
    <Pressable 
      onPress={() => router.push('/profile')}
      style={({ pressed }) => ({
        marginLeft: tokens.spacing.md,
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <Avatar 
        uri={profile?.avatar_url || user?.user_metadata?.avatar_url} 
        size={32} 
      />
    </Pressable>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tokens.colors.primary500,
        tabBarInactiveTintColor: tokens.colors.neutral400,
        tabBarStyle: {
          backgroundColor: tokens.colors.surface,
          borderTopColor: tokens.colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color }) => <TabIcon icon="home" />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <TabIcon icon="library" />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabs.history'),
          tabBarIcon: ({ color }) => <TabIcon icon="history" />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <TabIcon icon="settings" />,
        }}
      />
    </Tabs>
  );
}
