"use client"

import { useState, useEffect } from "react"
import { Bot, Phone, Mic, MicOff, Volume2, VolumeX, PhoneOff, Play, Pause, Send, Lightbulb, MessageSquare, AlertTriangle, TrendingUp, Target, Zap, FileText, ExternalLink, Command } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Textarea } from "../ui/textarea"
import { Progress } from "../ui/progress"
import { Separator } from "../ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { toast } from "sonner"

interface AgentAssistProps {
  onPageChange?: (page: string) => void
}

export function AgentAssist({ onPageChange }: AgentAssistProps = {}) {
  const [isCallActive, setIsCallActive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [callDuration, setCallDuration] = useState("02:34")
  const [currentScript, setCurrentScript] = useState("")
  const [activeObjection, setActiveObjection] = useState<string | null>(null)
  const [sentimentScore, setSentimentScore] = useState(75)
  const [callProgress, setCallProgress] = useState(30)

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

  const suggestions = [
    {
      type: "script",
      title: "Opening Script",
      content: "Hi Sarah, this is Mike from FitLife Studio. I noticed you were a valued member with us and wanted to personally reach out about some exciting new programs we've added.",
      confidence: 95,
      category: "opening"
    },
    {
      type: "objection",
      title: "Price Concern Response", 
      content: "I completely understand budget is important. Actually, we have a special comeback member rate that's 40% off your previous membership for the first 3 months.",
      confidence: 88,
      category: "pricing"
    },
    {
      type: "question",
      title: "Discovery Question",
      content: "What was your favorite class or workout when you were with us? We've actually expanded that program with new equipment and instructors.",
      confidence: 92,
      category: "discovery"
    },
    {
      type: "closing",
      title: "Soft Close",
      content: "Would you like to come in this week for a complimentary session to see all the improvements we've made? I can hold a spot for you.",
      confidence: 85,
      category: "closing"
    }
  ]

  const objectionHandling = [
    {
      objection: "I don't have time",
      responses: [
        "I totally understand - work-life balance is so important. That's actually why we've added 24/7 access and express 20-minute workouts.",
        "What if I told you we could help you get better results in less time? Our new HIIT classes are specifically designed for busy professionals.",
        "Many of our members felt the same way initially. Could we start with just one 30-minute session this week to show you our time-efficient options?"
      ],
      success_rate: 78
    },
    {
      objection: "It's too expensive",
      responses: [
        "I hear that concern. When you think about the cost per visit versus a daily coffee, it's actually quite reasonable - plus your health is priceless.",
        "We have flexible payment options and our returning member discount makes it very affordable. Let me show you the numbers.",
        "What's your monthly budget for health and wellness? I bet we can find something that works within that range."
      ],
      success_rate: 65
    },
    {
      objection: "I'll think about it",
      responses: [
        "Of course! What specific concerns do you need to think through? Maybe I can address those right now.",
        "I appreciate that. What would help you make a decision today? A trial week or meeting with a trainer?",
        "Absolutely. While you're thinking, would you like me to hold a spot in tomorrow's yoga class - no commitment, just so you have the option?"
      ],
      success_rate: 82
    }
  ]

  const quickActions = [
    { label: "Book Trial Class", action: "book_trial", icon: "📅" },
    { label: "Send Pricing Info", action: "send_pricing", icon: "💰" },
    { label: "Schedule Tour", action: "schedule_tour", icon: "🏃‍♀️" },
    { label: "Add to VIP List", action: "add_vip", icon: "⭐" },
    { label: "Send SMS Follow-up", action: "send_sms", icon: "📱" },
    { label: "Email Class Schedule", action: "email_schedule", icon: "📧" }
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
    personalityInsights: "Values community, health-conscious, busy professional",
    preferredCommunication: "Text messages",
    bestTimeToContact: "Evenings 6-8 PM"
  }

  const handleQuickAction = (action: string, label: string) => {
    toast.success(`${label} completed`)
  }

  const handleObjectionResponse = (objection: string, response: string) => {
    setActiveObjection(null)
    toast.success("Objection response added to script")
  }

  return (
    <div className="p-6 space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Bot className="mr-2 h-6 w-6 text-primary" />
            Agent Assist - Live Call Support
          </h1>
          <p className="text-muted-foreground">AI-powered real-time assistance with live suggestions and objection handling</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${isCallActive ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span>{isCallActive ? 'Live' : 'Offline'}</span>
          </Badge>
          {onPageChange && (
            <Button 
              className="gradient-accent text-white btn-press"
              size="sm"
              onClick={() => onPageChange("/command-center")}
            >
              <Command className="h-4 w-4 mr-2" />
              Command Center
            </Button>
          )}
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Pop-out Widget
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Lead Context & Call Controls */}
        <Card className="card-glow xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Target className="mr-2 h-4 w-4" />
              Lead Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Lead Info */}
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium">
                SJ
              </div>
              <div>
                <h3 className="font-medium">{leadContext.name}</h3>
                <p className="text-sm text-muted-foreground">Former Premium Member</p>
                <div className="flex space-x-1 mt-1">
                  <Badge variant="outline" className="text-xs">High Value</Badge>
                  <Badge variant="outline" className="text-xs">Warm Lead</Badge>
                </div>
              </div>
            </div>

            {/* Context Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-mono text-xs">{leadContext.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Visit:</span>
                <span>{leadContext.lastVisit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">LTV:</span>
                <span className="font-medium text-green-600">{leadContext.lifetimeValue}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Left Because:</span>
                <span>{leadContext.reasonForLeaving}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Best Contact:</span>
                <span>{leadContext.bestTimeToContact}</span>
              </div>
            </div>

            <div className="p-2 bg-blue-50 dark:bg-blue-950/20 rounded text-xs">
              <strong>AI Insight:</strong> {leadContext.personalityInsights}
            </div>

            <Separator />

            {/* Call Controls */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Call Status</span>
                <Badge variant={isCallActive ? "default" : "secondary"}>
                  {isCallActive ? "Active" : "Ready"}
                </Badge>
              </div>

              {isCallActive && (
                <div className="text-center">
                  <div className="text-2xl font-mono mb-2">{callDuration}</div>
                  <div className="space-y-2">
                    {/* Call Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Call Progress</span>
                        <span>{callProgress}%</span>
                      </div>
                      <Progress value={callProgress} className="h-2" />
                    </div>
                    
                    {/* Sentiment Score */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Sentiment</span>
                        <span className={sentimentScore > 70 ? 'text-green-500' : sentimentScore > 40 ? 'text-yellow-500' : 'text-red-500'}>
                          {sentimentScore}%
                        </span>
                      </div>
                      <Progress 
                        value={sentimentScore} 
                        className={`h-2 ${sentimentScore > 70 ? '[&>div]:bg-green-500' : sentimentScore > 40 ? '[&>div]:bg-yellow-500' : '[&>div]:bg-red-500'}`}
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
            </div>
          </CardContent>
        </Card>

        {/* AI Suggestions & Objection Handling */}
        <Card className="card-glow xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Lightbulb className="mr-2 h-4 w-4 text-accent" />
              Live AI Assistance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="suggestions" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="suggestions">Smart Suggestions</TabsTrigger>
                <TabsTrigger value="objections">Objection Handling</TabsTrigger>
                <TabsTrigger value="actions">Quick Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="suggestions" className="space-y-4 mt-4">
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
                      <Button size="sm" variant="outline" className="text-xs btn-press">
                        <Play className="mr-1 h-3 w-3" />
                        Use Script
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs btn-press">
                        <MessageSquare className="mr-1 h-3 w-3" />
                        Adapt
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs btn-press">
                        <FileText className="mr-1 h-3 w-3" />
                        Add to Notes
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="objections" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {objectionHandling.map((obj, index) => (
                    <Card key={index} className="border-l-4 border-l-orange-500">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm flex items-center">
                            <AlertTriangle className="mr-2 h-4 w-4 text-orange-500" />
                            "{obj.objection}"
                          </CardTitle>
                          <Badge variant="outline" className="text-xs">
                            {obj.success_rate}% success rate
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {obj.responses.map((response, respIndex) => (
                            <div key={respIndex} className="p-2 bg-muted/30 rounded text-xs">
                              <div className="flex justify-between items-start">
                                <p className="flex-1 italic">"{response}"</p>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="ml-2 h-6 px-2 text-xs"
                                  onClick={() => handleObjectionResponse(obj.objection, response)}
                                >
                                  Use
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="actions" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-3">
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
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Custom Action</h4>
                  <div className="flex space-x-2">
                    <Input placeholder="Type custom action..." className="text-sm" />
                    <Button size="sm" className="gradient-accent">
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Live Transcript & Notes */}
        <Card className="card-glow xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Live Transcript</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Live Transcript */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium flex items-center">
                <div className={`w-2 h-2 rounded-full mr-2 ${isCallActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                {isCallActive ? 'Live Transcript' : 'Call Transcript'}
              </h4>
              
              <div className="bg-muted/50 rounded-lg p-3 h-64 overflow-y-auto space-y-3 text-sm">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-muted-foreground">Agent (10:32 AM)</span>
                  <p>"Hi Sarah, this is Mike from FitLife Studio. How are you doing today?"</p>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-muted-foreground">Sarah (10:32 AM)</span>
                  <p>"Oh hi! I'm doing well, thank you. It's been a while since I heard from you guys."</p>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-muted-foreground">Agent (10:33 AM)</span>
                  <p>"Absolutely! I wanted to reach out because I know you were such an important part of our yoga community."</p>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-xs text-muted-foreground">Sarah (10:33 AM)</span>
                  <p>"I really did love those classes. I miss them, but work has been so crazy with all the travel."</p>
                </div>

                {isCallActive && (
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs italic">Listening...</span>
                  </div>
                )}
              </div>
            </div>

            {/* Notes Section */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Call Notes</h4>
              <Textarea 
                placeholder="Add your notes about this conversation..."
                className="min-h-[100px] text-sm"
                value={currentScript}
                onChange={(e) => setCurrentScript(e.target.value)}
              />
            </div>

            {/* AI Insights */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Real-time Insights</h4>
              <div className="space-y-2">
                <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-green-700 dark:text-green-400">Positive Engagement</p>
                      <p className="text-green-600 dark:text-green-300 text-xs mt-1">Sarah mentioned missing classes - great re-engagement opportunity</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Zap className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-700 dark:text-blue-400">Next Best Action</p>
                      <p className="text-blue-600 dark:text-blue-300 text-xs mt-1">Address travel concern with flexible scheduling options</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Suggestion Overlay */}
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
                  <Button size="sm" className="gradient-accent text-white btn-press">
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

      {/* Floating Widget Iframe Simulation */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-6 right-6 gradient-primary rounded-full w-14 h-14 shadow-lg">
            <Bot className="h-6 w-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-sm h-[600px] p-0">
          <div className="h-full bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg overflow-hidden">
            <div className="p-4 bg-gradient-primary text-white">
              <h3 className="font-semibold">AI Assistant Widget</h3>
              <p className="text-xs opacity-90">Iframe-embedded support</p>
            </div>
            <div className="p-4 space-y-3 h-full overflow-y-auto">
              <div className="bg-white dark:bg-card rounded p-3 text-sm">
                <strong>Current Lead:</strong> Sarah Johnson<br/>
                <strong>Sentiment:</strong> <span className="text-green-600">Positive (75%)</span><br/>
                <strong>Stage:</strong> Discovery
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Quick Actions:</h4>
                {quickActions.slice(0, 4).map((action, index) => (
                  <Button key={index} size="sm" variant="outline" className="w-full text-xs">
                    {action.icon} {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
