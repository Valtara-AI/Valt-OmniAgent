"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Textarea } from "../ui/textarea"
import { Progress } from "../ui/progress"
import { FileText, Play, Download, Edit, Tag, TrendingUp, TrendingDown, Minus, Clock, User, Phone, MessageSquare, Headphones, Zap } from "lucide-react"
import { toast } from "sonner"

interface CallRecord {
  id: string
  leadName: string
  agentName: string
  duration: string
  timestamp: string
  status: "completed" | "processing" | "failed"
  transcriptionStatus: "completed" | "processing" | "failed"
  summaryStatus: "completed" | "processing" | "failed"
  temperature: "hot" | "warm" | "cold"
  outcome: "interested" | "follow_up" | "not_interested" | "callback"
  sentiment: number
  keyTopics: string[]
  nextAction: string
  transcription?: string
  summary?: string
  tags: string[]
}

const callRecords: CallRecord[] = [
  {
    id: "call_001",
    leadName: "Sarah Johnson",
    agentName: "Mike Thompson",
    duration: "8:45",
    timestamp: "2025-01-20 10:32 AM",
    status: "completed",
    transcriptionStatus: "completed",
    summaryStatus: "completed",
    temperature: "hot",
    outcome: "interested",
    sentiment: 85,
    keyTopics: ["yoga classes", "flexible scheduling", "pricing concerns", "trial membership"],
    nextAction: "Schedule tour for this Thursday",
    tags: ["returning-member", "high-value", "yoga-enthusiast"],
    transcription: `Agent: Hi Sarah, this is Mike from FitLife Studio. How are you doing today?

Lead: Oh hi! I'm doing well, thank you. It's been a while since I heard from you guys.

Agent: Absolutely! I wanted to reach out because I know you were such an important part of our yoga community. I noticed you haven't been in for a few months.

Lead: I really did love those classes. I miss them, but work has been so crazy with all the travel.

Agent: I completely understand. That's actually one of the reasons I'm calling. We've introduced some new flexible scheduling options that might work better with your travel schedule.

Lead: Oh really? What kind of options?

Agent: We now offer virtual yoga classes that you can join from anywhere, plus we have early morning and late evening sessions. And for returning members like yourself, we have a special rate.

Lead: That sounds interesting. What's the pricing like?

Agent: For returning premium members, we're offering 40% off the first three months. After that, it goes to our standard rate, but you'd still have access to all the virtual options.

Lead: That's actually really reasonable. I've been missing the community aspect too.

Agent: I'm so glad to hear that! Would you like to come in this week for a complimentary session to see all the improvements we've made?

Lead: Yes, I think I'd like that. Thursday evening would work best for me.

Agent: Perfect! I'll hold a spot for you in our 6 PM yoga flow class this Thursday.`,
    summary: `High-potential reactivation call with former premium member Sarah Johnson. Key points:

• Strong positive response - expressed genuine interest in returning
• Main barrier was work travel, which we addressed with flexible scheduling
• Responded well to virtual class options and returning member discount
• Mentioned missing the community aspect - strong emotional connection
• Agreed to trial session this Thursday 6 PM

Next Steps:
- Confirm Thursday 6 PM yoga flow class booking
- Send welcome back email with virtual class access info
- Follow up day before class with reminder

Lead Temperature: HOT - Very likely to convert back to membership`
  },
  {
    id: "call_002", 
    leadName: "David Chen",
    agentName: "Lisa Rodriguez",
    duration: "12:20",
    timestamp: "2025-01-20 11:15 AM",
    status: "completed",
    transcriptionStatus: "completed",
    summaryStatus: "processing",
    temperature: "warm",
    outcome: "follow_up",
    sentiment: 65,
    keyTopics: ["budget concerns", "family time", "home gym setup"],
    nextAction: "Follow up in 2 weeks with family package info",
    tags: ["price-sensitive", "family-focused", "needs-nurturing"]
  },
  {
    id: "call_003",
    leadName: "Maria Rodriguez",
    agentName: "Jake Wilson", 
    duration: "5:30",
    timestamp: "2025-01-20 2:45 PM",
    status: "completed",
    transcriptionStatus: "processing",
    summaryStatus: "completed",
    temperature: "cold",
    outcome: "not_interested",
    sentiment: 25,
    keyTopics: ["moved away", "new gym", "not interested"],
    nextAction: "Mark as do not contact",
    tags: ["relocated", "not-interested", "remove-from-active"]
  }
]

const temperatureConfig = {
  hot: { 
    color: "bg-red-500", 
    textColor: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
    description: "High conversion probability - immediate follow-up required" 
  },
  warm: { 
    color: "bg-yellow-500", 
    textColor: "text-yellow-600",
    bgColor: "bg-yellow-50 dark:bg-yellow-950/20", 
    borderColor: "border-yellow-200 dark:border-yellow-800",
    description: "Moderate interest - scheduled follow-up recommended"
  },
  cold: { 
    color: "bg-blue-500", 
    textColor: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800", 
    description: "Low interest - long-term nurturing or removal from active list"
  }
}

