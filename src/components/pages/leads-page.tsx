"use client"

import { useState } from "react"
import { Search, Filter, LayoutGrid, List, Phone, Mail, Calendar, MoreHorizontal, Database, Target, Zap, Clock, Users, TrendingUp, Plus, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Progress } from "../ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { toast } from "sonner"

const leads = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "(555) 123-4567",
    status: "hot",
    score: 92,
    lastActivity: "2 hours ago",
    dormantDays: 45,
    source: "Mindbody",
    tags: ["Yoga", "Premium Member", "High-Value"],
    avatar: "SJ",
    lastVisit: "March 2024",
    membershipValue: "$2400",
    reactivationProb: 87,
    preferredContact: "Phone",
    bestCallTime: "6-8 PM"
  },
  {
    id: 2,
    name: "Mike Chen",
    email: "mike.chen@email.com", 
    phone: "(555) 234-5678",
    status: "warm",
    score: 78,
    lastActivity: "4 hours ago",
    dormantDays: 62,
    source: "Zen Planner",
    tags: ["CrossFit", "Former Member"],
    avatar: "MC",
    lastVisit: "February 2024",
    membershipValue: "$1800",
    reactivationProb: 65,
    preferredContact: "Email",
    bestCallTime: "12-2 PM"
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma.d@email.com",
    phone: "(555) 345-6789",
    status: "cold",
    score: 45,
    lastActivity: "1 day ago",
    dormantDays: 120,
    source: "ClubReady",
    tags: ["Pilates"],
    avatar: "ED",
    lastVisit: "January 2024",
    membershipValue: "$960",
    reactivationProb: 32,
    preferredContact: "SMS",
    bestCallTime: "9-11 AM"
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    email: "alex.r@email.com",
    phone: "(555) 456-7890",
    status: "hot",
    score: 89,
    lastActivity: "30 minutes ago", 
    dormantDays: 38,
    source: "Mindbody",
    tags: ["Personal Training", "VIP"],
    avatar: "AR",
    lastVisit: "March 2024",
    membershipValue: "$3200",
    reactivationProb: 91,
    preferredContact: "Phone",
    bestCallTime: "7-9 PM"
  },
  {
    id: 5,
    name: "Lisa Thompson",
    email: "lisa.t@email.com",
    phone: "(555) 567-8901",
    status: "warm",
    score: 67,
    lastActivity: "6 hours ago",
    dormantDays: 75,
    source: "Zen Planner", 
    tags: ["Group Classes"],
    avatar: "LT",
    lastVisit: "February 2024",
    membershipValue: "$1440",
    reactivationProb: 58,
    preferredContact: "Email",
    bestCallTime: "10-12 PM"
  },
  {
    id: 6,
    name: "James Wilson",
    email: "james.w@email.com",
    phone: "(555) 678-9012",
    status: "cold",
    score: 34,
    lastActivity: "3 days ago",
    dormantDays: 180,
    source: "ClubReady",
    tags: ["Swimming"],
    avatar: "JW",
    lastVisit: "December 2023",
    membershipValue: "$720",
    reactivationProb: 28,
    preferredContact: "Phone",
    bestCallTime: "6-8 AM"
  }
]

