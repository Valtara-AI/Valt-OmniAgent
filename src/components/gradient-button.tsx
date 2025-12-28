import React from "react"
import { Button } from "./ui/button"
import { cn } from "./ui/utils"

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export function GradientButton({ 
  variant = "primary", 
  size = "md", 
  className,
  children,
  ...props 
}: GradientButtonProps) {
  const gradientClass = variant === "primary" ? "gradient-primary" : "gradient-accent"
  
  const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4",
    lg: "h-12 px-6 text-lg"
  }

  return (
    <Button
      className={cn(
        gradientClass,
        sizeClasses[size],
        "btn-press text-white border-0 hover:shadow-lg transition-all duration-200",
        variant === "primary" ? "hover:glow-primary" : "hover:glow-accent",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
