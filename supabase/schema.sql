-- ==========================================
-- CropWatch PostgreSQL Schema (Supabase)
-- ==========================================

-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table (Extends Supabase Auth Auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone_number TEXT UNIQUE,
  language_pref VARCHAR(10) DEFAULT 'en', -- 'en' or 'pcm'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Crops Library (Static Config)
CREATE TABLE public.crops (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  dataset_context TEXT NOT NULL
);

-- RLS for Crops
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read crops" ON public.crops FOR SELECT USING (true);
-- Only Admins can modify crops (assume manual insert for MVP)

-- 3. Scans Table (Farmer History)
CREATE TABLE public.scans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  crop_id INT REFERENCES public.crops(id),
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'completed' -- pending, failed, completed
);

-- RLS for Scans
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own scans" ON public.scans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own scans" ON public.scans FOR SELECT USING (auth.uid() = user_id);

-- 4. Diagnoses Table (Results tied to a Scan)
CREATE TABLE public.diagnoses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  scan_id UUID REFERENCES public.scans(id) ON DELETE CASCADE,
  disease_name TEXT NOT NULL,
  confidence DECIMAL CHECK (confidence >= 0 AND confidence <= 100),
  severity VARCHAR(10) CHECK (severity IN ('Mild', 'Moderate', 'Severe')),
  treatment_sugg TEXT NOT NULL,
  prevention_tips TEXT NOT NULL
);

-- RLS for Diagnoses
ALTER TABLE public.diagnoses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own diagnoses" ON public.diagnoses FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.scans WHERE scans.id = diagnoses.scan_id AND scans.user_id = auth.uid()
  )
);

-- 5. Disease Library Reference (Optional / Static UI fallback)
CREATE TABLE public.disease_library (
  id SERIAL PRIMARY KEY,
  crop_id INT REFERENCES public.crops(id),
  disease_name VARCHAR(100) NOT NULL,
  treatment_local TEXT,
  severity_pattern VARCHAR(20)
);

-- Indexing for scaling read layers
CREATE INDEX idx_scans_userid ON public.scans(user_id);
CREATE INDEX idx_diagnoses_scanid ON public.diagnoses(scan_id);

-- ==========================================
-- Storage Bucket Instructions (Manual Setup)
-- ==========================================
-- 1. Create a Bucket named "scan_images"
-- 2. Configure RLS to allow INSERT for Authenticated users.
