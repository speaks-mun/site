import { supabase } from './supabase/client'

export async function logout() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error('Failed to sign out')
  }

  // Redirect to login page
  window.location.href = '/auth/login'
} 

export async function getUserSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Error getting session:', error)
      return null
    }
    
    return session
  } catch (error) {
    console.error('Unexpected error getting session:', error)
    return null
  }
}

export async function refreshSession() {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession()
    
    if (error) {
      console.error('Error refreshing session:', error)
      return null
    }
    
    return session
  } catch (error) {
    console.error('Unexpected error refreshing session:', error)
    return null
  }
} 