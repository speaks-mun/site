import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const code = params.code as string
  const error = params.error as string

  console.log('Auth callback received - Code:', !!code, 'Error:', error)

  if (error) {
    console.error('OAuth callback error:', error)
    redirect('/auth/login?error=auth_failed')
  }

  if (code) {
    const supabase = await createClient()
    
    try {
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError)
        redirect('/auth/login?error=exchange_failed')
      }

      if (data.user) {
        console.log('User authenticated successfully:', data.user.id)
        
        // Check if user exists in our database and needs onboarding
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, onboarding_completed')
          .eq('id', data.user.id)
          .single()

        if (userError && userError.code !== 'PGRST116') {
          // PGRST116 is "not found" error, which is fine for new users
          console.error('Database error checking user:', userError)
        }

        // If user doesn't exist or hasn't completed onboarding, redirect to onboarding
        if (!userData || !userData.onboarding_completed) {
          console.log('Redirecting to onboarding - User data:', userData)
          redirect('/auth/onboarding')
        } else {
          // User exists and completed onboarding, redirect to discover
          console.log('User found and onboarded, redirecting to discover')
          redirect('/discover')
        }
      }
    } catch (error) {
      console.error('Unexpected error in auth callback:', error)
      redirect('/auth/login?error=unexpected')
    }
  }

  // Fallback redirect
  console.log('No code provided, redirecting to login')
  redirect('/auth/login?error=no_code')
}

 