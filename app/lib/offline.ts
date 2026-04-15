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

const PENDING_SCANS_KEY = '@cropwatch_pending_scans';
const USER_PREFERENCES_KEY = '@cropwatch_preferences';
const DIAGNOSIS_CACHE_KEY = '@cropwatch_diagnosis_cache';

export const OfflineStorage = {
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

  async cacheDiagnosis(scanId: string, diagnosis: Diagnosis[]): Promise<void> {
    const cache = await this.getDiagnosisCache();
    cache[scanId] = { diagnosis, timestamp: Date.now() };
    await AsyncStorage.setItem(DIAGNOSIS_CACHE_KEY, JSON.stringify(cache));
  },

  async getCachedDiagnosis(scanId: string): Promise<Diagnosis[] | null> {
    const cache = await this.getDiagnosisCache();
    return cache[scanId]?.diagnosis || null;
  },

  async getDiagnosisCache(): Promise<Record<string, { diagnosis: Diagnosis[]; timestamp: number }>> {
    const data = await AsyncStorage.getItem(DIAGNOSIS_CACHE_KEY);
    return data ? JSON.parse(data) : {};
  },

  async isOnline(): Promise<boolean> {
    const networkState = await Network.getNetworkStateAsync();
    return networkState.isConnected ?? false;
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove([PENDING_SCANS_KEY, USER_PREFERENCES_KEY, DIAGNOSIS_CACHE_KEY]);
  },
};
