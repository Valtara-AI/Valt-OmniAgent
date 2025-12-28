"use client"

import {
  AlertTriangle,
  Brain,
  Calendar,
  CheckCircle,
  Clock,
  Heart,
  Mic,
  MicOff,
  PauseCircle,
  Phone,
  PhoneCall,
  PhoneOff,
  PlayCircle,
  Target,
  TrendingUp,
  Zap
} from "lucide-react"
import { useRef, useState } from "react"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Progress } from "../ui/progress"
import { ScrollArea } from "../ui/scroll-area"
import { Separator } from "../ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Textarea } from "../ui/textarea"

interface EnhancedLead {
  id: string
  name: string
  phone: string
  email: string
  avatar?: string
  
  // Lead Reactivation Specific
  membershipStatus: "former" | "lapsed" | "trial_expired" | "cancelled"
  lastVisitDate: string
  daysInactive: number
  lifetimeValue: number
  reactivationScore: number
  preferredClasses: string[]
  lastPurchase: string
  reasonForLeaving: string
  previousObjections: string[]
  
  // Behavioral Data
  engagementHistory: {
    emailOpens: number
    smsResponses: number
    websiteVisits: number
    socialMediaActivity: number
  }
  
  // Demographics & Preferences
  age: number
  location: string
  bestContactTime: string
  communicationPreference: "phone" | "email" | "sms"
  fitnessGoals: string[]
  personalityType: "analytical" | "driver" | "expressive" | "amiable"
  
  // CRM Integration Data
  crmSource: "mindbody" | "zenplanner" | "clubready"
  memberNumber: string
  notes: string[]
}

interface CallSession {
  lead: EnhancedLead
  startTime: Date
  duration: number
  status: "active" | "on_hold" | "ended"
  sentimentScore: number
  engagementLevel: number
  objectionCount: number
  interestSignals: string[]
  callPhase: "opening" | "discovery" | "presentation" | "objection_handling" | "closing"
  notes: string
  outcome?: "scheduled_trial" | "rejoined" | "callback" | "not_interested" | "no_answer"
}

const reactivationScripts = {
  opening: {
    former_member: "Hi [Name], this is [Agent] from [Studio]. I hope you're doing well! I was just reviewing our member family and noticed we haven't seen you in a while. I wanted to personally reach out because you were such a valued part of our community.",
    trial_expired: "Hi [Name], this is [Agent] from [Studio]. I wanted to follow up on your recent trial experience with us. How did you feel about the classes you tried?",
    cancelled: "Hi [Name], this is [Agent] from [Studio]. I understand you recently made the decision to cancel your membership. I wanted to reach out to see if there's anything we could have done differently."
  },
  discovery: {
    barriers: "What's been the biggest challenge keeping you away from your fitness routine lately?",
    lifestyle: "How has your lifestyle changed since you were last with us?",
    goals: "Are your fitness goals the same as when you were here before, or have they evolved?",
    competition: "Have you tried any other fitness options since leaving us?"
  },
  reactivation: {
    nostalgia: "Do you remember [specific class/instructor] that you used to love? They're still here and have been asking about you!",
    improvements: "We've made some exciting improvements since you were last here - including [specific improvement relevant to their interests].",
    community: "The community really misses you. [Specific member] mentioned you just last week!",
    value: "As a returning member, I can offer you our special comeback rate - 40% off for the first 3 months."
  },
  objection_handling: {
    time: "I completely understand time is precious. That's actually why we now offer express 20-minute classes and 24/7 access.",
    money: "I hear that concern. When you think about it per visit, it's less than your daily coffee - and unlike coffee, this investment improves every aspect of your life.",
    motivation: "Motivation is exactly why you need us! Our community and accountability system is designed to keep you motivated when you can't motivate yourself.",
    results: "I understand you want to see results. That's why we now have a 30-day transformation guarantee - if you don't see progress, we'll work with you until you do."
  },
  closing: {
    trial: "I'd love to welcome you back with a complimentary week so you can see all the improvements we've made. Are you available this [day] at [time]?",
    limited_time: "This comeback offer is only available for former members this month. Can I secure your spot today?",
    soft_close: "What would need to happen for you to give us another try?",
    urgency: "I can hold this special rate for you until [date], but after that it goes back to regular pricing."
  }
}

