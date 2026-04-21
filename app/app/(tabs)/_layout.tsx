import { Tabs } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/constants/tokens';
import { MaterialIcons } from '@expo/vector-icons';

function TabIcon({ name, color, focused, isPremium }: { name: keyof typeof MaterialIcons.glyphMap, color: string, focused: boolean, isPremium?: boolean }) {
  return (
    <View style={styles.iconContainer}>
      <MaterialIcons name={name} size={26} color={color} />
      {focused && <View style={[styles.activeDot, { backgroundColor: tokens.colors.primary500 }]} />}
      {isPremium && (
        <View style={styles.premiumBadge}>
          <MaterialIcons name="stars" size={8} color={tokens.colors.accent50} />
          <Text style={styles.premiumText}>Premium</Text>
        </View>
      )}
    </View>
  );
}

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tokens.colors.primary500,
        tabBarInactiveTintColor: tokens.colors.neutral500,
        tabBarShowLabel: true, // Ensure labels are shown
        tabBarStyle: {
          backgroundColor: tokens.colors.surface,
          borderTopColor: tokens.colors.border,
          height: 85,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="history" color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Chats',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="lock" color={color} focused={focused} isPremium />
          ),
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="settings" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.neutral100,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    position: 'absolute',
    top: -4,
    right: -24,
    borderWidth: 1,
    borderColor: tokens.colors.surface,
  },
  premiumText: {
    fontSize: 7,
    fontWeight: '700',
    color: tokens.colors.accent50,
    marginLeft: 1,
  },
});
