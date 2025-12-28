"use client"

import {
  BarChart3,
  Bot,
  Brain,
  Calendar,
  Command,
  FileText,
  LayoutDashboard,
  Phone,
  Plug,
  Settings,
  Users,
  Workflow,
  Zap
} from "lucide-react"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { cn } from "./ui/utils"

interface NavigationItem {
  name: string
  href: string
  icon: any
  premium?: boolean
}

const navigation: NavigationItem[] = [
  { name: "Command Center", href: "/command-center", icon: Command, premium: true },
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Agent Assist", href: "/agent", icon: Bot },
  { name: "Dialer", href: "/dialer", icon: Phone },
  { name: "Premium Calling", href: "/enhanced-calling", icon: Zap, premium: true },
  { name: "OmniAgent", href: "/omniagent", icon: Brain, premium: true },
  { name: "Workflows", href: "/workflows", icon: Workflow },
  { name: "Post-Call", href: "/post-call", icon: FileText },
  { name: "Integrations", href: "/integrations", icon: Plug },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Milestones", href: "/milestones", icon: Calendar },
  { name: "Settings", href: "/settings", icon: Settings },
]

interface NavigationProps {
  currentPage: string
  onPageChange: (page: string) => void
}

export function Navigation({ currentPage, onPageChange }: NavigationProps) {
  return (
    <nav className="flex flex-col space-y-1 p-2">
      {navigation.map((item) => {
        const Icon = item.icon
        const isActive = currentPage === item.href
        
        return (
          <Button
            key={item.name}
            variant="ghost"
            className={cn(
              "w-full justify-between btn-press",
              isActive 
                ? "bg-primary/10 text-primary border border-primary/20" 
                : "text-muted-foreground hover:bg-accent/50"
            )}
            onClick={() => onPageChange(item.href)}
          >
            <div className="flex items-center">
              <Icon className="mr-2 h-4 w-4" />
              {item.name}
            </div>
            {item.premium && (
              <Badge className="bg-gradient-primary text-white text-xs" size="sm">
                PRO
              </Badge>
            )}
          </Button>
        )
      })}
    </nav>
  )
}
