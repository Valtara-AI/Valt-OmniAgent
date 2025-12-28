"use client"

import { useState } from "react"
import { TrendingUp, TrendingDown, Download, Calendar, Filter, BarChart3 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
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
  Cell,
  LineChart,
  Line
} from "recharts"

const reactivationData = [
  { month: "Jan", rate: 72, calls: 145, meetings: 58, revenue: 8400 },
  { month: "Feb", rate: 78, calls: 167, meetings: 72, revenue: 12600 },
  { month: "Mar", rate: 82, calls: 189, meetings: 89, revenue: 15800 },
  { month: "Apr", rate: 85, calls: 203, meetings: 94, revenue: 17200 },
  { month: "May", rate: 84, calls: 198, meetings: 91, revenue: 16900 },
  { month: "Jun", rate: 87, calls: 215, meetings: 102, revenue: 19400 }
]

const channelData = [
  { name: "Phone Calls", value: 45, color: "#6B5BFF" },
  { name: "Email", value: 30, color: "#5BC0FF" },
  { name: "SMS", value: 18, color: "#FF6B8A" },
  { name: "In-App", value: 7, color: "#10B981" }
]

const conversionData = [
  { stage: "Leads Contacted", count: 245, rate: 100 },
  { stage: "Responded", count: 156, rate: 63.7 },
  { stage: "Interested", count: 98, rate: 40.0 },
  { stage: "Meeting Booked", count: 67, rate: 27.3 },
  { stage: "Reactivated", count: 34, rate: 13.9 }
]

const topObjections = [
  { objection: "Too expensive", count: 45, resolution_rate: 72 },
  { objection: "No time", count: 38, resolution_rate: 65 },
  { objection: "Location inconvenient", count: 23, resolution_rate: 48 },
  { objection: "Tried other gyms", count: 19, resolution_rate: 78 },
  { objection: "Health concerns", count: 15, resolution_rate: 55 }
]

const kpis = [
  {
    title: "Reactivation Rate",
    value: "84.2%",
    change: "+12.3%",
    trend: "up",
    color: "text-green-500"
  },
  {
    title: "Call-to-Meeting Rate",
    value: "31.5%",
    change: "+5.2%",
    trend: "up",
    color: "text-blue-500"
  },
  {
    title: "Email Click Rate",
    value: "18.7%",
    change: "-2.1%",
    trend: "down",
    color: "text-orange-500"
  },
  {
    title: "Average Revenue Per Reactivation",
    value: "$567",
    change: "+$43",
    trend: "up",
    color: "text-purple-500"
  }
]

export function Analytics() {
  const [dateRange, setDateRange] = useState("6months")
  const [selectedMetric, setSelectedMetric] = useState("reactivation")

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">Track performance and optimize your reactivation campaigns</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1month">Last Month</SelectItem>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last Year</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="gradient-primary text-white btn-press">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="card-glow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-muted-foreground">{kpi.title}</h3>
                <Badge variant={kpi.trend === "up" ? "default" : "secondary"} className="text-xs">
                  {kpi.change}
                </Badge>
              </div>
              <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2 card-glow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Reactivation Trends
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reactivation">Reactivation Rate</SelectItem>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="calls">Total Calls</SelectItem>
                  <SelectItem value="meetings">Meetings Booked</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={reactivationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey={selectedMetric === "reactivation" ? "rate" : selectedMetric} 
                  stroke="#6B5BFF" 
                  fill="#6B5BFF" 
                  fillOpacity={0.6} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Channel Distribution */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Channel Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-2 mt-4">
              {channelData.map((channel, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: channel.color }}
                    />
                    <span>{channel.name}</span>
                  </div>
                  <span className="font-medium">{channel.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card className="lg:col-span-2 card-glow">
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {conversionData.map((stage, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{stage.stage}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">{stage.count}</span>
                      <Badge variant="outline" className="text-xs">
                        {stage.rate}%
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="gradient-primary h-2 rounded-full transition-all"
                      style={{ width: `${stage.rate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Objections */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Top Objections</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topObjections.map((objection, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{objection.objection}</span>
                    <Badge variant="outline" className="text-xs">
                      {objection.count}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          objection.resolution_rate > 70 ? 'bg-green-500' :
                          objection.resolution_rate > 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${objection.resolution_rate}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-8">
                      {objection.resolution_rate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card className="card-glow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Campaign Performance Details
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr className="text-left">
                  <th className="p-3">Campaign</th>
                  <th className="p-3">Leads</th>
                  <th className="p-3">Contacted</th>
                  <th className="p-3">Responded</th>
                  <th className="p-3">Meetings</th>
                  <th className="p-3">Reactivated</th>
                  <th className="p-3">ROI</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-muted/50">
                  <td className="p-3 font-medium">Q2 Yoga Comeback</td>
                  <td className="p-3">67</td>
                  <td className="p-3">64 (95.5%)</td>
                  <td className="p-3">41 (64.1%)</td>
                  <td className="p-3">23 (36.0%)</td>
                  <td className="p-3 text-green-600">12 (18.8%)</td>
                  <td className="p-3 font-medium">$6,840</td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="p-3 font-medium">CrossFit Reactivation</td>
                  <td className="p-3">89</td>
                  <td className="p-3">82 (92.1%)</td>
                  <td className="p-3">48 (58.5%)</td>
                  <td className="p-3">31 (37.8%)</td>
                  <td className="p-3 text-green-600">18 (21.9%)</td>
                  <td className="p-3 font-medium">$12,420</td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="p-3 font-medium">Premium Member Return</td>
                  <td className="p-3">45</td>
                  <td className="p-3">43 (95.6%)</td>
                  <td className="p-3">29 (67.4%)</td>
                  <td className="p-3">19 (44.2%)</td>
                  <td className="p-3 text-green-600">11 (25.6%)</td>
                  <td className="p-3 font-medium">$8,910</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
