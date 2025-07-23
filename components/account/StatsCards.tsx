'use client'

import { motion } from 'framer-motion'
import { Star, Gift, ShoppingBag, TrendingUp, Wallet } from 'lucide-react'

interface Stats {
  points: number
  coupons: number
  orders: number
  savings: number
}

interface StatsCardsProps {
  stats: Stats
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      id: 'points',
      title: 'Total Points',
      value: stats.points.toLocaleString(),
      icon: Star,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      change: '+125 this month'
    },
    {
      id: 'coupons',
      title: 'Active Coupons',
      value: stats.coupons.toString(),
      icon: Gift,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '2 expiring soon'
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: stats.orders.toString(),
      icon: ShoppingBag,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+3 this month'
    },
    {
      id: 'savings',
      title: 'Total Savings',
      value: `KES ${stats.savings.toLocaleString()}`,
      icon: Wallet,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+KES 450 this month'
    }
  ]

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-6 md:px-6 md:py-8">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">Your Stats</h3>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full"
          />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className={`${card.bgColor} rounded-2xl p-4 md:p-6 relative overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg group`}
            >
              {/* Background Gradient */}
              <div className={`absolute top-0 right-0 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${card.color} opacity-10 rounded-full transform translate-x-6 -translate-y-6 md:translate-x-8 md:-translate-y-8 group-hover:opacity-20 transition-opacity`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className={`p-2 md:p-3 rounded-lg bg-gradient-to-br ${card.color} shadow-sm group-hover:shadow-md transition-shadow`}>
                    <card.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                  <TrendingUp className={`w-4 h-4 md:w-5 md:h-5 ${card.textColor} opacity-70 group-hover:opacity-100 transition-opacity`} />
                </div>
                
                <div className="mb-2 md:mb-3">
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{card.value}</p>
                  <p className="text-sm md:text-base text-gray-600">{card.title}</p>
                </div>
                
                <p className={`text-xs md:text-sm ${card.textColor} font-medium`}>
                  {card.change}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatsCards