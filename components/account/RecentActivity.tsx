'use client'

import { motion } from 'framer-motion'
import { Clock, Gift, ShoppingBag, Star, MapPin, CreditCard, ChevronRight } from 'lucide-react'

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'points_earned',
      title: 'Points Earned',
      description: 'Purchase at Westgate Mall',
      amount: '+50 points',
      time: '2 hours ago',
      icon: Star,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      id: 2,
      type: 'coupon_used',
      title: 'Coupon Redeemed',
      description: '10% off Electronics',
      amount: 'KES 450 saved',
      time: '1 day ago',
      icon: Gift,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      type: 'order_placed',
      title: 'Order Placed',
      description: 'Home & Kitchen items',
      amount: 'KES 2,340',
      time: '3 days ago',
      icon: ShoppingBag,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 4,
      type: 'store_visit',
      title: 'Store Check-in',
      description: 'Sarit Centre branch',
      amount: '+10 points',
      time: '1 week ago',
      icon: MapPin,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      id: 5,
      type: 'coupon_received',
      title: 'New Coupon',
      description: '15% off Beauty Products',
      amount: 'Expires in 7 days',
      time: '1 week ago',
      icon: CreditCard,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-6 md:px-6 md:py-8">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-gray-900">Recent Activity</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-sm md:text-base text-blue-600 font-medium flex items-center hover:text-blue-700 transition-colors"
          >
            View All
            <ChevronRight className="w-4 h-4 ml-1" />
          </motion.button>
        </div>
        
        <div className="space-y-3 md:space-y-4">
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.01, x: 4 }}
              className="flex items-center p-3 md:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 cursor-pointer group hover:shadow-sm"
            >
              <div className={`${activity.bgColor} p-2 md:p-3 rounded-full mr-3 md:mr-4 group-hover:scale-110 transition-transform`}>
                <activity.icon className={`w-5 h-5 md:w-6 md:h-6 ${activity.color}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1 md:mb-2">
                  <p className="text-sm md:text-base font-semibold text-gray-900 truncate">
                    {activity.title}
                  </p>
                  <span className="text-xs md:text-sm text-gray-500 flex items-center flex-shrink-0 ml-2">
                    <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                    {activity.time}
                  </span>
                </div>
                
                <p className="text-sm md:text-base text-gray-600 truncate mb-1 md:mb-2">
                  {activity.description}
                </p>
                
                <p className={`text-sm md:text-base font-medium ${activity.color}`}>
                  {activity.amount}
                </p>
              </div>
              
              <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 ml-2 group-hover:text-gray-600 transition-colors" />
            </motion.div>
          ))}
        </div>
        
        {/* Load More Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full mt-4 md:mt-6 py-3 md:py-4 text-center text-gray-600 text-sm md:text-base font-medium bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 hover:border-gray-300"
        >
          Load More Activities
        </motion.button>
      </div>
    </div>
  )
}

export default RecentActivity