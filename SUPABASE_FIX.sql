-- SUPABASE DATABASE FIX FOR OAUTH USER CREATION
-- Run this in your Supabase SQL Editor

-- Step 1: Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 2: Drop existing function if it exists  
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Step 3: Ensure users table exists with correct structure
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  college_affiliation TEXT,
  is_organizer BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (id)
);

-- Step 4: Create the user handler function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url, onboarding_completed, created_at, updated_at)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', SPLIT_PART(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url',
    false,
    new.created_at,
    new.updated_at
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 5: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 6: Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Step 7: Create RLS policies
-- Drop existing policies first
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;  
DROP POLICY IF EXISTS "Enable insert for service role" ON public.users;

-- Create new policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Allow service role to insert (for trigger)
CREATE POLICY "Enable insert for service role" ON public.users
  FOR INSERT WITH CHECK (true);

-- Step 8: Test the setup
-- Check if function exists
SELECT routine_name, routine_type 
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- Check if trigger exists  
SELECT trigger_name, event_manipulation, event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check users table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;