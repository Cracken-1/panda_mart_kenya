'use client'

import { motion } from 'framer-motion'
import { Gift, TrendingUp, Calendar, Star, ArrowRight, Zap } from 'lucide-react'

interface UserProfile {
  points: number
  tier: string
  tierProgress: number
  pointsToNextTier: number
}

interface PandaPointsCardProps {
  userProfile: UserProfile
}

const PandaPointsCard = ({ userProfile }: PandaPointsCardProps) => {
  const pointsHistory = [
    { date: '2024-01-15', action: 'Store Purchase', points: '+50', store: 'Westgate Mall', amount: 'KES 5,000' },
    { date: '2024-01-12', action: 'Challenge Completed', points: '+100', store: 'Home Makeover Contest', amount: 'Bonus' },
    { date: '2024-01-10', action: 'Referral Bonus', points: '+25', store: 'Friend Signup', amount: 'Sarah K.' },
    { date: '2024-01-08', action: 'Store Purchase', points: '+75', store: 'Garden City', amount: 'KES 7,500' },
    { date: '2024-01-05', action: 'Review Bonus', points: '+10', store: 'Product Review', amount: 'Smart TV' },
    { date: '2024-01-03', action: 'Birthday Bonus', points: '+50', store: 'Special Gift', amount: 'Happy Birthday!' }
  ]

  const rewardOptions = [
    { points: 500, reward: 'KES 50 Off Coupon', category: 'General', popular: false },
    { points: 1000, reward: 'KES 100 Off Electronics', category: 'Electronics', popular: true },
    { points: 750, reward: 'Free Delivery', category: 'Shipping', popular: false },
    { points: 1500, reward: 'KES 200 Off Furniture', category: 'Furniture', popular: true },
    { points: 2000, reward: 'VIP Shopping Hour', category: 'Experience', popular: false },
    { points: 300, reward: '5% Off Next Purchase', category: 'General', popular: false }
  ]

  const tierBenefits = {
    Bronze: ['1 point per KES 100', 'Birthday bonus', 'Member-only deals'],
    Silver: ['1.25 points per KES 100', 'Free delivery on orders >KES 5,000', 'Early sale access'],
    Gold: ['1.5 points per KES 100', 'Free delivery on orders >KES 3,000', 'Priority customer service', 'Exclusive events'],
    Platinum: ['2 points per KES 100', 'Free delivery on all orders', 'Personal shopping assistant', 'VIP lounge access']
  }

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center mr-4">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-panda-black-900">Panda Points</h2>
              <p className="text-gray-600">Your loyalty rewards balance</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-panda-red-500">{userProfile.points.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Available Points</div>
          </div>
        </div>

        {/* Earning Rate */}
        <div className="bg-gradient-to-r from-panda-red-50 to-yellow-50 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="w-6 h-6 text-panda-red-500 mr-3" />
              <div>
                <div className="font-semibold text-panda-black-900">Current Earning Rate</div>
                <div className="text-sm text-gray-600">As a {userProfile.tier} member</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-panda-red-500">
                {userProfile.tier === 'Bronze' ? '1' : userProfile.tier === 'Silver' ? '1.25' : userProfile.tier === 'Gold' ? '1.5' : '2'} pts
              </div>
              <div className="text-sm text-gray-500">per KES 100</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center p-4 bg-panda-red-500 text-white rounded-xl hover:bg-panda-red-600 transition-colors">
            <Gift className="w-5 h-5 mr-2" />
            Redeem Points
          </button>
          <button className="flex items-center justify-center p-4 border-2 border-panda-red-500 text-panda-red-500 rounded-xl hover:bg-panda-red-50 transition-colors">
            <TrendingUp className="w-5 h-5 mr-2" />
            Earn More
          </button>
        </div>
      </div>

      {/* Redeem Points */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-panda-black-900 mb-4">Redeem Your Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewardOptions.map((option, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative p-4 border-2 rounded-xl transition-all hover:shadow-lg ${
                userProfile.points >= option.points
                  ? 'border-panda-red-500 hover:border-panda-red-600'
                  : 'border-gray-200 opacity-60'
              }`}
            >
              {option.popular && (
                <div className="absolute -top-2 left-4 bg-panda-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Popular
                </div>
              )}
              
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-panda-black-900">{option.reward}</div>
                <div className="text-sm bg-gray-100 px-2 py-1 rounded">{option.category}</div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-panda-red-500">{option.points} pts</div>
                <button
                  disabled={userProfile.points < option.points}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    userProfile.points >= option.points
                      ? 'bg-panda-red-500 text-white hover:bg-panda-red-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Redeem
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Points History */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-panda-black-900">Points History</h3>
          <button className="text-panda-red-500 font-semibold flex items-center">
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
        
        <div className="space-y-4">
          {pointsHistory.map((transaction, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                  transaction.points.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {transaction.points.startsWith('+') ? <TrendingUp className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-semibold text-panda-black-900">{transaction.action}</div>
                  <div className="text-sm text-gray-600">{transaction.store} • {transaction.amount}</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${
                  transaction.points.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.points}
                </div>
                <div className="text-xs text-gray-500">{transaction.date}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Tier Benefits */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-panda-black-900 mb-4">Tier Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(tierBenefits).map(([tier, benefits], index) => (
            <div
              key={tier}
              className={`p-4 rounded-xl border-2 ${
                userProfile.tier === tier
                  ? 'border-panda-red-500 bg-panda-red-50'
                  : 'border-gray-200'
              }`}
            >
              <div className="flex items-center mb-3">
                <Star className={`w-5 h-5 mr-2 ${
                  userProfile.tier === tier ? 'text-panda-red-500' : 'text-gray-400'
                }`} />
                <span className={`font-bold ${
                  userProfile.tier === tier ? 'text-panda-red-500' : 'text-gray-700'
                }`}>
                  {tier}
                </span>
                {userProfile.tier === tier && (
                  <span className="ml-2 bg-panda-red-500 text-white px-2 py-1 rounded-full text-xs">
                    Current
                  </span>
                )}
              </div>
              <ul className="space-y-2">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start">
                    <div className="w-1.5 h-1.5 bg-panda-red-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PandaPointsCard