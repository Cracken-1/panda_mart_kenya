'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Gift, Clock, Star, Copy, Check, Calendar, 
  ShoppingBag, Percent, Tag, Filter, Search,
  AlertCircle, Sparkles
} from 'lucide-react'

const CouponsSection = () => {
  const [activeTab, setActiveTab] = useState('active')
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const activeCoupons = [
    {
      id: 1,
      title: '15% Off Electronics',
      description: 'Valid on all electronics items',
      discount: '15%',
      code: 'ELEC15',
      expiryDate: '2024-02-15',
      minSpend: 'KES 2,000',
      category: 'Electronics',
      type: 'percentage',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 2,
      title: 'KES 500 Off Home & Kitchen',
      description: 'Minimum spend KES 3,000',
      discount: 'KES 500',
      code: 'HOME500',
      expiryDate: '2024-02-20',
      minSpend: 'KES 3,000',
      category: 'Home & Kitchen',
      type: 'fixed',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 3,
      title: '20% Off Beauty Products',
      description: 'All beauty and personal care',
      discount: '20%',
      code: 'BEAUTY20',
      expiryDate: '2024-02-10',
      minSpend: 'KES 1,500',
      category: 'Beauty',
      type: 'percentage',
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 4,
      title: 'Buy 2 Get 1 Free',
      description: 'Selected clothing items',
      discount: 'B2G1',
      code: 'CLOTH3',
      expiryDate: '2024-02-25',
      minSpend: 'No minimum',
      category: 'Fashion',
      type: 'bogo',
      color: 'from-purple-500 to-purple-600'
    }
  ]

  const usedCoupons = [
    {
      id: 5,
      title: '10% Off First Purchase',
      description: 'Welcome offer',
      discount: '10%',
      code: 'WELCOME10',
      usedDate: '2024-01-15',
      savedAmount: 'KES 450',
      category: 'General',
      color: 'from-gray-400 to-gray-500'
    },
    {
      id: 6,
      title: 'Free Delivery',
      description: 'No minimum spend',
      discount: 'Free',
      code: 'FREEDEL',
      usedDate: '2024-01-20',
      savedAmount: 'KES 200',
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

  const tabs = [
    { id: 'active', label: 'Active Coupons', count: activeCoupons.length },
    { id: 'used', label: 'Used Coupons', count: usedCoupons.length },
    { id: 'expired', label: 'Expired', count: 0 }
  ]

  const currentCoupons = activeTab === 'active' ? activeCoupons : usedCoupons

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Coupons & Rewards</h2>
          <p className="text-gray-600">Manage your discounts and special offers</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Sparkles className="w-4 h-4 mr-2" />
            Browse Offers
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Saved</p>
              <p className="text-2xl font-bold">KES 8,750</p>
            </div>
            <Gift className="w-8 h-8 text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Active Coupons</p>
              <p className="text-2xl font-bold">{activeCoupons.length}</p>
            </div>
            <Tag className="w-8 h-8 text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Used This Month</p>
              <p className="text-2xl font-bold">3</p>
            </div>
            <Star className="w-8 h-8 text-purple-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Expiring Soon</p>
              <p className="text-2xl font-bold">2</p>
            </div>
            <Clock className="w-8 h-8 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filter by Category
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Coupons List */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {currentCoupons.map((coupon, index) => {
              const daysLeft = activeTab === 'active' ? getDaysUntilExpiry(coupon.expiryDate) : null
              const isExpiringSoon = daysLeft !== null && daysLeft <= 3

              return (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-200"
                >
                  {/* Coupon Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{coupon.title}</h3>
                      <p className="text-sm text-gray-600">{coupon.description}</p>
                    </div>
                    <div className={`bg-gradient-to-r ${coupon.color} text-white px-3 py-1 rounded-full text-sm font-bold`}>
                      {coupon.discount}
                    </div>
                  </div>

                  {/* Coupon Code */}
                  <div className="bg-white rounded-xl p-4 mb-4 border-2 border-dashed border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Gift className="w-5 h-5 text-gray-400" />
                        <span className="font-mono font-bold text-lg text-gray-900">{coupon.code}</span>
                      </div>
                      <button
                        onClick={() => copyCode(coupon.code)}
                        className="flex items-center px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        {copiedCode === coupon.code ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Coupon Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Category:</span>
                      <span className="font-medium text-gray-900">{coupon.category}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Min. Spend:</span>
                      <span className="font-medium text-gray-900">{coupon.minSpend || 'No minimum'}</span>
                    </div>
                    {activeTab === 'active' && coupon.expiryDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Expires:</span>
                        <span className={`font-medium ${
                          getDaysUntilExpiry(coupon.expiryDate) <= 3 ? 'text-red-500' : 'text-gray-600'
                        }`}>
                          {getDaysUntilExpiry(coupon.expiryDate)} days left
                        </span>
                      </div>
                    )}
                    {activeTab === 'used' && (
                      <>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Used on:</span>
                          <span className="font-medium text-gray-900">
                            {new Date(coupon.usedDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">You saved:</span>
                          <span className="font-medium text-green-600">{coupon.savedAmount}</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Expiry Warning */}
                  {isExpiringSoon && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-700 font-medium">Expires soon!</span>
                    </div>
                  )}

                  {/* Action Button */}
                  {activeTab === 'active' && (
                    <button className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Use This Coupon
                    </button>
                  )}
                </motion.div>
              )
            })}
          </div>

          {currentCoupons.length === 0 && (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons found</h3>
              <p className="text-gray-500 mb-4">
                {activeTab === 'active' 
                  ? "You don't have any active coupons right now" 
                  : "You haven't used any coupons yet"
                }
              </p>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Browse Available Offers
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CouponsSection