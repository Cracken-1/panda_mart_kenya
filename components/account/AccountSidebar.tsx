'use client'

import { motion } from 'framer-motion'
import { 
  User, Shield, Bell, CreditCard, MapPin, Heart, 
  Headphones, Settings, Award, Gift, BarChart3,
  ShoppingBag, Clock, FileText, ShoppingCart
} from 'lucide-react'

interface AccountSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
  user: any
}

const AccountSidebar = ({ activeSection, onSectionChange, user }: AccountSidebarProps) => {
  const sidebarSections = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      description: 'Overview & Stats'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      description: 'Personal Information'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: ShoppingBag,
      description: 'Order History'
    },
    {
      id: 'cart',
      label: 'Shopping Cart',
      icon: ShoppingCart,
      description: 'Items in Cart'
    },
    {
      id: 'coupons',
      label: 'Coupons & Rewards',
      icon: Gift,
      description: 'Active & Used Coupons'
    },
    {
      id: 'addresses',
      label: 'Addresses',
      icon: MapPin,
      description: 'Delivery Addresses'
    },
    {
      id: 'payment',
      label: 'Payment Methods',
      icon: CreditCard,
      description: 'Cards & Payment Options'
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      description: 'Saved Items'
    },
    {
      id: 'loyalty',
      label: 'Loyalty Program',
      icon: Award,
      description: 'Tier Benefits & Progress'
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      description: 'Password & 2FA'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Preferences & Settings'
    },
    {
      id: 'support',
      label: 'Help & Support',
      icon: Headphones,
      description: 'Get Help'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      description: 'App Preferences'
    }
  ]

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-full overflow-y-auto">
      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-6 h-6 text-white" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
            <p className="text-sm text-gray-500 truncate">{user.email}</p>
            <div className="flex items-center mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {user.tier} Member
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4">
        <div className="space-y-1">
          {sidebarSections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              whileHover={{ x: 4 }}
              className={`w-full flex items-center px-4 py-3 text-left rounded-xl transition-all duration-200 group ${
                activeSection === section.id
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <section.icon className={`w-5 h-5 mr-3 ${
                activeSection === section.id ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{section.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{section.description}</div>
              </div>
              {activeSection === section.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="w-2 h-2 bg-blue-600 rounded-full"
                />
              )}
            </motion.button>
          ))}
        </div>
      </nav>
    </div>
  )
}

export default AccountSidebar