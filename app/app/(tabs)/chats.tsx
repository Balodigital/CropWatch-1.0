import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { tokens } from '@/constants/tokens';
import { AppHeader } from '@/components/ui/AppHeader';

export default function ChatsScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <AppHeader title="Premium Chat" showBack={false} />
      
      <View style={styles.content}>
        <View style={[styles.lockContainer, { backgroundColor: tokens.colors.accent95 }]}>
          <MaterialIcons name="lock" size={64} color={tokens.colors.accent50} />
        </View>
        
        <Text style={[styles.title, { color: tokens.colors.text }]}>
          Premium Access Required
        </Text>
        
        <Text style={[styles.description, { color: tokens.colors.textSecondary }]}>
          Chat directly with agricultural experts to get personalized advice for your crops.
        </Text>
        
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: tokens.colors.accent50 }]}
          onPress={() => {}}
        >
          <Text style={styles.buttonText}>Upgrade to Premium</Text>
        </TouchableOpacity>
        
        <Text style={[styles.footerText, { color: tokens.colors.neutral400 }]}>
          Join thousands of farmers getting professional support daily.
        </Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
  },
  lockContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: tokens.spacing.xxl,
    paddingHorizontal: tokens.spacing.md,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: tokens.radius.lg,
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
  },
});
