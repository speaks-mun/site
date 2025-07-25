"use client"

import { ThemeToggle } from '@/components/theme-toggle'

interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Theme toggle in fixed position */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      
      {/* Main content centered */}
      <div className="flex items-center justify-center min-h-screen">
        {children}
      </div>
    </div>
  )
} 