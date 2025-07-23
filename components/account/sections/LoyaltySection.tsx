'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Award, Star, Gift, TrendingUp, Clock, Calendar,
  ChevronRight, Info, Check, AlertCircle, Sparkles,
  Zap, Crown, Shield, Smartphone, QrCode
} from 'lucide-react'

interface LoyaltySectionProps {
  user?: any
}

const LoyaltySection = ({ user }: LoyaltySectionProps) => {
  const [activeTab, setActiveTab] = useState('overview')
  const [showQRCode, setShowQRCode] = useState(false)
  const [isRedeeming, setIsRedeeming] = useState(false)
  const [toast, setToast] = useState<{message: string, visible: boolean, type: 'success' | 'error'}>({message: '', visible: false, type: 'success'})
  const [userPoints, setUserPoints] = useState(2450)
  
  // Default user data if not provided
  const userData = user || {
    name: 'Sarah Wanjiku',
    tier: 'Gold',
    points: 2450,
    nextTier: 'Platinum',
    pointsToNextTier: 2550,
    joinDate: '2023-06-15'
  }
  
  // Calculate progress percentage
  const tierThresholds = {
    Bronze: 0,
    Silver: 1000,
    Gold: 5000,
    Platinum: 10000,
    Diamond: 25000
  }
  
  const currentTierPoints = tierThresholds[userData.tier as keyof typeof tierThresholds] || 0
  const nextTierPoints = tierThresholds[userData.nextTier as keyof typeof tierThresholds] || currentTierPoints + 5000
  const progressPercentage = ((userData.points - currentTierPoints) / (nextTierPoints - currentTierPoints)) * 100
  
  // Tier benefits
  const tierBenefits = {
    Bronze: [
      { icon: Star, label: 'Earn 1 point per KES 100 spent' },
      { icon: Gift, label: 'Birthday reward' },
      { icon: Clock, label: 'Standard delivery' }
    ],
    Silver: [
      { icon: Star, label: 'Earn 1.5 points per KES 100 spent' },
      { icon: Gift, label: 'Birthday reward + gift' },
      { icon: Clock, label: 'Priority delivery' },
      { icon: Sparkles, label: 'Exclusive Silver promotions' }
    ],
    Gold: [
      { icon: Star, label: 'Earn 2 points per KES 100 spent' },
      { icon: Gift, label: 'Premium birthday package' },
      { icon: Clock, label: 'Free express delivery' },
      { icon: Sparkles, label: 'Exclusive Gold promotions' },
      { icon: Calendar, label: 'Early access to sales' }
    ],
    Platinum: [
      { icon: Star, label: 'Earn 3 points per KES 100 spent' },
      { icon: Gift, label: 'Luxury birthday package' },
      { icon: Clock, label: 'Free priority delivery' },
      { icon: Sparkles, label: 'Exclusive Platinum promotions' },
      { icon: Calendar, label: 'VIP early access to sales' },
      { icon: Shield, label: 'Extended warranty on purchases' }
    ],
    Diamond: [
      { icon: Star, label: 'Earn 5 points per KES 100 spent' },
      { icon: Gift, label: 'Exclusive Diamond gifts' },
      { icon: Clock, label: 'Free same-day delivery' },
      { icon: Sparkles, label: 'Diamond-only promotions' },
      { icon: Calendar, label: 'First access to new products' },
      { icon: Shield, label: 'Premium warranty coverage' },
      { icon: Crown, label: 'Personal shopping assistant' }
    ]
  }
  
  const currentBenefits = tierBenefits[userData.tier as keyof typeof tierBenefits] || tierBenefits.Bronze
  
  // Recent activities with realistic dates
  const recentActivities = [
    {
      id: 1,
      type: 'earned',
      points: 150,
      description: 'Purchase at Westgate store',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
      icon: TrendingUp
    },
    {
      id: 2,
      type: 'redeemed',
      points: -500,
      description: 'Redeemed for 10% discount coupon',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week ago
      icon: Gift
    },
    {
      id: 3,
      type: 'bonus',
      points: 200,
      description: 'Birthday bonus points',
      date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 weeks ago
      icon: Sparkles
    },
    {
      id: 4,
      type: 'earned',
      points: 75,
      description: 'Purchase at Garden City store',
      date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 weeks ago
      icon: TrendingUp
    }
  ]
  
  // Available rewards
  const availableRewards = [
    {
      id: 1,
      name: '10% Off Electronics',
      points: 500,
      description: 'Valid for 30 days on any electronics purchase',
      category: 'discount',
      available: userData.points >= 500
    },
    {
      id: 2,
      name: 'Free Delivery Voucher',
      points: 200,
      description: 'Free delivery on your next order',
      category: 'service',
      available: userData.points >= 200
    },
    {
      id: 3,
      name: 'KES 1,000 Store Credit',
      points: 2000,
      description: 'Store credit valid for 6 months',
      category: 'credit',
      available: userData.points >= 2000
    },
    {
      id: 4,
      name: 'Exclusive Product Access',
      points: 1500,
      description: 'Early access to new product launches',
      category: 'access',
      available: userData.points >= 1500
    }
  ]

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Award },
    { id: 'rewards', name: 'Rewards', icon: Gift },
    { id: 'activity', name: 'Activity', icon: Clock },
    { id: 'benefits', name: 'Benefits', icon: Crown }
  ]

  // Toast notification system
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({message, visible: true, type})
    setTimeout(() => setToast({message: '', visible: false, type: 'success'}), 3000)
  }

  // Reward redemption functionality
  const handleRedeemReward = async (rewardId: number, pointsCost: number) => {
    if (userPoints < pointsCost) {
      showToast('Not enough points to redeem this reward', 'error')
      return
    }

    setIsRedeeming(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Deduct points
      const newPoints = userPoints - pointsCost
      setUserPoints(newPoints)
      
      // Save to localStorage
      const rewardData = {
        id: `REWARD-${Date.now()}`,
        rewardId,
        pointsUsed: pointsCost,
        redeemedAt: new Date().toISOString(),
        status: 'active'
      }
      
      const existingRewards = JSON.parse(localStorage.getItem('panda_redeemed_rewards') || '[]')
      existingRewards.push(rewardData)
      localStorage.setItem('panda_redeemed_rewards', JSON.stringify(existingRewards))
      localStorage.setItem('panda_user_points', String(newPoints))
      
      showToast('Reward redeemed successfully!', 'success')
    } catch (error) {
      showToast('Failed to redeem reward. Please try again.', 'error')
    } finally {
      setIsRedeeming(false)
    }
  }

  // Load user points from localStorage on mount
  useEffect(() => {
    const savedPoints = localStorage.getItem('panda_user_points')
    if (savedPoints) {
      setUserPoints(parseInt(savedPoints))
    }
  }, [])

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Tier Progress */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold">{userData.tier} Member</h3>
                  <p className="text-white/90">Since {new Date(userData.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{userData.points.toLocaleString()}</div>
                  <div className="text-white/90">Points</div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress to {userData.nextTier}</span>
                  <span>{userData.pointsToNextTier - userData.points} points to go</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3">
                  <div 
                    className="bg-white rounded-full h-3 transition-all duration-500"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <button 
                onClick={() => setShowQRCode(!showQRCode)}
                className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <QrCode className="w-5 h-5 mr-2" />
                Show QR Code
              </button>
            </div>

            {/* QR Code Modal */}
            {showQRCode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-6 text-center border border-gray-200"
              >
                <h4 className="text-xl font-bold text-gray-900 mb-4">Your Panda ID QR Code</h4>
                <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <QrCode className="w-24 h-24 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">Show this QR code at any Panda Mart store to earn points</p>
                <button 
                  onClick={() => setShowQRCode(false)}
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  Close
                </button>
              </motion.div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-gray-600 text-sm">Store Visits</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-gray-600 text-sm">Rewards Earned</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">KES 45K</div>
                <div className="text-gray-600 text-sm">Total Spent</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">6</div>
                <div className="text-gray-600 text-sm">Months Active</div>
              </div>
            </div>
          </div>
        )
      
      case 'rewards':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Available Rewards</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {availableRewards.map((reward) => (
                  <div 
                    key={reward.id}
                    className={`border rounded-xl p-4 transition-all ${
                      reward.available 
                        ? 'border-green-200 bg-green-50 hover:shadow-md' 
                        : 'border-gray-200 bg-gray-50 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900">{reward.name}</h4>
                      <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        reward.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {reward.points} pts
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
                    <button 
                      onClick={() => handleRedeemReward(reward.id, reward.points)}
                      disabled={!reward.available || isRedeeming}
                      className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                        reward.available && !isRedeeming
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {isRedeeming ? 'Redeeming...' : reward.available ? 'Redeem Now' : 'Not Enough Points'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'activity':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-4 ${
                        activity.type === 'earned' ? 'bg-green-100 text-green-600' :
                        activity.type === 'redeemed' ? 'bg-red-100 text-red-600' :
                        'bg-blue-100 text-blue-600'
                      }`}>
                        <activity.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{activity.description}</div>
                        <div className="text-sm text-gray-500">{new Date(activity.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className={`font-bold ${
                      activity.points > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {activity.points > 0 ? '+' : ''}{activity.points} pts
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      
      case 'benefits':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Your {userData.tier} Benefits</h3>
              <div className="space-y-3">
                {currentBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                    <div className="p-2 bg-green-100 rounded-full mr-4">
                      <benefit.icon className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{benefit.label}</div>
                    </div>
                    <Check className="w-5 h-5 text-green-600" />
                  </div>
                ))}
              </div>
            </div>

            {/* Next Tier Preview */}
            {userData.nextTier && (
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4">Unlock {userData.nextTier} Benefits</h3>
                <p className="text-white/90 mb-4">
                  Just {userData.pointsToNextTier - userData.points} more points to unlock exclusive {userData.nextTier} benefits!
                </p>
                <div className="space-y-2">
                  {tierBenefits[userData.nextTier as keyof typeof tierBenefits]?.slice(0, 3).map((benefit, index) => (
                    <div key={index} className="flex items-center text-white/90">
                      <benefit.icon className="w-4 h-4 mr-3" />
                      <span className="text-sm">{benefit.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      
      default:
        return null
    }
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Panda Loyalty Program</h2>
          <p className="text-gray-600">Earn points, unlock rewards, and enjoy exclusive benefits</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-1">
        <div className="flex space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  )
}

export default LoyaltySection