"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { ScrollArea } from "../ui/scroll-area"
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  Pause, 
  Play, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX,
  Clock,
  User,
  Calendar,
  MapPin,
  MessageSquare,
  Star,
  RotateCcw,
  SkipForward,
  CheckCircle
} from "lucide-react"
import { toast } from "sonner"

interface Lead {
  id: string
  name: string
  phone: string
  email: string
  status: "new" | "contacted" | "interested" | "not_interested" | "callback"
  source: string
  last_contact?: string
  notes?: string
  location?: string
  avatar?: string
  lead_score: number
  preferred_time?: string
}

interface CallSession {
  lead: Lead
  startTime: Date
  duration: number
  status: "active" | "on_hold" | "ended"
  notes: string
  outcome?: "interested" | "not_interested" | "callback" | "no_answer"
}

const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    phone: "+1 (555) 123-4567",
    email: "sarah@email.com",
    status: "new",
    source: "Website Form",
    location: "Downtown",
    lead_score: 85,
    preferred_time: "Morning",
    notes: "Interested in yoga classes, mentioned back pain issues"
  },
  {
    id: "2", 
    name: "Mike Chen",
    phone: "+1 (555) 234-5678",
    email: "mike@email.com",
    status: "callback",
    source: "Referral",
    location: "Westside",
    lead_score: 72,
    preferred_time: "Evening",
    last_contact: "2 days ago",
    notes: "Wants to try the 30-day trial, ask about family plans"
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    phone: "+1 (555) 345-6789", 
    email: "emily@email.com",
    status: "contacted",
    source: "Social Media",
    location: "Northside",
    lead_score: 91,
    preferred_time: "Lunch",
    last_contact: "5 hours ago"
  }
]

const callScripts = {
  intro: "Hi [Name], this is [Agent Name] from [Studio Name]. I'm calling about your interest in our fitness programs. Do you have a quick moment to chat?",
  pain_point: "What's been your biggest challenge with staying consistent with your fitness routine?",
  solution: "Based on what you've shared, I think our [Program Name] would be perfect for you. It specifically addresses [Pain Point] and many of our members have seen great results.",
  objection_price: "I understand cost is a consideration. Let me share how our members typically think about this investment in their health...",
  objection_time: "Time is definitely valuable. That's why our programs are designed to be efficient and flexible to fit your schedule...",
  close: "I'd love to get you started with a complimentary session so you can experience the difference. Are you available [Day] at [Time]?"
}

