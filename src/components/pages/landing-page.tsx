"use client"

import { ArrowRight, Phone, Users, Zap, BarChart3, Bot, Workflow, Database, MessageSquare, Target } from "lucide-react"
import { GradientButton } from "../gradient-button"
import { Button } from "../ui/button"
import { Card } from "../ui/card"

const coreFeatures = [
  {
    icon: Database,
    title: "Smart Database Scanning",
    description: "Automatically scans dormant databases, prioritizes leads based on engagement history, and generates targeted call lists with AI-powered scoring.",
    highlight: "Scan dormant databases & prioritize leads"
  },
  {
    icon: MessageSquare,
    title: "Omni-Channel Outreach",
    description: "Orchestrates coordinated outbound campaigns across phone, email, and SMS channels with intelligent timing and personalization.",
    highlight: "Orchestrate phone + email/SMS outreach"
  },
  {
    icon: Bot,
    title: "AI-Powered Call Assistance",
    description: "Support agents with real-time AI suggestions, objection handling, conversation insights, and next-best-action recommendations during calls.",
    highlight: "Agent-assisted calls with AI suggestions"
  },
  {
    icon: Workflow,
    title: "Automated Follow-Ups",
    description: "Intelligent retry logic and multi-channel workflows that adapt based on lead responses, engagement, and behavioral patterns.",
    highlight: "Multi-channel workflows with retry logic"
  },
  {
    icon: Target,
    title: "KPI Dashboards & ROI Tracking",
    description: "Comprehensive dashboards with real-time KPIs, conversion tracking, revenue attribution, and ROI visibility for data-driven decisions.",
    highlight: "Complete visibility & ROI tracking"
  }
]

const additionalFeatures = [
  {
    icon: Phone,
    title: "Click-to-Call Integration", 
    description: "Seamless dialer with real-time suggestions, call recording, and automatic CRM updates for maximum efficiency."
  },
  {
    icon: Users,
    title: "Smart Lead Scoring",
    description: "Advanced algorithms analyze member behavior, engagement patterns, and likelihood to re-engage for prioritized outreach."
  },
  {
    icon: Zap,
    title: "CRM Integrations",
    description: "Native integrations with Mindbody, Zen Planner, ClubReady, and other fitness platforms for seamless data sync."
  }
]

interface LandingPageProps {
  onGetDemo?: () => void
  onAbout?: () => void
  onViewDashboard?: () => void
}

export function LandingPage({ onGetDemo, onAbout, onViewDashboard }: LandingPageProps = {}) {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            AI-Powered{" "}
            <span className="gradient-primary bg-clip-text text-transparent">
              Lead Reactivation Agent
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Transform dormant leads into active members with intelligent database scanning, 
            omni-channel outreach orchestration, and AI-assisted calling designed specifically for fitness studios.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <GradientButton size="lg" className="min-w-[140px]" onClick={onGetDemo}>
              Get Demo <ArrowRight className="ml-2 h-4 w-4" />
            </GradientButton>
            <Button variant="outline" size="lg" className="min-w-[140px]" onClick={onViewDashboard}>
              View Dashboard
            </Button>
            <Button variant="ghost" size="lg" className="min-w-[140px]" onClick={onAbout}>
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">85%</div>
              <div className="text-sm text-muted-foreground">Reactivation Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-accent mb-2">3.2x</div>
              <div className="text-sm text-muted-foreground">ROI Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">AI Assistant</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              What Valt OmniAgent Will Do
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Five core capabilities that transform your dormant leads into active, paying members
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={index} 
                  className="p-8 card-glow relative overflow-hidden group cursor-pointer"
                >
                  {/* Decorative edge */}
                  <div className="absolute left-0 top-0 w-1 h-full gradient-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-start space-x-6">
                    <div className="gradient-accent rounded-xl p-3 group-hover:glow-accent transition-all flex-shrink-0">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="inline-block gradient-primary bg-clip-text text-transparent text-sm font-medium mb-2">
                        ● {feature.highlight}
                      </div>
                      <h3 className="font-semibold mb-3 text-lg">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Plus Additional Features
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={index} 
                  className="p-6 card-glow relative overflow-hidden group cursor-pointer"
                >
                  {/* Decorative edge */}
                  <div className="absolute left-0 top-0 w-1 h-full gradient-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-start space-x-4">
                    <div className="gradient-accent rounded-lg p-2 group-hover:glow-accent transition-all">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="gradient-primary rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Reactivate Your Leads?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Join hundreds of fitness studios already growing their revenue with AI-powered lead reactivation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="border-blue text-white hover:bg-white/10 btn-press"
                onClick={onGetDemo}
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10 btn-press"
                onClick={onGetDemo}
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}