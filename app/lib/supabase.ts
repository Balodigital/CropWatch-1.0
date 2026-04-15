import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  phone_number?: string;
  language_pref: 'en' | 'pcm';
  created_at: string;
}

export interface Scan {
  id: string;
  user_id: string;
  crop_id: number;
  crop_type: string;
  image_url?: string;
  description?: string;
  diagnosis_json?: Diagnosis[];
  severity?: 'Mild' | 'Moderate' | 'Severe';
  created_at: string;
  status: 'pending' | 'failed' | 'completed';
}

export interface Diagnosis {
  name: string;
  confidence: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  treatment: string;
  prevention: string;
}

export interface Crop {
  id: number;
  name: string;
  dataset_context: string;
  image?: string;
}

export const CROPS_DATA: Crop[] = [
  { id: 1, name: 'Tomato', dataset_context: 'tomato', image: '🍅' },
  { id: 2, name: 'Cassava', dataset_context: 'cassava', image: '🫚' },
  { id: 3, name: 'Maize', dataset_context: 'maize', image: '🌽' },
  { id: 4, name: 'Pepper', dataset_context: 'pepper', image: '🌶️' },
  { id: 5, name: 'Rice', dataset_context: 'rice', image: '🍚' },
  { id: 6, name: 'Yam', dataset_context: 'yam', image: '🍠' },
  { id: 7, name: 'Cowpea', dataset_context: 'cowpea', image: '🫘' },
  { id: 8, name: 'Cocoa', dataset_context: 'cocoa', image: '🍫' },
];
