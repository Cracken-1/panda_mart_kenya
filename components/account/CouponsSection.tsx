'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Clock, Star, Copy, Check, Filter, Search } from 'lucide-react'

const CouponsSection = () => {
  const [activeTab, setActiveTab] = useState('active')
  const [copiedCoupon, setCopiedCoupon] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCoupons, setActiveCoupons] = useState<any[]>([])
  const [usedCoupons, setUsedCoupons] = useState<any[]>([])
  const [expiredCoupons, setExpiredCoupons] = useState<any[]>([])
  const [toast, setToast] = useState<{message: string, visible: boolean, type: 'success' | 'error'}>({message: '', visible: false, type: 'success'})

  // Load coupons from localStorage and initialize with default data
  useEffect(() => {
    const defaultActiveCoupons = [
      {
        id: 'ELEC20',
        title: '20% Off Electronics',
        description: 'Valid on all electronics purchases above KES 10,000',
        discount: '20%',
        minSpend: 'KES 10,000',
        expiryDate: '2024-02-15',
        category: 'Electronics',
        type: 'percentage',
        color: 'bg-blue-500'
      },
      {
        id: 'FURN15',
        title: 'KES 1,500 Off Furniture',
        description: 'Get KES 1,500 off on furniture purchases above KES 15,000',
        discount: 'KES 1,500',
        minSpend: 'KES 15,000',
        expiryDate: '2024-02-20',
        category: 'Furniture',
        type: 'fixed',
        color: 'bg-green-500'
      },
      {
        id: 'DELIVERY',
        title: 'Free Delivery',
        description: 'Free delivery on all orders - no minimum spend',
        discount: 'Free',
        minSpend: 'No minimum',
        expiryDate: '2024-02-10',
        category: 'Shipping',
        type: 'free',
        color: 'bg-purple-500'
      },
      {
        id: 'HOME25',
        title: '25% Off Homeware',
        description: 'Special discount on all homeware and kitchen items',
        discount: '25%',
        minSpend: 'KES 5,000',
        expiryDate: '2024-02-25',
        category: 'Homeware',
        type: 'percentage',
        color: 'bg-orange-500'
      },
      {
        id: 'BEAUTY10',
        title: '10% Off Beauty Products',
        description: 'Discount on all beauty and personal care items',
        discount: '10%',
        minSpend: 'KES 2,000',
        expiryDate: '2024-02-18',
        category: 'Beauty',
        type: 'percentage',
        color: 'bg-pink-500'
      }
    ]

    const defaultUsedCoupons = [
      {
        id: 'WELCOME50',
        title: 'Welcome Bonus',
        description: 'KES 500 off your first purchase',
        discount: 'KES 500',
        usedDate: '2024-01-15',
        savedAmount: 'KES 500',
        category: 'Welcome',
        color: 'bg-gray-400'
      },
      {
        id: 'FLASH30',
        title: '30% Flash Sale',
        description: 'Flash sale discount on electronics',
        discount: '30%',
        usedDate: '2024-01-10',
        savedAmount: 'KES 2,100',
        category: 'Electronics',
        color: 'bg-gray-400'
      }
    ]

    const defaultExpiredCoupons = [
      {
        id: 'XMAS20',
        title: 'Christmas Special',
        description: '20% off on all items',
        discount: '20%',
        expiredDate: '2023-12-31',
        category: 'Seasonal',
        color: 'bg-red-300'
      }
    ]

    // Load from localStorage or use defaults
    const savedActiveCoupons = JSON.parse(localStorage.getItem('panda_active_coupons') || 'null')
    const savedUsedCoupons = JSON.parse(localStorage.getItem('panda_used_coupons') || 'null')
    const savedExpiredCoupons = JSON.parse(localStorage.getItem('panda_expired_coupons') || 'null')

    setActiveCoupons(savedActiveCoupons || defaultActiveCoupons)
    setUsedCoupons(savedUsedCoupons || defaultUsedCoupons)
    setExpiredCoupons(savedExpiredCoupons || defaultExpiredCoupons)

    // Save defaults to localStorage if not already saved
    if (!savedActiveCoupons) localStorage.setItem('panda_active_coupons', JSON.stringify(defaultActiveCoupons))
    if (!savedUsedCoupons) localStorage.setItem('panda_used_coupons', JSON.stringify(defaultUsedCoupons))
    if (!savedExpiredCoupons) localStorage.setItem('panda_expired_coupons', JSON.stringify(defaultExpiredCoupons))
  }, [])

  // Toast notification system
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({message, visible: true, type})
    setTimeout(() => setToast({message: '', visible: false, type: 'success'}), 3000)
  }

  // Use coupon functionality
  const handleUseCoupon = async (coupon: any) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Move coupon from active to used
      const updatedActiveCoupons = activeCoupons.filter(c => c.id !== coupon.id)
      const usedCoupon = {
        ...coupon,
        usedDate: new Date().toISOString().split('T')[0],
        savedAmount: coupon.type === 'percentage' ? `${coupon.discount} discount` : coupon.discount,
        color: 'bg-gray-400'
      }
      const updatedUsedCoupons = [...usedCoupons, usedCoupon]
      
      setActiveCoupons(updatedActiveCoupons)
      setUsedCoupons(updatedUsedCoupons)
      
      // Save to localStorage
      localStorage.setItem('panda_active_coupons', JSON.stringify(updatedActiveCoupons))
      localStorage.setItem('panda_used_coupons', JSON.stringify(updatedUsedCoupons))
      
      showToast(`Coupon ${coupon.id} used successfully!`, 'success')
    } catch (error) {
      showToast('Failed to use coupon', 'error')
    }
  }

  const handleCopyCoupon = (couponId: string) => {
    navigator.clipboard.writeText(couponId)
    setCopiedCoupon(couponId)
    setTimeout(() => setCopiedCoupon(null), 2000)
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const filteredCoupons = activeCoupons.filter(coupon =>
    coupon.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    coupon.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const renderCoupons = () => {
    let coupons = []
    
    switch (activeTab) {
      case 'active':
        coupons = filteredCoupons
        break
      case 'used':
        coupons = usedCoupons
        break
      case 'expired':
        coupons = expiredCoupons
        break
      default:
        coupons = filteredCoupons
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coupons.map((coupon, index) => (
          <motion.div
            key={coupon.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-xl border-2 ${
              activeTab === 'active' ? 'border-panda-red-200 bg-white' : 'border-gray-200 bg-gray-50'
            }`}
          >
            {/* Coupon Header */}
            <div className={`${coupon.color} p-4 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg">{coupon.title}</h3>
                  <p className="text-white/90 text-sm">{coupon.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{coupon.discount}</div>
                  <div className="text-xs text-white/80">OFF</div>
                </div>
              </div>
            </div>

            {/* Coupon Body */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                  <div className="font-semibold">Min. Spend: {coupon.minSpend || 'No minimum'}</div>
                  {activeTab === 'active' && coupon.expiryDate && (
                    <div className="flex items-center mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className={`${
                        getDaysUntilExpiry(coupon.expiryDate) <= 3 ? 'text-red-500' : 'text-gray-600'
                      }`}>
                        {getDaysUntilExpiry(coupon.expiryDate)} days left
                      </span>
                    </div>
                  )}
                  {activeTab === 'used' && (
                    <div className="text-green-600 font-semibold">
                      Saved: {(coupon as any).savedAmount}
                    </div>
                  )}
                </div>
                <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {coupon.category}
                </div>
              </div>

              {/* Coupon Code */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">Coupon Code</div>
                    <div className="font-mono font-bold text-panda-black-900">{coupon.id}</div>
                  </div>
                  {activeTab === 'active' && (
                    <button
                      onClick={() => handleCopyCoupon(coupon.id)}
                      className="flex items-center px-3 py-2 bg-panda-red-500 text-white rounded-lg hover:bg-panda-red-600 transition-colors"
                    >
                      {copiedCoupon === coupon.id ? (
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
                  )}
                </div>
              </div>

              {/* Action Button */}
              {activeTab === 'active' && (
                <button 
                  onClick={() => handleUseCoupon(coupon)}
                  className="w-full bg-panda-red-500 text-white py-3 rounded-lg font-semibold hover:bg-panda-red-600 transition-colors"
                >
                  Use This Coupon
                </button>
              )}
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gray-50 rounded-full transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-50 rounded-full transform -translate-y-1/2"></div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}
      
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <CreditCard className="w-8 h-8 text-panda-red-500 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-panda-black-900">My Coupons</h2>
              <p className="text-gray-600">Save more with exclusive deals</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-panda-red-500">{activeCoupons.length}</div>
            <div className="text-sm text-gray-500">Active Coupons</div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search coupons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { id: 'active', name: 'Active', count: activeCoupons.length },
            { id: 'used', name: 'Used', count: usedCoupons.length },
            { id: 'expired', name: 'Expired', count: expiredCoupons.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-panda-red-500 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Coupons Grid */}
      <div>
        {renderCoupons()}
      </div>

      {/* How to Use Coupons */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-panda-black-900 mb-4">How to Use Your Coupons</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-panda-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-panda-red-500 font-bold">1</span>
            </div>
            <h4 className="font-semibold mb-2">Copy Coupon Code</h4>
            <p className="text-sm text-gray-600">Click the copy button to save the coupon code</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-panda-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-panda-red-500 font-bold">2</span>
            </div>
            <h4 className="font-semibold mb-2">Visit Store</h4>
            <p className="text-sm text-gray-600">Go to any Panda Mart store and shop for eligible items</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-panda-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-panda-red-500 font-bold">3</span>
            </div>
            <h4 className="font-semibold mb-2">Show at Checkout</h4>
            <p className="text-sm text-gray-600">Present the coupon code at checkout to get your discount</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CouponsSection