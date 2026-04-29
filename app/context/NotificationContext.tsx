import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { OfflineStorage, AppNotification } from '@/lib/offline';

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshNotifications = useCallback(async () => {
    const data = await OfflineStorage.getNotifications();
    const count = await OfflineStorage.getUnreadNotificationCount();
    setNotifications(data);
    setUnreadCount(count);
  }, []);

  const addNotification = async (notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
    await OfflineStorage.addNotification(notif);
    await refreshNotifications();
  };

  const markAsRead = async (id: string) => {
    await OfflineStorage.markNotificationAsRead(id);
    await refreshNotifications();
  };

  useEffect(() => {
    refreshNotifications();
    // Refresh every 30 seconds to catch auto-sync results
    const interval = setInterval(refreshNotifications, 30000);
    return () => clearInterval(interval);
  }, [refreshNotifications]);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      refreshNotifications, 
      addNotification,
      markAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
