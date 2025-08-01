'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Settings, Bell, ShoppingBag, CreditCard, MapPin, Heart,
  Gift, Star, HelpCircle, LogOut, Edit, Shield, Camera, QrCode,
  X, Phone, Mail, Home, Truck, Percent, Award, MessageCircle,
  FileText, Info, ChevronRight, Scan, Wallet, Package, Clock,
  CheckCircle, AlertCircle, Plus, Trash2, Eye, EyeOff
} from 'lucide-react'
import { useRouter } from 'next/navigation'

// Import section components
import ProfileSection from '@/components/account/sections/ProfileSection'
import SecuritySection from '@/components/account/sections/SecuritySection'
import NotificationsSection from '@/components/account/sections/NotificationsSection'
import OrdersSection from '@/components/account/sections/OrdersSection'
import PaymentMethodsSection from '@/components/account/sections/PaymentSection'
import AddressesSection from '@/components/account/sections/AddressesSection'
import WishlistSection from '@/components/account/sections/WishlistSection'
import PointsSection from '@/components/account/sections/PointsSection'
import CouponsSection from '@/components/account/sections/CouponsSection'
import AchievementsSection from '@/components/account/sections/LoyaltySection'
import SupportSection from '@/components/account/sections/HelpSupportSection'
import FeedbackSection from '@/components/account/sections/HelpSupportSection'
import AboutSection from '@/components/account/sections/HelpSupportSection'

interface UserProfile {
  id: string
  pandaId: string
  name: string
  email: string
  phone: string
  tier: string
  points: number
  joinDate: string
  totalOrders: number
  totalSpent: number
  favoriteStore: string | null
  achievements: string[]
  addresses: Address[]
  paymentMethods: PaymentMethod[]
  orders: Order[]
  wishlist: WishlistItem[]
  notifications: Notification[]
}

interface Address {
  id: string
  type: 'home' | 'work' | 'other'
  name: string
  address: string
  city: string
  phone: string
  isDefault: boolean
}

interface PaymentMethod {
  id: string
  type: 'card' | 'mpesa' | 'bank'
  name: string
  details: string
  isDefault: boolean
}

interface Order {
  id: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: number
  store: string
}

interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  inStock: boolean
}

interface Notification {
  id: string
  type: 'order' | 'promotion' | 'system'
  title: string
  message: string
  date: string
  read: boolean
}

