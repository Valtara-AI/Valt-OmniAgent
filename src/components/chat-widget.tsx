"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ValtLogo } from "./valt-logo"

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen && (
        <div className="mb-4 w-80 bg-card rounded-lg shadow-lg border card-glow">
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between">
              <ValtLogo size="sm" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              How can I help you today?
            </p>
          </div>
          
          <div className="h-64 p-4 overflow-y-auto">
            <div className="space-y-3">
              <div className="bg-muted rounded-lg p-3 text-sm">
                Welcome! I'm your AI assistant. Ask me about lead reactivation, workflows, or any features.
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="text-xs">
                  Show me lead insights
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  Create workflow
                </Button>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-border">
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
              />
              <Button size="sm" className="gradient-primary text-white">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="gradient-primary text-white h-12 w-12 rounded-full shadow-lg hover:glow-primary"
      >
        <MessageCircle className="h-5 w-5" />
      </Button>
    </div>
  )
}
