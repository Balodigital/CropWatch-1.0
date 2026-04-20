import { Stack } from 'expo-router';
import { tokens } from '@/constants/tokens';

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: tokens.colors.primary500,
        },
        headerTintColor: tokens.colors.surface,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Profile',
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          title: 'Edit Profile',
        }}
      />
      <Stack.Screen
        name="change-password"
        options={{
          title: 'Change Password',
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          title: 'Language',
        }}
      />
      <Stack.Screen
        name="permissions"
        options={{
          title: 'App Permissions',
        }}
      />
    </Stack>
  );
}