const mockEnhancedLead: EnhancedLead = {
  id: "1",
  name: "Sarah Johnson",
  phone: "+1 (555) 123-4567",
  email: "sarah.johnson@email.com",
  avatar: "",
  membershipStatus: "former",
  lastVisitDate: "2024-03-15",
  daysInactive: 165,
  lifetimeValue: 2400,
  reactivationScore: 78,
  preferredClasses: ["Yoga", "Pilates", "Meditation"],
  lastPurchase: "Personal Training Package",
  reasonForLeaving: "Work travel increased",
  previousObjections: ["Time constraints", "Travel schedule"],
  engagementHistory: {
    emailOpens: 8,
    smsResponses: 3,
    websiteVisits: 12,
    socialMediaActivity: 5
  },
  age: 34,
  location: "Downtown",
  bestContactTime: "6:00-8:00 PM",
  communicationPreference: "phone",
  fitnessGoals: ["Stress relief", "Flexibility", "Work-life balance"],
  personalityType: "analytical",
  crmSource: "mindbody",
  memberNumber: "MB-15847",
  notes: [
    "Loved instructor Maria's yoga classes",
    "Always attended 6 PM sessions",
    "Mentioned work stress multiple times",
    "Responded well to mindfulness approach"
  ]
}

export function EnhancedCallingScreen() {
  const [currentCall, setCurrentCall] = useState<CallSession | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [callNotes, setCallNotes] = useState("")
  const [selectedScript, setSelectedScript] = useState("")
  const [realTimeInsights, setRealTimeInsights] = useState<string[]>([])
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startCall = () => {
    const session: CallSession = {
      lead: mockEnhancedLead,
      startTime: new Date(),
      duration: 0,
      status: "active",
      sentimentScore: 65,
      engagementLevel: 45,
      objectionCount: 0,
      interestSignals: [],
      callPhase: "opening",
      notes: ""
    }
    setCurrentCall(session)
    setCallNotes("")
    
    // Start timer and AI analysis
    intervalRef.current = setInterval(() => {
      setCurrentCall(prev => {
        if (!prev) return null
        
        const newDuration = prev.duration + 1
        const newSentiment = Math.max(20, Math.min(100, prev.sentimentScore + (Math.random() - 0.5) * 5))
        const newEngagement = Math.max(0, Math.min(100, prev.engagementLevel + (Math.random() - 0.3) * 8))
        
        // Simulate phase progression
        let newPhase = prev.callPhase
        if (newDuration > 120 && prev.callPhase === "opening") newPhase = "discovery"
        if (newDuration > 240 && prev.callPhase === "discovery") newPhase = "presentation"
        if (newDuration > 360 && prev.callPhase === "presentation") newPhase = "closing"
        
        return {
          ...prev,
          duration: newDuration,
          sentimentScore: newSentiment,
          engagementLevel: newEngagement,
          callPhase: newPhase
        }
      })
    }, 1000)
    
    toast.success(`Calling ${mockEnhancedLead.name}...`)
  }

  const endCall = (outcome?: CallSession['outcome']) => {
    if (currentCall) {
      setCurrentCall({...currentCall, status: "ended", outcome, notes: callNotes})
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      
      toast.success(`Call ended - ${outcome || 'completed'}`)
      
      setTimeout(() => {
        setCurrentCall(null)
        setCallNotes("")
      }, 3000)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'opening': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'discovery': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'presentation': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'objection_handling': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'closing': return 'bg-green-500/10 text-green-500 border-green-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const getScriptForPhase = (phase: string) => {
    const lead = mockEnhancedLead
    switch (phase) {
      case 'opening': {
        // Map membershipStatus to script keys
        const scriptKey = lead.membershipStatus === 'former' ? 'former_member' :
                         lead.membershipStatus === 'lapsed' ? 'lapsed' :
                         lead.membershipStatus === 'trial_expired' ? 'trial_expired' :
                         'cancelled'
        return reactivationScripts.opening[scriptKey as keyof typeof reactivationScripts.opening] || reactivationScripts.opening.former_member
      }
      case 'discovery':
        return reactivationScripts.discovery.barriers
      case 'presentation':
        return reactivationScripts.reactivation.improvements
      case 'closing':
        return reactivationScripts.closing.trial
      default:
        return "Continue the conversation naturally based on the lead's responses."
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Phone className="mr-2 h-6 w-6 text-primary" />
            Premium Reactivation Calling
          </h1>
          <p className="text-muted-foreground mt-1">
            AI-powered lead reactivation with real-time coaching and CRM intelligence
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-gradient-primary text-white">
            Reactivation Agent Mode
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Lead Intelligence Panel */}
        <Card className="lg:col-span-4 card-glow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-4 w-4 text-primary" />
              Lead Intelligence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Lead Profile */}
            <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg">
              <Avatar className="h-16 w-16 border-2 border-primary/20">
                <AvatarFallback className="bg-gradient-primary text-white text-lg">
                  {mockEnhancedLead.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{mockEnhancedLead.name}</h3>
                <p className="text-sm text-muted-foreground">{mockEnhancedLead.memberNumber}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    LTV: ${mockEnhancedLead.lifetimeValue.toLocaleString()}
                  </Badge>
                  <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 text-xs">
                    {mockEnhancedLead.daysInactive} days inactive
                  </Badge>
                </div>
              </div>
            </div>

            {/* Reactivation Score */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Reactivation Score</span>
                <span className="text-2xl font-bold text-green-500">{mockEnhancedLead.reactivationScore}%</span>
              </div>
              <Progress value={mockEnhancedLead.reactivationScore} className="h-3" />
              <p className="text-xs text-muted-foreground">High probability - strong engagement history</p>
            </div>

            <Separator />

            {/* Key Insights */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Key Insights</h4>
              <div className="space-y-2">
                <div className="flex items-start space-x-2 p-2 bg-green-50 dark:bg-green-950/20 rounded">
                  <Heart className="h-4 w-4 text-green-500 mt-0.5" />
                  <div className="text-xs">
                    <strong>Loved:</strong> {mockEnhancedLead.preferredClasses.join(", ")} with Instructor Maria
                  </div>
                </div>
                <div className="flex items-start space-x-2 p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
                  <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div className="text-xs">
                    <strong>Best Time:</strong> {mockEnhancedLead.bestContactTime} ({mockEnhancedLead.personalityType} personality)
                  </div>
                </div>
                <div className="flex items-start space-x-2 p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div className="text-xs">
                    <strong>Left Due To:</strong> {mockEnhancedLead.reasonForLeaving}
                  </div>
                </div>
              </div>
            </div>

            {/* Engagement Metrics */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Recent Engagement</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span>Email Opens:</span>
                  <span className="font-medium">{mockEnhancedLead.engagementHistory.emailOpens}</span>
                </div>
                <div className="flex justify-between">
                  <span>Website Visits:</span>
                  <span className="font-medium">{mockEnhancedLead.engagementHistory.websiteVisits}</span>
                </div>
                <div className="flex justify-between">
                  <span>SMS Responses:</span>
                  <span className="font-medium">{mockEnhancedLead.engagementHistory.smsResponses}</span>
                </div>
                <div className="flex justify-between">
                  <span>Social Activity:</span>
                  <span className="font-medium">{mockEnhancedLead.engagementHistory.socialMediaActivity}</span>
                </div>
              </div>
            </div>

            {/* Previous Notes */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Member Notes</h4>
              <ScrollArea className="h-24">
                <div className="space-y-1">
                  {mockEnhancedLead.notes.map((note, index) => (
                    <p key={index} className="text-xs p-2 bg-muted/30 rounded">• {note}</p>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>

        {/* Active Call Interface */}
        <Card className="lg:col-span-5 card-glow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Active Call Session</span>
              {currentCall && (
                <Badge className={getPhaseColor(currentCall.callPhase)}>
                  {currentCall.callPhase.replace('_', ' ').toUpperCase()}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {currentCall ? (
              <div className="space-y-6">
                {/* Call Status */}
                <div className="text-center p-4 bg-accent/5 rounded-lg">
                  <div className="text-3xl font-mono mb-2">{formatDuration(currentCall.duration)}</div>
                  <div className="text-sm text-muted-foreground mb-4">Call Duration</div>
                  
                  {/* Real-time Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Sentiment</span>
                        <span className={currentCall.sentimentScore > 70 ? 'text-green-500' : currentCall.sentimentScore > 40 ? 'text-yellow-500' : 'text-red-500'}>
                          {Math.round(currentCall.sentimentScore)}%
                        </span>
                      </div>
                      <Progress 
                        value={currentCall.sentimentScore} 
                        className={`h-2 ${currentCall.sentimentScore > 70 ? '[&>div]:bg-green-500' : currentCall.sentimentScore > 40 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'}`}
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Engagement</span>
                        <span className="text-blue-500">{Math.round(currentCall.engagementLevel)}%</span>
                      </div>
                      <Progress value={currentCall.engagementLevel} className="h-2 [&>div]:bg-blue-500" />
                    </div>
                  </div>
                </div>

                {/* Call Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <Button 
                    variant={isMuted ? "destructive" : "outline"}
                    size="lg"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setCurrentCall({...currentCall, status: currentCall.status === "on_hold" ? "active" : "on_hold"})}
                  >
                    {currentCall.status === "on_hold" ? <PlayCircle className="h-5 w-5" /> : <PauseCircle className="h-5 w-5" />}
                  </Button>

                  <Button 
                    size="lg"
                    variant="destructive"
                    onClick={() => endCall()}
                    className="px-8"
                  >
                    <PhoneOff className="h-5 w-5 mr-2" />
                    End Call
                  </Button>
                </div>

                {/* Call Outcomes */}
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => endCall("scheduled_trial")}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Trial Scheduled
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => endCall("rejoined")}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Rejoined
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => endCall("callback")}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Callback
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => endCall("not_interested")}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <PhoneOff className="h-4 w-4 mr-2" />
                    Not Interested
                  </Button>
                </div>

                {/* Call Notes */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Call Notes</label>
                  <Textarea
                    placeholder="Document key points, objections, and next steps..."
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Phone className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Ready for Reactivation Call</h3>
                <p className="text-muted-foreground mb-6">
                  AI analysis complete. Optimal conversation strategy prepared.
                </p>
                <Button 
                  className="gradient-primary" 
                  size="lg"
                  onClick={startCall}
                >
                  <PhoneCall className="h-5 w-5 mr-2" />
                  Start Reactivation Call
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Coach & Scripts */}
        <Card className="lg:col-span-3 card-glow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="mr-2 h-4 w-4 text-accent" />
              AI Coach
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="scripts" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="scripts">Scripts</TabsTrigger>
                <TabsTrigger value="insights">Live Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="scripts" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">
                    {currentCall ? `${currentCall.callPhase.replace('_', ' ').toUpperCase()} Script` : 'Opening Script'}
                  </h4>
                  <div className="p-3 bg-accent/5 rounded-lg text-sm italic">
                    "{currentCall ? getScriptForPhase(currentCall.callPhase) : reactivationScripts.opening.former_member}"
                  </div>
                  
                  {currentCall && (
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-muted-foreground">Quick Responses:</h5>
                      <div className="space-y-1">
                        <Button size="sm" variant="ghost" className="w-full text-xs text-left justify-start">
                          "I understand completely..."
                        </Button>
                        <Button size="sm" variant="ghost" className="w-full text-xs text-left justify-start">
                          "That makes perfect sense..."
                        </Button>
                        <Button size="sm" variant="ghost" className="w-full text-xs text-left justify-start">
                          "Many members felt the same way..."
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-medium text-green-700 dark:text-green-400">High Success Indicator</p>
                        <p className="text-green-600 dark:text-green-300 mt-1">Lead mentioned "missing the community" - strong reactivation signal</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-medium text-blue-700 dark:text-blue-400">Recommended Action</p>
                        <p className="text-blue-600 dark:text-blue-300 mt-1">Mention Maria's new advanced yoga program - matches their interests</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
                      <div className="text-xs">
                        <p className="font-medium text-yellow-700 dark:text-yellow-400">Potential Objection</p>
                        <p className="text-yellow-600 dark:text-yellow-300 mt-1">May bring up travel schedule - prepare flexible options</p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Real-time AI Suggestions Bar */}
      {currentCall && (
        <div className="fixed bottom-6 left-6 right-6 z-50">
          <Card className="border-2 border-accent glow-accent bg-card/95 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="font-medium">🎯 AI Suggestion:</span>
                  <span className="text-sm">"Ask about their favorite yoga poses - Maria teaches a new advanced flow class on Tuesdays"</span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="gradient-accent text-white">
                    Use Suggestion
                  </Button>
                  <Button size="sm" variant="ghost">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
