'use client'

import { motion } from 'framer-motion'
import { 
  Star, Gift, ShoppingBag, Wallet, TrendingUp, Clock,
  MapPin, CreditCard, Award, Users, Calendar, Target
} from 'lucide-react'

interface DashboardSectionProps {
  user: any
  stats: any
  onSectionChange: (section: string) => void
}

const DashboardSection = ({ user, stats, onSectionChange }: DashboardSectionProps) => {
  const quickStats = [
    {
      id: 'points',
      title: 'Panda Points',
      value: stats.points.toLocaleString(),
      icon: Star,
      color: 'from-yellow-400 to-yellow-600',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600',
      change: '+125 this month',
      action: () => onSectionChange('loyalty')
    },
    {
      id: 'coupons',
      title: 'Active Coupons',
      value: stats.coupons.toString(),
      icon: Gift,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      change: '2 expiring soon',
      action: () => onSectionChange('coupons')
    },
    {
      id: 'orders',
      title: 'Total Orders',
      value: stats.orders.toString(),
      icon: ShoppingBag,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      change: '+3 this month',
      action: () => onSectionChange('orders')
    },
    {
      id: 'savings',
      title: 'Total Savings',
      value: `KES ${stats.savings.toLocaleString()}`,
      icon: Wallet,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      change: '+KES 450 this month',
      action: () => console.log('View savings details')
    }
  ]

  const recentActivities = [
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
    }
  ]

  const quickActions = [
    {
      id: 'view-orders',
      title: 'View Orders',
      description: 'Track your recent purchases',
      icon: ShoppingBag,
      color: 'bg-blue-500',
      action: () => onSectionChange('orders')
    },
    {
      id: 'redeem-points',
      title: 'Redeem Points',
      description: 'Use your Panda Points',
      icon: Gift,
      color: 'bg-green-500',
      action: () => onSectionChange('coupons')
    },
    {
      id: 'update-profile',
      title: 'Update Profile',
      description: 'Keep your info current',
      icon: Users,
      color: 'bg-purple-500',
      action: () => onSectionChange('profile')
    },
    {
      id: 'find-stores',
      title: 'Find Stores',
      description: 'Locate nearby branches',
      icon: MapPin,
      color: 'bg-red-500',
      action: () => window.open('/stores', '_blank')
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}!</h2>
            <p className="text-blue-100 mb-4">Here's what's happening with your account</p>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{user.points.toLocaleString()}</div>
                <div className="text-sm text-blue-100">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.tier}</div>
                <div className="text-sm text-blue-100">Tier</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.visits}</div>
                <div className="text-sm text-blue-100">Visits</div>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <Award className="w-24 h-24 text-white/20" />
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            onClick={stat.action}
            className={`${stat.bgColor} rounded-2xl p-6 cursor-pointer transition-all duration-200 hover:shadow-lg group`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} shadow-sm group-hover:shadow-md transition-shadow`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className={`w-5 h-5 ${stat.textColor} opacity-70 group-hover:opacity-100 transition-opacity`} />
            </div>
            
            <div className="mb-3">
              <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-base text-gray-600">{stat.title}</p>
            </div>
            
            <p className={`text-sm ${stat.textColor} font-medium`}>
              {stat.change}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Recent Activity</h3>
              <button 
                onClick={() => console.log('View all activities')}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className={`${activity.bgColor} p-3 rounded-full mr-4`}>
                    <activity.icon className={`w-5 h-5 ${activity.color}`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900">{activity.title}</p>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-1">{activity.description}</p>
                    <p className={`font-medium ${activity.color}`}>{activity.amount}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
            
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.action}
                  className="w-full flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <div className={`${action.color} p-3 rounded-full mr-4`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{action.title}</div>
                    <div className="text-sm text-gray-500">{action.description}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardSection