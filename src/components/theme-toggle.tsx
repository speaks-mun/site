"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

interface ThemeToggleProps {
  variant?: "landing" | "app" | "menu"
  className?: string
}

export function ThemeToggle({ variant = "app", className = "" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Landing page version (bottom-left)
  if (variant === "landing") {
    return (
      <div className={`fixed bottom-6 left-6 z-50 ${className}`}>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="
            h-11 w-11 rounded-full border
            bg-background/80 backdrop-blur-md
            border-border/50 hover:border-border
            hover:bg-background/90
            transition-all duration-200
            shadow-lg hover:shadow-xl
          "
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4 text-foreground" />
          ) : (
            <Sun className="h-4 w-4 text-foreground" />
          )}
        </Button>
      </div>
    )
  }

  // Menu version (for hamburger menu)
  if (variant === "menu") {
    return (
      <div className={`flex items-center justify-between ${className}`}>
        <div className="flex items-center space-x-3">
          {theme === 'light' ? (
            <Sun className="w-5 h-5 text-foreground" />
          ) : (
            <Moon className="w-5 h-5 text-foreground" />
          )}
          <span className="text-foreground font-medium">
            {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="h-8 w-8 p-0"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>
      </div>
    )
  }

  // App version (global - top-right for desktop)
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={`
        h-9 w-9 rounded-lg
        hover:bg-muted
        transition-colors duration-200
        ${className}
      `}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 text-foreground" />
      ) : (
        <Sun className="h-4 w-4 text-foreground" />
      )}
    </Button>
  )
} 