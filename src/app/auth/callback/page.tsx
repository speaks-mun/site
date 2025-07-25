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

  if (error) {
    redirect('/auth/login?error=auth_failed')
  }

  if (code) {
    const supabase = await createClient()
    
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      redirect('/auth/login?error=auth_failed')
    }

    if (data.user) {
      // Check if user exists in our database and needs onboarding
      const { data: userData } = await supabase
        .from('users')
        .select('id, onboarding_completed')
        .eq('id', data.user.id)
        .single()

      // If user doesn't exist or hasn't completed onboarding, redirect to onboarding
      if (!userData || !userData.onboarding_completed) {
        redirect('/auth/onboarding')
      } else {
        // User exists and completed onboarding, redirect to discover
        redirect('/discover')
      }
    }
  }

  // Fallback redirect
  redirect('/auth/login')
}

// Loading component while processing
function LoadingMessage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-cta mx-auto mb-4"></div>
        <p className="text-body-text">Completing sign in...</p>
      </div>
    </div>
  )
} 