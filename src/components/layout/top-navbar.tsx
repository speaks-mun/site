"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FilterBar } from '@/components/discovery/filter-bar'
import Link from 'next/link'
import { 
  Menu, 
  Bell, 
  Search,
  X
} from 'lucide-react'

interface TopNavbarProps {
  onMenuClick: () => void
  showFilters?: boolean
}

export function TopNavbar({ onMenuClick, showFilters = false }: TopNavbarProps) {
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [unreadNotifications] = useState(3) // Mock notification count

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-card-background/80 backdrop-blur-md border-b border-border-divider">
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
          <div className="w-8 h-8 bg-primary-cta rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-heading-text text-xl md:text-2xl font-bold">
            Speaks
          </span>
        </Link>

        {/* Desktop Filters Area */}
        {showFilters && (
          <div className="hidden lg:flex flex-grow max-w-md ml-8">
            <FilterBar />
          </div>
        )}

        {/* Mobile Search Toggle (shown only when filters are enabled) */}
        {showFilters && (
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMobileSearch(!showMobileSearch)}
              className="p-2"
            >
              {showMobileSearch ? (
                <X className="w-5 h-5" />
              ) : (
                <Search className="w-5 h-5" />
              )}
            </Button>
          </div>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="sm"
            className="p-2 relative"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <Badge 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs"
              >
                {unreadNotifications}
              </Badge>
            )}
          </Button>

          {/* Hamburger Menu */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="p-2"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Filters */}
      {showFilters && showMobileSearch && (
        <div className="lg:hidden border-t border-border-divider bg-card-background p-4">
          <FilterBar />
        </div>
      )}
    </header>
  )
} 