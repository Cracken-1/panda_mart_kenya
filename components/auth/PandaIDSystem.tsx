'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Phone, Eye, EyeOff, Gift, Star, CreditCard, MapPin } from 'lucide-react'

interface PandaIDSystemProps {
  redirectTo?: string
}

const PandaIDSystem = ({ redirectTo = '/account' }: PandaIDSystemProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: 'Sarah Wanjiku',
    pandaId: 'PANDA123456',
    points: 2450,
    tier: 'Gold',
    email: 'sarah@example.com',
    phone: '+254 700 000 000'
  })

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const authToken = localStorage.getItem('auth-token')
      const userData = localStorage.getItem('user-data')
      
      if (authToken && userData) {
        try {
          const parsedUserData = JSON.parse(userData)
          setUserProfile(parsedUserData)
          setIsLoggedIn(true)
        } catch (error) {
          console.error('Error parsing user data:', error)
          // Clear invalid data
          localStorage.removeItem('auth-token')
          localStorage.removeItem('user-data')
          setIsLoggedIn(false)
        }
      } else {
        setIsLoggedIn(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Check for auth parameter in URL to auto-open modal
  useEffect(() => {
    const authRequired = searchParams.get('auth') === 'required'
    if (authRequired && !isLoggedIn) {
      setIsOpen(true)
    }
  }, [searchParams, isLoggedIn])

  const handleLogin = async () => {
    setIsLoading(true)
    
    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setIsLoggedIn(true)
      setIsOpen(false)
      
      // Store auth token in localStorage for persistence
      localStorage.setItem('auth-token', 'demo-token-' + Date.now())
      localStorage.setItem('user-data', JSON.stringify({
        id: 'user_123',
        pandaId: 'PANDA123456',
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        tier: userProfile.tier,
        points: userProfile.points
      }))
      
      // Get redirect URL from search params or use default
      const redirectUrl = searchParams.get('redirect') || redirectTo
      
      // Use Next.js router for navigation with a small delay to ensure state is updated
      setTimeout(() => {
        router.push(redirectUrl)
      }, 100)
      
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const UserDashboard = () => (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="gradient-bg rounded-xl p-6 text-white mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mr-4">
              {userProfile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              <p className="text-white/80">Panda ID: {userProfile.pandaId}</p>
              <div className="flex items-center mt-1">
                <Star className="w-4 h-4 text-yellow-300 mr-1" />
                <span className="text-yellow-300 font-semibold">{userProfile.tier} Member</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card p-6 text-center">
          <Gift className="w-8 h-8 text-panda-red-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-panda-black-900 mb-1">{userProfile.points}</div>
          <div className="text-gray-600">Panda Points</div>
          <button className="mt-3 text-panda-red-500 text-sm font-semibold">Redeem Points</button>
        </div>
        
        <div className="card p-6 text-center">
          <CreditCard className="w-8 h-8 text-panda-red-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-panda-black-900 mb-1">5</div>
          <div className="text-gray-600">Active Coupons</div>
          <button className="mt-3 text-panda-red-500 text-sm font-semibold">View Coupons</button>
        </div>
        
        <div className="card p-6 text-center">
          <MapPin className="w-8 h-8 text-panda-red-500 mx-auto mb-3" />
          <div className="text-2xl font-bold text-panda-black-900 mb-1">12</div>
          <div className="text-gray-600">Store Visits</div>
          <button className="mt-3 text-panda-red-500 text-sm font-semibold">Find Stores</button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-panda-black-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <div className="font-semibold">Earned 50 points</div>
              <div className="text-sm text-gray-500">Purchase at Westgate store</div>
            </div>
            <div className="text-sm text-gray-500">2 days ago</div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <div className="font-semibold">Redeemed coupon</div>
              <div className="text-sm text-gray-500">10% off Electronics</div>
            </div>
            <div className="text-sm text-gray-500">1 week ago</div>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <div className="font-semibold">Joined Panda Challenge</div>
              <div className="text-sm text-gray-500">Home Makeover Contest</div>
            </div>
            <div className="text-sm text-gray-500">2 weeks ago</div>
          </div>
        </div>
      </div>
    </div>
  )

  const AuthModal = () => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="gradient-bg p-6 text-white text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold">P</span>
              </div>
              <h2 className="text-2xl font-bold">Panda ID</h2>
              <p className="text-white/80">Your gateway to exclusive deals</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 px-4 font-semibold ${
                  activeTab === 'login'
                    ? 'text-panda-red-500 border-b-2 border-panda-red-500'
                    : 'text-gray-500'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-3 px-4 font-semibold ${
                  activeTab === 'register'
                    ? 'text-panda-red-500 border-b-2 border-panda-red-500'
                    : 'text-gray-500'
                }`}
              >
                Register
              </button>
            </div>

            {/* Form Content */}
            <div className="p-6">
              {activeTab === 'login' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email or Phone
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                        placeholder="Enter email or phone"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                        placeholder="Enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className={`w-full btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Logging in...
                      </div>
                    ) : (
                      'Login to Panda ID'
                    )}
                  </button>
                  
                  <div className="text-center">
                    <a href="#" className="text-sm text-panda-red-500 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                        placeholder="Enter full name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                        placeholder="+254 700 000 000"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                        placeholder="Create password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className={`w-full btn-primary ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating account...
                      </div>
                    ) : (
                      'Create Panda ID'
                    )}
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    By creating an account, you agree to our Terms & Conditions
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <button
        onClick={async () => {
          // If already logged in, go to account page
          if (isLoggedIn) {
            setIsLoading(true)
            try {
              // Use Next.js router with proper error handling
              await router.push(redirectTo)
            } catch (error) {
              console.error('Navigation error:', error)
              // Fallback to window.location if router fails
              window.location.href = redirectTo
            } finally {
              // Reset loading state after a short delay
              setTimeout(() => setIsLoading(false), 1000)
            }
          } else {
            setIsOpen(true)
          }
        }}
        disabled={isLoading}
        className={`flex items-center transition-colors relative ${
          isLoading 
            ? 'text-gray-400 cursor-not-allowed' 
            : 'text-gray-700 hover:text-red-500'
        }`}
        title={isLoggedIn ? 'Go to Account' : 'Login to Panda ID'}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
        ) : (
          <User className="w-6 h-6" />
        )}
        {isLoggedIn && !isLoading && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </button>
      <AuthModal />
    </>
  )
}

export default PandaIDSystem