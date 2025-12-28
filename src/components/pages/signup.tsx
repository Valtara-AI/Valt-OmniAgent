"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useAuth } from "../auth-context"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { ValtLogo } from "../valt-logo"

interface SignUpProps {
  onToggleMode: () => void
}

export function SignUp({ onToggleMode }: SignUpProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const { signup, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password || !name || !confirmPassword) {
      toast.error("Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    const success = await signup(email, password, name)
    if (success) {
      toast.success("Account created successfully!")
    } else {
      toast.error("Failed to create account")
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
            <CardTitle className="text-2xl">Get started</CardTitle>
            <CardDescription>
              Create your Valt OmniAgent account
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-input-background"
              />
            </div>
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-input-background"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-input-background"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full gradient-primary btn-press" 
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <button
              onClick={onToggleMode}
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
            <p className="text-xs text-center text-muted-foreground">
              Demo mode: Use any valid information
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}