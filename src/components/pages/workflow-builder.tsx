"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { 
  Plus, 
  Play, 
  Pause, 
  Copy, 
  Trash2, 
  Settings, 
  Phone, 
  Mail, 
  MessageSquare, 
  Clock, 
  Users, 
  Filter,
  ArrowRight,
  Zap,
  RotateCcw,
  Target,
  Calendar,
  Workflow,
  AlertTriangle,
  CheckCircle
} from "lucide-react"
import { toast } from "sonner"

interface WorkflowStep {
  id: string
  type: "trigger" | "action" | "condition" | "retry"
  name: string
  description: string
  icon: any
  config?: Record<string, any>
}

interface Workflow {
  id: string
  name: string
  description: string
  status: "active" | "paused" | "draft"
  steps: WorkflowStep[]
  leads_processed: number
  success_rate: number
  created_at: string
  last_run?: string
  trigger_type: "manual" | "automatic" | "scheduled"
  retry_config?: {
    enabled: boolean
    max_retries: number
    delay_hours: number
    escalation_channel?: string
  }
}

const workflowTemplates = [
  {
    id: "multi-channel-reactivation",
    name: "Multi-Channel Reactivation",
    description: "Phone + Email/SMS outreach with intelligent retry logic",
    steps: ["Dormant lead detected", "AI script generation", "Phone call attempt", "Email follow-up", "SMS retry", "Schedule callback"],
    category: "reactivation"
  },
  {
    id: "automated-followup", 
    name: "Automated Follow-up Sequence",
    description: "Smart follow-ups based on call outcomes with retry logic",
    steps: ["Call completed", "Outcome analysis", "Channel selection", "Follow-up message", "Retry if no response", "Escalate to agent"],
    category: "follow-up"
  },
  {
    id: "call-outcome-workflow",
    name: "Post-Call Automation",
    description: "Trigger actions based on call outcomes and responses",
    steps: ["Call ends", "Sentiment analysis", "Outcome categorization", "Next action trigger", "Multi-channel follow-up"],
    category: "automation"
  },
  {
    id: "scheduled-outreach",
    name: "Scheduled Outreach Campaign",
    description: "Time-based campaign with phone and email coordination",
    steps: ["Schedule trigger", "Lead prioritization", "Call scheduling", "Email pre-send", "Coordinated outreach", "Results tracking"],
    category: "campaign"
  }
]

const availableSteps = [
  // Triggers
  { type: "trigger", name: "Lead Status Change", icon: Users, description: "When lead status changes (hot/warm/cold)" },
  { type: "trigger", name: "Dormancy Detection", icon: Clock, description: "When lead becomes dormant (X days inactive)" },
  { type: "trigger", name: "Call Outcome", icon: Phone, description: "After call completion with specific outcome" },
  { type: "trigger", name: "Time-based Trigger", icon: Calendar, description: "At specific times or intervals" },
  { type: "trigger", name: "Email Response", icon: Mail, description: "When lead responds to email" },
  
  // Actions - Multi-channel
  { type: "action", name: "Initiate Phone Call", icon: Phone, description: "Start dialer call with AI script" },
  { type: "action", name: "Send Personalized Email", icon: Mail, description: "Send AI-generated email" },
  { type: "action", name: "Send SMS Message", icon: MessageSquare, description: "Send targeted SMS" },
  { type: "action", name: "Schedule Callback", icon: Calendar, description: "Add to agent callback list" },
  { type: "action", name: "Update CRM Status", icon: Settings, description: "Update lead information" },
  { type: "action", name: "Add to Campaign", icon: Target, description: "Enroll in marketing campaign" },
  
  // Retry Logic
  { type: "retry", name: "Smart Retry Logic", icon: RotateCcw, description: "Retry with different channel if no response" },
  { type: "retry", name: "Escalation Rules", icon: AlertTriangle, description: "Escalate to agent after X attempts" },
  { type: "retry", name: "Channel Switching", icon: Workflow, description: "Switch communication channel on failure" },
  
  // Conditions
  { type: "condition", name: "Lead Score Check", icon: Zap, description: "Check if lead score meets criteria" },
  { type: "condition", name: "Response Analysis", icon: CheckCircle, description: "Analyze lead response sentiment" },
  { type: "condition", name: "Attempt Count", icon: RotateCcw, description: "Check number of contact attempts" }
]

