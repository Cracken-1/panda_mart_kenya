'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Cookie, Settings, X, Check, Info, Shield,
  Eye, BarChart3, Target, ExternalLink
} from 'lucide-react'
import Link from 'next/link'

interface CookiePreferences {
  essential: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
}

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true, // Always true, cannot be disabled
    functional: true,
    analytics: true,
    marketing: false
  })

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent')
    const cookiePreferences = localStorage.getItem('cookiePreferences')
    
    if (!cookieConsent) {
      // Show banner after a short delay
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 2000)
      
      return () => clearTimeout(timer)
    } else if (cookiePreferences) {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(cookiePreferences)
        setPreferences(savedPreferences)
        initializeServices(savedPreferences)
      } catch (error) {
        console.error('Error loading cookie preferences:', error)
      }
    }
  }, [])

  const initializeServices = (prefs: CookiePreferences) => {
    // Initialize Google Analytics
    if (prefs.analytics && process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID) {
      // Load Google Analytics
      const script = document.createElement('script')
      script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID}`
      script.async = true
      document.head.appendChild(script)

      script.onload = () => {
        window.gtag = window.gtag || function() {
          (window.gtag.q = window.gtag.q || []).push(arguments)
        }
        window.gtag('js', new Date())
        window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID!)
      }
    }

    // Initialize Facebook Pixel
    if (prefs.marketing && process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID) {
      // Load Facebook Pixel
      const script = document.createElement('script')
      script.innerHTML = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID}');
        fbq('track', 'PageView');
      `
      document.head.appendChild(script)
    }

    // Initialize Hotjar
    if (prefs.analytics && process.env.NEXT_PUBLIC_HOTJAR_ID) {
      const script = document.createElement('script')
      script.innerHTML = `
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${process.env.NEXT_PUBLIC_HOTJAR_ID},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `
      document.head.appendChild(script)
    }
  }

  const handleAcceptAll = () => {
    const allAccepted = {
      essential: true,
      functional: true,
      analytics: true,
      marketing: true
    }
    
    setPreferences(allAccepted)
    savePreferences(allAccepted)
    initializeServices(allAccepted)
    setShowBanner(false)
    setShowSettings(false)
  }

  const handleAcceptSelected = () => {
    savePreferences(preferences)
    initializeServices(preferences)
    setShowBanner(false)
    setShowSettings(false)
  }

  const handleRejectAll = () => {
    const essentialOnly = {
      essential: true,
      functional: false,
      analytics: false,
      marketing: false
    }
    
    setPreferences(essentialOnly)
    savePreferences(essentialOnly)
    setShowBanner(false)
    setShowSettings(false)
  }

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', 'true')
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs))
    localStorage.setItem('cookieConsentDate', new Date().toISOString())
  }

  const handlePreferenceChange = (category: keyof CookiePreferences, value: boolean) => {
    if (category === 'essential') return // Cannot disable essential cookies
    
    setPreferences(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const cookieCategories = [
    {
      id: 'essential' as keyof CookiePreferences,
      name: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      icon: Shield,
      color: 'text-green-600 bg-green-100',
      required: true,
      examples: [
        'Authentication and security',
        'Shopping cart functionality',
        'Form submissions',
        'Session management'
      ]
    },
    {
      id: 'functional' as keyof CookiePreferences,
      name: 'Functional Cookies',
      description: 'These cookies enable enhanced functionality and personalization.',
      icon: Settings,
      color: 'text-blue-600 bg-blue-100',
      required: false,
      examples: [
        'Language preferences',
        'Recently viewed products',
        'Personalized content',
        'Chat widget settings'
      ]
    },
    {
      id: 'analytics' as keyof CookiePreferences,
      name: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website.',
      icon: BarChart3,
      color: 'text-purple-600 bg-purple-100',
      required: false,
      examples: [
        'Page views and traffic',
        'User behavior analysis',
        'Performance monitoring',
        'Error reporting'
      ]
    },
    {
      id: 'marketing' as keyof CookiePreferences,
      name: 'Marketing Cookies',
      description: 'These cookies are used to deliver relevant advertisements and track campaign performance.',
      icon: Target,
      color: 'text-orange-600 bg-orange-100',
      required: false,
      examples: [
        'Targeted advertisements',
        'Social media integration',
        'Conversion tracking',
        'Retargeting campaigns'
      ]
    }
  ]

  return (
    <>
      {/* Cookie Banner */}
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Cookie className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">We use cookies</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      We use cookies to enhance your browsing experience, serve personalized content, 
                      and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Link 
                        href="/privacy#cookies" 
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
                      >
                        Learn more
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                      <Link 
                        href="/privacy" 
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        Privacy Policy
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowSettings(true)}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Customize
                  </button>
                  <button
                    onClick={handleRejectAll}
                    className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Accept All
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cookie Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" />
              
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Cookie className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Cookie Preferences</h3>
                      <p className="text-sm text-gray-600">Manage your cookie settings and privacy preferences</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {cookieCategories.map((category) => (
                    <div key={category.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          <div className={`p-2 rounded-lg ${category.color}`}>
                            <category.icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{category.name}</h4>
                              {category.required && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                  Required
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-gray-700">Examples:</p>
                              <ul className="text-xs text-gray-600 space-y-1">
                                {category.examples.map((example, index) => (
                                  <li key={index}>• {example}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="ml-4">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences[category.id]}
                              onChange={(e) => handlePreferenceChange(category.id, e.target.checked)}
                              disabled={category.required}
                              className="sr-only peer"
                            />
                            <div className={`w-11 h-6 rounded-full peer transition-colors ${
                              category.required 
                                ? 'bg-green-600 cursor-not-allowed' 
                                : preferences[category.id]
                                  ? 'bg-blue-600'
                                  : 'bg-gray-200'
                            } peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Info className="w-4 h-4" />
                    <span>Changes will take effect immediately</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleRejectAll}
                      className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      Reject All
                    </button>
                    <button
                      onClick={handleAcceptAll}
                      className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Accept All
                    </button>
                    <button
                      onClick={handleAcceptSelected}
                      className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Save Preferences
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// Global type declarations for analytics
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    fbq: (...args: any[]) => void
    hj: (...args: any[]) => void
  }
}

export default CookieConsent