export function Dialer() {
  const [currentCall, setCurrentCall] = useState<CallSession | null>(null)
  const [callQueue, setCallQueue] = useState<Lead[]>(mockLeads)
  const [isMuted, setIsMuted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [callNotes, setCallNotes] = useState("")
  const [selectedScript, setSelectedScript] = useState<keyof typeof callScripts>("intro")
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startCall = (lead: Lead) => {
    const session: CallSession = {
      lead,
      startTime: new Date(),
      duration: 0,
      status: "active",
      notes: ""
    }
    setCurrentCall(session)
    setCallNotes("")
    setIsRecording(true)
    
    // Start timer
    intervalRef.current = setInterval(() => {
      setCurrentCall(prev => prev ? {...prev, duration: prev.duration + 1} : null)
    }, 1000)
    
    toast.success(`Calling ${lead.name}...`)
  }

  const endCall = (outcome?: CallSession['outcome']) => {
    if (currentCall) {
      setCurrentCall({...currentCall, status: "ended", outcome, notes: callNotes})
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      
      // Remove from queue and update status
      setCallQueue(prev => prev.filter(lead => lead.id !== currentCall.lead.id))
      
      toast.success(`Call ended - ${outcome || 'completed'}`)
      
      setTimeout(() => {
        setCurrentCall(null)
        setCallNotes("")
      }, 2000)
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    toast.success(isMuted ? "Unmuted" : "Muted")
  }

  const skipLead = () => {
    if (callQueue.length > 0) {
      const nextLead = callQueue[1] || callQueue[0]
      setCallQueue(prev => [...prev.slice(1), prev[0]])
      toast.success("Lead skipped to end of queue")
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'new': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'contacted': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'interested': return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'callback': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Smart Dialer</h1>
          <p className="text-muted-foreground mt-1">
            AI-powered calling system with real-time assistance and lead prioritization
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
            {callQueue.length} leads in queue
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Call Interface */}
        <Card className="lg:col-span-2 card-glow">
          <CardHeader>
            <CardTitle>Active Call</CardTitle>
            <CardDescription>
              {currentCall ? `Connected with ${currentCall.lead.name}` : "Ready to start calling"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentCall ? (
              <div className="space-y-6">
                {/* Current Lead Info */}
                <div className="flex items-center justify-between p-4 bg-accent/5 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={currentCall.lead.avatar} />
                      <AvatarFallback>
                        {currentCall.lead.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{currentCall.lead.name}</h3>
                      <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                        <span>{currentCall.lead.phone}</span>
                        <Badge className={getStatusColor(currentCall.lead.status)}>
                          {currentCall.lead.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-mono">{formatDuration(currentCall.duration)}</div>
                    <div className="text-sm text-muted-foreground">Call duration</div>
                  </div>
                </div>

                {/* Call Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={toggleMute}
                    className={isMuted ? "bg-red-500/10 border-red-500/20" : ""}
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => setCurrentCall({...currentCall, status: currentCall.status === "on_hold" ? "active" : "on_hold"})}
                  >
                    {currentCall.status === "on_hold" ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
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
                <div className="grid grid-cols-4 gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => endCall("interested")}
                    className="text-green-600 border-green-200 hover:bg-green-50"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Interested
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => endCall("callback")}
                    className="text-blue-600 border-blue-200 hover:bg-blue-50"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Callback
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => endCall("no_answer")}
                    className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    No Answer
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
                    placeholder="Add notes about this call..."
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Phone className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Ready to Start Calling</h3>
                <p className="text-muted-foreground mb-6">
                  Select a lead from the queue to begin your calling session
                </p>
                {callQueue.length > 0 && (
                  <Button 
                    className="gradient-primary" 
                    size="lg"
                    onClick={() => startCall(callQueue[0])}
                  >
                    <PhoneCall className="h-5 w-5 mr-2" />
                    Call Next Lead
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Lead Queue & Scripts */}
        <div className="space-y-6">
          {/* Lead Queue */}
          <Card className="card-glow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Call Queue</CardTitle>
                <Button variant="ghost" size="sm" onClick={skipLead}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-64">
                <div className="space-y-3">
                  {callQueue.map((lead, index) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-accent/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-sm font-medium text-muted-foreground">
                          #{index + 1}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {lead.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">{lead.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Score: {lead.lead_score}
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => startCall(lead)}
                        disabled={!!currentCall}
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Call Scripts */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-base">Call Scripts</CardTitle>
              <CardDescription>AI-generated talking points</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={selectedScript} onValueChange={(v) => setSelectedScript(v as keyof typeof callScripts)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="intro">Intro</TabsTrigger>
                  <TabsTrigger value="close">Close</TabsTrigger>
                </TabsList>
                <TabsContent value="intro" className="space-y-3 mt-4">
                  <div className="p-3 bg-accent/5 rounded-lg text-sm">
                    {callScripts.intro}
                  </div>
                  <div className="p-3 bg-accent/5 rounded-lg text-sm">
                    {callScripts.pain_point}
                  </div>
                </TabsContent>
                <TabsContent value="close" className="space-y-3 mt-4">
                  <div className="p-3 bg-accent/5 rounded-lg text-sm">
                    {callScripts.solution}
                  </div>
                  <div className="p-3 bg-accent/5 rounded-lg text-sm">
                    {callScripts.close}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="card-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Calls Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">47</div>
            <div className="text-xs text-muted-foreground">+12 from yesterday</div>
          </CardContent>
        </Card>
        <Card className="card-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Connect Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-500">68%</div>
            <div className="text-xs text-muted-foreground">Above average</div>
          </CardContent>
        </Card>
        <Card className="card-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Avg Call Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">4:23</div>
            <div className="text-xs text-muted-foreground">Optimal range</div>
          </CardContent>
        </Card>
        <Card className="card-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Conversion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-blue-500">24%</div>
            <div className="text-xs text-muted-foreground">+5% this week</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