export function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "Multi-Channel Lead Reactivation",
      description: "Phone + Email/SMS orchestration with smart retry logic",
      status: "active",
      steps: [],
      leads_processed: 1247,
      success_rate: 34.2,
      created_at: "2024-01-15",
      last_run: "2 hours ago",
      trigger_type: "automatic",
      retry_config: {
        enabled: true,
        max_retries: 3,
        delay_hours: 24,
        escalation_channel: "agent_call"
      }
    },
    {
      id: "2", 
      name: "Automated Follow-up Sequence",
      description: "Multi-channel follow-ups based on call outcomes",
      status: "active",
      steps: [],
      leads_processed: 892,
      success_rate: 28.7,
      created_at: "2024-01-10",
      last_run: "4 hours ago",
      trigger_type: "automatic",
      retry_config: {
        enabled: true,
        max_retries: 2,
        delay_hours: 48,
        escalation_channel: "email"
      }
    },
    {
      id: "3",
      name: "Scheduled Outreach Campaign",
      description: "Time-based coordinated phone and email outreach",
      status: "paused",
      steps: [],
      leads_processed: 456,
      success_rate: 22.1,
      created_at: "2024-01-08",
      trigger_type: "scheduled",
      retry_config: {
        enabled: false,
        max_retries: 1,
        delay_hours: 12
      }
    }
  ])

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [isBuilding, setIsBuilding] = useState(false)
  const [showRetryConfig, setShowRetryConfig] = useState(false)

  const handleCreateWorkflow = (template?: any) => {
    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: template?.name || "New Multi-Channel Workflow",
      description: template?.description || "Custom automation workflow with retry logic",
      status: "draft",
      steps: [],
      leads_processed: 0,
      success_rate: 0,
      created_at: new Date().toISOString().split('T')[0],
      trigger_type: "automatic",
      retry_config: {
        enabled: true,
        max_retries: 3,
        delay_hours: 24
      }
    }
    setWorkflows([...workflows, newWorkflow])
    setSelectedWorkflow(newWorkflow)
    setIsBuilding(true)
    toast.success("New workflow created with retry logic!")
  }

  const handleToggleWorkflow = (workflow: Workflow) => {
    const newStatus = workflow.status === "active" ? "paused" : "active"
    setWorkflows(workflows.map(w => 
      w.id === workflow.id ? {...w, status: newStatus} : w
    ))
    toast.success(`Workflow ${newStatus === "active" ? "activated" : "paused"}`)
  }

  const handleTestWorkflow = (workflow: Workflow) => {
    toast.success(`Testing ${workflow.name} with sample leads...`)
  }

  const getStatusBadge = (status: Workflow['status']) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Active</Badge>
      case 'paused':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Paused</Badge>
      case 'draft':
        return <Badge variant="outline">Draft</Badge>
    }
  }

  const getTriggerBadge = (type: string) => {
    switch (type) {
      case 'automatic':
        return <Badge variant="default">Auto</Badge>
      case 'manual':
        return <Badge variant="outline">Manual</Badge>
      case 'scheduled':
        return <Badge variant="secondary">Scheduled</Badge>
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Automation Engine</h1>
          <p className="text-muted-foreground mt-1">
            Orchestrate multi-channel outreach with intelligent retry logic and automated follow-ups
          </p>
        </div>
        <div className="flex space-x-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Automation Templates</DialogTitle>
                <DialogDescription>
                  Pre-built workflows for phone + email/SMS orchestration with retry logic
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 mt-4 md:grid-cols-2">
                {workflowTemplates.map((template) => (
                  <Card key={template.id} className="cursor-pointer hover:bg-accent/5 card-glow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">{template.category}</Badge>
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 mb-4">
                        {template.steps.map((step, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <span className="text-xs font-medium text-primary">{index + 1}</span>
                            </div>
                            <span className="text-muted-foreground">{step}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full gradient-accent"
                        onClick={() => handleCreateWorkflow(template)}
                      >
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Button className="gradient-primary" onClick={() => handleCreateWorkflow()}>
            <Plus className="h-4 w-4 mr-2" />
            Create Workflow
          </Button>
        </div>
      </div>

      <Tabs defaultValue="workflows" className="w-full">
        <TabsList>
          <TabsTrigger value="workflows">Active Workflows</TabsTrigger>
          <TabsTrigger value="builder">Workflow Builder</TabsTrigger>
          <TabsTrigger value="retry">Retry Configuration</TabsTrigger>
          <TabsTrigger value="analytics">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id} className="card-glow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <CardTitle className="text-lg">{workflow.name}</CardTitle>
                          {getTriggerBadge(workflow.trigger_type)}
                          {workflow.retry_config?.enabled && (
                            <Badge variant="outline" className="text-xs">
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Retry Logic
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          {workflow.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(workflow.status)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTestWorkflow(workflow)}
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleWorkflow(workflow)}
                      >
                        {workflow.status === "active" ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-5">
                    <div className="text-center">
                      <div className="text-2xl font-semibold">{workflow.leads_processed.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Leads Processed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-semibold text-green-500">{workflow.success_rate}%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-500">
                        {workflow.retry_config?.enabled ? workflow.retry_config.max_retries : 0}
                      </div>
                      <div className="text-sm text-muted-foreground">Max Retries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">Created</div>
                      <div className="text-sm text-muted-foreground">{workflow.created_at}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium">Last Run</div>
                      <div className="text-sm text-muted-foreground">{workflow.last_run || "Never"}</div>
                    </div>
                  </div>
                  
                  {workflow.retry_config?.enabled && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-2 text-sm">
                        <RotateCcw className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-700 dark:text-blue-400">Retry Logic Active:</span>
                        <span className="text-blue-600 dark:text-blue-300">
                          {workflow.retry_config.max_retries} attempts, {workflow.retry_config.delay_hours}h delay
                        </span>
                        {workflow.retry_config.escalation_channel && (
                          <span className="text-blue-600 dark:text-blue-300">
                            → {workflow.retry_config.escalation_channel}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builder" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-4">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-base">Available Actions</CardTitle>
                <CardDescription>Drag to build your automation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {availableSteps.map((step, index) => (
                  <div
                    key={index}
                    className={`flex items-center p-3 border rounded-lg cursor-move hover:bg-accent/5 ${
                      step.type === 'trigger' ? 'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20' :
                      step.type === 'retry' ? 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20' :
                      step.type === 'action' ? 'border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-950/20' :
                      'border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20'
                    }`}
                  >
                    <step.icon className="h-4 w-4 mr-3 text-primary" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{step.name}</div>
                      <div className="text-xs text-muted-foreground">{step.description}</div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {step.type}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="lg:col-span-3 card-glow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Multi-Channel Workflow Canvas</CardTitle>
                    <CardDescription>Design phone + email/SMS automation with retry logic</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Save Draft</Button>
                    <Button size="sm" className="gradient-primary">Publish Workflow</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px] border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Workflow className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">Build Your Automation</h3>
                    <p className="text-muted-foreground mb-4 max-w-md">
                      Create multi-channel workflows with intelligent retry logic. Start with a trigger, add actions, and configure retry rules.
                    </p>
                    <div className="flex space-x-2 justify-center">
                      <Button className="gradient-accent">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Trigger
                      </Button>
                      <Button variant="outline">
                        <Copy className="h-4 w-4 mr-2" />
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="retry" className="space-y-6 mt-6">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Retry Logic Configuration</CardTitle>
              <CardDescription>
                Configure intelligent retry rules for failed contact attempts across multiple channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Maximum Retry Attempts</Label>
                    <Select defaultValue="3">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 attempt</SelectItem>
                        <SelectItem value="2">2 attempts</SelectItem>
                        <SelectItem value="3">3 attempts</SelectItem>
                        <SelectItem value="5">5 attempts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Retry Delay</Label>
                    <Select defaultValue="24">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="6">6 hours</SelectItem>
                        <SelectItem value="12">12 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="48">48 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Channel Switching Rules</Label>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Phone className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Phone → Email (if no answer)</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Email → SMS (if no open)</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center space-x-3">
                        <MessageSquare className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">SMS → Agent Call (final attempt)</span>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Escalation Rules</Label>
                    <Select defaultValue="agent_call">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agent_call">Escalate to Agent Call</SelectItem>
                        <SelectItem value="manager_review">Manager Review</SelectItem>
                        <SelectItem value="pause_workflow">Pause Workflow</SelectItem>
                        <SelectItem value="mark_unreachable">Mark as Unreachable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Smart Timing</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Respect lead time zones</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Avoid weekends</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Business hours only</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Performance Optimization</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">AI-powered timing</span>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Dynamic channel selection</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2 pt-4 border-t">
                <Button className="gradient-primary">
                  Save Configuration
                </Button>
                <Button variant="outline">
                  Test Rules
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="card-glow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Active Workflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-green-500">{workflows.filter(w => w.status === 'active').length}</div>
                <div className="text-xs text-muted-foreground">Running automation</div>
              </CardContent>
            </Card>
            <Card className="card-glow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Total Outreach</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold">2,595</div>
                <div className="text-xs text-muted-foreground">Multi-channel touches</div>
              </CardContent>
            </Card>
            <Card className="card-glow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Retry Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-blue-500">67%</div>
                <div className="text-xs text-muted-foreground">Of retries convert</div>
              </CardContent>
            </Card>
            <Card className="card-glow">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Avg Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-purple-500">29.1%</div>
                <div className="text-xs text-muted-foreground">+3.2% from last month</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-base">Channel Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Phone Calls</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">34.2%</div>
                      <div className="text-xs text-muted-foreground">1,247 attempts</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Email Follow-ups</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">28.7%</div>
                      <div className="text-xs text-muted-foreground">892 sent</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">SMS Retries</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">22.1%</div>
                      <div className="text-xs text-muted-foreground">456 sent</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-glow">
              <CardHeader>
                <CardTitle className="text-base">Retry Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">First Attempt Success</span>
                    <span className="text-sm font-medium">31.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Second Attempt Success</span>
                    <span className="text-sm font-medium">24.8%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Third Attempt Success</span>
                    <span className="text-sm font-medium">18.3%</span>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-sm font-medium">Total with Retries</span>
                    <span className="text-sm font-medium text-green-600">67.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
