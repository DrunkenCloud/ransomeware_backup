"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertTriangle,
  CheckCircle,
  Mail,
  Shield,
  X,
  Paperclip,
  FileText,
  FileSpreadsheet,
  Archive,
} from "lucide-react"

interface Attachment {
  name: string
  size: string
  type: string
  suspicious?: boolean
}

interface Email {
  id: number
  from: string
  fromEmail: string
  subject: string
  date: string
  content: string
  attachments?: Attachment[]
  isPhishing: boolean
  phishingIndicators?: string[]
  legitimateReasons?: string[]
}

const mockEmails: Email[] = [
  {
    id: 1,
    from: "PayPal Security",
    fromEmail: "security@paypaI.com",
    subject: "URGENT: Your Account Will Be Suspended",
    date: "2024-01-15 09:23 AM",
    content:
      "Dear Valued Customer,\n\nWe have detected suspicious activity on your PayPal account. Your account will be suspended within 24 hours unless you verify your information immediately.\n\nPlease download and complete the attached verification form, then upload it back to our secure portal.\n\nClick here to access portal: http://paypal-security-verify.net/login\n\nFailure to verify will result in permanent account closure.\n\nPayPal Security Team",
    attachments: [
      {
        name: "PayPal_Account_Verification.exe",
        size: "2.3 MB",
        type: "executable",
        suspicious: true,
      },
    ],
    isPhishing: true,
    phishingIndicators: [
      "Suspicious domain (paypaI.com with capital i instead of l)",
      "Executable file disguised as verification form",
      "Urgent threat language",
      "Suspicious verification link",
      "Generic greeting",
    ],
  },
  {
    id: 2,
    from: "Microsoft Office 365",
    fromEmail: "admin@microsoft.com",
    subject: "Monthly Security Report - January 2024",
    date: "2024-01-14 02:15 PM",
    content:
      "Hello,\n\nYour monthly security report is ready for review. This report includes:\n\n• Login activity summary\n• Security recommendations\n• Account health status\n\nPlease find the detailed report attached. View additional insights in the Microsoft 365 Security Center.\n\nBest regards,\nMicrosoft Security Team",
    attachments: [
      {
        name: "Security_Report_January_2024.pdf",
        size: "847 KB",
        type: "pdf",
      },
    ],
    isPhishing: false,
    legitimateReasons: [
      "Legitimate Microsoft domain",
      "Professional tone",
      "Appropriate PDF attachment for report",
      "No urgent threats or demands",
      "Informational content",
    ],
  },
  {
    id: 3,
    from: "Amazon Customer Service",
    fromEmail: "noreply@amazon-customer.org",
    subject: "Your order #AMZ-789456123 has been shipped",
    date: "2024-01-13 11:45 AM",
    content:
      "Dear Customer,\n\nYour recent order has been processed and shipped. However, there was an issue with your payment method.\n\nPlease review the attached invoice and update your payment information using the secure link provided in the document.\n\nOrder Details:\n- 1x iPhone 15 Pro Max - $1,199.99\n- Shipping: Express (2-day)\n\nThank you for choosing Amazon!",
    attachments: [
      {
        name: "Invoice_AMZ789456123.pdf.exe",
        size: "1.8 MB",
        type: "executable",
        suspicious: true,
      },
      {
        name: "Payment_Update_Form.docm",
        size: "245 KB",
        type: "document",
        suspicious: true,
      },
    ],
    isPhishing: true,
    phishingIndicators: [
      "Suspicious domain (amazon-customer.org)",
      "Double extension file (.pdf.exe)",
      "Macro-enabled Word document (.docm)",
      "Unexpected expensive purchase",
      "Payment verification scam",
    ],
  },
  {
    id: 4,
    from: "IT Department",
    fromEmail: "it@yourcompany.com",
    subject: "Scheduled Maintenance - Email System",
    date: "2024-01-12 08:30 AM",
    content:
      "Dear Team,\n\nWe will be performing scheduled maintenance on our email system this weekend (January 20-21).\n\nMaintenance Window:\n• Saturday 11:00 PM - Sunday 6:00 AM\n• Expected downtime: 2-3 hours\n\nPlease find the detailed maintenance schedule and backup procedures attached.\n\nNo action is required from users.\n\nIT Support Team",
    attachments: [
      {
        name: "Maintenance_Schedule_Jan2024.pdf",
        size: "156 KB",
        type: "pdf",
      },
      {
        name: "Email_Backup_Procedures.docx",
        size: "89 KB",
        type: "document",
      },
    ],
    isPhishing: false,
    legitimateReasons: [
      "Internal company domain",
      "Routine maintenance notification",
      "Appropriate document attachments",
      "Professional communication",
      "No requests for personal information",
    ],
  },
  {
    id: 5,
    from: "Bank of America Alert",
    fromEmail: "alerts@bankofamerica.com",
    subject: "Suspicious Transaction Detected - Act Now!",
    date: "2024-01-11 07:22 PM",
    content:
      "SECURITY ALERT\n\nWe've detected a suspicious transaction on your account:\n\nTransaction: $2,847.99 - Bitcoin Purchase\nLocation: Unknown\nTime: Today, 7:15 PM\n\nPlease download and run the attached security scanner to protect your account immediately. This tool will check your computer for malware that may have compromised your banking information.\n\nYour account will be frozen if no action is taken within 2 hours.\n\nBank of America Fraud Prevention",
    attachments: [
      {
        name: "BOA_Security_Scanner.exe",
        size: "3.2 MB",
        type: "executable",
        suspicious: true,
      },
      {
        name: "Transaction_Details.zip",
        size: "1.1 MB",
        type: "archive",
        suspicious: true,
      },
    ],
    isPhishing: true,
    phishingIndicators: [
      "Requests to download and run executable",
      "High-pressure time limit",
      "Suspicious ZIP file",
      "Banks don't distribute security software",
      "Threatening account freeze",
    ],
  },
  {
    id: 6,
    from: "Netflix",
    fromEmail: "info@netflix.com",
    subject: "New releases this week",
    date: "2024-01-10 03:45 PM",
    content:
      "Hi there!\n\nCheck out what's new on Netflix this week:\n\n🎬 New Movies:\n• The Silent Storm (Thriller)\n• Comedy Central: Best of 2023\n• Documentary: Ocean Mysteries\n\n📺 New Series:\n• Detective Chronicles - Season 2\n• Cooking Masters - New Episodes\n\nWe've also attached our monthly content guide for your reference.\n\nStart watching now on Netflix.\n\nHappy streaming!\nThe Netflix Team",
    attachments: [
      {
        name: "Netflix_Content_Guide_January.pdf",
        size: "2.1 MB",
        type: "pdf",
      },
    ],
    isPhishing: false,
    legitimateReasons: [
      "Legitimate Netflix domain",
      "Promotional content typical of Netflix",
      "Appropriate PDF attachment for content guide",
      "No requests for personal information",
      "Casual, brand-appropriate tone",
    ],
  },
  {
    id: 7,
    from: "HR Department",
    fromEmail: "hr@company-benefits.net",
    subject: "Important: Updated Employee Handbook - Action Required",
    date: "2024-01-09 12:18 PM",
    content:
      "Dear Employee,\n\nWe have updated our employee handbook with new policies effective immediately. All employees must review and acknowledge the changes within 48 hours.\n\nPlease:\n1. Download the attached handbook\n2. Run the policy acknowledgment tool\n3. Submit your digital signature\n\nFailure to complete this process will result in account suspension and may affect your employment status.\n\nHR Department",
    attachments: [
      {
        name: "Employee_Handbook_2024.pdf",
        size: "4.2 MB",
        type: "pdf",
      },
      {
        name: "Policy_Acknowledgment_Tool.scr",
        size: "892 KB",
        type: "executable",
        suspicious: true,
      },
      {
        name: "Digital_Signature_Form.xlsm",
        size: "234 KB",
        type: "spreadsheet",
        suspicious: true,
      },
    ],
    isPhishing: true,
    phishingIndicators: [
      "Suspicious domain (company-benefits.net)",
      "Screen saver file (.scr) - often malware",
      "Macro-enabled Excel file (.xlsm)",
      "Urgent employment threats",
      "Requests to run unknown tools",
    ],
  },
]

