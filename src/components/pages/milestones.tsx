"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Progress } from "../ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Calendar } from "../ui/calendar"
import { 
  CheckCircle, 
  Clock, 
  Target, 
  TrendingUp, 
  Users, 
  Phone, 
  Mail, 
  Calendar as CalendarIcon,
  Award,
  Star,
  Zap,
  ChevronRight
} from "lucide-react"

interface Milestone {
  id: string
  title: string
  description: string
  category: "calls" | "leads" | "conversion" | "engagement"
  target: number
  current: number
  deadline: string
  status: "completed" | "in_progress" | "pending" | "overdue"
  reward?: string
}

interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked_date: string
  rarity: "common" | "rare" | "epic" | "legendary"
}

const milestones: Milestone[] = [
  {
    id: "1",
    title: "First 50 Calls",
    description: "Complete your first 50 outbound calls",
    category: "calls",
    target: 50,
    current: 47,
    deadline: "2024-01-31",
    status: "in_progress"
  },
  {
    id: "2", 
    title: "Weekly Lead Target",
    description: "Convert 10 leads this week",
    category: "conversion",
    target: 10,
    current: 7,
    deadline: "2024-01-21",
    status: "in_progress"
  },
  {
    id: "3",
    title: "Perfect Week",
    description: "Complete all scheduled calls for a full week",
    category: "engagement",
    target: 25,
    current: 25,
    deadline: "2024-01-14",
    status: "completed",
    reward: "Perfect Week Badge"
  },
  {
    id: "4",
    title: "Lead Reactivation Master",
    description: "Reactivate 100 dormant leads",
    category: "leads",
    target: 100,
    current: 23,
    deadline: "2024-02-15",
    status: "in_progress"
  }
]

const achievements: Achievement[] = [
  {
    id: "1",
    title: "Early Bird",
    description: "First call of the day for 5 consecutive days",
    icon: "🌅",
    unlocked_date: "2024-01-15",
    rarity: "common"
  },
  {
    id: "2",
    title: "Conversation Master",
    description: "Average call duration over 5 minutes for a week",
    icon: "🎯",
    unlocked_date: "2024-01-12",
    rarity: "rare"
  },
  {
    id: "3",
    title: "Perfect Week",
    description: "100% call completion rate for a full week",
    icon: "⭐",
    unlocked_date: "2024-01-14",
    rarity: "epic"
  },
  {
    id: "4",
    title: "Reactivation Champion",
    description: "30%+ conversion rate on dormant leads",
    icon: "🏆",
    unlocked_date: "2024-01-10",
    rarity: "legendary"
  }
]

const upcomingGoals = [
  { title: "Monthly Revenue Target", progress: 68, target: "$15,000" },
  { title: "Lead Conversion Rate", progress: 85, target: "25%" },
  { title: "Customer Satisfaction", progress: 92, target: "4.5/5" },
  { title: "Call Quality Score", progress: 78, target: "90%" }
]

export function Milestones() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'in_progress':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'pending':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
      case 'overdue':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
    }
  }

  const getCategoryIcon = (category: Milestone['category']) => {
    switch (category) {
      case 'calls':
        return Phone
      case 'leads':
        return Users
      case 'conversion':
        return Target
      case 'engagement':
        return Mail
    }
  }

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
      case 'rare':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'epic':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'legendary':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
    }
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Milestones & Goals</h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and celebrate achievements
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
            Level 12
          </Badge>
          <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
            2,450 XP
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="milestones" className="w-full">
        <TabsList>
          <TabsTrigger value="milestones">Current Milestones</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="goals">Monthly Goals</TabsTrigger>
          <TabsTrigger value="calendar">Progress Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="milestones" className="space-y-4 mt-6">
          <div className="grid gap-4">
            {milestones.map((milestone) => {
              const IconComponent = getCategoryIcon(milestone.category)
              const progress = getProgressPercentage(milestone.current, milestone.target)
              
              return (
                <Card key={milestone.id} className="card-glow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-accent/10 rounded-lg">
                          <IconComponent className="h-5 w-5 text-accent" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{milestone.title}</CardTitle>
                          <CardDescription className="mt-1">
                            {milestone.description}
                          </CardDescription>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge className={getStatusColor(milestone.status)}>
                              {milestone.status.replace('_', ' ')}
                            </Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              Due {milestone.deadline}
                            </div>
                          </div>
                        </div>
                      </div>
                      {milestone.status === 'completed' && (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">
                          {milestone.current} / {milestone.target}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2" />
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{Math.round(progress)}% complete</span>
                        {milestone.reward && (
                          <span className="flex items-center">
                            <Award className="h-3 w-3 mr-1" />
                            {milestone.reward}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="card-glow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <CardTitle className="text-base">{achievement.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {achievement.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    Unlocked on {achievement.unlocked_date}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Progress to Next Achievement */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-base">Next Achievement</CardTitle>
              <CardDescription>You're close to unlocking something special!</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <div className="font-medium">Century Club</div>
                    <div className="text-sm text-muted-foreground">Complete 100 calls</div>
                  </div>
                </div>
                <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                  Epic
                </Badge>
              </div>
              <Progress value={78} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>78 / 100 calls</span>
                <span>22 more to go!</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingGoals.map((goal, index) => (
              <Card key={index} className="card-glow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{goal.title}</CardTitle>
                    <div className="text-right">
                      <div className="font-semibold">{goal.progress}%</div>
                      <div className="text-xs text-muted-foreground">Target: {goal.target}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={goal.progress} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Monthly Challenge */}
          <Card className="card-glow">
            <CardHeader>
              <CardTitle className="text-base">January Challenge</CardTitle>
              <CardDescription>Special monthly challenge with bonus rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">🚀</div>
                  <div>
                    <div className="font-medium">Reactivation Rocket</div>
                    <div className="text-sm text-muted-foreground">
                      Reactivate 50 dormant leads with 35%+ conversion rate
                    </div>
                  </div>
                </div>
                <Badge className="bg-gradient-primary text-white border-0">
                  Premium Reward
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Leads Reactivated</div>
                  <div className="text-2xl font-semibold">23 / 50</div>
                  <Progress value={46} className="h-1 mt-1" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Conversion Rate</div>
                  <div className="text-2xl font-semibold text-green-500">38%</div>
                  <Progress value={100} className="h-1 mt-1" />
                </div>
              </div>

              <div className="mt-4 p-3 bg-accent/5 rounded-lg">
                <div className="text-sm font-medium mb-1">Reward Preview</div>
                <div className="text-xs text-muted-foreground">
                  🏆 Exclusive "Reactivation Master" badge<br />
                  💰 $500 bonus<br />
                  🎯 Advanced AI coaching for 30 days
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4 mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2 card-glow">
              <CardHeader>
                <CardTitle className="text-base">Progress Calendar</CardTitle>
                <CardDescription>View your daily achievements and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card className="card-glow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Today's Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Calls Made</span>
                    </div>
                    <div className="font-semibold">12 / 15</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Leads Contacted</span>
                    </div>
                    <div className="font-semibold">8</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      <span className="text-sm">Conversions</span>
                    </div>
                    <div className="font-semibold">2</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Streak</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-500 mb-1">7</div>
                    <div className="text-sm text-muted-foreground">Days active</div>
                    <div className="flex justify-center mt-2">
                      {[...Array(7)].map((_, i) => (
                        <div key={i} className="w-2 h-2 bg-orange-500 rounded-full mx-0.5" />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-glow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-lg">⭐</span>
                    <span>Perfect Week completed</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="text-lg">🎯</span>
                    <span>Conversation Master unlocked</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
