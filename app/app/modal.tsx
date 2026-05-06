import { Link } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';

import { tokens } from '@/constants/tokens';
import { AppHeader } from '@/components/ui/AppHeader';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <AppHeader title="Modal" />
      <View style={styles.content}>
        <Text style={[tokens.typography.heading, { color: tokens.colors.text }]}>This is a modal</Text>
        <Link href="/" dismissTo style={styles.link}>
          <Text style={[tokens.typography.body, { color: tokens.colors.primary500 }]}>Go to home screen</Text>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: tokens.spacing.lg,
  },
  link: {
    marginTop: tokens.spacing.md,
    paddingVertical: tokens.spacing.md,
  },
});
