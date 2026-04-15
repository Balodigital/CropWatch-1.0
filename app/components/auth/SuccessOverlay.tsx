import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  Animated, 
  Dimensions 
} from 'react-native';
import { Colors } from '@/constants/theme';
import { Typography } from '@/constants/Typography';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Button } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react-native';

interface SuccessOverlayProps {
  visible: boolean;
  onClose: () => void;
}

export const SuccessOverlay: React.FC<SuccessOverlayProps> = ({ visible, onClose }) => {
  const colorScheme = useColorScheme() ?? 'light';
  const theme = Colors[colorScheme];

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
    >
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
          <View style={[styles.iconContainer, { backgroundColor: theme.success + '20' }]}>
            <CheckCircle2 size={48} color={theme.success} strokeWidth={2.5} />
          </View>
          
          <Text style={[Typography.headlineSmall, { color: theme.onSurface, textAlign: 'center' }]}>
            Account Created Successfully
          </Text>
          
          <Text style={[Typography.bodyMedium, { color: theme.onSurfaceVariant, textAlign: 'center', marginTop: 12, marginBottom: 24 }]}>
            Your account has been created. You can now sign in to start monitoring your crops and getting AI diagnoses.
          </Text>
          
          <Button
            title="Continue to Sign In"
            onPress={onClose}
            style={styles.button}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  button: {
    width: '100%',
  },
});
