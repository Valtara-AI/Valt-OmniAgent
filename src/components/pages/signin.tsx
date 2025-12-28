"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useAuth } from "../auth-context"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { ValtLogo } from "../valt-logo"

interface SignInProps {
  onToggleMode: () => void
}

export function SignIn({ onToggleMode }: SignInProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      toast.error("Please fill in all fields")
      return
    }

    const success = await login(email, password)
    if (success) {
      toast.success("Welcome to Valt OmniAgent!")
    } else {
      toast.error("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary)_0%,_transparent_50%)] opacity-10" />
      
      <Card className="w-full max-w-md card-glow relative z-10">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <ValtLogo className="h-12 w-auto" />
          </div>
          <div>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>
              Sign in to your Valt OmniAgent account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-input-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input-background"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full gradient-primary btn-press" 
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <button
              onClick={onToggleMode}
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-xs text-center text-muted-foreground">
              Demo credentials: any email and password
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}