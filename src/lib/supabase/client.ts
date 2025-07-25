import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mnsecoyoquxymxckvnqj.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1uc2Vjb3lvcXV4eW14Y2t2bnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxOTQ0NDgsImV4cCI6MjA2ODc3MDQ0OH0.3u7qFv3f3w8-juDNuMvG0mx79YaNNSAHbEKedL7o2S0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
  },
}) 