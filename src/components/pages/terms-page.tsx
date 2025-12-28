"use client"

import { FileText, Scale, Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Separator } from "../ui/separator"
import { Alert, AlertDescription } from "../ui/alert"

interface TermsPageProps {
  onBack?: () => void
}

export function TermsPage({ onBack }: TermsPageProps = {}) {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-transparent" />
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Terms of{" "}
            <span className="gradient-primary bg-clip-text text-transparent">
              Service
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8">
            Please read these terms carefully before using Valt OmniAgent. 
            By accessing our service, you agree to be bound by these terms.
          </p>

          <div className="flex items-center justify-center space-x-4 mb-8">
            <div className="gradient-primary rounded-lg p-2">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <span className="font-medium">Legal Agreement</span>
            <Separator orientation="vertical" className="h-6" />
            <span className="text-muted-foreground">Effective Date: December 15, 2024</span>
          </div>

          {onBack && (
            <Button variant="outline" size="lg" onClick={onBack}>
              Back to App
            </Button>
          )}
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> These terms constitute a legally binding agreement between you and Valt Technologies Inc. 
              Please review them carefully and contact us if you have any questions before proceeding.
            </AlertDescription>
          </Alert>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-12">
            
            {/* Acceptance of Terms */}
            <div>
              <h2 className="text-2xl font-bold mb-6">1. Acceptance of Terms</h2>
              <Card className="p-8 card-glow">
                <p className="text-muted-foreground mb-4">
                  By accessing or using Valt OmniAgent ("Service"), you agree to be bound by these Terms of Service ("Terms"). 
                  If you disagree with any part of these terms, you may not access the Service.
                </p>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      These Terms apply to all visitors, users, and others who access or use the Service, 
                      including fitness studios, individual users, and enterprise customers.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Service Description */}
            <div>
              <h2 className="text-2xl font-bold mb-6">2. Description of Service</h2>
              <Card className="p-8 card-glow">
                <p className="text-muted-foreground mb-6">
                  Valt OmniAgent is an AI-powered lead reactivation platform designed specifically for fitness studios. 
                  Our Service includes:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Dormant database scanning and analysis</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">AI-powered lead prioritization and scoring</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Multi-channel outreach campaigns</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Agent-assisted calling with real-time AI</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Automated follow-up workflows</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                      <span className="text-sm">Performance analytics and ROI tracking</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* User Accounts and Responsibilities */}
            <div>
              <h2 className="text-2xl font-bold mb-6">3. User Accounts and Responsibilities</h2>
              <div className="space-y-6">
                <Card className="p-6 card-glow">
                  <h3 className="font-semibold mb-3">Account Creation</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    You must provide accurate, complete, and current information when creating your account. 
                    You are responsible for maintaining the confidentiality of your account credentials.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Use strong, unique passwords</li>
                    <li>• Do not share account credentials</li>
                    <li>• Notify us immediately of any unauthorized access</li>
                  </ul>
                </Card>

                <Card className="p-6 card-glow">
                  <h3 className="font-semibold mb-3">Acceptable Use</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    You agree to use the Service only for lawful purposes and in accordance with these Terms. 
                    You will not use the Service to:
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Violate any applicable laws or regulations</li>
                    <li>• Send spam or unsolicited communications</li>
                    <li>• Interfere with or disrupt the Service</li>
                    <li>• Attempt to gain unauthorized access to systems</li>
                  </ul>
                </Card>
              </div>
            </div>

            {/* Payment Terms */}
            <div>
              <h2 className="text-2xl font-bold mb-6">4. Payment Terms</h2>
              <Card className="p-8 card-glow">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-semibold mb-4">Billing</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Subscription fees are billed monthly or annually</li>
                      <li>• Charges are non-refundable except as required by law</li>
                      <li>• Late payments may result in service suspension</li>
                      <li>• Price changes require 30 days advance notice</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-4">Cancellation</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Cancel anytime with 30 days notice</li>
                      <li>• Service continues until end of billing period</li>
                      <li>• Data export available for 30 days post-cancellation</li>
                      <li>• Outstanding balances remain due</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Data and Privacy */}
            <div>
              <h2 className="text-2xl font-bold mb-6">5. Data and Privacy</h2>
              <Card className="p-8 card-glow">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="gradient-primary rounded-lg p-2">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Your Data Rights</h3>
                    <p className="text-muted-foreground text-sm">
                      You retain ownership of all data you provide to the Service. We process your data 
                      in accordance with our Privacy Policy and applicable data protection laws.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Data Security</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• End-to-end encryption</li>
                      <li>• SOC 2 Type II compliance</li>
                      <li>• Regular security audits</li>
                      <li>• Access controls and monitoring</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Data Usage</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Service delivery and improvement</li>
                      <li>• AI model training (anonymized)</li>
                      <li>• Analytics and insights</li>
                      <li>• Legal compliance requirements</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2 className="text-2xl font-bold mb-6">6. Intellectual Property</h2>
              <Card className="p-8 card-glow">
                <p className="text-muted-foreground mb-6">
                  The Service and its original content, features, and functionality are owned by Valt Technologies Inc. 
                  and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Our Rights</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Platform software and algorithms</li>
                      <li>• AI models and training data</li>
                      <li>• Trademarks and branding</li>
                      <li>• Documentation and guides</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Your Rights</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Your member and business data</li>
                      <li>• Generated reports and analytics</li>
                      <li>• Customizations and configurations</li>
                      <li>• Limited license to use our Service</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2 className="text-2xl font-bold mb-6">7. Limitation of Liability</h2>
              <Card className="p-8 card-glow border-amber-200 dark:border-amber-800">
                <div className="flex items-start space-x-3 mb-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-700 dark:text-amber-400 mb-2">Important Legal Notice</h3>
                    <p className="text-sm text-muted-foreground">
                      In no event shall Valt Technologies Inc. be liable for any indirect, incidental, special, 
                      consequential, or punitive damages, including without limitation, loss of profits, data, 
                      use, goodwill, or other intangible losses.
                    </p>
                  </div>
                </div>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>• Our total liability shall not exceed the amount paid by you for the Service in the 12 months preceding the claim</p>
                  <p>• We provide the Service "as is" without warranties of any kind</p>
                  <p>• Some jurisdictions do not allow limitation of liability, so these limitations may not apply to you</p>
                </div>
              </Card>
            </div>

            {/* Termination */}
            <div>
              <h2 className="text-2xl font-bold mb-6">8. Termination</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 card-glow">
                  <h3 className="font-semibold mb-3">By You</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    You may terminate your account at any time by following the cancellation process in your account settings.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• 30 days notice required</li>
                    <li>• Service continues until billing period ends</li>
                    <li>• Data export available for 30 days</li>
                  </ul>
                </Card>

                <Card className="p-6 card-glow">
                  <h3 className="font-semibold mb-3">By Us</h3>
                  <p className="text-muted-foreground text-sm mb-3">
                    We may terminate or suspend your account immediately for violation of these Terms or other legitimate reasons.
                  </p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• Material breach of Terms</li>
                    <li>• Non-payment of fees</li>
                    <li>• Illegal or harmful activity</li>
                  </ul>
                </Card>
              </div>
            </div>

            {/* Changes to Terms */}
            <div>
              <h2 className="text-2xl font-bold mb-6">9. Changes to Terms</h2>
              <Card className="p-8 card-glow">
                <div className="flex items-start space-x-4">
                  <div className="gradient-accent rounded-lg p-2">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Updates and Modifications</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      We reserve the right to modify these Terms at any time. When we do, we will notify you 
                      via email and update the "Effective Date" at the top of this page.
                    </p>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>• Material changes require 30 days advance notice</p>
                      <p>• Minor updates (typos, clarifications) are effective immediately</p>
                      <p>• Continued use constitutes acceptance of updated Terms</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold mb-6">10. Contact Information</h2>
              <Card className="p-8 card-glow">
                <div className="text-center">
                  <p className="text-muted-foreground mb-6">
                    Questions about these Terms? Contact our legal team for clarification.
                  </p>
                  <div className="space-y-2">
                    <p className="font-medium">Valt Technologies Inc.</p>
                    <p className="text-sm text-muted-foreground">123 Fitness Tech Boulevard, Suite 456</p>
                    <p className="text-sm text-muted-foreground">San Francisco, CA 94107</p>
                    <p className="font-medium mt-4">Email: legal@valtomniagent.com</p>
                    <p className="text-sm text-muted-foreground">Response time: Within 5 business days</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Acknowledgment */}
      <section className="py-12 px-6 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center">
          <Card className="p-8 card-glow">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="gradient-primary rounded-lg p-2">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold">Legal Acknowledgment</h3>
            </div>
            <p className="text-muted-foreground mb-4">
              By using Valt OmniAgent, you acknowledge that you have read, understood, 
              and agree to be bound by these Terms of Service.
            </p>
            <p className="text-sm text-muted-foreground">
              These Terms constitute the entire agreement between you and Valt Technologies Inc. 
              regarding the use of our Service.
            </p>
          </Card>
        </div>
      </section>
    </div>
  )
}
