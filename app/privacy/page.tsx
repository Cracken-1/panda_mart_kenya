import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Shield, Eye, Database, Lock, Users, Globe, FileText, AlertTriangle, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - Panda Mart Kenya',
  description: 'Privacy Policy and Data Protection information for Panda Mart Kenya users.',
}

export default function PrivacyPolicy() {
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
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
                <p className="text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-1">Your Privacy Matters</h3>
                  <p className="text-green-800 text-sm">
                    We are committed to protecting your personal information and being transparent about how we use it.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8 space-y-8">
            
            {/* Section 1: Introduction */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. Introduction</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  Panda Mart Kenya Limited ("we," "our," or "us") respects your privacy and is committed to protecting 
                  your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your 
                  information when you use our website, mobile application, and services.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  This policy applies to all users of our services, including customers, visitors, and anyone who 
                  interacts with our platform.
                </p>
              </div>
            </section>

            {/* Section 2: Information We Collect */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <Database className="w-4 h-4 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. Information We Collect</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">2.1 Personal Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  We collect information you provide directly to us, including:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Name, email address, and phone number</li>
                  <li>Delivery addresses and billing information</li>
                  <li>Payment information (processed securely by our payment partners)</li>
                  <li>Account preferences and settings</li>
                  <li>Communication history with our support team</li>
                </ul>
                
                <h3 className="text-lg font-semibold text-gray-900">2.2 Automatically Collected Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  When you use our services, we automatically collect:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Device information (type, operating system, browser)</li>
                  <li>IP address and location data</li>
                  <li>Usage patterns and preferences</li>
                  <li>Cookies and similar tracking technologies</li>
                  <li>Transaction history and shopping behavior</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900">2.3 Third-Party Information</h3>
                <p className="text-gray-700 leading-relaxed">
                  We may receive information about you from third parties, such as:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Social media platforms (when you connect your accounts)</li>
                  <li>Payment processors and financial institutions</li>
                  <li>Delivery partners and logistics providers</li>
                  <li>Marketing partners and analytics services</li>
                </ul>
              </div>
            </section>

            {/* Section 3: How We Use Your Information */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Eye className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. How We Use Your Information</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We use your information for the following purposes:
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900">3.1 Service Provision</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Process and fulfill your orders</li>
                  <li>Manage your account and provide customer support</li>
                  <li>Send order confirmations and delivery updates</li>
                  <li>Process payments and prevent fraud</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900">3.2 Personalization</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Customize your shopping experience</li>
                  <li>Recommend products based on your preferences</li>
                  <li>Show relevant deals and promotions</li>
                  <li>Improve our services and user interface</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900">3.3 Communication</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Send promotional emails and notifications (with your consent)</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Send important service updates and policy changes</li>
                  <li>Conduct surveys and gather feedback</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900">3.4 Legal and Security</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Comply with legal obligations and regulations</li>
                  <li>Protect against fraud and unauthorized access</li>
                  <li>Enforce our terms of service and policies</li>
                  <li>Resolve disputes and investigate complaints</li>
                </ul>
              </div>
            </section>

            {/* Section 4: Information Sharing */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-orange-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. Information Sharing and Disclosure</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We do not sell your personal information. We may share your information in the following circumstances:
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900">4.1 Service Providers</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Payment processors for transaction processing</li>
                  <li>Delivery companies for order fulfillment</li>
                  <li>Cloud storage and hosting providers</li>
                  <li>Customer support and communication tools</li>
                  <li>Analytics and marketing service providers</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900">4.2 Legal Requirements</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>When required by law or legal process</li>
                  <li>To protect our rights and property</li>
                  <li>To prevent fraud or security threats</li>
                  <li>In connection with legal proceedings</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900">4.3 Business Transfers</h3>
                <p className="text-gray-700 leading-relaxed">
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred 
                  as part of the business transaction, subject to confidentiality agreements.
                </p>
              </div>
            </section>

            {/* Section 5: Data Security */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">5. Data Security</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  We implement appropriate technical and organizational measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication measures</li>
                  <li>Employee training on data protection</li>
                  <li>Incident response and breach notification procedures</li>
                </ul>
                <div className="bg-red-50 rounded-lg p-4 mt-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-1">Important Security Note</h4>
                      <p className="text-red-800 text-sm">
                        While we strive to protect your information, no method of transmission over the internet 
                        is 100% secure. Please use strong passwords and keep your account information confidential.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 6: Your Rights */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">6. Your Rights and Choices</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  You have the following rights regarding your personal information:
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900">6.1 Access and Portability</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Request access to your personal information</li>
                  <li>Obtain a copy of your data in a portable format</li>
                  <li>Review how your information is being used</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900">6.2 Correction and Updates</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Update your account information at any time</li>
                  <li>Correct inaccurate or incomplete data</li>
                  <li>Request verification of data accuracy</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900">6.3 Deletion and Restriction</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Request deletion of your personal information</li>
                  <li>Restrict processing of your data</li>
                  <li>Object to certain uses of your information</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900">6.4 Communication Preferences</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Opt out of marketing communications</li>
                  <li>Manage notification preferences</li>
                  <li>Control cookie settings</li>
                </ul>
              </div>
            </section>

            {/* Section 7: Cookies and Tracking */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">7. Cookies and Tracking Technologies</h2>
              </div>
              <div className="prose prose-gray max-w-none space-y-4">
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar technologies to enhance your experience:
                </p>
                
                <h3 className="text-lg font-semibold text-gray-900">7.1 Types of Cookies</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how you use our site</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                  <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900">7.2 Managing Cookies</h3>
                <p className="text-gray-700 leading-relaxed">
                  You can control cookies through your browser settings. However, disabling certain cookies 
                  may affect the functionality of our services.
                </p>
              </div>
            </section>

            {/* Section 8: Data Retention */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                  <Database className="w-4 h-4 text-teal-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">8. Data Retention</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  We retain your personal information for as long as necessary to:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mt-4">
                  <li>Provide our services and support your account</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Resolve disputes and enforce our agreements</li>
                  <li>Improve our services and prevent fraud</li>
                </ul>
                <p className="text-gray-700 leading-relaxed mt-4">
                  When we no longer need your information, we will securely delete or anonymize it in accordance 
                  with our data retention policies.
                </p>
              </div>
            </section>

            {/* Section 9: International Transfers */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                  <Globe className="w-4 h-4 text-pink-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">9. International Data Transfers</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  Your information may be transferred to and processed in countries other than Kenya. When we 
                  transfer your data internationally, we ensure appropriate safeguards are in place to protect 
                  your information in accordance with applicable data protection laws.
                </p>
              </div>
            </section>

            {/* Section 10: Children's Privacy */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-cyan-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">10. Children's Privacy</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  Our services are not intended for children under 18 years of age. We do not knowingly collect 
                  personal information from children under 18. If you are a parent or guardian and believe your 
                  child has provided us with personal information, please contact us immediately.
                </p>
              </div>
            </section>

            {/* Section 11: Changes to Privacy Policy */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <FileText className="w-4 h-4 text-gray-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">11. Changes to This Privacy Policy</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any material changes 
                  by posting the new policy on this page and updating the "Last updated" date. We encourage you 
                  to review this policy periodically.
                </p>
              </div>
            </section>

            {/* Section 12: Contact Information */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">12. Contact Us</h2>
              </div>
              <div className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <div className="space-y-2 text-gray-700">
                    <p><strong>Data Protection Officer:</strong> privacy@pandamart.co.ke</p>
                    <p><strong>General Inquiries:</strong> support@pandamart.co.ke</p>
                    <p><strong>Phone:</strong> +254 20 231 1166</p>
                    <p><strong>Address:</strong> Panda Mart Kenya Limited, Garden City Mall, Thika Road, Nairobi, Kenya</p>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                  <div className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-1">Data Protection Rights</h4>
                      <p className="text-blue-800 text-sm">
                        You can exercise your data protection rights by contacting our Data Protection Officer. 
                        We will respond to your request within 30 days.
                      </p>
                    </div>
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
              This Privacy Policy is effective as of {new Date().toLocaleDateString()} and governs our collection, 
              use, and disclosure of your personal information.
            </p>
            <div className="mt-2">
              <Link 
                href="/terms" 
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}