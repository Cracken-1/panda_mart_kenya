'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  User, Gift, CreditCard, Shield, Settings, Bell, MapPin,
  Heart, ShoppingBag, Star, ChevronRight, Edit3, Camera,
  Wallet, Award, TrendingUp, Clock, Phone, Mail, LogOut,
  QrCode, Share2, Download, Eye, EyeOff, Smartphone, Moon,
  Sun, Wifi, WifiOff, Battery, Signal, RefreshCw
} from 'lucide-react'
import AccountHeader from '../../components/account/AccountHeader'
import QuickActions from '../../components/account/QuickActions'
import StatsCards from '../../components/account/StatsCards'
import RecentActivity from '../../components/account/RecentActivity'
import AccountMenu from '../../components/account/AccountMenu'
import ProfileModal from '../../components/account/ProfileModal'
import SecurityModal from '../../components/account/SecurityModal'
import NotificationsModal from '../../components/account/NotificationsModal'
import QRScannerModal from '../../components/account/QRScannerModal'
import CouponsModal from '../../components/account/CouponsModal'
import WelcomeTour from '../../components/account/WelcomeTour'
import AccountSidebar from '../../components/account/AccountSidebar'
import AccountWebHeader from '../../components/account/AccountWebHeader'
import DashboardSection from '../../components/account/sections/DashboardSection'
import OrdersSection from '../../components/account/sections/OrdersSection'
import CouponsSection from '../../components/account/sections/CouponsSection'
import ProfileSection from '../../components/account/sections/ProfileSection'
import AddressesSection from '../../components/account/sections/AddressesSection'
import PaymentSection from '../../components/account/sections/PaymentSection'
import WishlistSection from '../../components/account/sections/WishlistSection'
import LoyaltySection from '../../components/account/sections/LoyaltySection'
import SettingsSection from '../../components/account/sections/SettingsSection'
import NotificationsSection from '../../components/account/sections/NotificationsSection'
import HelpSupportSection from '../../components/account/sections/HelpSupportSection'
import SecurityDashboard from '../../components/account/SecurityDashboard'
import CartSection from '../../components/cart/CartSection'
import CartDrawer from '../../components/cart/CartDrawer'

