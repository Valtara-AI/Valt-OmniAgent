"use client"

import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (email: string, password: string, name: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

// Simple storage wrapper to prevent errors
const storage = {
  get: (key: string) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key)
      }
    } catch {
      // Silent fail
    }
    return null
  },
  set: (key: string, value: string) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value)
      }
    } catch {
      // Silent fail
    }
  },
  remove: (key: string) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key)
      }
    } catch {
      // Silent fail
    }
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simple auth check with minimal delay
    const timer = setTimeout(() => {
      try {
        const savedUser = storage.get("valt-user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      } catch {
        storage.remove("valt-user")
      }
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    
    // Minimal delay to simulate auth
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (email && password) {
      const mockUser: User = {
        id: "1",
        email,
        name: email.split("@")[0],
        role: "Agent",
        avatar: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="#6B5BFF"/><text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">${email.split("@")[0].charAt(0).toUpperCase()}</text></svg>`)}`
      }
      setUser(mockUser)
      storage.set("valt-user", JSON.stringify(mockUser))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true)
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (email && password && name) {
      const mockUser: User = {
        id: "1",
        email,
        name,
        role: "Agent",
        avatar: `data:image/svg+xml;base64,${btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="#6B5BFF"/><text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="16" font-weight="bold">${name.charAt(0).toUpperCase()}</text></svg>`)}`
      }
      setUser(mockUser)
      storage.set("valt-user", JSON.stringify(mockUser))
      setIsLoading(false)
      return true
    }
    
    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    storage.remove("valt-user")
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}