const AccountPage = () => {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [isLoading, setIsLoading] = useState(true)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [showAddPayment, setShowAddPayment] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const authToken = localStorage.getItem('auth-token')
      const userData = localStorage.getItem('user-data')

      if (!authToken || !userData) {
        router.push('/')
        return
      }

      try {
        const parsedUserData = JSON.parse(userData)
        // Use user data as-is without adding mock data for new users
        const enhancedProfile: UserProfile = {
          ...parsedUserData,
          // Only add empty arrays if they don't exist, ensuring new users start with zero progress
          addresses: parsedUserData.addresses || [],
          paymentMethods: parsedUserData.paymentMethods || [],
          orders: parsedUserData.orders || [],
          wishlist: parsedUserData.wishlist || [],
          notifications: parsedUserData.notifications || [],
          rewards: parsedUserData.rewards || []
        }
        setUserProfile(enhancedProfile)
      } catch (error) {
        console.error('Error parsing user data:', error)
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user-data')
    router.push('/')
  }

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: User,
      section: 'Account'
    },
    {
      id: 'profile',
      label: 'Edit Profile',
      icon: Edit,
      section: 'Account'
    },
    {
      id: 'security',
      label: 'Security & Privacy',
      icon: Shield,
      section: 'Account'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      section: 'Account'
    },
    {
      id: 'orders',
      label: 'My Orders',
      icon: ShoppingBag,
      section: 'Shopping'
    },
    {
      id: 'payments',
      label: 'Payment Methods',
      icon: CreditCard,
      section: 'Shopping'
    },
    {
      id: 'addresses',
      label: 'Delivery Addresses',
      icon: MapPin,
      section: 'Shopping'
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      section: 'Shopping'
    },
    {
      id: 'points',
      label: 'Panda Points',
      icon: Gift,
      section: 'Benefits & Rewards'
    },
    {
      id: 'coupons',
      label: 'Coupons & Offers',
      icon: Percent,
      section: 'Benefits & Rewards'
    },
    {
      id: 'achievements',
      label: 'Achievements',
      icon: Award,
      section: 'Benefits & Rewards'
    },
    {
      id: 'support',
      label: 'Help & Support',
      icon: HelpCircle,
      section: 'Support & More'
    },
    {
      id: 'feedback',
      label: 'Feedback',
      icon: MessageCircle,
      section: 'Support & More'
    },
    {
      id: 'about',
      label: 'About Panda Mart',
      icon: Info,
      section: 'Support & More'
    }
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-panda-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Access Denied</h2>
          <p className="text-gray-500 mb-4">Please log in to access your account</p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  const isNewUser = userProfile.points === 0 && userProfile.totalOrders === 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-panda-red-500 to-panda-red-600 rounded-full flex items-center justify-center text-lg font-bold text-white">
                {userProfile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold text-panda-black-900">{userProfile.name}</h3>
                <div className="flex items-center">
                  <Star className="w-3 h-3 text-yellow-400 mr-1" />
                  <span className="text-xs font-medium text-yellow-600">{userProfile.tier}</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-panda-red-500 to-panda-red-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3">
                  {userProfile.name.charAt(0).toUpperCase()}
                </div>
                <h3 className="font-semibold text-panda-black-900">{userProfile.name}</h3>
                <p className="text-sm text-gray-500">ID: {userProfile.pandaId}</p>
                <div className="flex items-center justify-center mt-2">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium text-yellow-600">{userProfile.tier} Member</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-lg font-bold text-panda-red-500">{userProfile.points}</div>
                  <div className="text-xs text-gray-500">Points</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-panda-black-900">{userProfile.totalOrders}</div>
                  <div className="text-xs text-gray-500">Orders</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 mb-6">
                <button
                  onClick={() => setShowQRScanner(true)}
                  className="w-full flex items-center justify-center space-x-2 bg-panda-red-500 text-white py-2 px-4 rounded-lg hover:bg-panda-red-600 transition-colors"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Scan QR Code</span>
                </button>
                <button
                  onClick={() => setActiveSection('points')}
                  className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Gift className="w-4 h-4" />
                  <span>Redeem Points</span>
                </button>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 text-red-500 hover:text-red-600 py-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>

            {/* Desktop Navigation Menu */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {['Account', 'Shopping', 'Benefits & Rewards', 'Support & More'].map((section) => (
                <div key={section}>
                  <div className="bg-gray-50 px-4 py-2 text-sm font-semibold text-gray-700">
                    {section}
                  </div>
                  {menuItems
                    .filter(item => item.section === section)
                    .map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${activeSection === item.id ? 'bg-panda-red-50 text-panda-red-600 border-r-2 border-panda-red-500' : 'text-gray-700'
                          }`}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                        <ChevronRight className="w-4 h-4 ml-auto" />
                      </button>
                    ))}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Navigation Tabs */}
          <div className="lg:hidden mb-4">
            <div className="bg-white rounded-xl shadow-sm p-2">
              <div className="grid grid-cols-4 gap-1">
                {menuItems.slice(0, 8).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                      activeSection === item.id 
                        ? 'bg-panda-red-50 text-panda-red-600' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium text-center leading-tight">
                      {item.label.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* More Options for Mobile */}
            {menuItems.length > 8 && (
              <div className="bg-white rounded-xl shadow-sm p-2 mt-2">
                <div className="grid grid-cols-4 gap-1">
                  {menuItems.slice(8).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                        activeSection === item.id 
                          ? 'bg-panda-red-50 text-panda-red-600' 
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="w-5 h-5 mb-1" />
                      <span className="text-xs font-medium text-center leading-tight">
                        {item.label.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm p-4 lg:p-6">
              {/* Dashboard Content will be rendered here based on activeSection */}
              {activeSection === 'dashboard' && <DashboardSection userProfile={userProfile} isNewUser={isNewUser} />}
              {activeSection === 'profile' && <ProfileSection userProfile={userProfile} setUserProfile={setUserProfile} />}
              {activeSection === 'security' && <SecuritySection />}
              {activeSection === 'notifications' && <NotificationsSection notifications={userProfile.notifications} />}
              {activeSection === 'orders' && <OrdersSection orders={userProfile.orders} />}
              {activeSection === 'payments' && <PaymentMethodsSection paymentMethods={userProfile.paymentMethods} />}
              {activeSection === 'addresses' && <AddressesSection addresses={userProfile.addresses} />}
              {activeSection === 'wishlist' && <WishlistSection wishlist={userProfile.wishlist} />}
              {activeSection === 'points' && <PointsSection userProfile={userProfile} />}
              {activeSection === 'coupons' && <CouponsSection />}
              {activeSection === 'achievements' && <AchievementsSection achievements={userProfile.achievements} />}
              {activeSection === 'support' && <SupportSection />}
              {activeSection === 'feedback' && <FeedbackSection />}
              {activeSection === 'about' && <AboutSection />}
            </div>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal isOpen={showQRScanner} onClose={() => setShowQRScanner(false)} />
    </div>
  )
}

// Dashboard Section Component
const DashboardSection = ({ userProfile, isNewUser }: { userProfile: UserProfile, isNewUser: boolean }) => (
  <div>
    <h2 className="text-xl lg:text-2xl font-bold text-panda-black-900 mb-4 lg:mb-6">Dashboard</h2>

    {/* Welcome Message */}
    <div className="gradient-bg rounded-xl p-4 lg:p-6 text-white mb-4 lg:mb-6">
      <h3 className="text-lg lg:text-xl font-bold mb-2">
        {isNewUser ? `Welcome to Panda Mart, ${userProfile.name}!` : `Welcome back, ${userProfile.name}!`}
      </h3>
      <p className="text-white/90 text-sm lg:text-base">
        {isNewUser
          ? 'Start shopping to earn Panda Points and unlock exclusive rewards'
          : `You have ${userProfile.points} Panda Points ready to use`
        }
      </p>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-4 lg:mb-6">
      <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 text-center shadow-sm">
        <Gift className="w-6 h-6 lg:w-8 lg:h-8 text-panda-red-500 mx-auto mb-2 lg:mb-3" />
        <div className="text-xl lg:text-2xl font-bold text-panda-black-900 mb-1">{userProfile.points}</div>
        <div className="text-gray-600 text-sm lg:text-base">Panda Points</div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 text-center shadow-sm">
        <ShoppingBag className="w-6 h-6 lg:w-8 lg:h-8 text-panda-red-500 mx-auto mb-2 lg:mb-3" />
        <div className="text-xl lg:text-2xl font-bold text-panda-black-900 mb-1">{userProfile.totalOrders}</div>
        <div className="text-gray-600 text-sm lg:text-base">Total Orders</div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 text-center shadow-sm">
        <Wallet className="w-6 h-6 lg:w-8 lg:h-8 text-panda-red-500 mx-auto mb-2 lg:mb-3" />
        <div className="text-xl lg:text-2xl font-bold text-panda-black-900 mb-1">
          KES {userProfile.totalSpent.toLocaleString()}
        </div>
        <div className="text-gray-600 text-sm lg:text-base">Total Spent</div>
      </div>
    </div>

    {/* Recent Activity */}
    <div className="bg-white border border-gray-200 rounded-xl p-4 lg:p-6 shadow-sm">
      <h3 className="text-lg lg:text-xl font-bold text-panda-black-900 mb-4">Recent Activity</h3>
      {isNewUser ? (
        <div className="text-center py-6 lg:py-8">
          <Package className="w-12 h-12 lg:w-16 lg:h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-base lg:text-lg font-semibold text-gray-600 mb-2">No activity yet</h4>
          <p className="text-gray-500 mb-6 text-sm lg:text-base">Start shopping to see your activity here</p>
          <button className="btn-primary text-sm lg:text-base px-4 lg:px-6 py-2 lg:py-3">Browse Products</button>
        </div>
      ) : (
        <div className="space-y-4">
          {userProfile.orders.slice(0, 3).map((order) => (
            <div key={order.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${order.status === 'delivered' ? 'bg-green-500' :
                    order.status === 'shipped' ? 'bg-blue-500' :
                      order.status === 'processing' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                <div>
                  <div className="font-semibold text-sm lg:text-base">Order #{order.id}</div>
                  <div className="text-xs lg:text-sm text-gray-500">{order.items} items • {order.store}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-sm lg:text-base">KES {order.total.toLocaleString()}</div>
                <div className="text-xs lg:text-sm text-gray-500 capitalize">{order.status}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)

// QR Scanner Modal Component
const QRScannerModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-semibold">QR Code Scanner</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6">
            <div className="bg-gray-100 rounded-lg p-8 text-center mb-4">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">Camera access required to scan QR codes</p>
              <button className="btn-primary">
                <Camera className="w-4 h-4 mr-2" />
                Enable Camera
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center">
              Scan QR codes at Panda Mart stores to earn points and access exclusive offers
            </p>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
)

// I'll continue with the other section components in the next part...
export default AccountPage