'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Phone, Eye, EyeOff, Gift, Star, CreditCard, MapPin } from 'lucide-react'

interface PandaIDSystemProps {
  redirectTo?: string
}

const PandaIDSystemInner = ({ redirectTo = '/account' }: PandaIDSystemProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPandaId, setShowPandaId] = useState(false)
  const [newPandaId, setNewPandaId] = useState('')

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      // Only run on client side
      if (typeof window === 'undefined') return

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
          setUserProfile(null)
        }
      } else {
        setIsLoggedIn(false)
        setUserProfile(null)
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

  // Generate unique Panda ID
  const generatePandaId = () => {
    const prefix = 'PANDA'
    const randomNum = Math.floor(100000 + Math.random() * 900000)
    return `${prefix}${randomNum}`
  }

  // Calculate tier based on points
  const calculateTier = (points) => {
    if (points >= 5000) return 'Platinum'
    if (points >= 2000) return 'Gold'
    if (points >= 500) return 'Silver'
    return 'Bronze'
  }

  const handleRegister = async () => {
    setIsLoading(true)

    try {
      // Validate form
      if (!formData.name || !formData.email || !formData.phone || !formData.password) {
        alert('Please fill in all fields')
        return
      }

      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match')
        return
      }

      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Generate new Panda ID
      const pandaId = generatePandaId()
      setNewPandaId(pandaId)

      // Create new user profile with zero progress
      const newUserProfile = {
        id: 'user_' + Date.now(),
        pandaId: pandaId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        tier: 'Bronze',
        points: 0,
        joinDate: new Date().toISOString(),
        totalOrders: 0,
        totalSpent: 0,
        favoriteStore: null,
        achievements: [],
        addresses: []
      }

      // Store user data
      localStorage.setItem('auth-token', 'token-' + Date.now())
      localStorage.setItem('user-data', JSON.stringify(newUserProfile))

      setUserProfile(newUserProfile)
      setIsLoggedIn(true)

      // Show Panda ID for 3 seconds before redirecting
      setShowPandaId(true)
      setTimeout(() => {
        setShowPandaId(false)
        setIsOpen(false)
        const redirectUrl = searchParams.get('redirect') || redirectTo
        router.push(redirectUrl)
      }, 3000)

    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    setIsLoading(true)

    try {
      // Validate form
      if (!formData.email || !formData.password) {
        alert('Please enter email and password')
        return
      }

      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 800))

      // For demo purposes, create a user profile if login is attempted
      // In a real app, this would authenticate against a backend
      const existingUser = localStorage.getItem('user-data')
      let userProfile

      if (existingUser) {
        userProfile = JSON.parse(existingUser)
      } else {
        // Create demo user for login
        userProfile = {
          id: 'user_' + Date.now(),
          pandaId: generatePandaId(),
          name: formData.email.split('@')[0], // Use email prefix as name
          email: formData.email,
          phone: '+254 700 000 000',
          tier: 'Bronze',
          points: 0,
          joinDate: new Date().toISOString(),
          totalOrders: 0,
          totalSpent: 0,
          favoriteStore: null,
          achievements: [],
          addresses: []
        }
        localStorage.setItem('user-data', JSON.stringify(userProfile))
      }

      setUserProfile(userProfile)
      setIsLoggedIn(true)
      setIsOpen(false)

      localStorage.setItem('auth-token', 'token-' + Date.now())

      // Redirect to dashboard
      const redirectUrl = searchParams.get('redirect') || redirectTo
      setTimeout(() => {
        router.push(redirectUrl)
      }, 100)

    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserProfile(null)
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-data')
    // Reset form data
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    })
  }

  const UserDashboard = () => {
    if (!userProfile) return null

    const isNewUser = userProfile.points === 0 && userProfile.totalOrders === 0

    return (
      <div className="p-6 max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="gradient-bg rounded-xl p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold mr-4">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{userProfile.name}</h2>
                <p className="text-white/80">Panda ID: {userProfile.pandaId}</p>
                <div className="flex items-center mt-1">
                  <Star className="w-4 h-4 text-yellow-300 mr-1" />
                  <span className="text-yellow-300 font-semibold">{userProfile.tier} Member</span>
                </div>
                {isNewUser && (
                  <div className="mt-2 bg-white/20 rounded-full px-3 py-1 text-xs">
                    🎉 Welcome! Start shopping to earn points
                  </div>
                )}
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
            <button className="mt-3 text-panda-red-500 text-sm font-semibold">
              {userProfile.points > 0 ? 'Redeem Points' : 'Earn Points'}
            </button>
          </div>

          <div className="card p-6 text-center">
            <CreditCard className="w-8 h-8 text-panda-red-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-panda-black-900 mb-1">{userProfile.totalOrders}</div>
            <div className="text-gray-600">Total Orders</div>
            <button className="mt-3 text-panda-red-500 text-sm font-semibold">
              {userProfile.totalOrders > 0 ? 'View Orders' : 'Start Shopping'}
            </button>
          </div>

          <div className="card p-6 text-center">
            <MapPin className="w-8 h-8 text-panda-red-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-panda-black-900 mb-1">
              KES {userProfile.totalSpent.toLocaleString()}
            </div>
            <div className="text-gray-600">Total Spent</div>
            <button className="mt-3 text-panda-red-500 text-sm font-semibold">Find Stores</button>
          </div>
        </div>

        {/* Recent Activity or Welcome Message */}
        <div className="card p-6">
          <h3 className="text-xl font-bold text-panda-black-900 mb-4">
            {isNewUser ? 'Get Started' : 'Recent Activity'}
          </h3>

          {isNewUser ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-panda-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-panda-red-500" />
              </div>
              <h4 className="text-lg font-semibold text-panda-black-900 mb-2">
                Welcome to Panda Mart, {userProfile.name}!
              </h4>
              <p className="text-gray-600 mb-6">
                Start shopping to earn Panda Points and unlock exclusive rewards
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="btn-primary">Browse Deals</button>
                <button className="btn-outline">Find Stores</button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <div className="font-semibold">Account Created</div>
                  <div className="text-sm text-gray-500">Welcome to Panda Mart!</div>
                </div>
                <div className="text-sm text-gray-500">Just now</div>
              </div>
              <div className="text-center py-4 text-gray-500">
                Your shopping activity will appear here
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const AuthModal = () => (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-start sm:items-center justify-center p-4 overflow-y-auto"
          style={{
            minHeight: '100vh',
            minHeight: '100dvh' // Dynamic viewport height for mobile
          }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden my-4 sm:my-auto"
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
                className={`flex-1 py-3 px-4 font-semibold ${activeTab === 'login'
                  ? 'text-panda-red-500 border-b-2 border-panda-red-500'
                  : 'text-gray-500'
                  }`}
              >
                Login
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-3 px-4 font-semibold ${activeTab === 'register'
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
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                        placeholder="Enter email or phone"
                        autoComplete="email"
                        inputMode="email"
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
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                        placeholder="Enter password"
                        autoComplete="current-password"
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
                    <a href="/forgot-password" className="text-sm text-panda-red-500 hover:underline">
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
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                        placeholder="Enter full name"
                        autoComplete="name"
                        inputMode="text"
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
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                        placeholder="Enter email"
                        autoComplete="email"
                        inputMode="email"
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
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                        placeholder="+254 700 000 000"
                        autoComplete="tel"
                        inputMode="tel"
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
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                        placeholder="Create password"
                        autoComplete="new-password"
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                        placeholder="Confirm password"
                        autoComplete="new-password"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleRegister}
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
                    By creating an account, you agree to our{' '}
                    <a href="/terms" target="_blank" className="text-panda-red-500 hover:underline">
                      Terms & Conditions
                    </a>
                    {' '}and{' '}
                    <a href="/privacy" target="_blank" className="text-panda-red-500 hover:underline">
                      Privacy Policy
                    </a>
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  // Panda ID Display Modal
  const PandaIdModal = () => (
    <AnimatePresence>
      {showPandaId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden text-center"
          >
            {/* Celebration Header */}
            <div className="gradient-bg p-8 text-white">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <span className="text-3xl">🎉</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl font-bold mb-2"
              >
                Welcome to Panda Mart!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-white/90"
              >
                Your account has been created successfully
              </motion.p>
            </div>

            {/* Panda ID Display */}
            <div className="p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
                className="bg-gray-50 rounded-lg p-6 mb-6"
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Panda ID</h3>
                <div className="text-3xl font-bold text-panda-red-500 tracking-wider">
                  {newPandaId}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Save this ID - you'll need it for exclusive deals!
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0 }}
                className="space-y-3 text-sm text-gray-600"
              >
                <div className="flex items-center justify-center">
                  <Gift className="w-4 h-4 text-panda-red-500 mr-2" />
                  <span>0 Panda Points to start</span>
                </div>
                <div className="flex items-center justify-center">
                  <Star className="w-4 h-4 text-panda-red-500 mr-2" />
                  <span>Bronze Member Status</span>
                </div>
                <div className="flex items-center justify-center">
                  <User className="w-4 h-4 text-panda-red-500 mr-2" />
                  <span>Ready to earn rewards!</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="mt-6"
              >
                <div className="text-xs text-gray-500">
                  Redirecting to your dashboard in 3 seconds...
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 3, ease: "linear" }}
                    className="bg-panda-red-500 h-1 rounded-full"
                  />
                </div>
              </motion.div>
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
        className={`flex items-center transition-colors relative ${isLoading
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
      <PandaIdModal />
    </>
  )
}

const PandaIDSystem = ({ redirectTo = '/account' }: PandaIDSystemProps) => {
  return (
    <Suspense fallback={
      <button className="btn-primary">
        <User className="w-5 h-5 mr-2" />
        Account
      </button>
    }>
      <PandaIDSystemInner redirectTo={redirectTo} />
    </Suspense>
  )
}

export default PandaIDSystem