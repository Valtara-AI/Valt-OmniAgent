"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { Textarea } from "../ui/textarea"
import { Input } from "../ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"
import { 
  Bot, 
  Brain, 
  Target, 
  TrendingUp, 
  Users, 
  Calendar, 
  Phone, 
  Mail, 
  MessageSquare,
  Star,
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Heart,
  Activity,
  BarChart3,
  Filter,
  Search,
  Send,
  Lightbulb,
  Trophy,
  Database,
  Settings,
  PlayCircle,
  Pause
} from "lucide-react"
import { toast } from "sonner"

interface ReactivationLead {
  id: string
  name: string
  email: string
  phone: string
  membershipStatus: "former" | "lapsed" | "trial_expired" | "cancelled"
  daysInactive: number
  lifetimeValue: number
  reactivationScore: number
  lastContactDate: string
  preferredContactMethod: "phone" | "email" | "sms"
  fitnessInterests: string[]
  reasonForLeaving: string
  engagementLevel: "hot" | "warm" | "cold"
  personalityType: "analytical" | "driver" | "expressive" | "amiable"
  bestContactTime: string
  crmSource: "mindbody" | "zenplanner" | "clubready"
  urgencyScore: number
}

interface AIInsight {
  type: "opportunity" | "warning" | "recommendation" | "trend"
  title: string
  description: string
  confidence: number
  actionable: boolean
  suggested_action?: string
}

interface ReactivationStrategy {
  leadId: string
  strategy: "nostalgia" | "value" | "community" | "health" | "convenience"
  keyTalkingPoints: string[]
  objectionAnticipation: string[]
  successProbability: number
  recommendedOffers: string[]
}

const mockLeads: ReactivationLead[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@email.com",
    phone: "+1 (555) 123-4567",
    membershipStatus: "former",
    daysInactive: 165,
    lifetimeValue: 2400,
    reactivationScore: 78,
    lastContactDate: "2024-08-15",
    preferredContactMethod: "phone",
    fitnessInterests: ["Yoga", "Pilates", "Meditation"],
    reasonForLeaving: "Work travel increased",
    engagementLevel: "warm",
    personalityType: "analytical",
    bestContactTime: "6:00-8:00 PM",
    crmSource: "mindbody",
    urgencyScore: 85
  },
  {
    id: "2",
    name: "Mike Chen",
    email: "mike@email.com", 
    phone: "+1 (555) 234-5678",
    membershipStatus: "lapsed",
    daysInactive: 45,
    lifetimeValue: 1800,
    reactivationScore: 92,
    lastContactDate: "2024-09-01",
    preferredContactMethod: "sms",
    fitnessInterests: ["HIIT", "Strength Training", "Boxing"],
    reasonForLeaving: "Financial constraints",
    engagementLevel: "hot",
    personalityType: "driver",
    bestContactTime: "7:00-9:00 AM",
    crmSource: "zenplanner",
    urgencyScore: 95
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily@email.com",
    phone: "+1 (555) 345-6789",
    membershipStatus: "trial_expired",
    daysInactive: 14,
    lifetimeValue: 0,
    reactivationScore: 88,
    lastContactDate: "2024-09-20",
    preferredContactMethod: "email",
    fitnessInterests: ["Dance", "Zumba", "Cardio"],
    reasonForLeaving: "Overwhelmed by options",
    engagementLevel: "hot",
    personalityType: "expressive",
    bestContactTime: "12:00-2:00 PM",
    crmSource: "clubready",
    urgencyScore: 90
  }
]

const aiInsights: AIInsight[] = [
  {
    type: "opportunity",
    title: "High-Value Reactivation Window",
    description: "32 former members are within optimal reactivation timeframe (30-180 days inactive)",
    confidence: 94,
    actionable: true,
    suggested_action: "Launch targeted 'Welcome Back' campaign with personalized offers"
  },
  {
    type: "trend",
    title: "Seasonal Reactivation Pattern",
    description: "Historical data shows 40% higher success rates for reactivation calls in October",
    confidence: 87,
    actionable: true,
    suggested_action: "Increase outreach volume by 25% this month"
  },
  {
    type: "warning",
    title: "High-Risk Departures",
    description: "5 premium members haven't attended in 14+ days - intervention needed",
    confidence: 91,
    actionable: true,
    suggested_action: "Proactive retention calls within 24 hours"
  },
  {
    type: "recommendation",
    title: "Personality-Based Approach",
    description: "Analytical personalities respond 65% better to data-driven benefit presentations",
    confidence: 89,
    actionable: true,
    suggested_action: "Customize scripts based on personality assessments"
  }
]

