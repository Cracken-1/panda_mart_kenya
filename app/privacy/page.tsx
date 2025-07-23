'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, Eye, Lock, Database, Users, Globe,
  ArrowLeft, Download, Printer, Calendar, FileText,
  CheckCircle, AlertCircle, Settings, Mail, Phone
} from 'lucide-react'
import Link from 'next/link'

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', title: 'Privacy Overview', icon: Shield },
    { id: 'collection', title: 'Data Collection', icon: Database },
    { id: 'usage', title: 'How We Use Data', icon: Settings },
    { id: 'sharing', title: 'Data Sharing', icon: Users },
    { id: 'security', title: 'Data Security', icon: Lock },
    { id: 'rights', title: 'Your Rights', icon: Eye },
    { id: 'cookies', title: 'Cookies & Tracking', icon: Globe },
    { id: 'children', title: 'Children\'s Privacy', icon: Shield },
    { id: 'changes', title: 'Policy Changes', icon: FileText },
    { id: 'contact', title: 'Contact Us', icon: Mail }
  ]

  const lastUpdated = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Privacy is Our Priority</h3>
                  <p className="text-blue-800">
                    At Panda Mart Kenya, we are committed to protecting your personal information and 
                    respecting your privacy. This Privacy Policy explains how we collect, use, disclose, 
                    and safeguard your information when you use our services.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">What This Policy Covers</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Personal information we collect</li>
                  <li>• How we use your information</li>
                  <li>• When we share your information</li>
                  <li>• How we protect your data</li>
                  <li>• Your privacy rights and choices</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Our Commitment</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Transparent data practices</li>
                  <li>• Strong security measures</li>
                  <li>• Respect for your choices</li>
                  <li>• Compliance with data protection laws</li>
                  <li>• Regular policy updates</li>
                </ul>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-2">Data Protection Compliance</h4>
                  <p className="text-green-800">
                    We comply with applicable data protection laws, including Kenya's Data Protection Act, 
                    and follow international best practices for data privacy and security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'collection':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Information We Collect</h3>
            
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Personal Information You Provide</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Account Information</h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Full name</li>
                      <li>• Email address</li>
                      <li>• Phone number</li>
                      <li>• Date of birth</li>
                      <li>• Profile picture (optional)</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Order Information</h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Delivery addresses</li>
                      <li>• Payment information</li>
                      <li>• Purchase history</li>
                      <li>• Product preferences</li>
                      <li>• Special instructions</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Information We Collect Automatically</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Device Information</h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Device type and model</li>
                      <li>• Operating system</li>
                      <li>• Browser type and version</li>
                      <li>• IP address</li>
                      <li>• Device identifiers</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Usage Information</h5>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Pages visited</li>
                      <li>• Time spent on site</li>
                      <li>• Click patterns</li>
                      <li>• Search queries</li>
                      <li>• Referral sources</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Location Information</h4>
                <p className="text-gray-700 mb-3">
                  We may collect location information to provide location-based services:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Approximate location from IP address</li>
                  <li>• Precise location (with your permission) for delivery services</li>
                  <li>• Store location preferences</li>
                  <li>• Delivery route optimization</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case 'usage':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">How We Use Your Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Service Provision</h4>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Process and fulfill orders</li>
                  <li>• Manage your account</li>
                  <li>• Provide customer support</li>
                  <li>• Send order confirmations and updates</li>
                  <li>• Facilitate store pickups and deliveries</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Service Improvement</h4>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Analyze usage patterns</li>
                  <li>• Improve website and app functionality</li>
                  <li>• Develop new features</li>
                  <li>• Optimize user experience</li>
                  <li>• Conduct research and analytics</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Communication</h4>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Send promotional offers (with consent)</li>
                  <li>• Notify about new products and services</li>
                  <li>• Share loyalty program updates</li>
                  <li>• Conduct customer surveys</li>
                  <li>• Send important service announcements</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900">Security & Compliance</h4>
                </div>
                <ul className="space-y-2 text-gray-700">
                  <li>• Prevent fraud and abuse</li>
                  <li>• Ensure account security</li>
                  <li>• Comply with legal obligations</li>
                  <li>• Resolve disputes</li>
                  <li>• Enforce our terms of service</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-2">Legal Basis for Processing</h4>
                  <p className="text-yellow-800">
                    We process your personal information based on legitimate interests, contractual necessity, 
                    legal compliance, and your consent where required. You can withdraw consent at any time 
                    where we rely on it as the legal basis for processing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'sharing':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">When We Share Your Information</h3>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-2">Our Commitment</h4>
                  <p className="text-green-800">
                    We do not sell, rent, or trade your personal information to third parties for their 
                    marketing purposes. We only share your information in specific circumstances outlined below.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Service Providers</h4>
                <p className="text-gray-700 mb-3">
                  We share information with trusted third-party service providers who help us operate our business:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-gray-700">
                    <li>• Payment processors (Stripe, M-Pesa)</li>
                    <li>• Delivery and logistics partners</li>
                    <li>• Cloud hosting providers</li>
                    <li>• Email service providers</li>
                  </ul>
                  <ul className="space-y-2 text-gray-700">
                    <li>• SMS service providers</li>
                    <li>• Analytics providers</li>
                    <li>• Customer support tools</li>
                    <li>• Security service providers</li>
                  </ul>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Legal Requirements</h4>
                <p className="text-gray-700 mb-3">
                  We may disclose your information when required by law or to protect our rights:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• In response to legal process or government requests</li>
                  <li>• To comply with applicable laws and regulations</li>
                  <li>• To protect our rights, property, or safety</li>
                  <li>• To protect the rights and safety of our users</li>
                  <li>• To prevent fraud or illegal activities</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Business Transfers</h4>
                <p className="text-gray-700">
                  In the event of a merger, acquisition, or sale of assets, your information may be 
                  transferred as part of the transaction. We will notify you of any such change in 
                  ownership or control of your personal information.
                </p>
              </div>
            </div>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">How We Protect Your Information</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Lock className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Security First</h4>
                  <p className="text-blue-800">
                    We implement comprehensive security measures to protect your personal information 
                    from unauthorized access, use, disclosure, alteration, or destruction.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Technical Safeguards</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• SSL/TLS encryption for data transmission</li>
                  <li>• AES-256 encryption for data at rest</li>
                  <li>• Secure database storage</li>
                  <li>• Regular security audits and testing</li>
                  <li>• Intrusion detection systems</li>
                  <li>• Firewall protection</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Administrative Safeguards</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Access controls and user authentication</li>
                  <li>• Employee training on data protection</li>
                  <li>• Background checks for staff</li>
                  <li>• Confidentiality agreements</li>
                  <li>• Incident response procedures</li>
                  <li>• Regular policy reviews</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Physical Safeguards</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Secure data centers</li>
                  <li>• Restricted physical access</li>
                  <li>• Environmental controls</li>
                  <li>• Backup and disaster recovery</li>
                  <li>• Secure disposal of hardware</li>
                  <li>• Video surveillance</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Your Security Role</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Use strong, unique passwords</li>
                  <li>• Enable two-factor authentication</li>
                  <li>• Keep your contact info updated</li>
                  <li>• Log out from shared devices</li>
                  <li>• Report suspicious activity</li>
                  <li>• Review account statements regularly</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-2">Security Limitations</h4>
                  <p className="text-yellow-800">
                    While we implement industry-standard security measures, no method of transmission 
                    over the internet or electronic storage is 100% secure. We cannot guarantee 
                    absolute security, but we continuously work to improve our security practices.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'rights':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Your Privacy Rights</h3>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Eye className="w-6 h-6 text-green-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-900 mb-2">You Have Control</h4>
                  <p className="text-green-800">
                    You have several rights regarding your personal information. We provide easy ways 
                    for you to exercise these rights and maintain control over your data.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Access & Portability</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>View all personal data we have about you</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Download your data in a portable format</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Transfer your data to another service</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Correction & Updates</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Update your account information</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Correct inaccurate information</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Complete incomplete information</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Deletion & Restriction</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Delete your account and data</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Request data deletion</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Restrict data processing</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Communication Preferences</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Opt out of marketing emails</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Control SMS notifications</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <span>Manage push notifications</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">How to Exercise Your Rights</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Settings className="w-6 h-6 text-blue-600" />
                  </div>
                  <h5 className="font-medium text-gray-900 mb-2">Account Settings</h5>
                  <p className="text-sm text-gray-600">Access and update your information through your account dashboard</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <h5 className="font-medium text-gray-900 mb-2">Email Request</h5>
                  <p className="text-sm text-gray-600">Send us an email at privacy@pandamart.co.ke with your request</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <h5 className="font-medium text-gray-900 mb-2">Phone Support</h5>
                  <p className="text-sm text-gray-600">Call our support team at +254 700 000 000 for assistance</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'cookies':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Cookies & Tracking Technologies</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Globe className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">What Are Cookies?</h4>
                  <p className="text-blue-800">
                    Cookies are small text files stored on your device when you visit our website. 
                    They help us provide you with a better, more personalized experience.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Essential Cookies</h4>
                <p className="text-gray-700 mb-3">Required for basic website functionality:</p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Authentication and security</li>
                  <li>• Shopping cart functionality</li>
                  <li>• Form submissions</li>
                  <li>• Session management</li>
                  <li>• Load balancing</li>
                </ul>
                <div className="mt-4 px-3 py-2 bg-green-100 text-green-800 rounded-lg text-sm">
                  These cookies cannot be disabled
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Performance Cookies</h4>
                <p className="text-gray-700 mb-3">Help us understand how you use our site:</p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Page views and traffic sources</li>
                  <li>• Time spent on pages</li>
                  <li>• Click patterns and navigation</li>
                  <li>• Error reporting</li>
                  <li>• Site performance metrics</li>
                </ul>
                <div className="mt-4 px-3 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm">
                  You can opt out of these cookies
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Functional Cookies</h4>
                <p className="text-gray-700 mb-3">Enhance your experience with personalized features:</p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Language and region preferences</li>
                  <li>• Personalized content</li>
                  <li>• Recently viewed products</li>
                  <li>• Wishlist items</li>
                  <li>• Chat widget settings</li>
                </ul>
                <div className="mt-4 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm">
                  Disabling may affect functionality
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4">Marketing Cookies</h4>
                <p className="text-gray-700 mb-3">Used for advertising and marketing purposes:</p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Targeted advertisements</li>
                  <li>• Social media integration</li>
                  <li>• Conversion tracking</li>
                  <li>• Retargeting campaigns</li>
                  <li>• Third-party analytics</li>
                </ul>
                <div className="mt-4 px-3 py-2 bg-purple-100 text-purple-800 rounded-lg text-sm">
                  Requires your consent
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Managing Your Cookie Preferences</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <div>
                    <p className="font-medium">Cookie Banner</p>
                    <p className="text-sm text-gray-600">Manage preferences through our cookie consent banner</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <div>
                    <p className="font-medium">Browser Settings</p>
                    <p className="text-sm text-gray-600">Configure cookie settings in your browser preferences</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <div>
                    <p className="font-medium">Account Settings</p>
                    <p className="text-sm text-gray-600">Update preferences in your account privacy settings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Contact Us About Privacy</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3">Questions About Your Privacy?</h4>
              <p className="text-blue-800">
                If you have any questions about this Privacy Policy, your personal information, 
                or how to exercise your privacy rights, please don't hesitate to contact us.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Privacy Officer</h4>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <a href="mailto:privacy@pandamart.co.ke" className="hover:text-blue-600">
                      privacy@pandamart.co.ke
                    </a>
                  </p>
                  <p className="text-sm text-gray-600">For all privacy-related inquiries</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Phone className="w-6 h-6 text-green-600" />
                  <h4 className="font-semibold text-gray-900">Phone Support</h4>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <a href="tel:+254700000000" className="hover:text-blue-600">
                      +254 700 000 000
                    </a>
                  </p>
                  <p className="text-sm text-gray-600">Mon-Sun: 8:00 AM - 8:00 PM EAT</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Data Protection Authority</h4>
              <p className="text-gray-700 mb-4">
                If you believe we have not addressed your privacy concerns adequately, you have the right 
                to lodge a complaint with the relevant data protection authority:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-medium text-gray-900 mb-2">Office of the Data Protection Commissioner</h5>
                <p className="text-sm text-gray-600 mb-2">Kenya</p>
                <p className="text-sm text-gray-600">
                  Website: <a href="https://odpc.go.ke" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">odpc.go.ke</a>
                </p>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </button>
              <button className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Last updated: {lastUpdated}
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                GDPR Compliant
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-8">
              <h3 className="font-semibold text-gray-900 mb-4">Sections</h3>
              <nav className="space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <section.icon className="w-4 h-4 mr-3" />
                    <span className="text-sm">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg border border-gray-200 p-8"
            >
              {renderSectionContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy