'use client'

import { useState } from 'react'
import { Gift, Star, Trophy, Target, Clock, ArrowRight, Zap, Award, TrendingUp } from 'lucide-react'

interface PointsTransaction {
  id: string
  type: 'earned' | 'redeemed'
  points: number
  description: string
  date: string
  orderId?: string
}

interface Reward {
  id: string
  name: string
  pointsCost: number
  description: string
  image: string
  category: 'discount' | 'product' | 'experience'
  available: boolean
  expiryDate?: string
}

const PointsSection = () => {
  const [activeTab, setActiveTab] = useState('overview')
  
  // Mock user points data
  const userPoints = {
    current: 2450,
    tier: 'Gold',
    nextTier: 'Platinum',
    pointsToNextTier: 2550,
    lifetimeEarned: 8750,
    thisMonth: 450
  }

  // Mock transactions
  const transactions: PointsTransaction[] = [
    {
      id: '1',
      type: 'earned',
      points: 150,
      description: 'Purchase at Westgate Store',
      date: '2024-01-15',
      orderId: 'ORD-001'
    },
    {
      id: '2',
      type: 'redeemed',
      points: -500,
      description: '10% Discount Coupon',
      date: '2024-01-10'
    },
    {
      id: '3',
      type: 'earned',
      points: 200,
      description: 'Birthday Bonus',
      date: '2024-01-05'
    },
    {
      id: '4',
      type: 'earned',
      points: 75,
      description: 'Product Review',
      date: '2024-01-02'
    }
  ]

  // Mock rewards
  const rewards: Reward[] = [
    {
      id: '1',
      name: '10% Off Next Purchase',
      pointsCost: 500,
      description: 'Get 10% discount on your next purchase',
      image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=200&h=150&fit=crop',
      category: 'discount',
      available: true
    },
    {
      id: '2',
      name: 'Free Coffee Mug',
      pointsCost: 1000,
      description: 'Panda Mart branded ceramic coffee mug',
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?w=200&h=150&fit=crop',
      category: 'product',
      available: true
    },
    {
      id: '3',
      name: '20% Off Electronics',
      pointsCost: 1500,
      description: 'Special discount on electronics category',
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&h=150&fit=crop',
      category: 'discount',
      available: true
    },
    {
      id: '4',
      name: 'VIP Shopping Experience',
      pointsCost: 3000,
      description: 'Personal shopping assistant for 2 hours',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=150&fit=crop',
      category: 'experience',
      available: false,
      expiryDate: '2024-02-28'
    }
  ]

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Bronze': return 'text-amber-600'
      case 'Silver': return 'text-gray-500'
      case 'Gold': return 'text-yellow-500'
      case 'Platinum': return 'text-purple-500'
      default: return 'text-gray-500'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'Bronze': return Award
      case 'Silver': return Star
      case 'Gold': return Trophy
      case 'Platinum': return Target
      default: return Gift
    }
  }

  const redeemReward = (reward: Reward) => {
    if (userPoints.current >= reward.pointsCost && reward.available) {
      alert(`Successfully redeemed: ${reward.name}`)
    } else if (!reward.available) {
      alert('This reward is currently unavailable')
    } else {
      alert('Insufficient points for this reward')
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-panda-black-900 mb-6">Panda Points & Rewards</h2>

      {/* Points Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Current Points */}
        <div className="card p-6 text-center gradient-bg text-white">
          <Gift className="w-12 h-12 mx-auto mb-4 text-white" />
          <div className="text-3xl font-bold mb-2">{userPoints.current.toLocaleString()}</div>
          <div className="text-white/90">Available Points</div>
        </div>

        {/* Current Tier */}
        <div className="card p-6 text-center">
          {(() => {
            const TierIcon = getTierIcon(userPoints.tier)
            return <TierIcon className={`w-12 h-12 mx-auto mb-4 ${getTierColor(userPoints.tier)}`} />
          })()}
          <div className="text-2xl font-bold text-panda-black-900 mb-2">{userPoints.tier}</div>
          <div className="text-gray-600">Current Tier</div>
        </div>

        {/* This Month */}
        <div className="card p-6 text-center">
          <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <div className="text-2xl font-bold text-panda-black-900 mb-2">+{userPoints.thisMonth}</div>
          <div className="text-gray-600">Points This Month</div>
        </div>
      </div>

      {/* Progress to Next Tier */}
      <div className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-panda-black-900">Progress to {userPoints.nextTier}</h3>
          <span className="text-sm text-gray-600">
            {userPoints.pointsToNextTier} points to go
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-panda-red-500 to-panda-red-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(userPoints.current / (userPoints.current + userPoints.pointsToNextTier)) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{userPoints.tier} ({userPoints.current} pts)</span>
          <span>{userPoints.nextTier} ({userPoints.current + userPoints.pointsToNextTier} pts)</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-semibold ${
            activeTab === 'overview'
              ? 'text-panda-red-500 border-b-2 border-panda-red-500'
              : 'text-gray-500 hover:text-panda-red-500'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('rewards')}
          className={`px-6 py-3 font-semibold ${
            activeTab === 'rewards'
              ? 'text-panda-red-500 border-b-2 border-panda-red-500'
              : 'text-gray-500 hover:text-panda-red-500'
          }`}
        >
          Rewards Store
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`px-6 py-3 font-semibold ${
            activeTab === 'history'
              ? 'text-panda-red-500 border-b-2 border-panda-red-500'
              : 'text-gray-500 hover:text-panda-red-500'
          }`}
        >
          History
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* How to Earn Points */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-panda-black-900 mb-4">How to Earn Points</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center p-4 bg-green-50 rounded-lg">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-green-800">Shop & Earn</div>
                  <div className="text-sm text-green-600">1 point per KES 10 spent</div>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-blue-800">Write Reviews</div>
                  <div className="text-sm text-blue-600">50-100 points per review</div>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-purple-50 rounded-lg">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mr-4">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-purple-800">Special Events</div>
                  <div className="text-sm text-purple-600">Bonus points during promotions</div>
                </div>
              </div>
              
              <div className="flex items-center p-4 bg-orange-50 rounded-lg">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center mr-4">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-orange-800">Referrals</div>
                  <div className="text-sm text-orange-600">500 points per friend referred</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-panda-black-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {transactions.slice(0, 3).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                      transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.type === 'earned' ? (
                        <ArrowRight className="w-4 h-4 text-green-600 rotate-180" />
                      ) : (
                        <ArrowRight className="w-4 h-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-panda-black-900">{transaction.description}</div>
                      <div className="text-sm text-gray-500">{transaction.date}</div>
                    </div>
                  </div>
                  <div className={`font-bold ${
                    transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'earned' ? '+' : ''}{transaction.points}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rewards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div key={reward.id} className="card overflow-hidden">
              <img
                src={reward.image}
                alt={reward.name}
                className="w-full h-32 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-panda-black-900">{reward.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    reward.category === 'discount' ? 'bg-green-100 text-green-800' :
                    reward.category === 'product' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {reward.category}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Gift className="w-4 h-4 text-panda-red-500 mr-1" />
                    <span className="font-bold text-panda-red-500">{reward.pointsCost} pts</span>
                  </div>
                  <button
                    onClick={() => redeemReward(reward)}
                    disabled={!reward.available || userPoints.current < reward.pointsCost}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      reward.available && userPoints.current >= reward.pointsCost
                        ? 'bg-panda-red-500 text-white hover:bg-panda-red-600'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {!reward.available ? 'Unavailable' : 
                     userPoints.current < reward.pointsCost ? 'Insufficient Points' : 'Redeem'}
                  </button>
                </div>
                {reward.expiryDate && (
                  <div className="mt-2 text-xs text-orange-600 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    Expires: {reward.expiryDate}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="card p-6">
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                    transaction.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.type === 'earned' ? (
                      <ArrowRight className="w-5 h-5 text-green-600 rotate-180" />
                    ) : (
                      <ArrowRight className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium text-panda-black-900">{transaction.description}</div>
                    <div className="text-sm text-gray-500">{transaction.date}</div>
                    {transaction.orderId && (
                      <div className="text-xs text-blue-600">Order: {transaction.orderId}</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-lg ${
                    transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'earned' ? '+' : ''}{transaction.points}
                  </div>
                  <div className="text-xs text-gray-500">
                    {transaction.type === 'earned' ? 'Earned' : 'Redeemed'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PointsSection