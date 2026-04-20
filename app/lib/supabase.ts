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
  { id: 1, name: 'Tomato', dataset_context: 'tomato', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: 2, name: 'Cassava', dataset_context: 'cassava', image: 'https://images.unsplash.com/photo-1621464759391-77218327299a?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: 3, name: 'Maize', dataset_context: 'maize', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: 4, name: 'Pepper', dataset_context: 'pepper', image: 'https://images.unsplash.com/photo-1563201481-2d7448375eeb?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: 5, name: 'Rice', dataset_context: 'rice', image: 'https://images.unsplash.com/photo-1536305030588-15dc3f67a3b9?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: 6, name: 'Yam', dataset_context: 'yam', image: 'https://images.unsplash.com/photo-1594282486512-ad58f6c38221?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: 7, name: 'Cowpea', dataset_context: 'cowpea', image: 'https://images.unsplash.com/photo-1551460417-ee18510227aa?q=80&w=400&h=400&auto=format&fit=crop' },
  { id: 8, name: 'Cocoa', dataset_context: 'cocoa', image: 'https://images.unsplash.com/photo-1599591037488-816999335889?q=80&w=400&h=400&auto=format&fit=crop' },
];