export function PostCallWorkflows() {
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null)
  const [filterTemp, setFilterTemp] = useState<string>("all")
  const [isProcessing, setIsProcessing] = useState(false)

  const filteredCalls = callRecords.filter(call => 
    filterTemp === "all" || call.temperature === filterTemp
  )

  const handleReprocessCall = async (callId: string) => {
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)
    toast.success("Call reprocessed successfully")
  }

  const handleUpdateTags = (callId: string, newTags: string[]) => {
    toast.success("Tags updated successfully")
  }

  const handleUpdateTemperature = (callId: string, newTemp: "hot" | "warm" | "cold") => {
    toast.success(`Lead marked as ${newTemp}`)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>
      case 'processing':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Processing</Badge>
      case 'failed':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getSentimentIcon = (sentiment: number) => {
    if (sentiment >= 70) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (sentiment >= 40) return <Minus className="h-4 w-4 text-yellow-500" />
    return <TrendingDown className="h-4 w-4 text-red-500" />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <FileText className="mr-2 h-6 w-6 text-primary" />
            Post-Call Workflows
          </h1>
          <p className="text-muted-foreground">
            Automated transcription, AI summaries, and intelligent lead temperature tagging
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
          <Button className="gradient-primary">
            <Zap className="h-4 w-4 mr-2" />
            Reprocess Failed
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Calls Today</p>
                <p className="text-2xl font-semibold">47</p>
              </div>
              <Phone className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Transcribed</p>
                <p className="text-2xl font-semibold text-green-600">44</p>
              </div>
              <Headphones className="h-8 w-8 text-green-600 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Hot Leads</p>
                <p className="text-2xl font-semibold text-red-500">12</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Sentiment</p>
                <p className="text-2xl font-semibold text-blue-600">72%</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600 opacity-75" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-2">
        <Label>Filter by Temperature:</Label>
        <div className="flex space-x-2">
          <Button 
            variant={filterTemp === "all" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterTemp("all")}
          >
            All Calls
          </Button>
          <Button 
            variant={filterTemp === "hot" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterTemp("hot")}
            className={filterTemp === "hot" ? "bg-red-500 hover:bg-red-600" : ""}
          >
            🔥 Hot
          </Button>
          <Button 
            variant={filterTemp === "warm" ? "default" : "outline"} 
            size="sm" 
            onClick={() => setFilterTemp("warm")}
            className={filterTemp === "warm" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
          >
            🟡 Warm
          </Button>
          <Button 
            variant={filterTemp === "cold" ? "default" : "outline"} 
            size="sm"
            onClick={() => setFilterTemp("cold")}
            className={filterTemp === "cold" ? "bg-blue-500 hover:bg-blue-600" : ""}
          >
            🔵 Cold
          </Button>
        </div>
      </div>

      {/* Call Records Table */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle>Recent Call Records</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lead</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Temperature</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCalls.map((call) => (
                <TableRow key={call.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{call.leadName}</div>
                      <div className="text-sm text-muted-foreground">{call.timestamp}</div>
                    </div>
                  </TableCell>
                  <TableCell>{call.agentName}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      {call.duration}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${temperatureConfig[call.temperature].color}`} />
                      <span className={`capitalize font-medium ${temperatureConfig[call.temperature].textColor}`}>
                        {call.temperature}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getSentimentIcon(call.sentiment)}
                      <span>{call.sentiment}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {getStatusBadge(call.transcriptionStatus)}
                      {call.summaryStatus !== call.transcriptionStatus && getStatusBadge(call.summaryStatus)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedCall(call)}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Call Details - {call.leadName}</DialogTitle>
                            <DialogDescription>
                              {call.timestamp} • Duration: {call.duration} • Agent: {call.agentName}
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedCall && (
                            <Tabs defaultValue="summary" className="w-full">
                              <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="summary">AI Summary</TabsTrigger>
                                <TabsTrigger value="transcript">Full Transcript</TabsTrigger>
                                <TabsTrigger value="insights">Insights</TabsTrigger>
                                <TabsTrigger value="actions">Actions</TabsTrigger>
                              </TabsList>

                              <TabsContent value="summary" className="space-y-4">
                                <Card className={`${temperatureConfig[selectedCall.temperature].bgColor} border ${temperatureConfig[selectedCall.temperature].borderColor}`}>
                                  <CardHeader>
                                    <CardTitle className="text-lg flex items-center">
                                      <div className={`w-3 h-3 rounded-full mr-2 ${temperatureConfig[selectedCall.temperature].color}`} />
                                      Lead Temperature: {selectedCall.temperature.toUpperCase()}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                      {temperatureConfig[selectedCall.temperature].description}
                                    </p>
                                  </CardHeader>
                                </Card>

                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">AI-Generated Summary</h4>
                                    <div className="bg-muted/50 rounded-lg p-4">
                                      <pre className="whitespace-pre-wrap text-sm">
                                        {selectedCall.summary || "Summary is being processed..."}
                                      </pre>
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-2">Key Topics Discussed</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedCall.keyTopics.map((topic) => (
                                        <Badge key={topic} variant="secondary">
                                          {topic}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <h4 className="font-semibold mb-2">Next Action Required</h4>
                                    <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
                                      <p className="text-sm">{selectedCall.nextAction}</p>
                                    </div>
                                  </div>
                                </div>
                              </TabsContent>

                              <TabsContent value="transcript" className="space-y-4">
                                <div className="bg-muted/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                                  <pre className="whitespace-pre-wrap text-sm">
                                    {selectedCall.transcription || "Transcription is being processed..."}
                                  </pre>
                                </div>
                                
                                <div className="flex space-x-2">
                                  <Button variant="outline" size="sm">
                                    <Download className="h-3 w-3 mr-1" />
                                    Download Transcript
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <Play className="h-3 w-3 mr-1" />
                                    Play Recording
                                  </Button>
                                </div>
                              </TabsContent>

                              <TabsContent value="insights" className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">Sentiment Analysis</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex items-center space-x-2">
                                        {getSentimentIcon(selectedCall.sentiment)}
                                        <span className="text-2xl font-semibold">{selectedCall.sentiment}%</span>
                                      </div>
                                      <Progress value={selectedCall.sentiment} className="mt-2" />
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader className="pb-2">
                                      <CardTitle className="text-sm">Call Outcome</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <Badge className="capitalize">
                                        {selectedCall.outcome.replace('_', ' ')}
                                      </Badge>
                                    </CardContent>
                                  </Card>
                                </div>

                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-sm">Current Tags</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                      {selectedCall.tags.map((tag) => (
                                        <Badge key={tag} variant="outline">
                                          {tag}
                                        </Badge>
                                      ))}
                                    </div>
                                    <div className="flex space-x-2">
                                      <Input placeholder="Add new tag..." className="text-sm" />
                                      <Button size="sm">
                                        <Tag className="h-3 w-3 mr-1" />
                                        Add
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </TabsContent>

                              <TabsContent value="actions" className="space-y-4">
                                <div className="space-y-4">
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Update Lead Temperature</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="flex space-x-2">
                                        <Button 
                                          size="sm" 
                                          variant={selectedCall.temperature === "hot" ? "default" : "outline"}
                                          className={selectedCall.temperature === "hot" ? "bg-red-500 hover:bg-red-600" : ""}
                                          onClick={() => handleUpdateTemperature(selectedCall.id, "hot")}
                                        >
                                          🔥 Hot
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant={selectedCall.temperature === "warm" ? "default" : "outline"}
                                          className={selectedCall.temperature === "warm" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                                          onClick={() => handleUpdateTemperature(selectedCall.id, "warm")}
                                        >
                                          🟡 Warm
                                        </Button>
                                        <Button 
                                          size="sm" 
                                          variant={selectedCall.temperature === "cold" ? "default" : "outline"}
                                          className={selectedCall.temperature === "cold" ? "bg-blue-500 hover:bg-blue-600" : ""}
                                          onClick={() => handleUpdateTemperature(selectedCall.id, "cold")}
                                        >
                                          🔵 Cold
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Reprocess Call</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <p className="text-sm text-muted-foreground mb-3">
                                        Regenerate transcription and AI summary if there were processing errors.
                                      </p>
                                      <Button 
                                        size="sm" 
                                        onClick={() => handleReprocessCall(selectedCall.id)}
                                        disabled={isProcessing}
                                        className="gradient-accent"
                                      >
                                        {isProcessing ? "Processing..." : "Reprocess Call"}
                                      </Button>
                                    </CardContent>
                                  </Card>

                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-sm">Follow-up Actions</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                      <Button size="sm" variant="outline" className="w-full justify-start">
                                        📧 Send Follow-up Email
                                      </Button>
                                      <Button size="sm" variant="outline" className="w-full justify-start">
                                        📱 Schedule SMS Reminder
                                      </Button>
                                      <Button size="sm" variant="outline" className="w-full justify-start">
                                        📞 Add to Call Back List
                                      </Button>
                                      <Button size="sm" variant="outline" className="w-full justify-start">
                                        🎯 Add to Marketing Campaign
                                      </Button>
                                    </CardContent>
                                  </Card>
                                </div>
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleReprocessCall(call.id)}
                      >
                        <Zap className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