export function LeadsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dormancyFilter, setDormancyFilter] = useState("all")
  const [selectedLeads, setSelectedLeads] = useState<number[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [showCallListDialog, setShowCallListDialog] = useState(false)

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter
    const matchesDormancy = dormancyFilter === "all" || 
      (dormancyFilter === "30" && lead.dormantDays >= 30) ||
      (dormancyFilter === "60" && lead.dormantDays >= 60) ||
      (dormancyFilter === "90" && lead.dormantDays >= 90)
    return matchesSearch && matchesStatus && matchesDormancy
  })

  const handleScanDatabase = async () => {
    setIsScanning(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsScanning(false)
    toast.success("Database scan completed! Found 23 new dormant leads to prioritize.")
  }

  const handleCreateCallList = () => {
    if (selectedLeads.length === 0) {
      toast.error("Please select leads to add to call list")
      return
    }
    setShowCallListDialog(true)
  }

  const handleCallLead = (lead: typeof leads[0]) => {
    toast.success(`Initiating call to ${lead.name}...`)
  }

  const handleEmailLead = (lead: typeof leads[0]) => {
    toast.success(`Composing email to ${lead.name}...`)
  }

  const handleScheduleFollowup = (lead: typeof leads[0]) => {
    toast.success(`Follow-up scheduled for ${lead.name}`)
  }

  const toggleLeadSelection = (leadId: number) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hot": return "bg-red-500"
      case "warm": return "bg-orange-500"
      case "cold": return "bg-blue-500"
      default: return "bg-gray-500"
    }
  }

  const LeadCard = ({ lead }: { lead: typeof leads[0] }) => (
    <Card className={`card-glow group cursor-pointer transition-all ${selectedLeads.includes(lead.id) ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selectedLeads.includes(lead.id)}
              onChange={() => toggleLeadSelection(lead.id)}
              className="rounded border-border"
            />
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-medium">
              {lead.avatar}
            </div>
            <div>
              <h3 className="font-medium">{lead.name}</h3>
              <p className="text-sm text-muted-foreground">{lead.email}</p>
              <p className="text-xs text-muted-foreground">{lead.phone}</p>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleCallLead(lead)}>
                <Phone className="mr-2 h-4 w-4" />
                Call Lead
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEmailLead(lead)}>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleScheduleFollowup(lead)}>
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Follow-up
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">AI Score</span>
            <span className="font-medium">{lead.score}%</span>
          </div>
          <Progress value={lead.score} className="h-2" />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Reactivation Prob</span>
            <span className="font-medium text-green-600">{lead.reactivationProb}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <div>
            <span className="text-muted-foreground">LTV:</span>
            <span className="font-medium ml-1">{lead.membershipValue}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Dormant:</span>
            <span className="font-medium ml-1">{lead.dormantDays}d</span>
          </div>
          <div>
            <span className="text-muted-foreground">Contact:</span>
            <span className="font-medium ml-1">{lead.preferredContact}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Best Time:</span>
            <span className="font-medium ml-1">{lead.bestCallTime}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm mb-3">
          <Badge variant={lead.status === 'hot' ? 'destructive' : lead.status === 'warm' ? 'default' : 'secondary'}>
            {lead.status}
          </Badge>
          <span className="text-muted-foreground">{lead.lastActivity}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {lead.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex space-x-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" className="flex-1 gradient-primary text-white" onClick={() => handleCallLead(lead)}>
            <Phone className="mr-1 h-3 w-3" />
            Call
          </Button>
          <Button size="sm" variant="outline" className="flex-1" onClick={() => handleEmailLead(lead)}>
            <Mail className="mr-1 h-3 w-3" />
            Email
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const LeadRow = ({ lead }: { lead: typeof leads[0] }) => (
    <tr className={`hover:bg-muted/50 group ${selectedLeads.includes(lead.id) ? 'bg-primary/5' : ''}`}>
      <td className="p-4">
        <input
          type="checkbox"
          checked={selectedLeads.includes(lead.id)}
          onChange={() => toggleLeadSelection(lead.id)}
          className="rounded border-border"
        />
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
            {lead.avatar}
          </div>
          <div>
            <p className="font-medium">{lead.name}</p>
            <p className="text-sm text-muted-foreground">{lead.phone}</p>
          </div>
        </div>
      </td>
      <td className="p-4 text-sm text-muted-foreground">{lead.email}</td>
      <td className="p-4">{lead.lastActivity}</td>
      <td className="p-4">
        <Badge variant={lead.status === 'hot' ? 'destructive' : lead.status === 'warm' ? 'default' : 'secondary'}>
          {lead.status}
        </Badge>
      </td>
      <td className="p-4">
        <div className="flex items-center space-x-2">
          <Progress value={lead.score} className="h-2 w-16" />
          <span className="text-sm font-medium">{lead.score}%</span>
        </div>
      </td>
      <td className="p-4 text-sm font-medium text-green-600">{lead.reactivationProb}%</td>
      <td className="p-4 text-sm">{lead.source}</td>
      <td className="p-4">
        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleCallLead(lead)}>
            <Phone className="h-3 w-3" />
          </Button>
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => handleEmailLead(lead)}>
            <Mail className="h-3 w-3" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Lead Profile</DropdownMenuItem>
              <DropdownMenuItem>Add to Campaign</DropdownMenuItem>
              <DropdownMenuItem>Mark as Contacted</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dormant Lead Database</h1>
          <p className="text-muted-foreground">Scan, prioritize, and reactivate your dormant leads with AI-powered insights</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleScanDatabase}
            disabled={isScanning}
            className="btn-press"
          >
            {isScanning ? (
              <>
                <div className="animate-spin h-4 w-4 mr-2 border-2 border-primary border-t-transparent rounded-full" />
                Scanning...
              </>
            ) : (
              <>
                <Database className="h-4 w-4 mr-2" />
                Scan Database
              </>
            )}
          </Button>
          <Button 
            className="gradient-primary text-white"
            onClick={handleCreateCallList}
            disabled={selectedLeads.length === 0}
          >
            <Target className="h-4 w-4 mr-2" />
            Create Call List ({selectedLeads.length})
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Dormant Leads</p>
                <p className="text-2xl font-semibold">{leads.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-semibold text-red-500">{leads.filter(l => l.status === 'hot').length}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Reactivation Rate</p>
                <p className="text-2xl font-semibold text-green-600">73%</p>
              </div>
              <Target className="h-8 w-8 text-green-600 opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Potential Value</p>
                <p className="text-2xl font-semibold text-blue-600">$127K</p>
              </div>
              <Zap className="h-8 w-8 text-blue-600 opacity-75" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="card-glow">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search leads by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="hot">🔥 Hot</SelectItem>
                <SelectItem value="warm">🟡 Warm</SelectItem>
                <SelectItem value="cold">🔵 Cold</SelectItem>
              </SelectContent>
            </Select>

            <Select value={dormancyFilter} onValueChange={setDormancyFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Dormancy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="30">30+ days</SelectItem>
                <SelectItem value="60">60+ days</SelectItem>
                <SelectItem value="90">90+ days</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Button 
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className="btn-press"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="btn-press"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredLeads.length} of {leads.length} leads • {selectedLeads.length} selected
        </p>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            <span>Hot ({leads.filter(l => l.status === 'hot').length})</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span>Warm ({leads.filter(l => l.status === 'warm').length})</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span>Cold ({leads.filter(l => l.status === 'cold').length})</span>
          </div>
        </div>
      </div>

      {/* Leads Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLeads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      ) : (
        <Card className="card-glow">
          <CardContent className="p-0">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="p-4 font-medium">Select</th>
                  <th className="p-4 font-medium">Name</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">Last Activity</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">AI Score</th>
                  <th className="p-4 font-medium">Reactivation %</th>
                  <th className="p-4 font-medium">Source</th>
                  <th className="p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead) => (
                  <LeadRow key={lead.id} lead={lead} />
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Call List Creation Dialog */}
      <Dialog open={showCallListDialog} onOpenChange={setShowCallListDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Call List</DialogTitle>
            <DialogDescription>
              Generate a prioritized call list for {selectedLeads.length} selected leads
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="list-name">Call List Name</Label>
              <Input 
                id="list-name" 
                placeholder="Hot Leads - Week 1"
                defaultValue={`Call List - ${new Date().toLocaleDateString()}`}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea 
                id="notes" 
                placeholder="Add notes about this call list..."
                className="min-h-[60px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Call Priority Order</Label>
              <Select defaultValue="ai-score">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai-score">AI Score (Highest First)</SelectItem>
                  <SelectItem value="reactivation-prob">Reactivation Probability</SelectItem>
                  <SelectItem value="value">Membership Value</SelectItem>
                  <SelectItem value="dormancy">Dormancy Period</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex space-x-2 pt-4">
              <Button 
                className="flex-1 gradient-primary text-white"
                onClick={() => {
                  setShowCallListDialog(false)
                  toast.success(`Call list created with ${selectedLeads.length} leads!`)
                  setSelectedLeads([])
                }}
              >
                <Target className="h-4 w-4 mr-2" />
                Create List
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowCallListDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
