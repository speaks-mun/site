"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  PlusCircle, 
  Heart, 
  Compass, 
  User, 
  Settings 
} from 'lucide-react'

const navigationItems = [
  {
    icon: Heart,
    label: 'Bookmarks',
    href: '/bookmarks',
  },
  {
    icon: Compass,
    label: 'Discover',
    href: '/discover',
  },
  {
    icon: PlusCircle,
    label: 'Create',
    href: '/create-event/invite',
    isLarge: true,
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
]

export function BottomNavbar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 w-full bg-card-background/95 backdrop-blur-md border-t border-border-divider">
      <div className="flex items-center justify-around p-2 max-w-md mx-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href === '/discover' && pathname === '/') ||
            (item.href === '/discover' && pathname.startsWith('/discover'))
          const Icon = item.icon

          if (item.isLarge) {
            // Central large create button
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  size="lg"
                  className={`
                    h-14 w-14 rounded-full bg-primary-cta text-white hover:bg-primary-cta/90 
                    shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200
                    ${isActive ? 'ring-2 ring-primary-cta ring-offset-2 ring-offset-background' : ''}
                  `}
                >
                  <Icon className="w-6 h-6" />
                </Button>
              </Link>
            )
          }

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className={`
                  flex flex-col items-center justify-center h-16 w-16 p-2 space-y-1
                  ${isActive 
                    ? 'text-primary-cta bg-primary-cta/10' 
                    : 'text-body-text hover:text-heading-text hover:bg-muted'
                  }
                `}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-primary-cta' : ''}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-primary-cta' : ''}`}>
                  {item.label}
                </span>
              </Button>
            </Link>
          )
        })}
      </div>
    </nav>
  )
} 