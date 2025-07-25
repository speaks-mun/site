import { supabase } from './supabase/client'

export async function logout() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error('Failed to sign out')
  }

  // Redirect to login page
  window.location.href = '/auth/login'
} 