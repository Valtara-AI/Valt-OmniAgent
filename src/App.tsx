"use client"

import React, { useState } from "react"
import { ThemeProvider } from "./components/theme-provider"
import { AuthProvider, useAuth } from "./components/auth-context"
import { Layout } from "./components/layout"
import { LandingPage } from "./components/pages/landing-page"
import { AboutPage } from "./components/pages/about-page"
import { ContactPage } from "./components/pages/contact-page"
import { HelpPage } from "./components/pages/help-page"
import { PrivacyPage } from "./components/pages/privacy-page"
import { TermsPage } from "./components/pages/terms-page"
import { AuthPage } from "./components/pages/auth-page"
import { SignIn } from "./components/pages/signin"
import { SignUp } from "./components/pages/signup"
import { Dashboard } from "./components/pages/dashboard"
import { LeadsPage } from "./components/pages/leads-page"
import { AgentAssist } from "./components/pages/agent-assist"
import { Analytics } from "./components/pages/analytics"
import { Integrations } from "./components/pages/integrations"
import { WorkflowBuilder } from "./components/pages/workflow-builder"
import { Dialer } from "./components/pages/dialer"
import { EnhancedCallingScreen } from "./components/pages/enhanced-calling-screen"
import { OmniagentReactivation } from "./components/pages/omniagent-reactivation"
import { EnterpriseCommandCenter } from "./components/pages/enterprise-command-center"
import { Settings } from "./components/pages/settings"
import { Milestones } from "./components/pages/milestones"
import { Toaster } from "./components/ui/sonner"
import { PostCallWorkflows } from "./components/pages/post-call-workflows"

function AppContent() {
  const { user, isLoading } = useAuth()
  const [currentPage, setCurrentPage] = useState("/")

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  const handlePageChange = (page: string) => {
    setCurrentPage(page)
  }

  // Determine what page to show based on auth state and current page
  let pageToShow = currentPage
  const publicPages = ["/", "/about", "/contact", "/help", "/privacy", "/terms", "/auth", "/signin", "/signup"]
  
  if (user) {
    // User is authenticated
    if (currentPage === "/signin" || currentPage === "/signup" || currentPage === "/") {
      pageToShow = "/command-center"
    }
  } else {
    // User is not authenticated
    if (!publicPages.includes(currentPage)) {
      pageToShow = "/"
    }
  }

  const renderPage = () => {
    // If not authenticated, show landing page, about page, or auth pages
    if (!user) {
      switch (pageToShow) {
        case "/about":
          return <AboutPage onGetDemo={() => setCurrentPage("/signin")} onBack={() => setCurrentPage("/")} />
        case "/contact":
          return <ContactPage onBack={() => setCurrentPage("/")} />
        case "/help":
          return <HelpPage onBack={() => setCurrentPage("/")} />
        case "/privacy":
          return <PrivacyPage onBack={() => setCurrentPage("/")} />
        case "/terms":
          return <TermsPage onBack={() => setCurrentPage("/")} />
        case "/auth":
          return <AuthPage />
        case "/signin":
          return <SignIn onToggleMode={() => setCurrentPage("/signup")} />
        case "/signup":
          return <SignUp onToggleMode={() => setCurrentPage("/signin")} />
        default:
          return <LandingPage 
            onGetDemo={() => setCurrentPage("/signin")} 
            onAbout={() => setCurrentPage("/about")}
            onViewDashboard={() => setCurrentPage("/signin")}
          />
      }
    }

    // If authenticated, show main application pages
    switch (pageToShow) {
      case "/":
      case "/command-center":
        return <EnterpriseCommandCenter onPageChange={handlePageChange} />
      case "/dashboard":
        return <Dashboard onPageChange={handlePageChange} />
      case "/leads":
        return <LeadsPage />
      case "/agent":
        return <AgentAssist onPageChange={handlePageChange} />
      case "/dialer":
        return <Dialer />
      case "/enhanced-calling":
        return <EnhancedCallingScreen />
      case "/omniagent":
        return <OmniagentReactivation />
      case "/workflows":
        return <WorkflowBuilder />
      case "/integrations":
        return <Integrations />
      case "/analytics":
        return <Analytics />
      case "/milestones":
        return <Milestones />
      case "/settings":
        return <Settings />
      case "/post-call":
        return <PostCallWorkflows />
      default:
        return <EnterpriseCommandCenter onPageChange={handlePageChange} />
    }
  }

  return (
    <Layout currentPage={pageToShow} onPageChange={handlePageChange} isAuthenticated={!!user}>
      {renderPage()}
      <Toaster />
    </Layout>
  )
}

// Minimal app wrapper to prevent environment conflicts
function SafeApp() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="valt-ui-theme">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default function App() {
  return <SafeApp />
}
