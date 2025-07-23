'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, Calendar, Shield, CreditCard, Truck, 
  AlertCircle, CheckCircle, Phone, Mail, MapPin,
  ArrowLeft, Download, Printer
} from 'lucide-react'
import Link from 'next/link'

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState('overview')

  const sections = [
    { id: 'overview', title: 'Overview', icon: FileText },
    { id: 'acceptance', title: 'Acceptance of Terms', icon: CheckCircle },
    { id: 'services', title: 'Our Services', icon: Truck },
    { id: 'accounts', title: 'User Accounts', icon: Shield },
    { id: 'orders', title: 'Orders & Payments', icon: CreditCard },
    { id: 'delivery', title: 'Delivery & Pickup', icon: Truck },
    { id: 'returns', title: 'Returns & Refunds', icon: AlertCircle },
    { id: 'privacy', title: 'Privacy & Data', icon: Shield },
    { id: 'liability', title: 'Liability', icon: AlertCircle },
    { id: 'contact', title: 'Contact Us', icon: Phone }
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
                <FileText className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Welcome to Panda Mart Kenya</h3>
                  <p className="text-blue-800">
                    These Terms and Conditions govern your use of our website, mobile application, and services. 
                    By accessing or using Panda Mart Kenya, you agree to be bound by these terms.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">What We Offer</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Online shopping platform</li>
                  <li>• Store pickup services</li>
                  <li>• Loyalty program (Panda Points)</li>
                  <li>• Customer support</li>
                  <li>• Community features</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Your Responsibilities</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Provide accurate information</li>
                  <li>• Use services lawfully</li>
                  <li>• Protect your account</li>
                  <li>• Respect other users</li>
                  <li>• Follow payment terms</li>
                </ul>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-2">Important Notice</h4>
                  <p className="text-yellow-800">
                    These terms may be updated from time to time. We will notify you of significant changes 
                    via email or through our platform. Continued use of our services constitutes acceptance 
                    of the updated terms.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'acceptance':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Acceptance of Terms</h3>
            
            <div className="prose max-w-none">
              <p>
                By accessing, browsing, or using the Panda Mart Kenya website, mobile application, 
                or any of our services, you acknowledge that you have read, understood, and agree 
                to be bound by these Terms and Conditions.
              </p>

              <h4>Age Requirements</h4>
              <p>
                You must be at least 18 years old to use our services. If you are under 18, 
                you may only use our services with the involvement and consent of a parent or guardian.
              </p>

              <h4>Legal Capacity</h4>
              <p>
                By using our services, you represent and warrant that you have the legal capacity 
                to enter into these Terms and Conditions and to use our services in accordance with 
                all applicable laws and regulations.
              </p>

              <h4>Modifications</h4>
              <p>
                We reserve the right to modify these Terms and Conditions at any time. We will 
                provide notice of material changes by:
              </p>
              <ul>
                <li>Posting the updated terms on our website</li>
                <li>Sending email notifications to registered users</li>
                <li>Displaying prominent notices on our platform</li>
              </ul>
            </div>
          </div>
        )

      case 'services':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Our Services</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">E-commerce Platform</h4>
                <p className="text-gray-700 mb-4">
                  We provide an online marketplace where you can browse, select, and purchase 
                  products from our catalog.
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Product browsing and search</li>
                  <li>• Shopping cart functionality</li>
                  <li>• Secure checkout process</li>
                  <li>• Order tracking</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Store Services</h4>
                <p className="text-gray-700 mb-4">
                  Visit our physical stores for in-person shopping and order pickup services.
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Store pickup orders</li>
                  <li>• In-store shopping</li>
                  <li>• Customer service desk</li>
                  <li>• Product demonstrations</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Loyalty Program</h4>
                <p className="text-gray-700 mb-4">
                  Earn Panda Points with every purchase and enjoy exclusive member benefits.
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Points earning system</li>
                  <li>• Tier-based benefits</li>
                  <li>• Exclusive promotions</li>
                  <li>• Reward redemption</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Customer Support</h4>
                <p className="text-gray-700 mb-4">
                  Get help with orders, products, and account issues through multiple channels.
                </p>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Phone support</li>
                  <li>• Email assistance</li>
                  <li>• Live chat</li>
                  <li>• WhatsApp support</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Service Availability</h4>
              <p className="text-gray-700">
                Our services are available to customers in Kenya. We reserve the right to 
                modify, suspend, or discontinue any part of our services at any time with 
                or without notice. We are not liable for any modification, suspension, or 
                discontinuation of our services.
              </p>
            </div>
          </div>
        )

      case 'accounts':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">User Accounts</h3>
            
            <div className="prose max-w-none">
              <h4>Account Creation</h4>
              <p>
                To access certain features of our services, you must create an account. 
                When creating an account, you must provide accurate, complete, and current information.
              </p>

              <h4>Account Security</h4>
              <p>
                You are responsible for maintaining the confidentiality of your account 
                credentials and for all activities that occur under your account. You must:
              </p>
              <ul>
                <li>Choose a strong, unique password</li>
                <li>Keep your login credentials confidential</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Log out from shared or public computers</li>
                <li>Enable two-factor authentication when available</li>
              </ul>

              <h4>Account Information</h4>
              <p>
                You agree to keep your account information accurate and up-to-date. 
                This includes your contact information, delivery addresses, and payment methods.
              </p>

              <h4>Account Termination</h4>
              <p>
                We reserve the right to suspend or terminate your account if you violate 
                these Terms and Conditions or engage in fraudulent, abusive, or illegal activities.
              </p>
            </div>
          </div>
        )

      case 'orders':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Orders & Payments</h3>
            
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Order Process</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                    <div>
                      <p className="font-medium">Browse & Select</p>
                      <p className="text-sm text-gray-600">Choose products and add to cart</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                    <div>
                      <p className="font-medium">Checkout</p>
                      <p className="text-sm text-gray-600">Provide delivery/pickup details</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                    <div>
                      <p className="font-medium">Payment</p>
                      <p className="text-sm text-gray-600">Complete secure payment</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                    <div>
                      <p className="font-medium">Confirmation</p>
                      <p className="text-sm text-gray-600">Receive order confirmation</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Payment Methods</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• M-Pesa (Mobile Money)</li>
                    <li>• Visa & Mastercard</li>
                    <li>• Cash on Pickup</li>
                    <li>• Bank Transfer</li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Pricing & Taxes</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• All prices in Kenyan Shillings (KES)</li>
                    <li>• Prices include applicable VAT</li>
                    <li>• Delivery charges may apply</li>
                    <li>• Prices subject to change</li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h4 className="font-semibold text-yellow-900 mb-3">Order Modifications</h4>
                <p className="text-yellow-800">
                  Orders can be modified or cancelled within 30 minutes of placement. 
                  After this period, please contact customer service for assistance. 
                  Some restrictions may apply for certain products or during peak periods.
                </p>
              </div>
            </div>
          </div>
        )

      case 'delivery':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Delivery & Pickup</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Store Pickup</h4>
                <p className="text-gray-700 mb-4">
                  Collect your orders from any of our store locations at your convenience.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Free pickup service</li>
                  <li>• Available at all store locations</li>
                  <li>• Flexible pickup times</li>
                  <li>• Order ready notifications</li>
                  <li>• Valid ID required for pickup</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Home Delivery</h4>
                <p className="text-gray-700 mb-4">
                  Get your orders delivered directly to your doorstep within Nairobi and surrounding areas.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Same-day delivery available</li>
                  <li>• Delivery within 50km radius</li>
                  <li>• Delivery charges apply</li>
                  <li>• Real-time tracking</li>
                  <li>• Contactless delivery options</li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Delivery Terms</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Delivery Times</h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Standard: 2-3 business days</li>
                    <li>• Express: Next business day</li>
                    <li>• Same-day: Within 4-6 hours</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Delivery Areas</h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Nairobi County</li>
                    <li>• Kiambu County</li>
                    <li>• Machakos County</li>
                    <li>• Kajiado County (selected areas)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h4 className="font-semibold text-red-900 mb-3">Delivery Limitations</h4>
              <p className="text-red-800">
                We are not responsible for delays caused by weather conditions, traffic, 
                security situations, or other circumstances beyond our control. Delivery 
                times are estimates and not guaranteed.
              </p>
            </div>
          </div>
        )

      case 'returns':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Returns & Refunds</h3>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-3">Our Return Policy</h4>
              <p className="text-green-800">
                We want you to be completely satisfied with your purchase. If you're not happy 
                with your order, we offer a flexible return policy to ensure your satisfaction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Return Conditions</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Items must be unused and in original condition</li>
                  <li>• Original packaging and tags required</li>
                  <li>• Return within 30 days of purchase</li>
                  <li>• Receipt or proof of purchase required</li>
                  <li>• Some items may have specific return policies</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Non-Returnable Items</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Perishable goods and food items</li>
                  <li>• Personal care and hygiene products</li>
                  <li>• Customized or personalized items</li>
                  <li>• Digital products and gift cards</li>
                  <li>• Items damaged by misuse</li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Return Process</h4>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                  <div>
                    <p className="font-medium">Contact Us</p>
                    <p className="text-sm text-gray-600">Call +254 700 000 000 or email support@pandamart.co.ke</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                  <div>
                    <p className="font-medium">Return Authorization</p>
                    <p className="text-sm text-gray-600">Receive return authorization and instructions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                  <div>
                    <p className="font-medium">Return Item</p>
                    <p className="text-sm text-gray-600">Bring item to store or arrange pickup</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                  <div>
                    <p className="font-medium">Refund Processing</p>
                    <p className="text-sm text-gray-600">Refund processed within 5-7 business days</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3">Refund Methods</h4>
              <p className="text-blue-800 mb-3">
                Refunds will be processed using the same payment method used for the original purchase:
              </p>
              <ul className="space-y-1 text-blue-800">
                <li>• M-Pesa: Refunded to original M-Pesa number</li>
                <li>• Card payments: Refunded to original card</li>
                <li>• Cash purchases: Cash refund at store</li>
              </ul>
            </div>
          </div>
        )

      case 'privacy':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Privacy & Data Protection</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">Your Privacy Matters</h4>
                  <p className="text-blue-800">
                    We are committed to protecting your personal information and respecting your privacy. 
                    Our Privacy Policy details how we collect, use, and protect your data.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Data We Collect</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Account information (name, email, phone)</li>
                  <li>• Order and purchase history</li>
                  <li>• Delivery addresses</li>
                  <li>• Payment information (securely processed)</li>
                  <li>• Website usage data</li>
                  <li>• Customer service interactions</li>
                </ul>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">How We Use Your Data</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Process orders and payments</li>
                  <li>• Provide customer support</li>
                  <li>• Send order updates and notifications</li>
                  <li>• Improve our services</li>
                  <li>• Personalize your experience</li>
                  <li>• Comply with legal requirements</li>
                </ul>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-4">Your Rights</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Access & Control</h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• View your personal data</li>
                    <li>• Update your information</li>
                    <li>• Delete your account</li>
                    <li>• Export your data</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 mb-2">Communication Preferences</h5>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Opt out of marketing emails</li>
                    <li>• Control notification settings</li>
                    <li>• Manage SMS preferences</li>
                    <li>• Update contact preferences</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h4 className="font-semibold text-green-900 mb-3">Data Security</h4>
              <p className="text-green-800">
                We implement industry-standard security measures to protect your personal information, 
                including encryption, secure servers, and regular security audits. However, no method 
                of transmission over the internet is 100% secure.
              </p>
            </div>

            <div className="text-center">
              <Link 
                href="/privacy" 
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Shield className="w-4 h-4 mr-2" />
                Read Full Privacy Policy
              </Link>
            </div>
          </div>
        )

      case 'liability':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Limitation of Liability</h3>
            
            <div className="prose max-w-none">
              <h4>Service Availability</h4>
              <p>
                While we strive to provide uninterrupted service, we do not guarantee that 
                our website, mobile app, or services will be available at all times. We may 
                experience downtime for maintenance, updates, or due to circumstances beyond our control.
              </p>

              <h4>Product Information</h4>
              <p>
                We make every effort to ensure that product information, prices, and availability 
                are accurate. However, errors may occur, and we reserve the right to correct 
                any inaccuracies and update information without prior notice.
              </p>

              <h4>Limitation of Damages</h4>
              <p>
                To the maximum extent permitted by law, Panda Mart Kenya shall not be liable for:
              </p>
              <ul>
                <li>Indirect, incidental, or consequential damages</li>
                <li>Loss of profits, data, or business opportunities</li>
                <li>Damages resulting from service interruptions</li>
                <li>Third-party actions or content</li>
              </ul>

              <h4>Maximum Liability</h4>
              <p>
                Our total liability for any claim related to our services shall not exceed 
                the amount you paid for the specific product or service that gave rise to the claim.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-yellow-900 mb-2">Important Notice</h4>
                  <p className="text-yellow-800">
                    Some jurisdictions do not allow the exclusion or limitation of certain 
                    damages. In such jurisdictions, our liability will be limited to the 
                    maximum extent permitted by law.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'contact':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-semibold text-blue-900 mb-3">Get in Touch</h4>
              <p className="text-blue-800">
                If you have any questions about these Terms and Conditions or need assistance 
                with our services, please don't hesitate to contact us.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Mail className="w-6 h-6 text-blue-600" />
                  <h4 className="font-semibold text-gray-900">Email Support</h4>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <a href="mailto:support@pandamart.co.ke" className="hover:text-blue-600">
                      support@pandamart.co.ke
                    </a>
                  </p>
                  <p className="text-sm text-gray-600">Response within 24 hours</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <MapPin className="w-6 h-6 text-red-600" />
                  <h4 className="font-semibold text-gray-900">Head Office</h4>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">Nairobi, Kenya</p>
                  <p className="text-sm text-gray-600">
                    <a href="mailto:info@pandamart.co.ke" className="hover:text-blue-600">
                      info@pandamart.co.ke
                    </a>
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-6 h-6 text-purple-600" />
                  <h4 className="font-semibold text-gray-900">Legal Inquiries</h4>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <a href="mailto:legal@pandamart.co.ke" className="hover:text-blue-600">
                      legal@pandamart.co.ke
                    </a>
                  </p>
                  <p className="text-sm text-gray-600">For legal and compliance matters</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h4 className="font-semibold text-gray-900 mb-3">Business Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Company Name:</p>
                  <p className="font-medium">Panda Mart Kenya Limited</p>
                </div>
                <div>
                  <p className="text-gray-600">Registration Number:</p>
                  <p className="font-medium">C.123456/2023</p>
                </div>
                <div>
                  <p className="text-gray-600">Tax PIN:</p>
                  <p className="font-medium">P051234567X</p>
                </div>
                <div>
                  <p className="text-gray-600">Last Updated:</p>
                  <p className="font-medium">{lastUpdated}</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Last updated: {lastUpdated}
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-1" />
                Version 1.0
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

export default TermsAndConditions