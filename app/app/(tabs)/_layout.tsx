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
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.background,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('scan_leaf'),
          headerTitle: 'CropWatch',
          tabBarIcon: ({ color }) => <TabIcon icon="home" />,
          headerLeft: () => <HeaderAvatar />,
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color }) => <TabIcon icon="library" />,
          headerLeft: () => <HeaderAvatar />,
          headerTitleAlign: 'center',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('history'),
          tabBarIcon: ({ color }) => <TabIcon icon="history" />,
          headerLeft: () => <HeaderAvatar />,
          headerTitleAlign: 'center',
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
