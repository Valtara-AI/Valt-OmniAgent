"use client"

import { LogOut, Settings, User } from "lucide-react"
import { useAuth } from "./auth-context"
import { GradientButton } from "./gradient-button"
import { Navigation } from "./navigation"
import { ThemeToggle } from "./theme-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { ValtLogo } from "./valt-logo"

interface LayoutProps {
  children: React.ReactNode
  currentPage: string
  onPageChange: (page: string) => void
  isAuthenticated: boolean
}

export function Layout({ children, currentPage, onPageChange, isAuthenticated }: LayoutProps) {
  const { user, logout } = useAuth()
  
  // Show different navigation based on authentication state
  const isDashboard = isAuthenticated && (currentPage === "/dashboard" || currentPage === "/")
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header - Always shown, but content changes */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex h-16 items-center justify-between px-6">
          <button onClick={() => onPageChange("/")} className="cursor-pointer" title="Valt Home" aria-label="Go to Valt home">
            <ValtLogo size="md" />
          </button>
          
          {/* Main navigation - only for non-authenticated users */}
          {!isAuthenticated && (
            <nav className="hidden md:flex items-center space-x-6">
              <button onClick={() => onPageChange("/about")} className="text-sm font-medium text-muted-foreground hover:text-primary">About</button>
              <button onClick={() => onPageChange("/contact")} className="text-sm font-medium text-muted-foreground hover:text-primary">Contact</button>
              <button onClick={() => onPageChange("/help")} className="text-sm font-medium text-muted-foreground hover:text-primary">Help</button>
            </nav>
          )}
          
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onPageChange("/dashboard")}>
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onPageChange("/settings")}>
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" size="sm" onClick={() => onPageChange("/signin")}>
                    Sign In
                  </Button>
                  <GradientButton size="sm" onClick={() => onPageChange("/signin")}>
                    Get Demo
                  </GradientButton>
                </>
              )}
            </div>
          </div>
        </header>

      <div className="flex">
        {/* Sidebar - Only show on non-dashboard pages */}
        {isAuthenticated && !isDashboard && currentPage !== "/auth" && currentPage !== "/about" && currentPage !== "/contact" && currentPage !== "/help" && currentPage !== "/privacy" && currentPage !== "/terms" && currentPage !== "/signin" && currentPage !== "/signup" && (
          <aside className="w-64 border-r border-border bg-card/30 backdrop-blur-sm sticky min-h-[calc(100vh-4rem)] top-16">
            <div className="p-4">
              <Navigation currentPage={currentPage} onPageChange={onPageChange} />
            </div>
          </aside>
        )}

        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

  {/* Chat Widget removed per request */}

      {/* Footer - only show on landing and auth pages */}
      {(!isAuthenticated || currentPage === "/" || currentPage === "/auth" || currentPage === "/about" || currentPage === "/contact" || currentPage === "/help" || currentPage === "/privacy" || currentPage === "/terms" || currentPage === "/signin" || currentPage === "/signup") && (
        <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-16">
          <div className="px-6 py-12">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Company Info */}
                <div className="space-y-4">
                  <button onClick={() => onPageChange("/")} className="cursor-pointer" title="Valt Home" aria-label="Go to Valt home">
                    <ValtLogo size="sm" />
                  </button>
                  <p className="text-sm text-muted-foreground">
                    AI-powered lead reactivation for fitness studios. Transform dormant members into active revenue.
                  </p>
                </div>

                {/* Product Links */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Product</h4>
                  <div className="space-y-2">
                    <button onClick={() => onPageChange("/about")} className="block text-sm text-muted-foreground hover:text-primary">About</button>
                    <button onClick={() => onPageChange("/help")} className="block text-sm text-muted-foreground hover:text-primary">Help Center</button>
                    <a href="#" className="block text-sm text-muted-foreground hover:text-primary">API Docs</a>
                    <a href="#" className="block text-sm text-muted-foreground hover:text-primary">System Status</a>
                  </div>
                </div>

                {/* Support Links */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Support</h4>
                  <div className="space-y-2">
                    <button onClick={() => onPageChange("/contact")} className="block text-sm text-muted-foreground hover:text-primary">Contact Us</button>
                    <a href="#" className="block text-sm text-muted-foreground hover:text-primary">Schedule Demo</a>
                    <a href="#" className="block text-sm text-muted-foreground hover:text-primary">Community</a>
                    <a href="#" className="block text-sm text-muted-foreground hover:text-primary">Training</a>
                  </div>
                </div>

                {/* Legal Links */}
                <div className="space-y-4">
                  <h4 className="font-semibold">Legal</h4>
                  <div className="space-y-2">
                    <button onClick={() => onPageChange("/privacy")} className="block text-sm text-muted-foreground hover:text-primary">Privacy Policy</button>
                    <button onClick={() => onPageChange("/terms")} className="block text-sm text-muted-foreground hover:text-primary">Terms of Service</button>
                    <a href="#" className="block text-sm text-muted-foreground hover:text-primary">Security</a>
                    <a href="#" className="block text-sm text-muted-foreground hover:text-primary">Compliance</a>
                  </div>
                </div>
              </div>

              <div className="border-t border-border mt-8 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="text-sm text-muted-foreground mb-4 md:mb-0">
                    © 2025 Valtara Inc. All rights reserved.
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-muted-foreground">Theme:</span>
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}
