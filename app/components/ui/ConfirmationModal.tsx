import React from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Animated } from 'react-native';
import { tokens } from '@/constants/tokens';
import { Button } from './Button';

interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Pressable style={styles.content} onPress={(e) => e.stopPropagation()}>
            <Text style={[tokens.typography.heading, styles.title]}>{title}</Text>
            <Text style={[tokens.typography.body, styles.message]}>{message}</Text>
            
            <View style={styles.actions}>
              <Button 
                title={cancelLabel} 
                onPress={onClose} 
                variant="ghost" 
                style={styles.button}
              />
              <Button 
                title={confirmLabel} 
                onPress={onConfirm} 
                variant={isDestructive ? 'outline' : 'primary'}
                style={[styles.button, isDestructive && styles.destructiveButton]}
                textStyle={isDestructive ? { color: tokens.colors.error500 } : undefined}
              />
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: tokens.spacing.xl,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
  },
  content: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.xl,
    ...tokens.elevation.level3,
  },
  title: {
    color: tokens.colors.text,
    marginBottom: tokens.spacing.md,
    fontSize: 20,
  },
  message: {
    color: tokens.colors.textSecondary,
    lineHeight: 22,
    marginBottom: tokens.spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
  },
  button: {
    flex: 1,
  },
  destructiveButton: {
    borderColor: tokens.colors.error500,
  },
});
