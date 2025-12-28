"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "valt-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Minimal theme setup
    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          const storedTheme = localStorage.getItem(storageKey) as Theme
          if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
            setTheme(storedTheme)
          }
        }
      } catch {
        // Ignore errors
      }
      setMounted(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [storageKey])

  useEffect(() => {
    if (!mounted) return

    try {
      const root = window.document.documentElement
      root.classList.remove("light", "dark")

      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        root.classList.add(systemTheme)
      } else {
        root.classList.add(theme)
      }
    } catch {
      // Ignore errors
    }
  }, [theme, mounted])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(storageKey, theme)
        }
      } catch {
        // Ignore errors
      }
      setTheme(theme)
    },
  }

  // Simple loading state
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
