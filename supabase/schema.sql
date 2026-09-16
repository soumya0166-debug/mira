-- ==============================================================================
-- MIND AI – NER Database Schema (Supabase PostgreSQL + Row Level Security)
-- Ministry of Development of North Eastern Region (MDoNER) - SIH 2026 PS ID: 26003
-- ==============================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  preferred_language TEXT DEFAULT 'en',
  voice_enabled BOOLEAN DEFAULT true,
  role TEXT DEFAULT 'elderly' CHECK (role IN ('elderly', 'caregiver', 'family')),
  pin VARCHAR(10) DEFAULT '1234',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. USER PREFERENCES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  language TEXT DEFAULT 'en',
  voice_enabled BOOLEAN DEFAULT true,
  font_scale NUMERIC(3,2) DEFAULT 1.00 CHECK (font_scale IN (1.00, 1.25, 1.50)),
  high_contrast BOOLEAN DEFAULT false,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. COGNITIVE SESSIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.cognitive_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  score INTEGER NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 0, -- Duration in seconds
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. GAME RESULTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.game_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  game_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  accuracy NUMERIC(5,2) NOT NULL DEFAULT 100.00,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. MEMORY ITEMS TABLE (PRIVATE MEMORY VAULT)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.memory_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('person', 'place', 'event', 'family', 'tradition')),
  image_url TEXT,
  voice_note_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. ROUTINE ITEMS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.routine_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_time TIME NOT NULL,
  repeat_pattern TEXT DEFAULT 'daily' CHECK (repeat_pattern IN ('daily', 'weekdays', 'weekends', 'weekly')),
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. REMINDERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. MOOD CHECKINS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.mood_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  mood TEXT NOT NULL CHECK (mood IN ('peaceful', 'happy', 'neutral', 'tired', 'confused', 'sad')),
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 9. CAREGIVER CONNECTIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.caregiver_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  elderly_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  caregiver_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  permission_level TEXT NOT NULL DEFAULT 'NONE' 
    CHECK (permission_level IN ('NONE', 'BASIC_ACTIVITY', 'ROUTINES', 'INSIGHTS', 'FULL_SHARED_DATA')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('pending', 'active', 'revoked')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_elderly_caregiver UNIQUE (elderly_user_id, caregiver_user_id)
);

-- ------------------------------------------------------------------------------
-- 10. NOTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('reminder', 'caregiver', 'achievement', 'info')),
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_cognitive_sessions_user ON public.cognitive_sessions(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_results_user ON public.game_results(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_memory_items_user ON public.memory_items(user_id);
CREATE INDEX IF NOT EXISTS idx_routine_items_user ON public.routine_items(user_id, scheduled_time ASC);
CREATE INDEX IF NOT EXISTS idx_reminders_user ON public.reminders(user_id, scheduled_at ASC);
CREATE INDEX IF NOT EXISTS idx_caregiver_elderly ON public.caregiver_connections(elderly_user_id, caregiver_user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict User Isolation + Granular Caregiver Consent
-- ==============================================================================

-- 1. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cognitive_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if caller is authorized caregiver with required permission level
CREATE OR REPLACE FUNCTION public.has_caregiver_permission(
  target_elderly_id UUID,
  required_permissions TEXT[]
) RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.caregiver_connections
    WHERE elderly_user_id = target_elderly_id
      AND caregiver_user_id = auth.uid()
      AND status = 'active'
      AND permission_level = ANY(required_permissions)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- --- PROFILES POLICIES ---
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- --- USER PREFERENCES POLICIES ---
CREATE POLICY "Users can manage own preferences"
  ON public.user_preferences FOR ALL
  USING (auth.uid() = user_id);

-- --- COGNITIVE SESSIONS POLICIES ---
CREATE POLICY "Users can manage own cognitive sessions"
  ON public.cognitive_sessions FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Caregivers can view cognitive sessions with permission"
  ON public.cognitive_sessions FOR SELECT
  USING (
    auth.uid() = user_id OR
    public.has_caregiver_permission(user_id, ARRAY['BASIC_ACTIVITY', 'INSIGHTS', 'FULL_SHARED_DATA'])
  );

-- --- GAME RESULTS POLICIES ---
CREATE POLICY "Users can manage own game results"
  ON public.game_results FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Caregivers can view game results with permission"
  ON public.game_results FOR SELECT
  USING (
    auth.uid() = user_id OR
    public.has_caregiver_permission(user_id, ARRAY['BASIC_ACTIVITY', 'INSIGHTS', 'FULL_SHARED_DATA'])
  );

-- --- MEMORY ITEMS POLICIES (Strict Private Vault) ---
CREATE POLICY "Users can manage own memory items"
  ON public.memory_items FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Caregivers can view memories ONLY with FULL_SHARED_DATA permission"
  ON public.memory_items FOR SELECT
  USING (
    auth.uid() = user_id OR
    public.has_caregiver_permission(user_id, ARRAY['FULL_SHARED_DATA'])
  );

-- --- ROUTINE ITEMS POLICIES ---
CREATE POLICY "Users can manage own routines"
  ON public.routine_items FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Caregivers can view routines with permission"
  ON public.routine_items FOR SELECT
  USING (
    auth.uid() = user_id OR
    public.has_caregiver_permission(user_id, ARRAY['ROUTINES', 'FULL_SHARED_DATA'])
  );

CREATE POLICY "Caregivers can update routines with permission"
  ON public.routine_items FOR UPDATE
  USING (
    auth.uid() = user_id OR
    public.has_caregiver_permission(user_id, ARRAY['ROUTINES', 'FULL_SHARED_DATA'])
  );

-- --- REMINDERS POLICIES ---
CREATE POLICY "Users can manage own reminders"
  ON public.reminders FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Caregivers can view reminders with permission"
  ON public.reminders FOR SELECT
  USING (
    auth.uid() = user_id OR
    public.has_caregiver_permission(user_id, ARRAY['ROUTINES', 'FULL_SHARED_DATA'])
  );

-- --- MOOD CHECKINS POLICIES ---
CREATE POLICY "Users can manage own mood checkins"
  ON public.mood_checkins FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Caregivers can view mood with INSIGHTS permission"
  ON public.mood_checkins FOR SELECT
  USING (
    auth.uid() = user_id OR
    public.has_caregiver_permission(user_id, ARRAY['INSIGHTS', 'FULL_SHARED_DATA'])
  );

-- --- CAREGIVER CONNECTIONS POLICIES ---
CREATE POLICY "Elderly user controls caregiver connections"
  ON public.caregiver_connections FOR ALL
  USING (auth.uid() = elderly_user_id);

CREATE POLICY "Caregiver can view their own connections"
  ON public.caregiver_connections FOR SELECT
  USING (auth.uid() = caregiver_user_id);

-- --- NOTIFICATIONS POLICIES ---
CREATE POLICY "Users can manage own notifications"
  ON public.notifications FOR ALL
  USING (auth.uid() = user_id);
