"use client"

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { TopNavbar } from './top-navbar'
import { HamburgerMenu } from './hamburger-menu'
import { BottomNavbar } from './bottom-navbar'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false)
  const pathname = usePathname()

  // Determine if we should show filters (only on discover page)
  const showFilters = pathname === '/discover' || pathname.startsWith('/discover')

  const openHamburgerMenu = () => {
    setIsHamburgerMenuOpen(true)
  }

  const closeHamburgerMenu = () => {
    setIsHamburgerMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <TopNavbar 
        onMenuClick={openHamburgerMenu}
        showFilters={showFilters}
      />

      {/* Hamburger Menu */}
      <HamburgerMenu 
        isOpen={isHamburgerMenuOpen}
        onClose={closeHamburgerMenu}
      />

      {/* Main Content */}
      <main className="pt-16 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNavbar />
    </div>
  )
} 