"use client"

import { useState } from "react"
import { SignIn } from "./signin"
import { SignUp } from "./signup"

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false)

  return isSignUp ? (
    <SignUp onToggleMode={() => setIsSignUp(false)} />
  ) : (
    <SignIn onToggleMode={() => setIsSignUp(true)} />
  )
}
