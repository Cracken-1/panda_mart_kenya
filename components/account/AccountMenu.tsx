'use client'

import { motion } from 'framer-motion'
import { 
  User, Shield, Bell, CreditCard, MapPin, Heart, 
  Headphones, Settings, LogOut, ChevronRight, 
  Smartphone, Download, Share2, Award, Gift
} from 'lucide-react'

interface AccountMenuProps {
  onMenuClick: (menu: string) => void
}

const AccountMenu = ({ onMenuClick }: AccountMenuProps) => {
  const menuSections = [
    {
      title: 'Account',
      items: [
        {
          id: 'profile',
          icon: User,
          label: 'Edit Profile',
          description: 'Update your personal information',
          color: 'text-blue-600',
          bgColor: 'bg-blue-50'
        },
        {
          id: 'security',
          icon: Shield,
          label: 'Security & Privacy',
          description: 'Manage your account security',
          color: 'text-green-600',
          bgColor: 'bg-green-50'
        },
        {
          id: 'notifications',
          icon: Bell,
          label: 'Notifications',
          description: 'Control your notification preferences',
          color: 'text-purple-600',
          bgColor: 'bg-purple-50'
        }
      ]
    },
    {
      title: 'Shopping',
      items: [
        {
          id: 'payment',
          icon: CreditCard,
          label: 'Payment Methods',
          description: 'Manage cards and payment options',
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50'
        },
        {
          id: 'addresses',
          icon: MapPin,
          label: 'Delivery Addresses',
          description: 'Manage your delivery locations',
          color: 'text-red-600',
          bgColor: 'bg-red-50'
        },
        {
          id: 'wishlist',
          icon: Heart,
          label: 'Wishlist',
          description: 'View your saved items',
          color: 'text-pink-600',
          bgColor: 'bg-pink-50'
        }
      ]
    },
    {
      title: 'Rewards & Benefits',
      items: [
        {
          id: 'loyalty',
          icon: Award,
          label: 'Loyalty Program',
          description: 'View tier benefits and progress',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50'
        },
        {
          id: 'referrals',
          icon: Share2,
          label: 'Refer Friends',
          description: 'Earn rewards by referring friends',
          color: 'text-orange-600',
          bgColor: 'bg-orange-50'
        },
        {
          id: 'rewards',
          icon: Gift,
          label: 'My Rewards',
          description: 'View available rewards and offers',
          color: 'text-emerald-600',
          bgColor: 'bg-emerald-50'
        }
      ]
    },
    {
      title: 'Support & More',
      items: [
        {
          id: 'support',
          icon: Headphones,
          label: 'Help & Support',
          description: 'Get help with your account',
          color: 'text-teal-600',
          bgColor: 'bg-teal-50'
        },
        {
          id: 'app',
          icon: Smartphone,
          label: 'Mobile App',
          description: 'Download our mobile app',
          color: 'text-cyan-600',
          bgColor: 'bg-cyan-50'
        },
        {
          id: 'settings',
          icon: Settings,
          label: 'App Settings',
          description: 'Customize your app experience',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50'
        }
      ]
    }
  ]

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-6 md:px-6 md:py-8">
        {menuSections.map((section, sectionIndex) => (
          <div key={section.title} className="mb-6 md:mb-8 last:mb-0">
            <h4 className="text-sm md:text-base font-semibold text-gray-500 uppercase tracking-wide mb-3 md:mb-4">
              {section.title}
            </h4>
            
            <div className="space-y-2 md:space-y-3">
              {section.items.map((item, itemIndex) => (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                  whileHover={{ scale: 1.01, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onMenuClick(item.id)}
                  className="w-full flex items-center p-4 md:p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 text-left group hover:shadow-sm"
                >
                  <div className={`${item.bgColor} p-2 md:p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-5 h-5 md:w-6 md:h-6 ${item.color}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm md:text-base font-semibold text-gray-900">
                      {item.label}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                      {item.description}
                    </p>
                  </div>
                  
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </motion.button>
              ))}
            </div>
          </div>
        ))}
        
        {/* Logout Button */}
        <div className="pt-4 md:pt-6 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.01, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onMenuClick('logout')}
            className="w-full flex items-center p-4 md:p-5 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-200 text-left group hover:shadow-sm"
          >
            <div className="bg-red-100 p-2 md:p-3 rounded-lg mr-4 group-hover:scale-110 transition-transform">
              <LogOut className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
            </div>
            
            <div className="flex-1">
              <p className="text-sm md:text-base font-semibold text-red-600">
                Sign Out
              </p>
              <p className="text-xs md:text-sm text-red-500 mt-1">
                Sign out of your account
              </p>
            </div>
            
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-red-400 group-hover:text-red-600 transition-colors" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default AccountMenu