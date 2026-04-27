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

const API_BASE_URL = getApiBaseUrl();

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

  const isOnline = await OfflineStorage.isOnline();

  if (!isOnline) {
    const pendingScanId = `offline_${Date.now()}`;
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
  }

  try {
    const response = await fetch(`${API_BASE_URL}/diagnose`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_base64: imageBase64,
        description: cleanDesc,
        crop_type: cropType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return { 
        success: false, 
        error: errorData.error || `Server error (${response.status}). Check if API tunnel is active.` 
      };
    }

    const data = await response.json();
    return { success: true, diagnosis: data.diagnosis };
  } catch (error) {
    const isStillOnline = await OfflineStorage.isOnline();
    
    if (isStillOnline) {
      return { 
        success: false, 
        error: "Could not connect to the diagnosis server. Please check if the API tunnel is active." 
      };
    }

    const pendingScanId = `offline_${Date.now()}`;
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
      const response = await fetch(`${API_BASE_URL}/diagnose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_base64: scan.imageBase64,
          description: scan.description,
          crop_type: scan.cropType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await OfflineStorage.cacheDiagnosis(scan.id, data.diagnosis);
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