const AccountPage = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [showWelcomeTour, setShowWelcomeTour] = useState(false)
  const [activeSection, setActiveSection] = useState('dashboard')
  const [showCartDrawer, setShowCartDrawer] = useState(false)

  // Force component refresh - updated timestamp
  const [lastUpdate] = useState(Date.now())
  const [showAccountDropdown, setShowAccountDropdown] = useState(false)
  const [user, setUser] = useState({
    id: 'user_123',
    pandaId: 'PANDA123456',
    name: 'Sarah Wanjiku',
    email: 'sarah.wanjiku@gmail.com',
    phone: '+254 712 345 678',
    avatar: null as string | null,
    tier: 'Gold',
    points: 2450,
    totalSpent: 45600,
    visits: 12,
    joinDate: '2023-06-15',
    isVerified: true,
    preferences: {
      notifications: {
        push: true,
        email: true,
        sms: false,
        marketing: true
      },
      privacy: {
        profileVisible: true,
        shareActivity: false
      }
    }
  })

  const [stats, setStats] = useState({
    points: 2450,
    coupons: 5,
    orders: 23,
    savings: 8750
  })

  // Check if user is new and should see welcome tour
  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenAccountTour')
    if (!hasSeenTour) {
      setShowWelcomeTour(true)
    }
  }, [])

  // Listen for navigation events from settings section
  useEffect(() => {
    const handleNavigateToSection = (event: CustomEvent) => {
      const section = event.detail
      if (section) {
        setActiveSection(section)
      }
    }

    window.addEventListener('navigate-to-section', handleNavigateToSection as EventListener)

    return () => {
      window.removeEventListener('navigate-to-section', handleNavigateToSection as EventListener)
    }
  }, [])

  const closeModal = () => setActiveModal(null)

  const handleQRScan = (data: string) => {
    console.log('QR Scanned:', data)
    // Handle different QR code types
    if (data.includes('CHECKIN')) {
      // Store check-in logic
      setStats(prev => ({ ...prev, points: prev.points + 10 }))
    } else if (data.includes('COUPON')) {
      // Coupon redemption logic
      setStats(prev => ({ ...prev, coupons: prev.coupons + 1 }))
    }
  }

  const completeTour = () => {
    localStorage.setItem('hasSeenAccountTour', 'true')
    setShowWelcomeTour(false)
  }

  const skipTour = () => {
    localStorage.setItem('hasSeenAccountTour', 'true')
    setShowWelcomeTour(false)
  }

  // Cart handlers
  const handleCartClick = () => {
    setShowCartDrawer(true)
  }

  const handleViewFullCart = () => {
    setActiveSection('cart')
    setShowCartDrawer(false)
  }

  const handleCheckout = () => {
    setShowCartDrawer(false)
    // Navigate to checkout or show checkout modal
    console.log('Proceeding to checkout...')
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardSection user={user} stats={stats} onSectionChange={setActiveSection} />
      case 'orders':
        return <OrdersSection />
      case 'coupons':
        return <CouponsSection />
      case 'profile':
        return <ProfileSection user={user} onUserUpdate={setUser} />
      case 'addresses':
        return <AddressesSection />
      case 'payment':
        return <PaymentSection />
      case 'wishlist':
        return <WishlistSection />
      case 'cart':
        return <CartSection onCheckout={() => console.log('Checkout')} />
      case 'loyalty':
        return <LoyaltySection user={user} />
      case 'security':
        return <SecurityDashboard userEmail={user.email} />
      case 'notifications':
        return <NotificationsSection user={user} />
      case 'support':
        return <HelpSupportSection user={user} />
      case 'settings':
        return <SettingsSection user={user} />
      default:
        return <DashboardSection user={user} stats={stats} onSectionChange={setActiveSection} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Layout (up to md) - Keep original mobile-app design */}
      <div className="md:hidden">
        <div className="max-w-md mx-auto bg-white min-h-screen relative">
          <AccountHeader
            user={user}
            onEditProfile={() => setActiveModal('profile')}
            onCartClick={handleCartClick}
          />
          <QuickActions onAction={setActiveModal} />
          <StatsCards stats={stats} />
          <RecentActivity />
          <AccountMenu onMenuClick={setActiveModal} />
        </div>
      </div>

      {/* Desktop/Tablet Layout (md and up) - Professional sidebar layout */}
      <div className="hidden md:flex h-screen">
        {/* Sidebar */}
        <AccountSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          user={user}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <AccountWebHeader
            user={user}
            activeSection={activeSection}
            onProfileEdit={() => setActiveModal('profile')}
            onLogout={() => console.log('Logout')}
          />

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">
            {renderSectionContent()}
          </div>
        </div>
      </div>

      {/* Modals - Only show mobile-specific modals on mobile */}
      <AnimatePresence>
        {activeModal === 'profile' && (
          <ProfileModal
            user={user}
            onClose={closeModal}
            onSave={(updatedUser) => setUser({ ...user, ...updatedUser })}
          />
        )}
        {activeModal === 'security' && (
          <SecurityModal
            user={user}
            onClose={closeModal}
          />
        )}
        {activeModal === 'notifications' && (
          <NotificationsModal
            preferences={user.preferences}
            onClose={closeModal}
            onSave={(prefs) => setUser({ ...user, preferences: prefs })}
          />
        )}
        {/* Hide mobile-specific features on desktop */}
        {activeModal === 'scan' && (
          <div className="md:hidden">
            <QRScannerModal
              onClose={closeModal}
              onScan={handleQRScan}
            />
          </div>
        )}
        {activeModal === 'coupons' && (
          <CouponsModal
            onClose={closeModal}
          />
        )}
        {showWelcomeTour && (
          <WelcomeTour
            onComplete={completeTour}
            onSkip={skipTour}
          />
        )}
      </AnimatePresence>

      {/* Cart Drawer - Available on both mobile and desktop */}
      <CartDrawer
        isOpen={showCartDrawer}
        onClose={() => setShowCartDrawer(false)}
        onViewFullCart={handleViewFullCart}
        onCheckout={handleCheckout}
      />
    </div>
  )
}

export default AccountPage