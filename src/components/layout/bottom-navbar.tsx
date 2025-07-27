"use client"

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Search, 
  Plus, 
  Clock, 
  User 
} from 'lucide-react'

const navigationItems = [
  {
    icon: Home,
    label: 'Home',
    href: '/discover',
  },
  {
    icon: Search,
    label: 'Search',
    href: '/search',
  },
  {
    icon: Clock,
    label: 'History',
    href: '/my-events',
  },
  {
    icon: User,
    label: 'Profile',
    href: '/profile',
  },
]

const centerAction = {
  icon: Plus,
  label: 'Create',
  href: '/create-event/invite',
}

export function BottomNavbar() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none">
      <div className="max-w-md mx-auto relative pointer-events-auto">
        {/* Main Navigation Container */}
        <nav className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-3xl shadow-2xl p-4">
          <div className="flex items-center justify-between">
            {navigationItems.map((item, index) => {
              const isActive = pathname === item.href || 
                (item.href === '/discover' && pathname === '/') ||
                (item.href === '/discover' && pathname.startsWith('/discover'))
              const Icon = item.icon

              return (
                <div key={item.href} className="flex-1 flex justify-center">
                  {/* Add spacer for center button */}
                  {index === 2 && <div className="w-14"></div>}
                  
                  <Link href={item.href} className="flex flex-col items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`
                        h-10 w-10 rounded-xl transition-all duration-200
                        ${isActive 
                          ? 'bg-foreground text-background hover:bg-foreground/90' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                    </Button>
                    
                    {/* Labels below icons */}
                    <span className={`text-xs font-medium transition-colors duration-200 ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                </div>
              )
            })}
          </div>
        </nav>

        {/* Floating Center Action Button */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Link href={centerAction.href}>
            <Button
              size="icon"
              className={`
                h-14 w-14 rounded-full bg-foreground text-background hover:bg-foreground/90
                shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200
                border-4 border-background
                ${pathname === centerAction.href ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background' : ''}
              `}
            >
              <centerAction.icon className="w-6 h-6" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 