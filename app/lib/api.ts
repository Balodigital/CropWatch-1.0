import { validateScanInput } from './validation';
import { runDeepSeekAnalysis, validateAndMapConfidence } from './deepseek';
import { OfflineStorage } from './offline';
import { Diagnosis } from './supabase';

const getApiBaseUrl = () => {
  let url = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
  // Remove trailing slash if present
  url = url.replace(/\/$/, '');
  // Ensure the URL always ends with /api for consistency with the server routing
  return url.endsWith('/api') ? url : `${url}/api`;
};

export const API_BASE_URL = getApiBaseUrl();

export interface DiagnosisResult {
  success: boolean;
  diagnosis?: Diagnosis[];
  error?: string;
  offline?: boolean;
  pendingScanId?: string;
}

export async function submitDiagnosis(
  imageBase64: string,
  description: string,
  cropType: string
): Promise<DiagnosisResult> {
  const { isValid, errors, cleanDesc } = validateScanInput(imageBase64, cropType, description);

  if (!isValid) {
    return { success: false, error: errors.join(', ') };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    const response = await fetch(`${API_BASE_URL}/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        image_base64: imageBase64,
        description: cleanDesc,
        crop_type: cropType,
      }),
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`[API] Server returned ${response.status} for ${API_BASE_URL}/diagnose`);
      const errorData = await response.json().catch(() => ({}));
      
      // If it's a server error, tunnel issue, or unreachable, save to offline
      // We only return success: false for 400 (Validation) or 401 (Auth)
      if (response.status >= 500 || response.status === 404 || response.status === 530) {
        const pendingScanId = `offline_${Date.now()}`;
        try {
          await OfflineStorage.savePendingScan({
            id: pendingScanId,
            imageBase64,
            description: cleanDesc,
            cropType,
            timestamp: Date.now(),
          });
          return {
            success: true,
            offline: true,
            pendingScanId,
            diagnosis: [],
          };
        } catch (storageError) {
          return { 
            success: false, 
            error: "Device storage is full. Please clear some space to save scans offline." 
          };
        }
      }

      return { 
        success: false, 
        error: errorData.error || `Server error (${response.status}).` 
      };
    }

    const data = await response.json();
    return { success: true, diagnosis: data.diagnosis };
  } catch (error) {
    console.error(`[API] Connection failed to ${API_BASE_URL}/diagnose:`, error);
    // If any connection error happens, we treat it as offline mode
    const pendingScanId = `offline_${Date.now()}`;
    try {
      await OfflineStorage.savePendingScan({
        id: pendingScanId,
        imageBase64,
        description: cleanDesc,
        cropType,
        timestamp: Date.now(),
      });

      return {
        success: true,
        offline: true,
        pendingScanId,
        diagnosis: [],
      };
    } catch (storageError) {
      return { 
        success: false, 
        error: "Connection failed and could not save offline. Device storage might be full." 
      };
    }
  }
}

export async function syncPendingScans(): Promise<{ synced: number; failed: number }> {
  const pending = await OfflineStorage.getPendingScans();
  let synced = 0;
  let failed = 0;

  const isOnline = await OfflineStorage.isOnline();
  if (!isOnline || pending.length === 0) {
    return { synced, failed };
  }

  for (const scan of pending) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch(`${API_BASE_URL}/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          image_base64: scan.imageBase64,
          description: scan.description,
          crop_type: scan.cropType,
        }),
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        // Check if already in cache to prevent duplicates
        const cache = await OfflineStorage.getDiagnosisCache();
        if (!cache[scan.id]) {
          await OfflineStorage.cacheDiagnosis(scan.id, data.diagnosis, scan.cropType);
          
          // Add notification
          await OfflineStorage.addNotification({
            title: 'Scan Complete',
            description: `Your ${scan.cropType} scan has been automatically diagnosed. Tap to view result.`,
            type: 'scan_complete',
            data: { 
              scanId: scan.id, 
              cropType: scan.cropType,
              diagnosis: data.diagnosis
            }
          });
        }
        await OfflineStorage.removePendingScan(scan.id);
        synced++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }

  return { synced, failed };
}

export async function fetchAndRestoreHistory(): Promise<{ count: number; error?: string }> {
  try {
    const { data: { user } } = await require('./supabase').supabase.auth.getUser();
    if (!user) return { count: 0, error: 'User not authenticated' };

    const { data: scans, error } = await require('./supabase').supabase
      .from('scans')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!scans || scans.length === 0) return { count: 0 };

    let count = 0;
    for (const scan of scans) {
      // Re-populate the local cache
      await OfflineStorage.cacheDiagnosis(
        scan.id, 
        scan.diagnosis_json || [], 
        scan.crop_type
      );
      count++;
    }

    return { count };
  } catch (err: any) {
    console.error('[API] Restore history failed:', err);
    return { count: 0, error: err.message };
  }
}

export interface SupportMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function sendSupportChatMessage(messages: SupportMessage[]): Promise<{ content: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/support/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`Server error (${response.status})`);
    }

    const data = await response.json();
    return { content: data.content };
  } catch (error: any) {
    console.error('[API] Support chat failed:', error);
    return { content: '', error: error.message };
  }
}

export async function submitSupportTicket(ticketData: { 
  summary: string; 
  description: string; 
  screenshot?: string 
}): Promise<{ success: boolean; ticketId?: string; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/support/ticket`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      throw new Error(`Server error (${response.status})`);
    }

    const data = await response.json();
    return { success: true, ticketId: data.ticketId };
  } catch (error: any) {
    console.error('[API] Ticket submission failed:', error);
    return { success: false, error: error.message };
  }
}
