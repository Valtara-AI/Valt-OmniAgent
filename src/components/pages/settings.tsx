"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { Switch } from "../ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Separator } from "../ui/separator"
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Phone, 
  Mail, 
  Zap, 
  Database, 
  Key,
  Download,
  Upload,
  Trash2,
  Camera,
  Save
} from "lucide-react"
import { useAuth } from "../auth-context"
import { toast } from "sonner"

export function Settings() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  // Profile Settings
  const [profile, setProfile] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    title: "Lead Reactivation Agent",
    bio: "Passionate about helping people achieve their fitness goals.",
    timezone: "America/Los_Angeles",
    language: "en"
  })

  // Notification Settings
  const [notifications, setNotifications] = useState({
    email_new_leads: true,
    email_call_reminders: true,
    email_daily_reports: false,
    push_call_notifications: true,
    push_lead_updates: true,
    sms_urgent_alerts: false,
    desktop_notifications: true
  })

  // Dialer Settings
  const [dialerSettings, setDialerSettings] = useState({
    auto_dial: false,
    call_recording: true,
    caller_id: "+1 (555) 100-0000",
    voicemail_enabled: true,
    call_timeout: "30",
    retry_attempts: "3",
    retry_interval: "60"
  })

  // AI Settings
  const [aiSettings, setAiSettings] = useState({
    script_generation: true,
    real_time_suggestions: true,
    sentiment_analysis: true,
    auto_summarization: true,
    lead_scoring: true,
    predictive_analytics: false
  })

  const handleSaveProfile = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast.success("Profile updated successfully!")
  }

  const handleSaveNotifications = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast.success("Notification preferences saved!")
  }

  const handleExportData = () => {
    toast.success("Data export initiated. You'll receive an email when ready.")
  }

  const handleImportData = () => {
    toast.success("Data import started. Processing in background.")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account, preferences, and system configuration
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="dialer">Dialer</TabsTrigger>
          <TabsTrigger value="ai">AI Settings</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback className="text-lg">
                    {profile.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={profile.title}
                    onChange={(e) => setProfile({...profile, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={profile.timezone} onValueChange={(value) => setProfile({...profile, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={profile.language} onValueChange={(value) => setProfile({...profile, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about yourself..."
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="min-h-[100px]"
                />
              </div>

              <Button onClick={handleSaveProfile} disabled={isLoading} className="gradient-primary">
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Choose what you want to be notified about via email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">New Lead Alerts</div>
                  <div className="text-sm text-muted-foreground">Get notified when new leads are added</div>
                </div>
                <Switch 
                  checked={notifications.email_new_leads}
                  onCheckedChange={(checked) => setNotifications({...notifications, email_new_leads: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Call Reminders</div>
                  <div className="text-sm text-muted-foreground">Reminders for scheduled follow-up calls</div>
                </div>
                <Switch 
                  checked={notifications.email_call_reminders}
                  onCheckedChange={(checked) => setNotifications({...notifications, email_call_reminders: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Daily Reports</div>
                  <div className="text-sm text-muted-foreground">Daily summary of your activity and performance</div>
                </div>
                <Switch 
                  checked={notifications.email_daily_reports}
                  onCheckedChange={(checked) => setNotifications({...notifications, email_daily_reports: checked})}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>Real-time notifications in the app</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Call Notifications</div>
                  <div className="text-sm text-muted-foreground">Incoming call alerts and status updates</div>
                </div>
                <Switch 
                  checked={notifications.push_call_notifications}
                  onCheckedChange={(checked) => setNotifications({...notifications, push_call_notifications: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Lead Updates</div>
                  <div className="text-sm text-muted-foreground">When lead status or information changes</div>
                </div>
                <Switch 
                  checked={notifications.push_lead_updates}
                  onCheckedChange={(checked) => setNotifications({...notifications, push_lead_updates: checked})}
                />
              </div>
            </CardContent>
          </Card>

          <Button onClick={handleSaveNotifications} disabled={isLoading} className="gradient-primary">
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Preferences"}
          </Button>
        </TabsContent>

        <TabsContent value="dialer" className="space-y-6 mt-6">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Dialer Configuration</CardTitle>
              <CardDescription>Configure your calling preferences and settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="caller-id">Caller ID</Label>
                  <Input
                    id="caller-id"
                    value={dialerSettings.caller_id}
                    onChange={(e) => setDialerSettings({...dialerSettings, caller_id: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="call-timeout">Call Timeout (seconds)</Label>
                  <Input
                    id="call-timeout"
                    type="number"
                    value={dialerSettings.call_timeout}
                    onChange={(e) => setDialerSettings({...dialerSettings, call_timeout: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retry-attempts">Retry Attempts</Label>
                  <Input
                    id="retry-attempts"
                    type="number"
                    value={dialerSettings.retry_attempts}
                    onChange={(e) => setDialerSettings({...dialerSettings, retry_attempts: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retry-interval">Retry Interval (minutes)</Label>
                  <Input
                    id="retry-interval"
                    type="number"
                    value={dialerSettings.retry_interval}
                    onChange={(e) => setDialerSettings({...dialerSettings, retry_interval: e.target.value})}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Auto Dial</div>
                    <div className="text-sm text-muted-foreground">Automatically dial next lead in queue</div>
                  </div>
                  <Switch 
                    checked={dialerSettings.auto_dial}
                    onCheckedChange={(checked) => setDialerSettings({...dialerSettings, auto_dial: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Call Recording</div>
                    <div className="text-sm text-muted-foreground">Record all calls for quality and training</div>
                  </div>
                  <Switch 
                    checked={dialerSettings.call_recording}
                    onCheckedChange={(checked) => setDialerSettings({...dialerSettings, call_recording: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Voicemail Detection</div>
                    <div className="text-sm text-muted-foreground">Automatically detect and handle voicemail</div>
                  </div>
                  <Switch 
                    checked={dialerSettings.voicemail_enabled}
                    onCheckedChange={(checked) => setDialerSettings({...dialerSettings, voicemail_enabled: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="space-y-6 mt-6">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>AI Assistant Settings</CardTitle>
              <CardDescription>Configure AI-powered features and suggestions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Script Generation</div>
                  <div className="text-sm text-muted-foreground">AI-generated call scripts based on lead data</div>
                </div>
                <Switch 
                  checked={aiSettings.script_generation}
                  onCheckedChange={(checked) => setAiSettings({...aiSettings, script_generation: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Real-time Suggestions</div>
                  <div className="text-sm text-muted-foreground">Live coaching during calls</div>
                </div>
                <Switch 
                  checked={aiSettings.real_time_suggestions}
                  onCheckedChange={(checked) => setAiSettings({...aiSettings, real_time_suggestions: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Sentiment Analysis</div>
                  <div className="text-sm text-muted-foreground">Analyze customer sentiment during conversations</div>
                </div>
                <Switch 
                  checked={aiSettings.sentiment_analysis}
                  onCheckedChange={(checked) => setAiSettings({...aiSettings, sentiment_analysis: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto Summarization</div>
                  <div className="text-sm text-muted-foreground">Automatic call summaries and next steps</div>
                </div>
                <Switch 
                  checked={aiSettings.auto_summarization}
                  onCheckedChange={(checked) => setAiSettings({...aiSettings, auto_summarization: checked})}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Lead Scoring</div>
                  <div className="text-sm text-muted-foreground">AI-powered lead prioritization</div>
                </div>
                <Switch 
                  checked={aiSettings.lead_scoring}
                  onCheckedChange={(checked) => setAiSettings({...aiSettings, lead_scoring: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Change Password</h4>
                  <div className="grid gap-3">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                    <Button variant="outline" className="w-fit">
                      Update Password
                    </Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Two-Factor Authentication</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm">Protect your account with 2FA</div>
                      <Badge variant="outline" className="mt-1">Not Enabled</Badge>
                    </div>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">API Keys</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">Production API Key</div>
                        <div className="text-sm text-muted-foreground">Last used: 2 hours ago</div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Regenerate</Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6 mt-6">
          <Card className="card-glow">
            <CardHeader>
              <CardTitle>Data Management</CardTitle>
              <CardDescription>Export, import, and manage your data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Export Data</CardTitle>
                    <CardDescription>Download your leads, calls, and analytics data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" onClick={handleExportData}>
                      <Download className="h-4 w-4 mr-2" />
                      Export All Data
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Import Data</CardTitle>
                    <CardDescription>Import leads from CSV or other sources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" onClick={handleImportData}>
                      <Upload className="h-4 w-4 mr-2" />
                      Import Data
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2 text-red-600">Danger Zone</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                    <div>
                      <div className="font-medium">Delete Account</div>
                      <div className="text-sm text-muted-foreground">Permanently delete your account and all data</div>
                    </div>
                    <Button variant="destructive">Delete Account</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
