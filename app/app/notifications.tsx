import React, { useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { tokens } from '@/constants/tokens';
import { AppHeader } from '@/components/ui/AppHeader';
import { useNotifications } from '@/context/NotificationContext';
import { formatDistanceToNow } from '@/utils/date';

export default function NotificationsScreen() {
  const router = useRouter();
  const { notifications, markAsRead, refreshNotifications } = useNotifications();

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

  const handleNotificationPress = async (notification: any) => {
    await markAsRead(notification.id);
    
    if (notification.type === 'scan_complete' && notification.data?.scanId) {
      // Navigate to result screen with cached data
      router.push({
        pathname: '/result',
        params: {
          diagnosis: JSON.stringify(notification.data.diagnosis),
          cropType: notification.data.cropType,
          image: '', // Pending scans don't have local image usually or it's base64
        }
      });
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    const isUnread = !item.isRead;
    
    return (
      <Pressable 
        style={[
          styles.notificationCard, 
          isUnread ? styles.unreadCard : styles.readCard
        ]}
        onPress={() => handleNotificationPress(item)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconContainer}>
            <MaterialIcons 
              name={item.type === 'scan_complete' ? 'check-circle' : 'notifications'} 
              size={24} 
              color={isUnread ? tokens.colors.primary500 : tokens.colors.neutral400} 
            />
          </View>
          <View style={styles.textContainer}>
            <View style={styles.titleRow}>
              <Text style={[styles.title, isUnread && styles.unreadTitle]}>{item.title}</Text>
              {isUnread && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.timestamp}>
              {formatDistanceToNow(item.timestamp, { addSuffix: true })}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <AppHeader title="Notifications" onBack={() => router.back()} />
      
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialIcons name="notifications-none" size={64} color={tokens.colors.neutral300} />
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptySub}>You're all caught up</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  listContent: {
    padding: tokens.spacing.md,
    flexGrow: 1,
  },
  notificationCard: {
    borderRadius: tokens.radius.lg,
    padding: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
    borderWidth: 1,
    borderColor: tokens.colors.neutral100,
  },
  unreadCard: {
    backgroundColor: tokens.colors.primary50,
    borderColor: tokens.colors.primary100,
  },
  readCard: {
    backgroundColor: tokens.colors.neutral98,
  },
  cardHeader: {
    flexDirection: 'row',
  },
  iconContainer: {
    marginRight: tokens.spacing.md,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: tokens.colors.text,
  },
  unreadTitle: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: tokens.colors.primary500,
  },
  description: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: tokens.colors.neutral500,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: tokens.colors.text,
    marginTop: tokens.spacing.md,
  },
  emptySub: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    marginTop: 4,
  },
});
