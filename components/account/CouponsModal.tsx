'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Gift, Clock, Star, ShoppingBag, Percent, 
  Calendar, MapPin, ChevronRight, Copy, Check
} from 'lucide-react'

interface CouponsModalProps {
  onClose: () => void
}

const CouponsModal = ({ onClose }: CouponsModalProps) => {
  const [activeTab, setActiveTab] = useState('available')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const availableCoupons = [
    {
      id: 1,
      title: '15% Off Electronics',
      description: 'Valid on all electronics items',
      discount: '15%',
      code: 'ELEC15',
      expiresAt: '2024-02-15',
      minSpend: 2000,
      category: 'Electronics',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      id: 2,
      title: 'KES 500 Off Home & Kitchen',
      description: 'Minimum spend KES 3,000',
      discount: 'KES 500',
      code: 'HOME500',
      expiresAt: '2024-02-20',
      minSpend: 3000,
      category: 'Home & Kitchen',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      id: 3,
      title: '20% Off Beauty Products',
      description: 'All beauty and personal care',
      discount: '20%',
      code: 'BEAUTY20',
      expiresAt: '2024-02-10',
      minSpend: 1500,
      category: 'Beauty',
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      textColor: 'text-pink-600'
    },
    {
      id: 4,
      title: 'Buy 2 Get 1 Free',
      description: 'Selected clothing items',
      discount: 'B2G1',
      code: 'CLOTH3',
      expiresAt: '2024-02-25',
      minSpend: 0,
      category: 'Fashion',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ]

  const usedCoupons = [
    {
      id: 5,
      title: '10% Off First Purchase',
      description: 'Welcome offer',
      discount: '10%',
      code: 'WELCOME10',
      usedAt: '2024-01-15',
      savedAmount: 450,
      category: 'General',
      color: 'from-gray-400 to-gray-500'
    },
    {
      id: 6,
      title: 'Free Delivery',
      description: 'No minimum spend',
      discount: 'Free',
      code: 'FREEDEL',
      usedAt: '2024-01-20',
      savedAmount: 200,
      category: 'Delivery',
      color: 'from-gray-400 to-gray-500'
    }
  ]

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const renderAvailableCoupons = () => (
    <div className="space-y-4">
      {availableCoupons.map((coupon, index) => {
        const daysLeft = getDaysUntilExpiry(coupon.expiresAt)
        const isExpiringSoon = daysLeft <= 3
        
        return (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${coupon.bgColor} rounded-2xl p-4 relative overflow-hidden`}
          >
            {/* Background Gradient */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${coupon.color} opacity-10 rounded-full transform translate-x-8 -translate-y-8`} />
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{coupon.title}</h3>
                  <p className="text-sm text-gray-600">{coupon.description}</p>
                </div>
                
                <div className={`bg-gradient-to-br ${coupon.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                  {coupon.discount}
                </div>
              </div>
              
              {/* Code Section */}
              <div className="flex items-center justify-between bg-white rounded-xl p-3 mb-3">
                <div className="flex items-center space-x-2">
                  <Gift className={`w-4 h-4 ${coupon.textColor}`} />
                  <span className="font-mono font-bold text-gray-900">{coupon.code}</span>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => copyCode(coupon.code)}
                  className={`p-2 rounded-lg ${coupon.bgColor} ${coupon.textColor}`}
                >
                  {copiedCode === coupon.code ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </motion.button>
              </div>
              
              {/* Details */}
              <div className="flex items-center justify-between text-xs text-gray-600">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span className={isExpiringSoon ? 'text-red-600 font-medium' : ''}>
                      {daysLeft > 0 ? `${daysLeft} days left` : 'Expired'}
                    </span>
                  </div>
                  
                  {coupon.minSpend > 0 && (
                    <div className="flex items-center space-x-1">
                      <ShoppingBag className="w-3 h-3" />
                      <span>Min: KES {coupon.minSpend.toLocaleString()}</span>
                    </div>
                  )}
                </div>
                
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${coupon.bgColor} ${coupon.textColor}`}>
                  {coupon.category}
                </span>
              </div>
              
              {isExpiringSoon && (
                <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-2 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-red-600" />
                  <span className="text-xs text-red-700 font-medium">Expires soon!</span>
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )

  const renderUsedCoupons = () => (
    <div className="space-y-4">
      {usedCoupons.map((coupon, index) => (
        <motion.div
          key={coupon.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gray-50 rounded-2xl p-4 relative overflow-hidden opacity-75"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-gray-700 mb-1">{coupon.title}</h3>
              <p className="text-sm text-gray-500">{coupon.description}</p>
            </div>
            
            <div className={`bg-gradient-to-br ${coupon.color} text-white px-3 py-1 rounded-full text-sm font-bold opacity-60`}>
              {coupon.discount}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Used on {new Date(coupon.usedAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>Saved KES {coupon.savedAmount}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 500 }}
        className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">My Coupons</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-3 px-4 font-semibold text-sm transition-colors ${
              activeTab === 'available'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Available ({availableCoupons.length})
          </button>
          <button
            onClick={() => setActiveTab('used')}
            className={`flex-1 py-3 px-4 font-semibold text-sm transition-colors ${
              activeTab === 'used'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Used ({usedCoupons.length})
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {activeTab === 'available' ? renderAvailableCoupons() : renderUsedCoupons()}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default CouponsModal