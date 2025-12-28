"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Switch } from "../ui/switch"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Settings, Check, X, RefreshCw, ExternalLink, Zap, Webhook, Database, AlertCircle, Activity } from "lucide-react"
import { toast } from "sonner"

interface Integration {
  id: string
  name: string
  description: string
  icon: string
  category: "crm" | "dialer" | "automation"
  status: "connected" | "disconnected" | "error"
  lastSync?: string
  features: string[]
  webhooks?: WebhookConfig[]
  dormancySettings?: DormancyConfig
}

interface WebhookConfig {
  id: string
  name: string
  url: string
  events: string[]
  status: "active" | "inactive"
  lastTriggered?: string
}

interface DormancyConfig {
  enabled: boolean
  thresholdDays: number
  tags: string[]
  autoReactivation: boolean
}

const integrations: Integration[] = [
  {
    id: "mindbody",
    name: "Mindbody",
    description: "Sync lead data and member information from your Mindbody studio management system",
    icon: "🧘‍♀️",
    category: "crm",
    status: "connected",
    lastSync: "2 minutes ago",
    features: ["Lead Import", "Member Status", "Class Bookings", "Payment History", "Webhook Events", "Dormancy Detection"],
    webhooks: [
      {
        id: "mb_1",
        name: "Lead Created",
        url: "https://api.valt.ai/webhooks/mindbody/lead-created",
        events: ["lead.created", "lead.updated"],
        status: "active",
        lastTriggered: "5 minutes ago"
      },
      {
        id: "mb_2", 
        name: "Member Status Change",
        url: "https://api.valt.ai/webhooks/mindbody/member-status",
        events: ["member.status_changed", "member.cancelled"],
        status: "active",
        lastTriggered: "1 hour ago"
      }
    ],
    dormancySettings: {
      enabled: true,
      thresholdDays: 30,
      tags: ["dormant", "high-value", "reactivation-candidate"],
      autoReactivation: true
    }
  },
  {
    id: "zenplanner",
    name: "Zen Planner",
    description: "Connect with Zen Planner to access member data and lead information",
    icon: "🎯",
    category: "crm",
    status: "disconnected",
    features: ["Lead Management", "Member Tracking", "Billing Integration", "Class Scheduling", "Webhook Support"],
    dormancySettings: {
      enabled: false,
      thresholdDays: 45,
      tags: ["inactive", "potential-return"],
      autoReactivation: false
    }
  },
  {
    id: "clubready",
    name: "ClubReady",
    description: "Integrate with ClubReady for comprehensive member and lead management",
    icon: "🏋️",
    category: "crm",
    status: "error",
    lastSync: "Failed 30 min ago",
    features: ["Lead Pipeline", "Member Analytics", "Billing System", "Check-ins", "Real-time Webhooks"],
    webhooks: [
      {
        id: "cr_1",
        name: "Member Check-in",
        url: "https://api.valt.ai/webhooks/clubready/checkin",
        events: ["member.checkin", "member.checkout"],
        status: "inactive",
        lastTriggered: "2 days ago"
      }
    ],
    dormancySettings: {
      enabled: true,
      thresholdDays: 21,
      tags: ["dormant", "needs-attention"],
      autoReactivation: false
    }
  },
  {
    id: "twilio",
    name: "Twilio Flex",
    description: "Cloud-based contact center platform for outbound calling and SMS",
    icon: "☁️",
    category: "dialer",
    status: "connected",
    lastSync: "Just now",
    features: ["Click-to-Call", "Call Recording", "SMS Campaigns", "Voice Analytics", "Webhook Integration", "Real-time Events"],
    webhooks: [
      {
        id: "tw_1",
        name: "Call Completed",
        url: "https://api.valt.ai/webhooks/twilio/call-completed",
        events: ["call.completed", "call.failed"],
        status: "active",
        lastTriggered: "2 minutes ago"
      },
      {
        id: "tw_2",
        name: "SMS Status",
        url: "https://api.valt.ai/webhooks/twilio/sms-status",
        events: ["sms.delivered", "sms.failed"],
        status: "active",
        lastTriggered: "10 minutes ago"
      }
    ]
  },
  {
    id: "aircall",
    name: "Aircall",
    description: "Cloud phone system for sales and support teams",
    icon: "📞",
    category: "dialer",
    status: "disconnected",
    features: ["Call Management", "Team Collaboration", "Call Analytics", "CRM Integration", "Webhook Events"]
  }
]

