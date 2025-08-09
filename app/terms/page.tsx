import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield, Users, ShoppingCart, AlertTriangle, Scale, FileText, X, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service - Panda Mart Kenya',
  description: 'Terms of Service and User Agreement for Panda Mart Kenya online shopping platform.',
}

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                <Scale className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
                <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Important Notice</h3>
                  <p className="text-blue-800 text-sm">
                    By using Panda Mart Kenya services, you agree to these terms. Please read them carefully.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Section 1: Acceptance of Terms */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. Acceptance of Terms</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  Welcome to Panda Mart Kenya. These Terms of Service ("Terms") govern your use of our website, 
                  mobile application, and services (collectively, the "Service") operated by Panda Mart Kenya Limited.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree with 
                  any part of these terms, then you may not access the Service.
                </p>
              </div>
            </section>

            {/* Section 2: Account Registration */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. Account Registration</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">2.1 Account Creation</h3>
                <p className="text-gray-700 leading-relaxed">
                  To access certain features of our Service, you must register for an account. You agree to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Accept responsibility for all activities under your account</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-900">2.2 Panda ID</h3>
                <p className="text-gray-700 leading-relaxed">
                  Upon registration, you will receive a unique Panda ID. This ID is personal to you and cannot 
                  be transferred to another person. You are responsible for all activities associated with your Panda ID.
                </p>
              </div>
            </section>

            {/* Section 3: Use of Service */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-4 h-4 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. Use of Service</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">3.1 Permitted Use</h3>
                <p className="text-gray-700 leading-relaxed">
                  You may use our Service for lawful purposes only. You agree not to use the Service:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>In any way that violates applicable laws or regulations</li>
                  <li>To transmit harmful, offensive, or inappropriate content</li>
                  <li>To impersonate others or provide false information</li>
                  <li>To interfere with or disrupt the Service</li>
                  <li>For any commercial purpose without our written consent</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900">3.2 Shopping and Orders</h3>
                <p className="text-gray-700 leading-relaxed">
                  When you place an order through our Service:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>You make an offer to purchase products at the listed price</li>
                  <li>We reserve the right to accept or decline your order</li>
                  <li>Payment must be made through approved payment methods</li>
                  <li>All sales are subject to product availability</li>
                </ul>
              </div>
            </section>

            {/* Section 4: Privacy and Data */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. Privacy and Data Protection</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  Your privacy is important to us. Our collection and use of personal information is governed by our 
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700 font-medium mx-1">
                    Privacy Policy
                  </Link>
                  , which is incorporated into these Terms by reference.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  By using our Service, you consent to the collection, use, and sharing of your information as 
                  described in our Privacy Policy.
                </p>
              </div>
            </section>

            {/* Section 5: Payments and Refunds */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <span className="text-yellow-600 font-bold text-sm">KSh</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">5. Payments and Refunds</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">5.1 Payment Terms</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>All prices are in Kenyan Shillings (KSh) unless otherwise stated</li>
                  <li>Payment is due at the time of order placement</li>
                  <li>We accept major credit cards, mobile money, and bank transfers</li>
                  <li>Additional fees may apply for certain payment methods</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900">5.2 Refund Policy</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Refunds are available within 30 days of purchase for eligible items</li>
                  <li>Items must be in original condition and packaging</li>
                  <li>Digital products and perishable goods are non-refundable</li>
                  <li>Refund processing may take 5-10 business days</li>
                </ul>
              </div>
            </section>

            {/* Section 6: Intellectual Property */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-bold text-sm">©</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">6. Intellectual Property</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  The Service and its original content, features, and functionality are owned by Panda Mart Kenya 
                  and are protected by international copyright, trademark, patent, trade secret, and other 
                  intellectual property laws.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You may not reproduce, distribute, modify, or create derivative works of our content without 
                  explicit written permission.
                </p>
              </div>
            </section>

            {/* Section 7: Limitation of Liability */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">7. Limitation of Liability</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  To the maximum extent permitted by law, Panda Mart Kenya shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages, including but not limited to loss of 
                  profits, data, use, goodwill, or other intangible losses.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Our total liability to you for all claims arising from or relating to the Service shall not 
                  exceed the amount you paid us in the twelve months preceding the claim.
                </p>
              </div>
            </section>

            {/* Section 8: Termination */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <X className="w-4 h-4 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">8. Termination</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  We may terminate or suspend your account and access to the Service immediately, without prior 
                  notice, for any reason, including if you breach these Terms.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  You may terminate your account at any time by contacting our customer support team.
                </p>
              </div>
            </section>

            {/* Section 9: Changes to Terms */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">9. Changes to Terms</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these Terms at any time. We will notify you of any changes by 
                  posting the new Terms on this page and updating the "Last updated" date.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Your continued use of the Service after any changes constitutes acceptance of the new Terms.
                </p>
              </div>
            </section>

            {/* Section 10: Contact Information */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-teal-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">10. Contact Information</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Email:</strong> legal@pandamart.co.ke</p>
                    <p><strong>Phone:</strong> +254 20 231 1166</p>
                    <p><strong>Address:</strong> Panda Mart Kenya Limited, Garden City Mall, Thika Road, Nairobi, Kenya</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <p className="text-gray-600 text-sm">
              These terms are effective as of {new Date().toLocaleDateString()} and will remain in effect except with respect to any changes in their provisions in the future.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}