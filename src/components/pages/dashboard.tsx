"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Phone, Calendar, Zap, Users, AlertTriangle, Target, Clock, MessageCircle, BarChart3, Command } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"

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
    description: "Percentage of dormant leads successfully reactivated",
    target: "85%"
  },
  {
    title: "Call-to-Meeting Ratio", 
    value: "26.8%",
    change: "+3.2%",
    trend: "up",
    icon: Target,
    color: "text-blue-500",
    description: "Calls that convert to scheduled meetings",
    target: "30%"
  },
  {
    title: "Avg Response Time",
    value: "1.4s",
    change: "-0.3s",
    trend: "up",
    icon: Clock,
    color: "text-purple-500", 
    description: "Average LLM response time for agent assistance",
    target: "< 2s"
  },
  {
    title: "Daily Calls",
    value: "127",
    change: "+23",
    trend: "up",
    icon: Phone,
    color: "text-cyan-500",
    description: "Total outbound calls made today",
    target: "150"
  },
  {
    title: "Hot Leads Generated",
    value: "34",
    change: "+8",
    trend: "up", 
    icon: Zap,
    color: "text-orange-500",
    description: "High-probability leads identified by AI",
    target: "40"
  }
]

const commonObjections = [
  { objection: "Too expensive", count: 47, percentage: 31.2, trend: "+5%" },
  { objection: "No time", count: 38, percentage: 25.2, trend: "-2%" },
  { objection: "Already have gym", count: 29, percentage: 19.2, trend: "+8%" },
  { objection: "Need to think about it", count: 22, percentage: 14.6, trend: "-1%" },
  { objection: "Location too far", count: 15, percentage: 9.8, trend: "+3%" }
]

const callOutcomes = [
  { name: "Interested", value: 42, color: "#10B981" },
  { name: "Follow-up", value: 35, color: "#6B5BFF" },
  { name: "Not Interested", value: 18, color: "#EF4444" },
  { name: "Callback", value: 12, color: "#F59E0B" }
]

const weeklyTrends = [
  { name: "Mon", calls: 24, meetings: 8, reactivations: 6, objections: 15 },
  { name: "Tue", calls: 32, meetings: 12, reactivations: 9, objections: 18 },
  { name: "Wed", calls: 28, meetings: 10, reactivations: 7, objections: 12 },
  { name: "Thu", calls: 45, meetings: 18, reactivations: 14, objections: 22 },
  { name: "Fri", calls: 38, meetings: 15, reactivations: 11, objections: 19 },
  { name: "Sat", calls: 22, meetings: 7, reactivations: 5, objections: 8 },
  { name: "Sun", calls: 18, meetings: 4, reactivations: 3, objections: 6 }
]

const recentLeads = [
  { name: "Sarah Johnson", phone: "(555) 123-4567", status: "hot", score: 92, lastActivity: "2h ago", source: "Mindbody", lastObjection: "Price concern" },
  { name: "Mike Chen", phone: "(555) 234-5678", status: "warm", score: 78, lastActivity: "4h ago", source: "Zen Planner", lastObjection: "No time" },
  { name: "Emma Davis", phone: "(555) 345-6789", status: "cold", score: 45, lastActivity: "1d ago", source: "ClubReady", lastObjection: "Already have gym" },
  { name: "Alex Rodriguez", phone: "(555) 456-7890", status: "hot", score: 89, lastActivity: "30m ago", source: "Mindbody", lastObjection: "Location" }
]

const recentTranscripts = [
  { lead: "Sarah Johnson", snippet: "I'm interested in rejoining but need to check my schedule first...", sentiment: "positive", duration: "3:45", objection: "Scheduling" },
  { lead: "Mike Chen", snippet: "The price seems high compared to other gyms in the area...", sentiment: "neutral", duration: "2:30", objection: "Price" },
  { lead: "Emma Davis", snippet: "I loved the classes but had to cancel due to work travel...", sentiment: "positive", duration: "5:12", objection: "Time" }
]

interface DashboardProps {
  onPageChange: (page: string) => void
}

