"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Users, Building2, Calendar, CheckCircle } from "lucide-react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { GradientButton } from "../gradient-button"
import { toast } from "sonner"

const contactInfo = [
  {
    icon: Mail,
    title: "Email Support",
    value: "support@valtomniagent.com",
    description: "Get help with technical issues, integrations, or general questions"
  },
  {
    icon: Phone,
    title: "Phone Support",
    value: "+1 (555) 123-4567",
    description: "Monday - Friday, 8AM - 6PM PST"
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    value: "Available 24/7",
    description: "Instant support through our in-app chat widget"
  },
  {
    icon: MapPin,
    title: "Headquarters",
    value: "San Francisco, CA",
    description: "123 Fitness Tech Boulevard, Suite 456"
  }
]

const supportOptions = [
  {
    icon: Users,
    title: "Sales Inquiry",
    description: "Learn about pricing, features, and demo scheduling",
    action: "Contact Sales"
  },
  {
    icon: Building2,
    title: "Technical Support",
    description: "Get help with integrations, troubleshooting, and setup",
    action: "Get Support"
  },
  {
    icon: Calendar,
    title: "Demo Request",
    description: "Schedule a personalized demo with our product experts",
    action: "Book Demo"
  }
]

const faqs = [
  {
    question: "How quickly can I get started with Valt OmniAgent?",
    answer: "Most fitness studios are up and running within 24-48 hours. Our team handles the CRM integration and initial setup, so you can start reactivating leads immediately."
  },
  {
    question: "Which fitness management systems do you integrate with?",
    answer: "We offer webhook-first integrations with Mindbody, Zen Planner, and ClubReady. We're constantly adding new integrations based on customer demand."
  },
  {
    question: "How does the AI agent assistance work during calls?",
    answer: "Our AI provides real-time suggestions, objection handling scripts, and conversation prompts during live calls. It learns from your successful interactions to improve over time."
  },
  {
    question: "What kind of results can I expect?",
    answer: "Our customers typically see 3.2x revenue increase from dormant leads, with an average reactivation rate of 84.2%. Results vary based on database quality and campaign consistency."
  },
  {
    question: "Is my member data secure?",
    answer: "Yes. We're SOC 2 compliant with end-to-end encryption. Your member data is protected with enterprise-grade security and never shared with third parties."
  }
]

interface ContactPageProps {
  onBack?: () => void
}

export function ContactPage({ onBack }: ContactPageProps = {}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    inquiry: "",
    message: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success("Message sent successfully! We'll get back to you within 24 hours.")
    setFormData({
      name: "",
      email: "",
      company: "",
      phone: "",
      inquiry: "",
      message: ""
    })
    setIsSubmitting(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Get in{" "}
              <span className="gradient-primary bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Have questions about Valt OmniAgent? Our team of fitness industry experts 
              is here to help you unlock the potential of your dormant member database.
            </p>

            {onBack && (
              <Button variant="outline" size="lg" onClick={onBack}>
                Back to Home
              </Button>
            )}
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((item, index) => {
              const Icon = item.icon
              return (
                <Card key={index} className="p-6 card-glow text-center group">
                  <div className="gradient-accent rounded-xl p-3 w-12 h-12 mx-auto mb-4 group-hover:glow-accent transition-all flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <div className="text-primary font-medium mb-2">{item.value}</div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Support Options */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="p-8 card-glow">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2">Send us a Message</h2>
                  <p className="text-muted-foreground">
                    Fill out the form below and we'll get back to you within 24 hours
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Fitness Studio/Company</Label>
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="Your fitness studio name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="inquiry">Type of Inquiry</Label>
                    <Select value={formData.inquiry} onValueChange={(value) => handleInputChange("inquiry", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select inquiry type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sales">Sales & Pricing</SelectItem>
                        <SelectItem value="demo">Demo Request</SelectItem>
                        <SelectItem value="technical">Technical Support</SelectItem>
                        <SelectItem value="integration">Integration Questions</SelectItem>
                        <SelectItem value="billing">Billing & Account</SelectItem>
                        <SelectItem value="partnership">Partnership Opportunities</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Tell us about your fitness studio and how we can help..."
                      rows={5}
                      required
                    />
                  </div>

                  <GradientButton type="submit" size="lg" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </GradientButton>
                </form>
              </Card>
            </div>

            {/* Support Options */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-4">Quick Support Options</h3>
                <div className="space-y-4">
                  {supportOptions.map((option, index) => {
                    const Icon = option.icon
                    return (
                      <Card key={index} className="p-4 card-glow group cursor-pointer hover:border-primary/30 transition-colors">
                        <div className="flex items-start space-x-3">
                          <div className="gradient-accent rounded-lg p-2 group-hover:glow-accent transition-all">
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{option.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{option.description}</p>
                            <Button variant="outline" size="sm" className="btn-press">
                              {option.action}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Business Hours */}
              <Card className="p-6 card-glow">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="gradient-primary rounded-lg p-2">
                    <Clock className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-semibold">Business Hours</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="text-muted-foreground">8AM - 6PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-muted-foreground">10AM - 4PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-muted-foreground">Closed</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-600">Support team online now</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 bg-muted/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">
              Quick answers to common questions about Valt OmniAgent
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6 card-glow">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2">{faq.question}</h4>
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">
              Still have questions? We're here to help!
            </p>
            <Button variant="outline" size="lg">
              View Full Knowledge Base
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="gradient-primary p-8 md:p-12 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">
              Ready to Reactivate Your Dormant Leads?
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Join hundreds of fitness studios using Valt OmniAgent to grow their business
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="border-white text-white hover:bg-white/10 btn-press"
              >
                Schedule Demo
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white/10 btn-press"
              >
                Start Free Trial
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
