import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import { Diagnosis } from './supabase';

interface PendingScan {
  id: string;
  imageBase64: string;
  description: string;
  cropType: string;
  timestamp: number;
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  timestamp: number;
  isRead: boolean;
  type: 'scan_complete' | 'system' | 'tips' | 'diagnosis_update';
  data?: any;
}

const PENDING_SCANS_KEY = '@cropscan_pending_scans';
const USER_PREFERENCES_KEY = '@cropscan_preferences';
const DIAGNOSIS_CACHE_KEY = '@cropscan_diagnosis_cache';
const NOTIFICATIONS_KEY = '@cropscan_notifications';
const SEARCH_HISTORY_KEY = '@cropscan_search_history';

export const OfflineStorage = {
  async saveRecentSearch(query: string): Promise<void> {
    if (!query.trim()) return;
    const history = await this.getRecentSearches();
    const filtered = history.filter(q => q.toLowerCase() !== query.toLowerCase());
    filtered.unshift(query);
    await AsyncStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(filtered.slice(0, 10)));
  },

  async getRecentSearches(): Promise<string[]> {
    const data = await AsyncStorage.getItem(SEARCH_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  },

  async clearRecentSearches(): Promise<void> {
    await AsyncStorage.removeItem(SEARCH_HISTORY_KEY);
  },
  async savePendingScan(scan: PendingScan): Promise<void> {
    const pending = await this.getPendingScans();
    pending.push(scan);
    await AsyncStorage.setItem(PENDING_SCANS_KEY, JSON.stringify(pending));
  },

  async getPendingScans(): Promise<PendingScan[]> {
    const data = await AsyncStorage.getItem(PENDING_SCANS_KEY);
    return data ? JSON.parse(data) : [];
  },

  async removePendingScan(id: string): Promise<void> {
    const pending = await this.getPendingScans();
    const filtered = pending.filter(s => s.id !== id);
    await AsyncStorage.setItem(PENDING_SCANS_KEY, JSON.stringify(filtered));
  },

  async getPendingCount(): Promise<number> {
    const pending = await this.getPendingScans();
    return pending.length;
  },

  async saveUserPreferences(prefs: { language: string; hasCompletedOnboarding: boolean }): Promise<void> {
    await AsyncStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(prefs));
  },

  async getUserPreferences(): Promise<{ language: string; hasCompletedOnboarding: boolean } | null> {
    const data = await AsyncStorage.getItem(USER_PREFERENCES_KEY);
    return data ? JSON.parse(data) : null;
  },

  async cacheDiagnosis(scanId: string, diagnosis: Diagnosis[], cropType: string): Promise<void> {
    const cache = await this.getDiagnosisCache();
    cache[scanId] = { diagnosis, cropType, timestamp: Date.now() };
    await AsyncStorage.setItem(DIAGNOSIS_CACHE_KEY, JSON.stringify(cache));
  },

  async getCachedDiagnosis(scanId: string): Promise<Diagnosis[] | null> {
    const cache = await this.getDiagnosisCache();
    return cache[scanId]?.diagnosis || null;
  },

  async getDiagnosisCache(): Promise<Record<string, { diagnosis: Diagnosis[]; cropType: string; timestamp: number }>> {
    const data = await AsyncStorage.getItem(DIAGNOSIS_CACHE_KEY);
    return data ? JSON.parse(data) : {};
  },

  async removeCachedDiagnosis(scanId: string): Promise<void> {
    const cache = await this.getDiagnosisCache();
    delete cache[scanId];
    await AsyncStorage.setItem(DIAGNOSIS_CACHE_KEY, JSON.stringify(cache));
  },

  async isOnline(): Promise<boolean> {
    const networkState = await Network.getNetworkStateAsync();
    return (networkState.isConnected && networkState.isInternetReachable) ?? false;
  },
  
  async checkServerHealth(apiUrl: string): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      // Try to hit the root health endpoint (not the /api/diagnose one)
      // Remove /api from the end to get the base server URL
      const baseServerUrl = apiUrl.replace(/\/api$/, '');
      const response = await fetch(`${baseServerUrl}/health`, { 
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      return response.ok;
    } catch (e) {
      return false;
    }
  },

  async clearDiagnosisCache(): Promise<void> {
    await AsyncStorage.removeItem(DIAGNOSIS_CACHE_KEY);
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([PENDING_SCANS_KEY, USER_PREFERENCES_KEY, DIAGNOSIS_CACHE_KEY, NOTIFICATIONS_KEY]);
  },

  async getNotifications(): Promise<AppNotification[]> {
    const data = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    const notifications: AppNotification[] = data ? JSON.parse(data) : [];
    // Sort by timestamp descending
    return notifications.sort((a, b) => b.timestamp - a.timestamp);
  },

  async addNotification(notif: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>): Promise<void> {
    const notifications = await this.getNotifications();
    const newNotif: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      isRead: false,
    };
    notifications.unshift(newNotif);
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  },

  async markNotificationAsRead(id: string): Promise<void> {
    const notifications = await this.getNotifications();
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications[index].isRead = true;
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    }
  },

  async getUnreadNotificationCount(): Promise<number> {
    const notifications = await this.getNotifications();
    return notifications.filter(n => !n.isRead).length;
  },
};
