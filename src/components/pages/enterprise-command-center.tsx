"use client"

import { useState, useEffect } from "react"
import { Bot, Phone, Mic, MicOff, Volume2, VolumeX, PhoneOff, Play, Pause, Send, Lightbulb, MessageSquare, AlertTriangle, TrendingUp, Target, Zap, FileText, ExternalLink, Users, Clock, Calendar, BarChart3, Maximize2, Minimize2, Eye, EyeOff } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Textarea } from "../ui/textarea"
import { Progress } from "../ui/progress"
import { Separator } from "../ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Switch } from "../ui/switch"
import { toast } from "sonner"

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts"

const enterpriseKPIs = [
  {
    title: "Reactivation Rate",
    value: "84.2%",
    change: "+12.3%",
    trend: "up",
    icon: TrendingUp,
    color: "text-green-500",
    target: "85%"
  },
  {
    title: "Call-to-Meeting", 
    value: "26.8%",
    change: "+3.2%",
    trend: "up",
    icon: Target,
    color: "text-blue-500",
    target: "30%"
  },
  {
    title: "AI Response Time",
    value: "1.4s",
    change: "-0.3s",
    trend: "up",
    icon: Clock,
    color: "text-purple-500", 
    target: "< 2s"
  },
  {
    title: "Daily Calls",
    value: "127",
    change: "+23",
    trend: "up",
    icon: Phone,
    color: "text-cyan-500",
    target: "150"
  }
]

const weeklyTrends = [
  { name: "Mon", calls: 24, meetings: 8, reactivations: 6 },
  { name: "Tue", calls: 32, meetings: 12, reactivations: 9 },
  { name: "Wed", calls: 28, meetings: 10, reactivations: 7 },
  { name: "Thu", calls: 45, meetings: 18, reactivations: 14 },
  { name: "Fri", calls: 38, meetings: 15, reactivations: 11 },
  { name: "Sat", calls: 22, meetings: 7, reactivations: 5 },
  { name: "Sun", calls: 18, meetings: 4, reactivations: 3 }
]

const recentLeads = [
  { name: "Sarah Johnson", phone: "(555) 123-4567", status: "hot", score: 92, lastActivity: "2h ago", source: "Mindbody", callActive: true },
  { name: "Mike Chen", phone: "(555) 234-5678", status: "warm", score: 78, lastActivity: "4h ago", source: "Zen Planner", callActive: false },
  { name: "Emma Davis", phone: "(555) 345-6789", status: "cold", score: 45, lastActivity: "1d ago", source: "ClubReady", callActive: false },
  { name: "Alex Rodriguez", phone: "(555) 456-7890", status: "hot", score: 89, lastActivity: "30m ago", source: "Mindbody", callActive: false }
]

const suggestions = [
  {
    type: "script",
    title: "Opening Script",
    content: "Hi Sarah, this is Mike from FitLife Studio. I noticed you were a valued member and wanted to personally reach out about exciting new programs.",
    confidence: 95,
    category: "opening"
  },
  {
    type: "objection",
    title: "Price Concern Response", 
    content: "I understand budget is important. We have a special comeback member rate that's 40% off for the first 3 months.",
    confidence: 88,
    category: "pricing"
  },
  {
    type: "closing",
    title: "Soft Close",
    content: "Would you like to come in this week for a complimentary session to see all the improvements? I can hold a spot.",
    confidence: 85,
    category: "closing"
  }
]

const quickActions = [
  { label: "Book Trial Class", action: "book_trial", icon: "📅" },
  { label: "Send Pricing Info", action: "send_pricing", icon: "💰" },
  { label: "Schedule Tour", action: "schedule_tour", icon: "🏃‍♀️" },
  { label: "Add to VIP List", action: "add_vip", icon: "⭐" }
]

const leadContext = {
  name: "Sarah Johnson",
  phone: "+1 (555) 123-4567",
  email: "sarah.johnson@email.com",
  previousMember: true,
  lastVisit: "March 2024",
  favoriteClasses: ["Yoga", "Pilates"],
  membershipType: "Premium",
  lifetimeValue: "$2,400",
  reasonForLeaving: "Travel for work",
  personalityInsights: "Values community, health-conscious, busy professional"
}

