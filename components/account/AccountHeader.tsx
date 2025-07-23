'use client'

import { motion } from 'framer-motion'
import { User, Edit3, Star, Shield, QrCode, Share2, Wallet, ShoppingCart } from 'lucide-react'

interface User {
  id: string
  pandaId: string
  name: string
  email: string
  phone: string
  avatar: string | null
  tier: string
  points: number
  isVerified: boolean
}

interface AccountHeaderProps {
  user: User
  onEditProfile: () => void
  onCartClick?: () => void
}

const AccountHeader = ({ user, onEditProfile, onCartClick }: AccountHeaderProps) => {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Gold': return 'from-yellow-400 to-yellow-600'
      case 'Silver': return 'from-gray-300 to-gray-500'
      case 'Bronze': return 'from-orange-400 to-orange-600'
      default: return 'from-blue-400 to-blue-600'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Gold': return '👑'
      case 'Silver': return '🥈'
      case 'Bronze': return '🥉'
      default: return '⭐'
    }
  }

  return (
    <div className={`bg-gradient-to-br ${getTierColor(user.tier)} relative overflow-hidden rounded-2xl md:rounded-3xl`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 rounded-full bg-white transform translate-x-16 -translate-y-16 md:translate-x-24 md:-translate-y-24"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 md:w-36 md:h-36 rounded-full bg-white transform -translate-x-12 translate-y-12 md:-translate-x-18 md:translate-y-18"></div>
      </div>

      <div className="relative z-10 p-6 md:p-8">
        {/* Top Row - QR Code, Cart, and Share */}
        <div className="flex justify-between items-start mb-6 md:mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-full hover:bg-white/30 transition-colors"
          >
            <QrCode className="w-5 h-5 md:w-6 md:h-6 text-white" />
          </motion.button>
          
          <div className="flex items-center space-x-3">
            {/* Cart Icon */}
            {onCartClick && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCartClick}
                className="bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-full hover:bg-white/30 transition-colors relative"
              >
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-full hover:bg-white/30 transition-colors"
            >
              <Share2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Profile Section - Responsive Layout */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
          <div className="flex items-center space-x-4 md:space-x-6 mb-4 md:mb-0">
            {/* Avatar */}
            <div className="relative">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-3 border-white/30">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 md:w-12 md:h-12 text-white" />
                )}
              </div>
              
              {/* Verification Badge */}
              {user.isVerified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                  <Shield className="w-3 h-3 md:w-4 md:h-4 text-white" />
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">{user.name}</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onEditProfile}
                  className="bg-white/20 backdrop-blur-sm p-1 md:p-2 rounded-full hover:bg-white/30 transition-colors"
                >
                  <Edit3 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </motion.button>
              </div>
              
              <p className="text-white/80 text-sm md:text-base mb-2">ID: {user.pandaId}</p>
              
              {/* Tier Badge */}
              <div className="flex items-center space-x-2">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 md:px-4 md:py-2 rounded-full flex items-center space-x-1">
                  <span className="text-sm md:text-base">{getTierIcon(user.tier)}</span>
                  <span className="text-white text-sm md:text-base font-semibold">{user.tier}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats for Desktop */}
          <div className="hidden md:flex md:flex-col md:items-end md:space-y-2">
            <div className="text-right">
              <p className="text-white/80 text-sm">Member Since</p>
              <p className="text-white font-semibold">June 2023</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Store Visits</p>
              <p className="text-white font-semibold">{user.visits} times</p>
            </div>
          </div>
        </div>

        {/* Points Display - Enhanced for Web */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white/80 text-sm md:text-base">Panda Points</p>
                <p className="text-white text-2xl md:text-3xl font-bold">{user.points.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Star className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
            </div>
            
            {/* Progress to next tier */}
            <div>
              <div className="flex justify-between text-xs md:text-sm text-white/80 mb-2">
                <span>Progress to Platinum</span>
                <span>2,550 more points</span>
              </div>
              <div className="bg-white/20 rounded-full h-2 md:h-3">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '49%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-white rounded-full h-2 md:h-3"
                />
              </div>
            </div>
          </motion.div>

          {/* Additional Info Card for Web */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 md:p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white/80 text-sm md:text-base">Total Savings</p>
                <p className="text-white text-2xl md:text-3xl font-bold">KES {user.totalSpent.toLocaleString()}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Wallet className="w-6 h-6 md:w-8 md:h-8 text-white" />
              </div>
            </div>
            
            <div className="flex justify-between text-xs md:text-sm text-white/80">
              <span>This Year</span>
              <span className="text-green-300 font-medium">+15% from last year</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default AccountHeader