"use client"

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  X, 
  Compass, 
  Calendar, 
  User, 
  Settings, 
  Mail, 
  LogOut
} from 'lucide-react'
import { logout } from '@/lib/auth-actions'
import { useApiAction } from '@/hooks/use-api-action'
import { ThemeToggle } from '@/components/theme-toggle'

interface HamburgerMenuProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  {
    icon: Compass,
    label: 'Discover',
    href: '/discover',
  },
  {
    icon: Calendar,
    label: 'My Events',
    href: '/my-events',
  },
  {
    icon: User,
    label: 'Profile',
    href: '/profile',
  },
  {
    icon: Settings,
    label: 'Settings',
    href: '/settings',
  },
  {
    icon: Mail,
    label: 'Support',
    href: '/support',
  },
]

  export function HamburgerMenu({ isOpen, onClose }: HamburgerMenuProps) {
    const pathname = usePathname()

  // Close menu on route change
  useEffect(() => {
    onClose()
  }, [pathname, onClose])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const { execute: handleLogout, isLoading: logoutLoading } = useApiAction(
    async () => {
      await logout()
    },
    {
      successMessage: "Logged out successfully",
    }
  )



  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className={`
        fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-card-background border-l border-border-divider z-50
        transform transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border-divider">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-cta rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-heading-text text-xl font-bold">Speaks</span>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-2 hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-6">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={`
                        w-full justify-start h-12 text-left
                        ${isActive 
                          ? 'bg-primary-cta/10 text-primary-cta border-primary-cta/20' 
                          : 'text-body-text hover:text-heading-text hover:bg-muted'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Theme Toggle */}
          <div className="p-6 border-t border-border-divider">
            <ThemeToggle variant="menu" />
          </div>

          <Separator />

          {/* Logout Button */}
          <div className="p-6">
            <Button
              onClick={() => handleLogout({})}
              disabled={logoutLoading}
              variant="outline"
              className="w-full justify-start h-12 text-destructive border-destructive/20 hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5 mr-3" />
              {logoutLoading ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
} 