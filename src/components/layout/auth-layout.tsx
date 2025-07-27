"use client"

import { ThemeToggle } from '@/components/theme-toggle'

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Professional theme toggle (now positioned bottom-left internally) */}
      <ThemeToggle />
      
      {/* Main content centered */}
      <div className="flex items-center justify-center min-h-screen p-4">
        {children}
      </div>
    </div>
  )
} 