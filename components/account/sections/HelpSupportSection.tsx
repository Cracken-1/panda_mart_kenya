'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  HelpCircle, MessageCircle, Phone, Mail, Search,
  ChevronDown, ChevronRight, ExternalLink, Clock,
  CheckCircle, AlertCircle, Book, Video, FileText,
  Headphones, MapPin, Star, Send, Paperclip, User,
  ShoppingCart, CreditCard
} from 'lucide-react'

interface HelpSupportSectionProps {
  user?: any
}

const HelpSupportSection = ({ user }: HelpSupportSectionProps) => {
  const [activeTab, setActiveTab] = useState('faq')
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState({
    category: '',
    subject: '',
    message: '',
    priority: 'medium',
    attachments: []
  })

  const tabs = [
    { id: 'faq', name: 'FAQ', icon: HelpCircle },
    { id: 'contact', name: 'Contact Us', icon: MessageCircle },
    { id: 'guides', name: 'User Guides', icon: Book },
    { id: 'status', name: 'System Status', icon: CheckCircle }
  ]

  const faqCategories = [
    {
      id: 'account',
      name: 'Account & Login',
      questions: [
        {
          id: 1,
          question: 'How do I create a Panda ID account?',
          answer: 'To create a Panda ID account, click on the user icon in the top right corner and select "Register". Fill in your details including name, email, and phone number. You\'ll receive a verification code to complete the registration process.'
        },
        {
          id: 2,
          question: 'I forgot my password. How can I reset it?',
          answer: 'Click on "Forgot Password" on the login page. Enter your email address or phone number, and we\'ll send you a reset link. Follow the instructions in the email to create a new password.'
        },
        {
          id: 3,
          question: 'How do I enable two-factor authentication?',
          answer: 'Go to Account Settings > Security > Two-Factor Authentication. Scan the QR code with your authenticator app (Google Authenticator, Microsoft Authenticator, or Authy) and enter the verification code to enable 2FA.'
        }
      ]
    },
    {
      id: 'shopping',
      name: 'Shopping & Orders',
      questions: [
        {
          id: 4,
          question: 'How do I place an order for store pickup?',
          answer: 'Browse our collections online, add items to your cart, and select "Store Pickup" during checkout. Choose your preferred store location and pickup time. You\'ll receive a confirmation with pickup details.'
        },
        {
          id: 5,
          question: 'Can I modify or cancel my order?',
          answer: 'You can modify or cancel your order within 30 minutes of placing it. Go to Account > Orders, find your order, and click "Modify" or "Cancel". After this window, please contact customer support.'
        },
        {
          id: 6,
          question: 'What payment methods do you accept?',
          answer: 'We accept M-Pesa, Visa, Mastercard, and cash payments for store pickup. All online payments are processed securely with encryption.'
        }
      ]
    },
    {
      id: 'loyalty',
      name: 'Panda Points & Loyalty',
      questions: [
        {
          id: 7,
          question: 'How do I earn Panda Points?',
          answer: 'Earn points with every purchase: Bronze members earn 1 point per KES 100, Silver members earn 1.5 points, Gold members earn 2 points, and Platinum members earn 3 points per KES 100 spent.'
        },
        {
          id: 8,
          question: 'How can I redeem my Panda Points?',
          answer: 'Go to Account > Loyalty Program > Rewards. Browse available rewards and click "Redeem" on items you want. Points will be deducted from your account and you\'ll receive a redemption code.'
        },
        {
          id: 9,
          question: 'When do my Panda Points expire?',
          answer: 'Panda Points expire after 12 months of inactivity. Make a purchase or redeem points to keep your account active and prevent expiration.'
        }
      ]
    },
    {
      id: 'technical',
      name: 'Technical Issues',
      questions: [
        {
          id: 10,
          question: 'The website is loading slowly. What should I do?',
          answer: 'Try clearing your browser cache and cookies, disable browser extensions, or try a different browser. If the issue persists, check our System Status page or contact support.'
        },
        {
          id: 11,
          question: 'I\'m having trouble with mobile app login.',
          answer: 'Ensure you have the latest app version, check your internet connection, and try logging out and back in. If issues persist, uninstall and reinstall the app.'
        },
        {
          id: 12,
          question: 'My payment failed but money was deducted.',
          answer: 'Payment failures with deductions are usually temporary holds that will be reversed within 3-5 business days. Contact your bank or M-Pesa customer service, and also reach out to our support team with transaction details.'
        }
      ]
    }
  ]

  const contactOptions = [
    {
      id: 'phone',
      name: 'Phone Support',
      description: 'Speak directly with our customer service team',
      contact: '+254 700 000 000',
      contactUrl: 'tel:+254700000000',
      hours: 'Mon-Sun: 8:00 AM - 8:00 PM',
      icon: Phone,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'email',
      name: 'Email Support',
      description: 'Send us a detailed message about your issue',
      contact: 'support@pandamart.co.ke',
      contactUrl: 'mailto:support@pandamart.co.ke',
      hours: 'Response within 24 hours',
      icon: Mail,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'chat',
      name: 'Live Chat',
      description: 'Chat with our support team in real-time',
      contact: 'Available now',
      contactUrl: '#',
      hours: 'Mon-Sun: 9:00 AM - 6:00 PM',
      icon: MessageCircle,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Support',
      description: 'Message us on WhatsApp for quick help',
      contact: '+254 700 000 001',
      contactUrl: 'https://wa.me/254700000001',
      hours: 'Mon-Sun: 8:00 AM - 8:00 PM',
      icon: MessageCircle,
      color: 'bg-green-100 text-green-600'
    }
  ]

  const userGuides = [
    {
      id: 1,
      title: 'Getting Started with Panda Mart',
      description: 'Learn the basics of shopping with us',
      type: 'video',
      duration: '5 min',
      icon: Video
    },
    {
      id: 2,
      title: 'How to Use Panda Points',
      description: 'Maximize your loyalty program benefits',
      type: 'guide',
      duration: '3 min read',
      icon: FileText
    },
    {
      id: 3,
      title: 'Store Pickup Process',
      description: 'Step-by-step pickup instructions',
      type: 'guide',
      duration: '2 min read',
      icon: FileText
    },
    {
      id: 4,
      title: 'Account Security Best Practices',
      description: 'Keep your account safe and secure',
      type: 'guide',
      duration: '4 min read',
      icon: FileText
    }
  ]

  const systemStatus = [
    {
      service: 'Website',
      status: 'operational',
      lastChecked: '2 minutes ago'
    },
    {
      service: 'Mobile App',
      status: 'operational',
      lastChecked: '5 minutes ago'
    },
    {
      service: 'Payment Processing',
      status: 'operational',
      lastChecked: '1 minute ago'
    },
    {
      service: 'M-Pesa Integration',
      status: 'operational',
      lastChecked: '3 minutes ago'
    },
    {
      service: 'Store Systems',
      status: 'maintenance',
      lastChecked: '10 minutes ago'
    }
  ]

  const allFaqs = faqCategories.flatMap(category => 
    category.questions.map(q => ({ ...q, category: category.name }))
  )

  const filteredFaqs = searchTerm 
    ? allFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allFaqs

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100'
      case 'maintenance': return 'text-yellow-600 bg-yellow-100'
      case 'outage': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return CheckCircle
      case 'maintenance': return Clock
      case 'outage': return AlertCircle
      default: return HelpCircle
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Save to localStorage for reference
      const supportTicket = {
        id: `TICKET-${Date.now()}`,
        ...contactForm,
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      }
      
      const existingTickets = JSON.parse(localStorage.getItem('panda_support_tickets') || '[]')
      existingTickets.push(supportTicket)
      localStorage.setItem('panda_support_tickets', JSON.stringify(existingTickets))
      
      setSubmitStatus('success')
      
      // Reset form after success
      setTimeout(() => {
        setContactForm({
          category: '',
          subject: '',
          message: '',
          priority: 'medium',
          attachments: []
        })
        setSubmitStatus('idle')
      }, 3000)
      
    } catch (error) {
      setSubmitStatus('error')
      setTimeout(() => setSubmitStatus('idle'), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'faq':
        return (
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search frequently asked questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* FAQ Categories or Search Results */}
            {searchTerm ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Search Results ({filteredFaqs.length})
                </h3>
                {filteredFaqs.map((faq) => (
                  <div key={faq.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium text-gray-900">{faq.question}</h4>
                        <p className="text-sm text-gray-500 mt-1">{faq.category}</p>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                        expandedFaq === faq.id ? 'rotate-180' : ''
                      }`} />
                    </button>
                    {expandedFaq === faq.id && (
                      <div className="px-4 pb-4 text-gray-700 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {faqCategories.map((category) => (
                  <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {category.questions.map((faq) => (
                        <div key={faq.id}>
                          <button
                            onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                          >
                            <h4 className="font-medium text-gray-900">{faq.question}</h4>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${
                              expandedFaq === faq.id ? 'rotate-180' : ''
                            }`} />
                          </button>
                          {expandedFaq === faq.id && (
                            <div className="px-4 pb-4 text-gray-700 leading-relaxed">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-8">
            {/* Contact Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactOptions.map((option) => (
                <div key={option.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-full ${option.color}`}>
                      <option.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{option.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{option.description}</p>
                      <div className="space-y-1">
                        <a 
                          href={option.contactUrl}
                          className="font-medium text-gray-900 hover:text-blue-600 transition-colors block"
                          target={option.id === 'whatsapp' ? '_blank' : '_self'}
                          rel={option.id === 'whatsapp' ? 'noopener noreferrer' : undefined}
                        >
                          {option.contact}
                        </a>
                        <p className="text-sm text-gray-500">{option.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={contactForm.category}
                      onChange={(e) => setContactForm({...contactForm, category: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="account">Account Issues</option>
                      <option value="orders">Orders & Payments</option>
                      <option value="technical">Technical Support</option>
                      <option value="feedback">Feedback & Suggestions</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={contactForm.priority}
                      onChange={(e) => setContactForm({...contactForm, priority: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({...contactForm, subject: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of your issue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please provide as much detail as possible about your issue..."
                    required
                  />
                </div>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-green-800 font-medium">Message sent successfully!</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1">We'll get back to you within 24 hours.</p>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <span className="text-red-800 font-medium">Failed to send message</span>
                    </div>
                    <p className="text-red-700 text-sm mt-1">Please try again or contact us directly.</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Paperclip className="w-4 h-4 mr-2" />
                    Attach Files
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )

      case 'guides':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userGuides.map((guide) => (
              <div key={guide.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                    <guide.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">{guide.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{guide.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{guide.duration}</span>
                      <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center">
                        View Guide
                        <ExternalLink className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )

      case 'status':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">System Status</h3>
              <p className="text-gray-600">Current operational status of our services</p>
            </div>

            <div className="space-y-4">
              {systemStatus.map((service, index) => {
                const StatusIcon = getStatusIcon(service.status)
                return (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <StatusIcon className={`w-5 h-5 ${getStatusColor(service.status).split(' ')[0]}`} />
                      <div>
                        <h4 className="font-medium text-gray-900">{service.service}</h4>
                        <p className="text-sm text-gray-500">Last checked: {service.lastChecked}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">All Systems Operational</h4>
                  <p className="text-blue-700 text-sm mt-1">
                    Our services are running smoothly. Store systems are currently under scheduled maintenance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Help & Support</h2>
          <p className="text-gray-600">Get help with your account, orders, and technical issues</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Phone className="w-4 h-4 mr-2" />
            Call Support
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <MessageCircle className="w-4 h-4 mr-2" />
            Live Chat
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-1">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {renderTabContent()}
      </div>
    </div>
  )
}

export default HelpSupportSection