export function Integrations() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null)
  const [isConfiguring, setIsConfiguring] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  const handleConnect = async (integration: Integration) => {
    setIsConfiguring(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsConfiguring(false)
    toast.success(`${integration.name} connected successfully!`)
  }

  const handleDisconnect = async (integration: Integration) => {
    toast.success(`${integration.name} disconnected`)
  }

  const handleSync = async (integration: Integration) => {
    toast.success(`Syncing ${integration.name}...`)
  }

  const handleWebhookToggle = (webhookId: string) => {
    toast.success("Webhook status updated")
  }

  const handleDormancyUpdate = (integrationId: string, settings: DormancyConfig) => {
    toast.success("Dormancy settings updated")
  }

  const getStatusBadge = (status: Integration['status']) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Connected</Badge>
      case 'disconnected':
        return <Badge variant="outline">Disconnected</Badge>
      case 'error':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Error</Badge>
    }
  }

  const getCategoryIcon = (category: Integration['category']) => {
    switch (category) {
      case 'crm':
        return '🏪'
      case 'dialer':
        return '☎️'
      case 'automation':
        return '🤖'
    }
  }

  const renderIntegrationCard = (integration: Integration) => (
    <Card key={integration.id} className="card-glow relative">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{integration.icon}</div>
            <div>
              <CardTitle className="text-lg">{integration.name}</CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                {getStatusBadge(integration.status)}
                <span className="text-xs text-muted-foreground">
                  {getCategoryIcon(integration.category)}
                </span>
              </div>
            </div>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" onClick={() => setSelectedIntegration(integration)}>
                <Settings className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Configure {integration.name}</DialogTitle>
                <DialogDescription>
                  Manage integration settings, webhooks, and dormancy detection
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="basic">Basic Settings</TabsTrigger>
                  <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
                  <TabsTrigger value="dormancy">Dormancy Config</TabsTrigger>
                  <TabsTrigger value="logs">Event Logs</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <Input id="api-key" placeholder="Enter your API key" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endpoint">Endpoint URL</Label>
                      <Input id="endpoint" placeholder="https://api.example.com" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-sync" />
                      <Label htmlFor="auto-sync">Enable auto-sync (every 15 minutes)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="real-time" />
                      <Label htmlFor="real-time">Enable real-time webhook updates</Label>
                    </div>
                    <Button className="w-full gradient-primary">
                      Save Configuration
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="webhooks" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Webhook Configuration</h3>
                      <p className="text-sm text-muted-foreground">Manage real-time event notifications</p>
                    </div>
                    <Button className="gradient-accent" size="sm">
                      <Webhook className="h-4 w-4 mr-2" />
                      Add Webhook
                    </Button>
                  </div>
                  
                  {integration.webhooks && integration.webhooks.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Events</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Triggered</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {integration.webhooks.map((webhook) => (
                          <TableRow key={webhook.id}>
                            <TableCell className="font-medium">{webhook.name}</TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {webhook.events.map((event) => (
                                  <Badge key={event} variant="secondary" className="text-xs">
                                    {event}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge className={webhook.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}>
                                {webhook.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {webhook.lastTriggered || 'Never'}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Switch
                                  checked={webhook.status === 'active'}
                                  onCheckedChange={() => handleWebhookToggle(webhook.id)}
                                />
                                <Button variant="ghost" size="sm">
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Webhook className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No webhooks configured for this integration</p>
                      <Button className="mt-4 gradient-accent" size="sm">
                        Add Your First Webhook
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="dormancy" className="space-y-4">
                  {integration.category === 'crm' && integration.dormancySettings ? (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Dormancy Detection</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Automatically identify and tag inactive members for reactivation campaigns
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="dormancy-enabled" 
                          checked={integration.dormancySettings.enabled}
                        />
                        <Label htmlFor="dormancy-enabled">Enable dormancy detection</Label>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="threshold">Dormancy Threshold (days)</Label>
                        <Input 
                          id="threshold" 
                          type="number" 
                          defaultValue={integration.dormancySettings.thresholdDays}
                          placeholder="30"
                        />
                        <p className="text-xs text-muted-foreground">
                          Members will be marked as dormant after this many days of inactivity
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Dormancy Tags</Label>
                        <div className="flex flex-wrap gap-2">
                          {integration.dormancySettings.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="px-2 py-1">
                              {tag}
                              <X className="h-3 w-3 ml-1 cursor-pointer" />
                            </Badge>
                          ))}
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            + Add Tag
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="auto-reactivation" 
                          checked={integration.dormancySettings.autoReactivation}
                        />
                        <Label htmlFor="auto-reactivation">Automatically trigger reactivation campaigns</Label>
                      </div>

                      <Button className="w-full gradient-primary">
                        Update Dormancy Settings
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Dormancy detection is not available for this integration type</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="logs" className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Recent Events</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Monitor webhook deliveries and sync activities
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    {[
                      { time: "2 min ago", event: "Webhook delivered", status: "success", details: "lead.created → 200 OK" },
                      { time: "5 min ago", event: "Data sync completed", status: "success", details: "Synced 24 leads, 156 members" },
                      { time: "15 min ago", event: "Webhook retry", status: "warning", details: "member.status_changed → Retry 2/3" },
                      { time: "1 hour ago", event: "Dormancy scan", status: "success", details: "Found 12 new dormant members" }
                    ].map((log, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                        <div className={`w-2 h-2 rounded-full ${
                          log.status === 'success' ? 'bg-green-500' : 
                          log.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{log.event}</span>
                            <span className="text-xs text-muted-foreground">{log.time}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">{log.details}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="mb-4">
          {integration.description}
        </CardDescription>
        
        <div className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {integration.features.slice(0, 2).map((feature) => (
              <Badge key={feature} variant="secondary" className="text-xs">
                {feature}
              </Badge>
            ))}
            {integration.features.length > 2 && (
              <Badge variant="outline" className="text-xs">
                +{integration.features.length - 2} more
              </Badge>
            )}
          </div>

          {integration.lastSync && (
            <div className="text-xs text-muted-foreground">
              Last sync: {integration.lastSync}
            </div>
          )}

          <div className="flex space-x-2 pt-2">
            {integration.status === 'connected' ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSync(integration)}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Sync
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDisconnect(integration)}
                >
                  <X className="h-3 w-3 mr-1" />
                  Disconnect
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="gradient-accent"
                disabled={isConfiguring}
                onClick={() => handleConnect(integration)}
              >
                {isConfiguring ? (
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                ) : (
                  <Check className="h-3 w-3 mr-1" />
                )}
                Connect
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Integrations</h1>
          <p className="text-muted-foreground mt-1">
            Connect your CRM, dialer, and automation tools with webhook-first ingestion and dormancy detection
          </p>
        </div>
        <Button className="gradient-primary">
          <Zap className="h-4 w-4 mr-2" />
          Browse All Integrations
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Integrations</TabsTrigger>
          <TabsTrigger value="crm">CRM Systems</TabsTrigger>  
          <TabsTrigger value="dialer">Dialers</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {integrations.map((integration) => renderIntegrationCard(integration))}
          </div>
        </TabsContent>

        <TabsContent value="crm" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {integrations.filter(i => i.category === 'crm').map((integration) => renderIntegrationCard(integration))}
          </div>
        </TabsContent>

        <TabsContent value="dialer" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {integrations.filter(i => i.category === 'dialer').map((integration) => renderIntegrationCard(integration))}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {integrations.filter(i => i.category === 'automation').map((integration) => renderIntegrationCard(integration))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Enhanced Integration Health Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Integration Health
            </CardTitle>
            <CardDescription>
              Monitor the status and performance of your connected integrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-500">4</div>
                <div className="text-sm text-muted-foreground">Active Connections</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-blue-500">12.3k</div>
                <div className="text-sm text-muted-foreground">Records Synced Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-yellow-500">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glow">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="h-5 w-5 mr-2" />
              Dormancy Insights
            </CardTitle>
            <CardDescription>
              Automated dormancy detection and tagging statistics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center">
                <div className="text-2xl font-semibold text-orange-500">247</div>
                <div className="text-sm text-muted-foreground">Dormant Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-purple-500">18</div>
                <div className="text-sm text-muted-foreground">Auto-Tagged Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-semibold text-green-500">12</div>
                <div className="text-sm text-muted-foreground">Reactivated This Week</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
