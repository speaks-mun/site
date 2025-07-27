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
    <div className="fixed bottom-0 left-0 right-0 z-50 p-6 pointer-events-none">
      <div className="max-w-sm mx-auto relative pointer-events-auto">
        {/* Main Navigation Rectangle */}
        <div className="bg-background/90 backdrop-blur-xl border border-border/20 rounded-2xl px-6 py-4 shadow-2xl">
          <div className="flex items-center justify-between">
            {navigationItems.map((item, index) => {
              const isActive = pathname === item.href || 
                (item.href === '/discover' && pathname === '/') ||
                (item.href === '/discover' && pathname.startsWith('/discover'))
              const Icon = item.icon

              return (
                <div key={item.href} className="flex flex-col items-center gap-1">
                  {/* Add spacing for center circle */}
                  {index === 2 && <div className="w-12 opacity-0"></div>}
                  
                  <Link href={item.href} className="flex flex-col items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`
                        h-8 w-8 rounded-lg transition-all duration-300
                        ${isActive 
                          ? 'bg-foreground text-background shadow-md' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                    </Button>
                    
                    <span className={`text-xs font-medium transition-colors duration-300 ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}>
                      {item.label}
                    </span>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* Floating Center Circle - Half cutting into rectangle */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Link href={centerAction.href}>
            <Button
              size="icon"
              className={`
                h-16 w-16 rounded-full 
                bg-gradient-to-br from-foreground to-foreground/80 
                text-background hover:from-foreground/90 hover:to-foreground/70
                shadow-2xl hover:shadow-3xl 
                transform hover:scale-105 active:scale-95 
                transition-all duration-300 ease-out
                border-4 border-background
                ${pathname === centerAction.href ? 'ring-2 ring-foreground/20 ring-offset-2 ring-offset-background' : ''}
              `}
            >
              <centerAction.icon className="w-7 h-7" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
} 