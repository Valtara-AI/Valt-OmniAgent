"use client"

import { CheckCircle, Users, Building2, TrendingUp, Award, Zap, Shield, Globe, Phone, Mail, MessageSquare, Database, Bot, RotateCcw, Target, BarChart3 } from "lucide-react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { GradientButton } from "../gradient-button"

const coreFeatures = [
  {
    icon: Database,
    title: "Dormant Database Scanning",
    description: "AI-powered analysis of your inactive members with intelligent prioritization and lead scoring algorithms."
  },
  {
    icon: Phone,
    title: "Multi-Channel Outreach",
    description: "Orchestrated phone + email/SMS campaigns with smart channel switching and optimal timing."
  },
  {
    icon: Bot,
    title: "Agent-Assisted Calls",
    description: "Real-time AI suggestions, objection handling, and live coaching during calls for maximum conversion."
  },
  {
    icon: RotateCcw,
    title: "Intelligent Retry Logic",
    description: "Automated follow-ups with smart retry sequences and escalation rules across multiple channels."
  },
  {
    icon: BarChart3,
    title: "ROI Tracking Dashboard",
    description: "Real-time KPIs including reactivation rate, call-to-meeting ratio, and revenue attribution."
  }
]

const benefits = [
  {
    icon: TrendingUp,
    title: "Increase Revenue by 3.2x",
    description: "Transform dormant leads into active paying members with proven AI-powered reactivation strategies."
  },
  {
    icon: Users,
    title: "85% Reactivation Success Rate",
    description: "Industry-leading conversion rates through intelligent lead scoring and personalized outreach campaigns."
  },
  {
    icon: Zap,
    title: "Reduce Manual Work by 90%",
    description: "Automate repetitive tasks with smart workflows, allowing your team to focus on high-value activities."
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description: "SOC 2 compliant platform with end-to-end encryption and comprehensive data protection."
  }
]

const integrations = [
  { name: "Mindbody", logo: "MB", description: "Webhook-first CRM integration" },
  { name: "Zen Planner", logo: "ZP", description: "Real-time member sync" },
  { name: "ClubReady", logo: "CR", description: "Dormancy detection" },
  { name: "Twilio Flex", logo: "TF", description: "Enterprise dialer integration" },
  { name: "Aircall", logo: "AC", description: "Cloud phone system" },
  { name: "HubSpot", logo: "HS", description: "Marketing automation" }
]

const stats = [
  { value: "500+", label: "Fitness Studios" },
  { value: "2.5M+", label: "Leads Reactivated" },
  { value: "$125M+", label: "Revenue Generated" },
  { value: "84.2%", label: "Avg Reactivation Rate" }
]

interface AboutPageProps {
  onGetDemo?: () => void
  onBack?: () => void
}