export function Dashboard({ onPageChange }: DashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("today")

  return (
    <div className="min-h-screen bg-background">

      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Lead Reactivation Dashboard</h1>
            <p className="text-muted-foreground">Real-time KPIs, call outcomes, and AI-powered insights</p>
          </div>
          <div className="flex items-center space-x-4">
            {/* Command Center Access */}
            <Button 
              className="gradient-primary text-white btn-press"
              onClick={() => onPageChange("/command-center")}
            >
              <Command className="mr-2 h-4 w-4" />
              Enterprise Command Center
              <Badge className="ml-2 bg-white/20 text-white text-xs">PRO</Badge>
            </Button>
            
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
              <Button 
                variant={selectedTimeframe === "month" ? "default" : "outline"} 
                size="sm"
                onClick={() => setSelectedTimeframe("month")}
              >
                This Month
              </Button>
            </div>
          </div>
        </div>

        {/* Unified Experience Promotion */}
        <Card className="card-glow border-2 border-accent/50 bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Command className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Unified Enterprise Experience</h3>
                  <p className="text-sm text-muted-foreground">Access the integrated Command Center with real-time agent assistance, live KPI monitoring, and unified lead management</p>
                </div>
              </div>
              <Button 
                className="gradient-primary text-white btn-press"
                onClick={() => onPageChange("/command-center")}
              >
                Launch Command Center
                <Badge className="ml-2 bg-white/20 text-white text-xs">PRO</Badge>
              </Button>
            </div>
          </CardContent>
        </Card>

      {/* Enterprise KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
                <div className="text-xs text-muted-foreground">
                  Target: {kpi.target}
                </div>
                <Progress value={parseFloat(kpi.value)} className="h-1 mt-2" />
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="objections">Common Objections</TabsTrigger>
          <TabsTrigger value="outcomes">Call Outcomes</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Weekly Activity Chart */}
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

            {/* Recent Activity */}
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
                      <p className="text-sm font-medium">📞 Call completed</p>
                      <p className="text-xs text-muted-foreground">Mike Chen - Meeting booked</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">🤖 AI assistance used</p>
                      <p className="text-xs text-muted-foreground">Objection handled successfully</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">⚡ Workflow triggered</p>
                      <p className="text-xs text-muted-foreground">Follow-up sequence started</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Leads Table */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                High-Priority Leads Requiring Action
                <Button variant="outline" size="sm">View All Leads</Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentLeads.map((lead, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.phone} • {lead.source}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-center">
                        <Badge variant="outline" className="text-xs mb-1">{lead.lastObjection}</Badge>
                        <p className="text-xs text-muted-foreground">Last objection</p>
                      </div>
                      <Badge variant={lead.status === 'hot' ? 'destructive' : lead.status === 'warm' ? 'default' : 'secondary'}>
                        {lead.status}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm font-medium">{lead.score}%</p>
                        <p className="text-xs text-muted-foreground">{lead.lastActivity}</p>
                      </div>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline" className="h-7 w-7 p-0" onClick={() => onPageChange("/enhanced-calling")}>
                          <Phone className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="objections" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
                  Most Common Objections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commonObjections.map((objection, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{objection.objection}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">{objection.trend}</Badge>
                          <span className="text-sm font-medium">{objection.count}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={objection.percentage} className="flex-1" />
                        <span className="text-xs text-muted-foreground min-w-[40px]">{objection.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle>Objection Handling Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">73.2%</div>
                    <p className="text-sm text-muted-foreground">Overall success rate in handling objections</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <span className="text-sm">Too expensive</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={85} className="w-16" />
                        <span className="text-sm font-medium">85%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                      <span className="text-sm">No time</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={68} className="w-16" />
                        <span className="text-sm font-medium">68%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <span className="text-sm">Already have gym</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={45} className="w-16" />
                        <span className="text-sm font-medium">45%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="outcomes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle>Call Outcome Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={callOutcomes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {callOutcomes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle>Call-to-Meeting Conversion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">26.8%</div>
                    <p className="text-sm text-muted-foreground">Calls that convert to meetings</p>
                    <Badge className="mt-2">+3.2% vs last week</Badge>
                  </div>
                  
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weeklyTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="meetings" fill="#5BC0FF" />
                      <Bar dataKey="calls" fill="#6B5BFF" fillOpacity={0.3} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle>Agent Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Mike Thompson", calls: 28, meetings: 9, rate: "32.1%" },
                    { name: "Lisa Rodriguez", calls: 24, meetings: 7, rate: "29.2%" },
                    { name: "Jake Wilson", calls: 31, meetings: 6, rate: "19.4%" },
                    { name: "Sarah Kim", calls: 22, meetings: 8, rate: "36.4%" }
                  ].map((agent, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-medium">{agent.name}</p>
                        <p className="text-sm text-muted-foreground">{agent.calls} calls, {agent.meetings} meetings</p>
                      </div>
                      <Badge>{agent.rate}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle>AI Assist Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">12.4K</div>
                    <p className="text-sm text-muted-foreground">AI suggestions used today</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Script suggestions</span>
                      <span className="text-sm font-medium">4.2K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Objection handling</span>
                      <span className="text-sm font-medium">3.8K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Real-time insights</span>
                      <span className="text-sm font-medium">2.9K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Call summaries</span>
                      <span className="text-sm font-medium">1.5K</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CRM Sync Status</span>
                    <Badge className="bg-green-500/10 text-green-500">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Dialer Integration</span>
                    <Badge className="bg-green-500/10 text-green-500">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">AI Model Status</span>
                    <Badge className="bg-green-500/10 text-green-500">Optimal</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Webhook Health</span>
                    <Badge className="bg-yellow-500/10 text-yellow-500">1 Warning</Badge>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="text-sm text-muted-foreground mb-2">Uptime: 99.97%</div>
                    <Progress value={99.97} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}
