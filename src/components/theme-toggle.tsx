"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="
          h-12 w-12 rounded-full border-2 
          bg-background/80 backdrop-blur-md
          border-border-divider/50
          hover:border-primary-cta/50
          hover:bg-card-background/90
          transition-all duration-300 ease-in-out
          shadow-lg hover:shadow-xl
          hover:scale-105
          group
        "
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500 group-hover:text-amber-600" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-500 group-hover:text-blue-600" />
      </Button>
    </div>
  )
} 