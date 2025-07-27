"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { User as UserIcon, LogOut } from 'lucide-react'
import Link from 'next/link'
import { logout } from '@/lib/auth-actions'
import { useApiAction } from '@/hooks/use-api-action'
import Image from 'next/image'

interface UserAvatarProps {
  variant?: "navbar" | "mobile"
  className?: string
  showDropdown?: boolean
}

export function UserAvatar({ variant = "navbar", className = "", showDropdown = false }: UserAvatarProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showMenu, setShowMenu] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    fetchUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const { execute: handleLogout } = useApiAction(
    async () => {
      await logout()
      setShowMenu(false)
    },
    {
      successMessage: "Logged out successfully",
    }
  )

  if (loading) {
    return (
      <div className={`h-8 w-8 rounded-full bg-muted animate-pulse ${className}`} />
    )
  }

  if (!user) {
    // Show login button when not authenticated
    return (
      <Link href="/auth/login">
        <Button variant="ghost" size="sm" className={`gap-2 ${className}`}>
          <UserIcon className="w-4 h-4" />
          {variant === "navbar" && <span className="hidden md:inline">Login</span>}
        </Button>
      </Link>
    )
  }

  // Get user's name and avatar
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const userAvatar = user.user_metadata?.avatar_url || null
  const userEmail = user.email || ''

  // Simple version without dropdown
  if (!showDropdown) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="relative">
          {userAvatar ? (
            <Image
              src={userAvatar}
              alt={userName}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover border-2 border-primary-cta/20"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-cta to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          
          {/* Online indicator */}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
        </div>
        
        {variant === "navbar" && (
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-medium text-foreground">{userName}</span>
            <span className="text-xs text-muted-foreground">Online</span>
          </div>
        )}
      </div>
    )
  }

  // Version with simple dropdown menu
  return (
    <div className={`relative ${className}`}>
      <Button
        variant="ghost"
        className="h-auto p-1 rounded-full"
        onClick={() => setShowMenu(!showMenu)}
      >
        <div className="relative">
          {userAvatar ? (
            <Image
              src={userAvatar}
              alt={userName}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-cta to-blue-500 flex items-center justify-center text-white text-sm font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
        </div>
      </Button>

      {/* Simple dropdown menu */}
      {showMenu && (
        <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">{userEmail}</p>
          </div>
          
          <div className="p-1">
            <Link href="/profile" onClick={() => setShowMenu(false)}>
              <Button variant="ghost" className="w-full justify-start h-8 px-2 text-sm">
                <UserIcon className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
            
            <Button 
              variant="ghost" 
              className="w-full justify-start h-8 px-2 text-sm text-red-600 hover:text-red-600"
              onClick={() => handleLogout({})}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      )}
      
      {/* Backdrop to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  )
} 