export function OmniagentReactivation() {
  const [selectedLead, setSelectedLead] = useState<ReactivationLead | null>(null)
  const [aiAnalysisActive, setAiAnalysisActive] = useState(false)
  const [currentStrategy, setCurrentStrategy] = useState<ReactivationStrategy | null>(null)
  const [filterEngagement, setFilterEngagement] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [customPrompt, setCustomPrompt] = useState("")

  // Simulate AI analysis
  useEffect(() => {
    if (selectedLead && aiAnalysisActive) {
      const timer = setTimeout(() => {
        const strategy: ReactivationStrategy = {
          leadId: selectedLead.id,
          strategy: selectedLead.personalityType === "analytical" ? "value" : 
                   selectedLead.personalityType === "driver" ? "convenience" : 
                   selectedLead.personalityType === "expressive" ? "community" : "health",
          keyTalkingPoints: generateTalkingPoints(selectedLead),
          objectionAnticipation: generateObjections(selectedLead),
          successProbability: selectedLead.reactivationScore,
          recommendedOffers: generateOffers(selectedLead)
        }
        setCurrentStrategy(strategy)
      }, 2000)
      
      return () => clearTimeout(timer)
    }
  }, [selectedLead, aiAnalysisActive])

  const generateTalkingPoints = (lead: ReactivationLead): string[] => {
    const points = []
    
    if (lead.lifetimeValue > 2000) {
      points.push(`"You were one of our most valued members with over $${lead.lifetimeValue.toLocaleString()} invested in your health"`)
    }
    
    if (lead.fitnessInterests.length > 0) {
      points.push(`"I know you loved ${lead.fitnessInterests[0]} - we've actually expanded that program significantly"`)
    }
    
    switch (lead.reasonForLeaving) {
      case "Work travel increased":
        points.push(`"We now offer 24/7 access and virtual classes for when you're traveling"`)
        break
      case "Financial constraints":
        points.push(`"We have new flexible payment options and returning member discounts"`)
        break
      case "Overwhelmed by options":
        points.push(`"We've created simple, guided fitness paths to make it easy to get started"`)
        break
    }
    
    points.push(`"The community has been asking about you - you were such an integral part of our fitness family"`)
    
    return points
  }

  const generateObjections = (lead: ReactivationLead): string[] => {
    const objections = []
    
    if (lead.reasonForLeaving === "Work travel increased") {
      objections.push("Time/Travel Schedule")
    }
    if (lead.reasonForLeaving === "Financial constraints") {
      objections.push("Price/Budget Concerns")
    }
    
    objections.push("Lack of Motivation")
    objections.push("Previous Bad Experience")
    objections.push("Found Alternative Solution")
    
    return objections
  }

  const generateOffers = (lead: ReactivationLead): string[] => {
    const offers = []
    
    if (lead.membershipStatus === "former") {
      offers.push("50% off first month returning member rate")
      offers.push("Free personal training session")
    }
    
    if (lead.lifetimeValue > 1500) {
      offers.push("VIP member benefits")
      offers.push("Free guest passes for friends")
    }
    
    offers.push("7-day free trial")
    offers.push("Complimentary body composition analysis")
    offers.push("Free fitness consultation")
    
    return offers
  }

  const filteredLeads = mockLeads.filter(lead => {
    const matchesEngagement = filterEngagement === "all" || lead.engagementLevel === filterEngagement
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesEngagement && matchesSearch
  })

  const startAnalysis = (lead: ReactivationLead) => {
    setSelectedLead(lead)
    setAiAnalysisActive(true)
    setCurrentStrategy(null)
    toast.success(`Starting AI analysis for ${lead.name}...`)
  }

  const initiateContact = (method: string) => {
    if (selectedLead) {
      toast.success(`Initiating ${method} contact with ${selectedLead.name}`)
    }
  }

  const getEngagementColor = (level: string) => {
    switch (level) {
      case 'hot': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'warm': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'cold': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'former': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'lapsed': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'trial_expired': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'cancelled': return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Bot className="mr-2 h-6 w-6 text-primary" />
            OmniAgent - Lead Reactivation Intelligence
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered lead reactivation with predictive analytics and personalized strategies
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-gradient-primary text-white">
            <Brain className="mr-1 h-3 w-3" />
            AI Active
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure AI
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* AI Insights Dashboard */}
        <Card className="lg:col-span-4 card-glow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Lightbulb className="mr-2 h-4 w-4 text-accent" />
              AI Insights & Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">78%</div>
                <div className="text-xs text-green-700 dark:text-green-400">Avg Reactivation Score</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">$2.1M</div>
                <div className="text-xs text-blue-700 dark:text-blue-400">Dormant LTV</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">142</div>
                <div className="text-xs text-purple-700 dark:text-purple-400">Reactivation Targets</div>
              </div>
              <div className="text-center p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">34%</div>
                <div className="text-xs text-orange-700 dark:text-orange-400">Win Rate This Month</div>
              </div>
            </div>

            <Separator />

            {/* AI Insights */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Live AI Insights</h4>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${
                      insight.type === 'opportunity' ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' :
                      insight.type === 'warning' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' :
                      insight.type === 'trend' ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' :
                      'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-sm">{insight.title}</h5>
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                      {insight.actionable && insight.suggested_action && (
                        <Button size="sm" variant="ghost" className="text-xs h-6 px-2">
                          <PlayCircle className="mr-1 h-3 w-3" />
                          {insight.suggested_action}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Quick AI Actions</h4>
              <div className="grid grid-cols-1 gap-2">
                <Button size="sm" variant="outline" className="text-xs justify-start">
                  <Zap className="mr-2 h-3 w-3" />
                  Generate Batch Campaigns
                </Button>
                <Button size="sm" variant="outline" className="text-xs justify-start">
                  <Target className="mr-2 h-3 w-3" />
                  Identify High-Value Targets
                </Button>
                <Button size="sm" variant="outline" className="text-xs justify-start">
                  <BarChart3 className="mr-2 h-3 w-3" />
                  Analyze Success Patterns
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lead List & Selection */}
        <Card className="lg:col-span-4 card-glow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Reactivation Targets
              </span>
              <Badge variant="outline">{filteredLeads.length} leads</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Filters */}
            <div className="space-y-2">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <Input 
                    placeholder="Search leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-sm"
                  />
                </div>
                <Button size="sm" variant="outline">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex space-x-1">
                {["all", "hot", "warm", "cold"].map((level) => (
                  <Button
                    key={level}
                    size="sm"
                    variant={filterEngagement === level ? "default" : "ghost"}
                    onClick={() => setFilterEngagement(level)}
                    className="text-xs"
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Lead List */}
            <ScrollArea className="h-80">
              <div className="space-y-3">
                {filteredLeads.map((lead) => (
                  <div 
                    key={lead.id} 
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedLead?.id === lead.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => startAnalysis(lead)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">{lead.name}</h4>
                        <p className="text-xs text-muted-foreground">{lead.email}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-green-600">{lead.reactivationScore}%</div>
                        <div className="text-xs text-muted-foreground">Score</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        <Badge className={getEngagementColor(lead.engagementLevel)} size="sm">
                          {lead.engagementLevel}
                        </Badge>
                        <Badge className={getStatusColor(lead.membershipStatus)} size="sm">
                          {lead.membershipStatus.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ${lead.lifetimeValue.toLocaleString()} LTV
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-muted-foreground">
                      {lead.daysInactive} days inactive • {lead.fitnessInterests.slice(0, 2).join(", ")}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* AI Strategy & Actions */}
        <Card className="lg:col-span-4 card-glow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-4 w-4 text-primary" />
              AI Strategy Engine
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedLead ? (
              <div className="space-y-4">
                {/* Lead Profile */}
                <div className="p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
                  <h3 className="font-semibold">{selectedLead.name}</h3>
                  <div className="text-sm text-muted-foreground mt-1">
                    {selectedLead.personalityType.charAt(0).toUpperCase() + selectedLead.personalityType.slice(1)} • 
                    {selectedLead.membershipStatus.replace('_', ' ')} • 
                    ${selectedLead.lifetimeValue.toLocaleString()} LTV
                  </div>
                  <div className="mt-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Reactivation Probability</span>
                      <span>{selectedLead.reactivationScore}%</span>
                    </div>
                    <Progress value={selectedLead.reactivationScore} className="h-2" />
                  </div>
                </div>

                {/* AI Analysis Status */}
                {aiAnalysisActive && !currentStrategy && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">AI analyzing lead profile and optimal strategy...</span>
                    </div>
                  </div>
                )}

                {/* Strategy Results */}
                {currentStrategy && (
                  <Tabs defaultValue="strategy" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="strategy">Strategy</TabsTrigger>
                      <TabsTrigger value="talking">Talking Points</TabsTrigger>
                      <TabsTrigger value="contact">Contact</TabsTrigger>
                    </TabsList>

                    <TabsContent value="strategy" className="space-y-3 mt-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Recommended Strategy: {currentStrategy.strategy.toUpperCase()}</h4>
                        <div className="text-xs text-muted-foreground">
                          Success Probability: <span className="font-medium text-green-600">{currentStrategy.successProbability}%</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium text-xs">Anticipated Objections:</h5>
                        <div className="space-y-1">
                          {currentStrategy.objectionAnticipation.map((objection, index) => (
                            <div key={index} className="text-xs p-2 bg-orange-50 dark:bg-orange-950/20 rounded">
                              <AlertTriangle className="inline h-3 w-3 mr-1 text-orange-500" />
                              {objection}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium text-xs">Recommended Offers:</h5>
                        <div className="space-y-1">
                          {currentStrategy.recommendedOffers.map((offer, index) => (
                            <div key={index} className="text-xs p-2 bg-green-50 dark:bg-green-950/20 rounded">
                              <Star className="inline h-3 w-3 mr-1 text-green-500" />
                              {offer}
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="talking" className="space-y-3 mt-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Key Talking Points</h4>
                        <div className="space-y-2">
                          {currentStrategy.keyTalkingPoints.map((point, index) => (
                            <div key={index} className="p-2 bg-accent/5 rounded text-xs italic">
                              {point}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Button size="sm" className="w-full gradient-accent text-white">
                        <PlayCircle className="mr-2 h-3 w-3" />
                        Generate Full Script
                      </Button>
                    </TabsContent>

                    <TabsContent value="contact" className="space-y-3 mt-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Optimal Contact Strategy</h4>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Best Time: {selectedLead.bestContactTime}</div>
                          <div>Preferred Method: {selectedLead.preferredContactMethod.toUpperCase()}</div>
                          <div>Last Contact: {selectedLead.lastContactDate}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <Button 
                          size="sm" 
                          className="gradient-primary text-white justify-start"
                          onClick={() => initiateContact("call")}
                        >
                          <Phone className="mr-2 h-3 w-3" />
                          Call Now ({selectedLead.phone})
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="justify-start"
                          onClick={() => initiateContact("email")}
                        >
                          <Mail className="mr-2 h-3 w-3" />
                          Send Email
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="justify-start"
                          onClick={() => initiateContact("sms")}
                        >
                          <MessageSquare className="mr-2 h-3 w-3" />
                          Send SMS
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-medium text-xs">Schedule Follow-up</h5>
                        <Button size="sm" variant="ghost" className="w-full text-xs">
                          <Calendar className="mr-2 h-3 w-3" />
                          Schedule Callback
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Select a Lead</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Choose a lead from the list to generate AI-powered reactivation strategy
                </p>
              </div>
            )}

            {/* Custom AI Prompt */}
            <div className="space-y-2 pt-4 border-t">
              <h4 className="font-medium text-sm">Custom AI Query</h4>
              <div className="flex space-x-2">
                <Input 
                  placeholder="Ask AI about reactivation strategies..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="text-sm"
                />
                <Button size="sm" className="gradient-accent">
                  <Send className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
