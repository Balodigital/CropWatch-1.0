# Supabase Database Schema

CropWatch uses Supabase as the core storage engine. The application operates primarily on anonymous/device-specific authentication to remove signup friction for farmers holding onto historical data.

## Table: `profiles`
Tracks user specific data like language preference.

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  device_id TEXT UNIQUE, 
  language_pref TEXT DEFAULT 'en', -- 'en' or 'pcm'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Table: `scans`
The primary table tracking historical scanning data for the farmer's log.

```sql
CREATE TABLE scans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  crop_type TEXT NOT NULL, 
  symptom_description TEXT, -- optional text input
  image_url TEXT, -- Pointing to Supabase Storage bucket
  diagnosis_json JSONB, -- The raw JSON output generated strictly by DeepSeek
  severity TEXT, -- Highest severity from the array (Mild, Moderate, Severe)
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Storage Buckets
- `scan_images` (Public read, Authenticated write via RLS).

## Row Level Security (RLS)
- **Profiles:** Users can only read and update their own Profile where `auth.uid() = id`.
- **Scans:** Users can only Insert and Select scans where `user_id = auth.uid()`.
