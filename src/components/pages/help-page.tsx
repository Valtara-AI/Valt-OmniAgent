"use client"

import { useState } from "react"
import { Search, Book, Video, MessageCircle, FileText, Zap, Users, Phone, Settings, BarChart3, Bot, Workflow, Database, ExternalLink, Play, Download, Clock } from "lucide-react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

const helpCategories = [
  {
    icon: Zap,
    title: "Getting Started",
    description: "Set up your account and first campaigns",
    articles: 12,
    color: "text-yellow-500"
  },
  {
    icon: Database,
    title: "CRM Integration",
    description: "Connect Mindbody, Zen Planner, ClubReady",
    articles: 8,
    color: "text-blue-500"
  },
  {
    icon: Phone,
    title: "Dialer & Calling",
    description: "Make calls and use agent assistance",
    articles: 15,
    color: "text-green-500"
  },
  {
    icon: Bot,
    title: "AI Features",
    description: "Agent assist, scripts, and automation",
    articles: 10,
    color: "text-purple-500"
  },
  {
    icon: Workflow,
    title: "Automation",
    description: "Build workflows and follow-up sequences",
    articles: 14,
    color: "text-orange-500"
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Track performance and ROI",
    articles: 9,
    color: "text-cyan-500"
  }
]

const popularArticles = [
  {
    title: "How to Set Up Your First Lead Reactivation Campaign",
    category: "Getting Started",
    readTime: "5 min",
    views: "2.3k",
    description: "Step-by-step guide to create and launch your first automated campaign"
  },
  {
    title: "Connecting Your Mindbody Account",
    category: "Integration",
    readTime: "3 min",
    views: "1.8k",
    description: "Complete setup instructions for Mindbody webhook integration"
  },
  {
    title: "Using AI Agent Assist During Live Calls",
    category: "AI Features",
    readTime: "7 min",
    views: "1.5k",
    description: "Maximize conversions with real-time AI suggestions and objection handling"
  },
  {
    title: "Understanding Lead Scoring & Prioritization",
    category: "AI Features",
    readTime: "4 min",
    views: "1.2k",
    description: "How our AI ranks leads by reactivation probability and lifetime value"
  },
  {
    title: "Building Multi-Channel Follow-up Workflows",
    category: "Automation",
    readTime: "6 min",
    views: "1.1k",
    description: "Create smart retry sequences across phone, email, and SMS"
  }
]

const videoTutorials = [
  {
    title: "Valt OmniAgent Overview",
    duration: "12:34",
    thumbnail: "overview",
    description: "Complete product walkthrough and key features"
  },
  {
    title: "CRM Integration Setup",
    duration: "8:45",
    thumbnail: "integration",
    description: "Connect your fitness management system"
  },
  {
    title: "Agent Assist in Action",
    duration: "15:22",
    thumbnail: "agent",
    description: "See AI assistance during real member calls"
  },
  {
    title: "Campaign Analytics Deep Dive",
    duration: "11:18",
    thumbnail: "analytics",
    description: "Understanding your performance metrics"
  }
]

const quickActions = [
  {
    icon: MessageCircle,
    title: "Contact Support",
    description: "Get help from our expert team",
    action: "Start Chat"
  },
  {
    icon: Video,
    title: "Schedule Demo",
    description: "1-on-1 product demonstration",
    action: "Book Now"
  },
  {
    icon: FileText,
    title: "Feature Request",
    description: "Suggest new functionality",
    action: "Submit"
  },
  {
    icon: Download,
    title: "Download Resources",
    description: "Best practices and guides",
    action: "Browse"
  }
]

interface HelpPageProps {
  onBack?: () => void
}

export function HelpPage({ onBack }: HelpPageProps = {}) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Help &{" "}
            <span className="gradient-primary bg-clip-text text-transparent">
              Support
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Everything you need to master Valt OmniAgent and maximize your lead reactivation success
          </p>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {onBack && (
            <Button variant="outline" size="lg" onClick={onBack}>
              Back to App
            </Button>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Card key={index} className="p-6 card-glow text-center group cursor-pointer hover:border-primary/30 transition-colors">
                  <div className="gradient-accent rounded-xl p-3 w-12 h-12 mx-auto mb-4 group-hover:glow-accent transition-all flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{action.description}</p>
                  <Button variant="outline" size="sm" className="btn-press">
                    {action.action}
                  </Button>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="articles" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="articles">Help Articles</TabsTrigger>
              <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
              <TabsTrigger value="categories">Browse by Category</TabsTrigger>
              <TabsTrigger value="status">System Status</TabsTrigger>
            </TabsList>

            {/* Help Articles */}
            <TabsContent value="articles" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Popular Articles</h2>
                <div className="space-y-4">
                  {popularArticles.map((article, index) => (
                    <Card key={index} className="p-6 card-glow group cursor-pointer hover:border-primary/30 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold group-hover:text-primary transition-colors">
                              {article.title}
                            </h3>
                            <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-muted-foreground mb-3">{article.description}</p>
                          <div className="flex items-center space-x-4">
                            <Badge variant="secondary">{article.category}</Badge>
                            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span>{article.readTime}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{article.views} views</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Video Tutorials */}
            <TabsContent value="videos" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Video Tutorials</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {videoTutorials.map((video, index) => (
                    <Card key={index} className="overflow-hidden card-glow group cursor-pointer hover:border-primary/30 transition-colors">
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 relative flex items-center justify-center">
                        <div className="gradient-primary rounded-full p-4 group-hover:scale-110 transition-transform">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                          {video.duration}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{video.title}</h3>
                        <p className="text-sm text-muted-foreground">{video.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Categories */}
            <TabsContent value="categories" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {helpCategories.map((category, index) => {
                    const Icon = category.icon
                    return (
                      <Card key={index} className="p-6 card-glow group cursor-pointer hover:border-primary/30 transition-colors">
                        <div className="flex items-start space-x-4">
                          <div className={`${category.color} bg-current/10 rounded-xl p-3`}>
                            <Icon className={`h-6 w-6 ${category.color}`} />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2">{category.title}</h3>
                            <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">{category.articles} articles</span>
                              <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </TabsContent>

            {/* System Status */}
            <TabsContent value="status" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">System Status</h2>
                <div className="space-y-4">
                  <Card className="p-6 card-glow">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold">All Systems Operational</h3>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Online</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground">All Valt OmniAgent services are running normally.</p>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { service: "Core Platform", status: "Operational", uptime: "99.9%" },
                      { service: "CRM Integrations", status: "Operational", uptime: "99.8%" },
                      { service: "Dialer Service", status: "Operational", uptime: "99.7%" },
                      { service: "AI Agent Assist", status: "Operational", uptime: "99.9%" },
                      { service: "Analytics API", status: "Operational", uptime: "99.8%" },
                      { service: "Webhook Processing", status: "Operational", uptime: "99.9%" }
                    ].map((service, index) => (
                      <Card key={index} className="p-4 card-glow">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{service.service}</h4>
                            <p className="text-sm text-muted-foreground">Uptime: {service.uptime}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-600">{service.status}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Support CTA */}
      <section className="py-16 px-6 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-muted-foreground mb-8">
            Our support team is standing by to help you succeed with Valt OmniAgent
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-press">
              <MessageCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
            <Button variant="outline" size="lg" className="btn-press">
              <Video className="mr-2 h-4 w-4" />
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