interface EnterpriseCommandCenterProps {
  onPageChange: (page: string) => void
}

export function EnterpriseCommandCenter({ onPageChange }: EnterpriseCommandCenterProps) {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [callDuration, setCallDuration] = useState("02:34")
  const [sentimentScore, setSentimentScore] = useState(75)
  const [callProgress, setCallProgress] = useState(30)
  const [selectedTimeframe, setSelectedTimeframe] = useState("today")
  const [viewMode, setViewMode] = useState<"dashboard" | "agent" | "split">("split")
  const [showAgentPanel, setShowAgentPanel] = useState(true)
  const [currentScript, setCurrentScript] = useState("")

  // Simulated real-time updates
  useEffect(() => {
    if (isCallActive) {
      const interval = setInterval(() => {
        setSentimentScore(prev => Math.max(40, Math.min(100, prev + (Math.random() - 0.5) * 10)))
        setCallProgress(prev => Math.min(100, prev + 1))
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isCallActive])

  const handleQuickAction = (action: string, label: string) => {
    toast.success(`${label} completed`)
    // Update KPIs in real-time based on action
    if (action === "book_trial") {
      toast.info("KPI Update: Call-to-Meeting ratio increased by 0.2%")
    }
  }

  const startCall = (lead: any) => {
    setIsCallActive(true)
    toast.success(`Starting call with ${lead.name}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Unified Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Bot className="mr-2 h-6 w-6 text-primary" />
              Enterprise Command Center
            </h1>
            <p className="text-muted-foreground">Unified dashboard with real-time agent assistance and KPI monitoring</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2 bg-muted/50 rounded-lg p-1">
              <Button 
                size="sm" 
                variant={viewMode === "dashboard" ? "default" : "ghost"} 
                onClick={() => setViewMode("dashboard")}
                className="text-xs"
              >
                <BarChart3 className="h-3 w-3 mr-1" />
                Dashboard
              </Button>
              <Button 
                size="sm" 
                variant={viewMode === "split" ? "default" : "ghost"} 
                onClick={() => setViewMode("split")}
                className="text-xs"
              >
                <Maximize2 className="h-3 w-3 mr-1" />
                Split View
              </Button>
              <Button 
                size="sm" 
                variant={viewMode === "agent" ? "default" : "ghost"} 
                onClick={() => setViewMode("agent")}
                className="text-xs"
              >
                <Bot className="h-3 w-3 mr-1" />
                Agent Focus
              </Button>
            </div>

            {/* Time Range */}
            <div className="flex items-center space-x-2">
              <Button 
                variant={selectedTimeframe === "today" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedTimeframe("today")}
              >
                Today
              </Button>
              <Button 
                variant={selectedTimeframe === "week" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedTimeframe("week")}
              >
                This Week
              </Button>
            </div>

            {/* Call Status */}
            <Badge variant={isCallActive ? "default" : "outline"} className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isCallActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
              <span>{isCallActive ? 'Live Call' : 'Ready'}</span>
            </Badge>
          </div>
        </div>

        {/* KPI Overview - Always visible */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {enterpriseKPIs.map((kpi, index) => {
            const Icon = kpi.icon
            return (
              <Card key={index} className="card-glow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`h-4 w-4 ${kpi.color}`} />
                    <Badge variant={kpi.trend === "up" ? "default" : "secondary"} className="text-xs">
                      {kpi.change}
                    </Badge>
                  </div>
                  <div className="text-2xl font-bold mb-1">{kpi.value}</div>
                  <div className="text-xs text-muted-foreground mb-2">{kpi.title}</div>
                  <Progress value={parseFloat(kpi.value)} className="h-1" />
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Main Content Area */}
        {viewMode === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Trends Chart */}
            <Card className="lg:col-span-2 card-glow">
              <CardHeader>
                <CardTitle>Weekly Reactivation Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weeklyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="calls" stackId="1" stroke="#6B5BFF" fill="#6B5BFF" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="meetings" stackId="1" stroke="#5BC0FF" fill="#5BC0FF" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="reactivations" stackId="1" stroke="#FF6B8A" fill="#FF6B8A" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Live Activity */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Live Activity Feed
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">🎯 Hot lead identified</p>
                      <p className="text-xs text-muted-foreground">Sarah Johnson - 92% AI score</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">📞 Call in progress</p>
                      <p className="text-xs text-muted-foreground">Agent Mike - AI assist active</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">🤖 AI suggestion accepted</p>
                      <p className="text-xs text-muted-foreground">Meeting booked successfully</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {viewMode === "agent" && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Lead Context */}
            <Card className="card-glow xl:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Target className="mr-2 h-4 w-4" />
                  Active Lead
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium">
                    SJ
                  </div>
                  <div>
                    <h3 className="font-medium">{leadContext.name}</h3>
                    <p className="text-sm text-muted-foreground">Former Premium Member</p>
                    <div className="flex space-x-1 mt-1">
                      <Badge variant="outline" className="text-xs">High Value</Badge>
                      <Badge variant={isCallActive ? "default" : "outline"} className="text-xs">
                        {isCallActive ? "Live Call" : "Ready"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">LTV:</span>
                    <span className="font-medium text-green-600">{leadContext.lifetimeValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Visit:</span>
                    <span>{leadContext.lastVisit}</span>
                  </div>
                </div>

                <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-xs">
                  <strong>AI Insight:</strong> {leadContext.personalityInsights}
                </div>

                <Separator />

                {/* Call Controls */}
                {isCallActive && (
                  <div className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-mono mb-2">{callDuration}</div>
                      <div className="space-y-2">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Sentiment</span>
                            <span className={sentimentScore > 70 ? 'text-green-500' : 'text-yellow-500'}>
                              {sentimentScore}%
                            </span>
                          </div>
                          <Progress 
                            value={sentimentScore} 
                            className={`h-2 ${sentimentScore > 70 ? '[&>div]:bg-green-500' : '[&>div]:bg-yellow-500'}`}
                          />
                        </div>

                        <div className="flex items-center space-x-2 justify-center">
                          <Button
                            size="sm"
                            variant={isMuted ? "destructive" : "outline"}
                            onClick={() => setIsMuted(!isMuted)}
                            className="btn-press"
                          >
                            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setIsCallActive(false)}
                            className="btn-press"
                          >
                            <PhoneOff className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {!isCallActive && (
                  <Button 
                    className="w-full gradient-primary text-white btn-press"
                    onClick={() => setIsCallActive(true)}
                  >
                    <Phone className="mr-2 h-4 w-4" />
                    Start Call
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* AI Suggestions */}
            <Card className="card-glow xl:col-span-2">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Lightbulb className="mr-2 h-4 w-4 text-accent" />
                  Live AI Assistance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suggestions.map((suggestion, index) => (
                    <div key={index} className={`border rounded-lg p-3 transition-all ${
                      isCallActive ? 'border-accent/50 bg-accent/5' : 'border-border'
                    } hover:border-primary/50`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{suggestion.title}</span>
                          <Badge variant="outline" className="text-xs">{suggestion.category}</Badge>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Progress value={suggestion.confidence} className="w-12 h-2" />
                          <span className="text-xs text-muted-foreground">{suggestion.confidence}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3 italic">"{suggestion.content}"</p>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-xs btn-press"
                          onClick={() => handleQuickAction("use_script", "Script used")}
                        >
                          <Play className="mr-1 h-3 w-3" />
                          Use Script
                        </Button>
                        <Button size="sm" variant="ghost" className="text-xs btn-press">
                          <MessageSquare className="mr-1 h-3 w-3" />
                          Adapt
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Live Transcript */}
            <Card className="card-glow xl:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Live Transcript</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-3 h-64 overflow-y-auto space-y-3 text-sm">
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground">Agent (10:32 AM)</span>
                    <p>"Hi Sarah, this is Mike from FitLife Studio. How are you doing today?"</p>
                  </div>
                  
                  <div className="flex flex-col space-y-1">
                    <span className="text-xs text-muted-foreground">Sarah (10:32 AM)</span>
                    <p>"Oh hi! I'm doing well, thank you. It's been a while since I heard from you guys."</p>
                  </div>

                  {isCallActive && (
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                      <span className="text-xs italic">Listening...</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Call Notes</h4>
                  <Textarea 
                    placeholder="Add your notes..."
                    className="min-h-[100px] text-sm"
                    value={currentScript}
                    onChange={(e) => setCurrentScript(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {viewMode === "split" && (
          <div className="space-y-6">
            {/* Top Section - Lead Queue with Real-time Integration */}
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  High-Priority Leads Queue
                  <div className="flex items-center space-x-2">
                    <Switch 
                      checked={showAgentPanel} 
                      onCheckedChange={setShowAgentPanel}
                      className="data-[state=checked]:bg-primary"
                    />
                    <span className="text-sm text-muted-foreground">Agent Panel</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentLeads.map((lead, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                      lead.callActive ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-border hover:border-primary/50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium flex items-center space-x-2">
                            <span>{lead.name}</span>
                            {lead.callActive && <Badge className="text-xs bg-green-500">Live Call</Badge>}
                          </p>
                          <p className="text-sm text-muted-foreground">{lead.phone} • {lead.source}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Badge variant={lead.status === 'hot' ? 'destructive' : lead.status === 'warm' ? 'default' : 'secondary'}>
                          {lead.status}
                        </Badge>
                        <div className="text-right">
                          <p className="text-sm font-medium">{lead.score}%</p>
                          <p className="text-xs text-muted-foreground">{lead.lastActivity}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button 
                            size="sm" 
                            variant={lead.callActive ? "destructive" : "outline"} 
                            className="h-7 w-7 p-0" 
                            onClick={() => lead.callActive ? setIsCallActive(false) : startCall(lead)}
                          >
                            {lead.callActive ? <PhoneOff className="h-3 w-3" /> : <Phone className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bottom Section - Split View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left: Dashboard Analytics */}
              <Card className="card-glow">
                <CardHeader>
                  <CardTitle>Real-time Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={weeklyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="calls" stackId="1" stroke="#6B5BFF" fill="#6B5BFF" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="meetings" stackId="1" stroke="#5BC0FF" fill="#5BC0FF" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Right: Agent Panel */}
              {showAgentPanel && (
                <Card className="card-glow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bot className="mr-2 h-4 w-4 text-primary" />
                      Agent Assistant
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Quick Actions */}
                      <div className="grid grid-cols-2 gap-2">
                        {quickActions.map((action, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant="outline"
                            className="text-xs btn-press justify-start"
                            onClick={() => handleQuickAction(action.action, action.label)}
                          >
                            <span className="mr-2">{action.icon}</span>
                            {action.label}
                          </Button>
                        ))}
                      </div>

                      <Separator />

                      {/* Current Script Preview */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Suggested Script</h4>
                        <div className="p-3 bg-muted/50 rounded-lg text-sm italic">
                          "{suggestions[0]?.content}"
                        </div>
                        <Button size="sm" className="w-full gradient-accent text-white">
                          <Play className="mr-2 h-3 w-3" />
                          Use Script
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}

        {/* Real-time Suggestion Overlay - Only when call is active */}
        {isCallActive && (
          <div className="fixed bottom-6 left-6 right-6 z-50">
            <Card className="border-2 border-accent glow-accent bg-card/95 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                    <span className="font-medium">🎯 Smart Suggestion:</span>
                    <span className="text-sm">"Sarah mentioned work travel - ask about flexible scheduling and virtual class options"</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="gradient-accent text-white btn-press"
                      onClick={() => handleQuickAction("use_suggestion", "AI suggestion used")}
                    >
                      Use Suggestion
                    </Button>
                    <Button size="sm" variant="ghost" className="btn-press">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
