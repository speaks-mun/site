"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { CheckCircle, User as UserIcon, Sparkles } from 'lucide-react'
import Image from 'next/image'

interface UserStatusBannerProps {
  variant?: "success" | "welcome" | "minimal"
  showOnPage?: "all" | "auth" | "app"
  className?: string
}

export function UserStatusBanner({ 
  variant = "minimal", 
  showOnPage = "all",
  className = "" 
}: UserStatusBannerProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<{
    name?: string
    college_affiliation?: string
    onboarding_completed?: boolean
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          setUser(user)
          
          // Get additional user data from our database
          const { data: dbUser } = await supabase
            .from('users')
            .select('name, college_affiliation, onboarding_completed')
            .eq('id', user.id)
            .single()
          
          setUserData(dbUser)
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user)
          fetchUser()
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
          setUserData(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className={`animate-pulse bg-muted/50 rounded-lg p-2 ${className}`}>
        <div className="h-4 bg-muted rounded w-32"></div>
      </div>
    )
  }

  if (!user) {
    // Show login prompt for non-authenticated users
    if (showOnPage === "app") return null
    
    return (
      <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 ${className}`}>
        <div className="flex items-center space-x-2">
          <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <div>
            <p className="text-blue-800 dark:text-blue-200 font-medium text-sm">Not logged in</p>
            <p className="text-blue-600 dark:text-blue-300 text-xs">
              <a href="/auth/login" className="underline hover:no-underline">Sign in</a> to access all features
            </p>
          </div>
        </div>
      </div>
    )
  }

  const displayName = userData?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'

  // Success variant (for onboarding/auth pages)
  if (variant === "success") {
    return (
      <div className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-green-800 dark:text-green-200 font-semibold">Login Successful!</p>
            <p className="text-green-600 dark:text-green-300 text-sm">
              Welcome back, {displayName} • Ready to explore MUN events
            </p>
          </div>
          {user.user_metadata?.avatar_url && (
            <Image
              src={user.user_metadata.avatar_url}
              alt="Profile"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border-2 border-green-400"
            />
          )}
        </div>
      </div>
    )
  }

  // Welcome variant (for main app pages)
  if (variant === "welcome") {
    return (
      <div className={`bg-gradient-to-r from-primary-cta/10 to-blue-500/10 border border-primary-cta/20 rounded-lg p-4 ${className}`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            {user.user_metadata?.avatar_url ? (
              <Image
                src={user.user_metadata.avatar_url}
                alt="Profile"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border-2 border-primary-cta"
              />
            ) : (
              <div className="w-10 h-10 bg-primary-cta rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
            )}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <p className="text-foreground font-semibold">Welcome back, {displayName}!</p>
              <Sparkles className="w-4 h-4 text-primary-cta" />
            </div>
            <p className="text-muted-foreground text-sm">
              {userData?.college_affiliation && `${userData.college_affiliation} • `}
              Logged in and ready to discover
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Minimal variant (for header/navigation)
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        {user.user_metadata?.avatar_url ? (
          <Image
            src={user.user_metadata.avatar_url}
            alt="Profile"
            width={24}
            height={24}
            className="w-6 h-6 rounded-full border border-primary-cta/30"
          />
        ) : (
          <div className="w-6 h-6 bg-primary-cta rounded-full flex items-center justify-center">
            <UserIcon className="w-4 h-4 text-white" />
          </div>
        )}
        <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-background"></div>
      </div>
      <span className="text-sm font-medium text-foreground">{displayName}</span>
    </div>
  )
} 