export function AboutPage({ onGetDemo, onBack }: AboutPageProps = {}) {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About{" "}
              <span className="gradient-primary bg-clip-text text-transparent">
                Valt OmniAgent
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-4xl mx-auto">
              The first AI-powered Lead Reactivation Agent specifically designed for fitness studios. 
              We scan dormant databases, prioritize leads, orchestrate multi-channel outreach, 
              and provide real-time agent assistance to maximize conversions.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GradientButton size="lg" onClick={onGetDemo}>
                Get Started Today
              </GradientButton>
              <Button variant="outline" size="lg" onClick={onBack}>
                Back to Home
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold gradient-primary bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="py-20 px-6 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Complete Lead Reactivation Solution</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything you need to scan, prioritize, contact, and convert dormant leads into active members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card 
                  key={index} 
                  className="p-8 card-glow relative overflow-hidden group"
                >
                  {/* Decorative edge */}
                  <div className="absolute left-0 top-0 w-1 h-full gradient-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="text-center">
                    <div className="gradient-accent rounded-xl p-4 w-16 h-16 mx-auto mb-6 group-hover:glow-accent transition-all flex items-center justify-center">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Valt OmniAgent Works</h2>
            <p className="text-lg text-muted-foreground">
              Five-step automated process that transforms dormant leads into active members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { 
                step: "01", 
                title: "Scan Database", 
                desc: "AI scans dormant databases and identifies reactivation candidates",
                icon: Database
              },
              { 
                step: "02", 
                title: "Prioritize Leads", 
                desc: "Smart scoring algorithm ranks leads by conversion probability",
                icon: Target
              },
              { 
                step: "03", 
                title: "Generate Call Lists", 
                desc: "Creates prioritized call lists with optimal contact timing",
                icon: Phone
              },
              { 
                step: "04", 
                title: "Orchestrate Outreach", 
                desc: "Multi-channel phone + email/SMS with retry logic",
                icon: MessageSquare
              },
              { 
                step: "05", 
                title: "Track ROI", 
                desc: "Real-time dashboards show reactivation rates and revenue",
                icon: BarChart3
              }
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <div key={index} className="text-center">
                  <div className="gradient-primary rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-medium text-primary mb-2">Step {item.step}</div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-8">
            We believe every fitness studio has untapped potential sitting in their dormant member database. 
            Our mission is to help you reconnect with past members through intelligent AI-powered outreach 
            that feels personal, not pushy. We combine advanced machine learning with deep fitness industry 
            expertise to deliver results that matter to your bottom line.
          </p>
          
          <Card className="p-8 card-glow">
            <div className="gradient-primary rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4">Built for Fitness Studios</h3>
            <p className="text-muted-foreground">
              Unlike generic CRM tools, Valt OmniAgent understands the unique challenges of fitness businesses. 
              From seasonal membership fluctuations to class-specific preferences, our AI is trained on fitness 
              industry data to deliver relevant, contextual outreach that converts.
            </p>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Valt OmniAgent?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Proven results that help fitness studios grow their revenue and retain more members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <Card 
                  key={index} 
                  className="p-8 card-glow relative overflow-hidden group"
                >
                  {/* Decorative edge */}
                  <div className="absolute left-0 top-0 w-1 h-full gradient-primary opacity-60 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex items-start space-x-6">
                    <div className="gradient-accent rounded-xl p-3 group-hover:glow-accent transition-all flex-shrink-0">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 px-6 bg-muted/20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Enterprise Integrations</h2>
          <p className="text-muted-foreground mb-8">
            Seamless webhook-first integrations with your existing fitness management and communication platforms
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {integrations.map((integration, index) => (
              <Card key={index} className="p-6 card-glow group">
                <div className="flex items-center space-x-4">
                  <div className="gradient-accent rounded-lg w-12 h-12 flex items-center justify-center text-white font-bold group-hover:glow-accent transition-all">
                    {integration.logo}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold">{integration.name}</div>
                    <div className="text-sm text-muted-foreground">{integration.description}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features Deep Dive */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Advanced Features</h2>
            <p className="text-lg text-muted-foreground">
              Enterprise-grade capabilities designed for fitness industry success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6">AI-Powered Intelligence</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <strong>Dormancy Detection:</strong> Automatically identifies members who've become inactive with configurable thresholds
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <strong>Lead Scoring:</strong> AI algorithms rank leads by reactivation probability and lifetime value
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <strong>Personalized Scripts:</strong> LLM generates contextual conversation starters based on member history
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <strong>Real-time Coaching:</strong> Live AI suggestions during calls with objection handling
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Automation & ROI</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <strong>Multi-Channel Orchestration:</strong> Coordinated phone, email, and SMS campaigns with smart timing
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <strong>Intelligent Retry Logic:</strong> Automated follow-ups with channel switching and escalation rules
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <strong>Performance Tracking:</strong> Real-time KPIs including call-to-meeting ratio and reactivation rates
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <strong>ROI Visibility:</strong> Track revenue attribution and campaign performance with detailed analytics
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="gradient-primary rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Unlock Your Hidden Revenue?
            </h2>
            <p className="text-lg opacity-90 mb-8">
              Join hundreds of fitness studios using Valt OmniAgent to reactivate dormant leads, 
              orchestrate multi-channel outreach, and grow their business with AI-powered automation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="border-white text-white hover:bg-white/10 btn-press"
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