export default function Component() {
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null)
  const [userAnswers, setUserAnswers] = useState<Record<number, boolean>>({})
  const [showResults, setShowResults] = useState(false)
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0)

  const handleAnswer = (emailId: number, isPhishing: boolean) => {
    setUserAnswers((prev) => ({ ...prev, [emailId]: isPhishing }))
  }

  const calculateScore = () => {
    const correct = mockEmails.filter((email) => userAnswers[email.id] === email.isPhishing).length
    return Math.round((correct / mockEmails.length) * 100)
  }

  const getAnsweredCount = () => {
    return Object.keys(userAnswers).length
  }

  const resetQuiz = () => {
    setUserAnswers({})
    setShowResults(false)
    setSelectedEmail(null)
    setCurrentEmailIndex(0)
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Shield className="w-6 h-6" />
                Phishing Detection Results
              </CardTitle>
              <CardDescription>Your cybersecurity awareness score</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold mb-4">{score}%</div>
              <div className="text-lg mb-6">
                You correctly identified{" "}
                {mockEmails.filter((email) => userAnswers[email.id] === email.isPhishing).length} out of{" "}
                {mockEmails.length} emails
              </div>
              <Button onClick={resetQuiz} className="mb-6">
                Try Again
              </Button>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {mockEmails.map((email) => {
              const userAnswer = userAnswers[email.id]
              const isCorrect = userAnswer === email.isPhishing

              return (
                <Card key={email.id} className={`${isCorrect ? "border-green-500" : "border-red-500"} border-2`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{email.subject}</CardTitle>
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Correct
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <X className="w-4 h-4 mr-1" />
                            Incorrect
                          </Badge>
                        )}
                        <Badge variant={email.isPhishing ? "destructive" : "secondary"}>
                          {email.isPhishing ? "Phishing" : "Legitimate"}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription>From: {email.fromEmail}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <strong>Your answer:</strong> {userAnswer ? "Phishing" : "Legitimate"}
                    </div>
                    {email.isPhishing && email.phishingIndicators && (
                      <div>
                        <strong className="text-red-600">Phishing Indicators:</strong>
                        <ul className="list-disc list-inside mt-2 text-sm">
                          {email.phishingIndicators.map((indicator, index) => (
                            <li key={index}>{indicator}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {!email.isPhishing && email.legitimateReasons && (
                      <div>
                        <strong className="text-green-600">Why it's legitimate:</strong>
                        <ul className="list-disc list-inside mt-2 text-sm">
                          {email.legitimateReasons.map((reason, index) => (
                            <li key={index}>{reason}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Shield className="w-6 h-6" />
              Phishing Email Detection Training
            </CardTitle>
            <CardDescription>Learn to identify phishing emails and protect yourself from cyber threats</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center gap-4 mb-4">
              <Badge variant="outline">
                Progress: {getAnsweredCount()}/{mockEmails.length}
              </Badge>
              {getAnsweredCount() === mockEmails.length && (
                <Button onClick={() => setShowResults(true)}>View Results</Button>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Click on each email to read it, then decide if it's legitimate or a phishing attempt
            </p>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Email List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Inbox ({mockEmails.length})
            </h3>
            {mockEmails.map((email) => (
              <Card
                key={email.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedEmail?.id === email.id ? "ring-2 ring-blue-500" : ""
                } ${userAnswers[email.id] !== undefined ? "bg-gray-50" : ""}`}
                onClick={() => setSelectedEmail(email)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">{email.from.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm truncate">{email.from}</p>
                        <p className="text-xs text-muted-foreground">{email.date}</p>
                      </div>
                      <p className="font-semibold text-sm mb-1 truncate">{email.subject}</p>
                      <p className="text-xs text-muted-foreground truncate">{email.content.substring(0, 60)}...</p>
                    </div>
                    {userAnswers[email.id] !== undefined && (
                      <Badge variant={userAnswers[email.id] ? "destructive" : "secondary"} className="text-xs">
                        {userAnswers[email.id] ? "Phishing" : "Safe"}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Email Detail */}
          <div className="lg:sticky lg:top-4">
            {selectedEmail ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{selectedEmail.subject}</CardTitle>
                    {selectedEmail.isPhishing && <AlertTriangle className="w-5 h-5 text-red-500" />}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>From:</strong> {selectedEmail.from} {"<"}
                      {selectedEmail.fromEmail}
                      {">"}
                    </div>
                    <div>
                      <strong>Date:</strong> {selectedEmail.date}
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="p-6">
                  <div className="whitespace-pre-wrap text-sm mb-6">{selectedEmail.content}</div>
                  {selectedEmail.attachments && selectedEmail.attachments.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Paperclip className="w-4 h-4" />
                        Attachments ({selectedEmail.attachments.length})
                      </h4>
                      <div className="space-y-2">
                        {selectedEmail.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-3 p-3 rounded-lg border ${
                              attachment.suspicious ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50"
                            }`}
                          >
                            <div className="flex-shrink-0">
                              {attachment.type === "pdf" && <FileText className="w-5 h-5 text-red-600" />}
                              {attachment.type === "document" && <FileText className="w-5 h-5 text-blue-600" />}
                              {attachment.type === "spreadsheet" && (
                                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                              )}
                              {attachment.type === "executable" && <AlertTriangle className="w-5 h-5 text-red-600" />}
                              {attachment.type === "archive" && <Archive className="w-5 h-5 text-yellow-600" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{attachment.name}</p>
                              <p className="text-xs text-muted-foreground">{attachment.size}</p>
                            </div>
                            {attachment.suspicious && (
                              <Badge variant="destructive" className="text-xs">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Suspicious
                              </Badge>
                            )}
                            <Button variant="outline" size="sm" disabled>
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant={userAnswers[selectedEmail.id] === false ? "default" : "outline"}
                      onClick={() => handleAnswer(selectedEmail.id, false)}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Legitimate
                    </Button>
                    <Button
                      variant={userAnswers[selectedEmail.id] === true ? "destructive" : "outline"}
                      onClick={() => handleAnswer(selectedEmail.id, true)}
                      className="flex-1"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Phishing
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Mail className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Select an email from the inbox to read it and make your decision
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
