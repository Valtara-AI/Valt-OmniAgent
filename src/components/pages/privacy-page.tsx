"use client"

import { Shield, Lock, Eye, Database, Users, FileText, CheckCircle } from "lucide-react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Separator } from "../ui/separator"

const privacyPrinciples = [
  {
    icon: Lock,
    title: "Data Encryption",
    description: "All data is encrypted in transit and at rest using industry-standard AES-256 encryption"
  },
  {
    icon: Eye,
    title: "Minimal Collection",
    description: "We only collect data necessary to provide and improve our lead reactivation services"
  },
  {
    icon: Shield,
    title: "Security First",
    description: "SOC 2 Type II compliant with comprehensive security controls and regular audits"
  },
  {
    icon: Users,
    title: "No Third-Party Sharing",
    description: "Your member data is never sold, rented, or shared with third parties for marketing"
  }
]

const dataTypes = [
  {
    category: "Member Information",
    items: [
      "Contact details (name, email, phone)",
      "Membership history and status",
      "Visit patterns and engagement data",
      "Payment and billing information"
    ]
  },
  {
    category: "Communication Data",
    items: [
      "Call recordings and transcripts",
      "Email and SMS message content",
      "Response rates and engagement metrics",
      "Conversation outcomes and notes"
    ]
  },
  {
    category: "Technical Information",
    items: [
      "IP addresses and device information",
      "Browser type and operating system",
      "Usage analytics and performance metrics",
      "Integration and API activity logs"
    ]
  }
]

interface PrivacyPageProps {
  onBack?: () => void
}

export function PrivacyPage({ onBack }: PrivacyPageProps = {}) {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Privacy{" "}
            <span className="gradient-primary bg-clip-text text-transparent">
              Policy
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Your privacy and data security are fundamental to everything we do at Valt OmniAgent. 
            This policy explains how we collect, use, and protect your information.
          </p>

          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="gradient-primary rounded-lg p-2">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="font-medium">SOC 2 Type II Compliant</span>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-muted-foreground">Last updated: December 15, 2024</span>
          </div>

          {onBack && (
            <Button variant="outline" size="lg" onClick={onBack}>
              Back to App
            </Button>
          )}
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Privacy Principles</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These core principles guide how we handle your data and protect your privacy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {privacyPrinciples.map((principle, index) => {
              const Icon = principle.icon
              return (
                <Card key={index} className="p-6 card-glow text-center group">
                  <div className="gradient-accent rounded-xl p-3 w-12 h-12 mx-auto mb-4 group-hover:glow-accent transition-all flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">{principle.title}</h3>
                  <p className="text-sm text-muted-foreground">{principle.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            
            {/* What Information We Collect */}
            <div>
              <h2 className="text-2xl font-bold mb-6">What Information We Collect</h2>
              <p className="text-muted-foreground mb-8">
                We collect information that enables us to provide effective lead reactivation services 
                for your fitness studio. This includes member data from your existing systems and 
                communication data from our platform.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {dataTypes.map((type, index) => (
                  <Card key={index} className="p-6 card-glow">
                    <h3 className="font-semibold mb-4">{type.category}</h3>
                    <ul className="space-y-2">
                      {type.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                ))}
              </div>
            </div>

            {/* How We Use Your Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">How We Use Your Information</h2>
              <Card className="p-8 card-glow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">Service Delivery</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Identify and prioritize dormant leads</li>
                      <li>• Generate personalized outreach campaigns</li>
                      <li>• Provide AI-powered agent assistance</li>
                      <li>• Track campaign performance and ROI</li>
                      <li>• Process payments and billing</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Platform Improvement</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Enhance AI algorithms and suggestions</li>
                      <li>• Improve user experience and interface</li>
                      <li>• Develop new features and capabilities</li>
                      <li>• Ensure security and prevent fraud</li>
                      <li>• Provide customer support</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Data Security & Protection */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Data Security & Protection</h2>
              <div className="space-y-6">
                <Card className="p-6 card-glow">
                  <div className="flex items-start space-x-4">
                    <div className="gradient-primary rounded-lg p-2">
                      <Lock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Encryption</h3>
                      <p className="text-muted-foreground">
                        All data is encrypted using AES-256 encryption in transit via TLS 1.3 
                        and at rest in our secure cloud infrastructure.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 card-glow">
                  <div className="flex items-start space-x-4">
                    <div className="gradient-primary rounded-lg p-2">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Access Controls</h3>
                      <p className="text-muted-foreground">
                        Strict role-based access controls ensure only authorized personnel 
                        can access your data on a need-to-know basis.
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 card-glow">
                  <div className="flex items-start space-x-4">
                    <div className="gradient-primary rounded-lg p-2">
                      <Database className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Data Retention</h3>
                      <p className="text-muted-foreground">
                        We retain your data only as long as necessary to provide services 
                        or as required by law, with automatic deletion procedures in place.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Your Rights */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Your Privacy Rights</h2>
              <Card className="p-8 card-glow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Data Access & Control</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Request copies of your data</li>
                      <li>• Correct inaccurate information</li>
                      <li>• Delete your data (right to be forgotten)</li>
                      <li>• Export your data in portable formats</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Communication Preferences</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Opt out of marketing communications</li>
                      <li>• Control notification settings</li>
                      <li>• Withdraw consent for processing</li>
                      <li>• Request restricted processing</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Compliance & Certifications */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Compliance & Certifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 card-glow text-center">
                  <div className="gradient-accent rounded-xl p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">SOC 2 Type II</h3>
                  <p className="text-sm text-muted-foreground">
                    Audited security, availability, and confidentiality controls
                  </p>
                </Card>
                
                <Card className="p-6 card-glow text-center">
                  <div className="gradient-accent rounded-xl p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">GDPR Compliant</h3>
                  <p className="text-sm text-muted-foreground">
                    Full compliance with European data protection regulations
                  </p>
                </Card>
                
                <Card className="p-6 card-glow text-center">
                  <div className="gradient-accent rounded-xl p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">CCPA Compliant</h3>
                  <p className="text-sm text-muted-foreground">
                    California Consumer Privacy Act compliance
                  </p>
                </Card>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Our Privacy Team</h2>
              <Card className="p-8 card-glow">
                <div className="text-center">
                  <p className="text-muted-foreground mb-6">
                    Have questions about your privacy or data? Our dedicated privacy team is here to help.
                  </p>
                  <div className="space-y-2">
                    <p className="font-medium">Email: privacy@valtomniagent.com</p>
                    <p className="font-medium">Data Protection Officer: dpo@valtomniagent.com</p>
                    <p className="text-sm text-muted-foreground">
                      Response time: Within 72 hours for privacy-related inquiries
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Updates Notice */}
      <section className="py-12 px-6 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-8 card-glow">
            <h3 className="text-xl font-bold mb-4">Policy Updates</h3>
            <p className="text-muted-foreground mb-4">
              We may update this privacy policy from time to time. When we do, we'll notify you 
              via email and update the "Last updated" date at the top of this page.
            </p>
            <p className="text-sm text-muted-foreground">
              Your continued use of Valt OmniAgent after any changes constitutes acceptance 
              of the updated privacy policy.
            </p>
          </Card>
        </div>
      </section>
    </div>
  )
}
