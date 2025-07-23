 'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Gift, ShoppingBag, Trophy, Star, Settings, Check, X } from 'lucide-react'

const NotificationsSection = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'points',
      title: 'Points Earned!',
      message: 'You earned 50 points from your recent purchase at Westgate Mall',
      time: '2 hours ago',
      read: false,
      icon: Gift,
      color: 'text-green-500'
    },
    {
      id: 2,
      type: 'challenge',
      title: 'Challenge Update',
      message: 'Home Makeover Challenge deadline is approaching - 3 days left!',
      time: '5 hours ago',
      read: false,
      icon: Trophy,
      color: 'text-yellow-500'
    },
    {
      id: 3,
      type: 'deal',
      title: 'Flash Sale Alert!',
      message: '30% off on all electronics - Limited time offer ending soon',
      time: '1 day ago',
      read: true,
      icon: ShoppingBag,
      color: 'text-red-500'
    },
    {
      id: 4,
      type: 'review',
      title: 'Review Reminder',
      message: 'How was your Smart TV? Share your experience and earn 10 bonus points',
      time: '2 days ago',
      read: false,
      icon: Star,
      color: 'text-blue-500'
    },
    {
      id: 5,
      type: 'tier',
      title: 'Tier Progress',
      message: 'You\'re 75% of the way to Platinum tier! Keep shopping to unlock exclusive benefits',
      time: '3 days ago',
      read: true,
      icon: Gift,
      color: 'text-purple-500'
    },
    {
      id: 6,
      type: 'coupon',
      title: 'New Coupon Available',
      message: 'Your birthday coupon is ready! Get 20% off your next purchase',
      time: '1 week ago',
      read: true,
      icon: Gift,
      color: 'text-pink-500'
    }
  ])

  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    dealAlerts: true,
    pointsUpdates: true,
    challengeReminders: true,
    reviewRequests: true,
    tierUpdates: true
  })

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Bell className="w-8 h-8 text-panda-red-500 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-panda-black-900">Notifications</h2>
              <p className="text-gray-600">Stay updated with your account activity</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-panda-red-500">{unreadCount}</div>
            <div className="text-sm text-gray-500">Unread</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-3">
          <button
            onClick={markAllAsRead}
            className="flex items-center px-4 py-2 bg-panda-red-500 text-white rounded-lg hover:bg-panda-red-600 transition-colors"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </button>
          <button className="flex items-center px-4 py-2 border-2 border-panda-red-500 text-panda-red-500 rounded-lg hover:bg-panda-red-50 transition-colors">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`card p-4 ${!notification.read ? 'border-l-4 border-panda-red-500 bg-panda-red-50' : ''}`}
          >
            <div className="flex items-start">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
                !notification.read ? 'bg-white' : 'bg-gray-100'
              }`}>
                <notification.icon className={`w-5 h-5 ${notification.color}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className={`font-semibold ${!notification.read ? 'text-panda-black-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h3>
                    <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-500'} mt-1`}>
                      {notification.message}
                    </p>
                    <div className="text-xs text-gray-400 mt-2">
                      {notification.time}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    {!notification.read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 text-panda-red-500 hover:bg-panda-red-100 rounded transition-colors"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Notification Settings */}
      <div className="card p-6">
        <h3 className="text-lg font-bold text-panda-black-900 mb-4">Notification Preferences</h3>
        
        {/* Delivery Methods */}
        <div className="mb-6">
          <h4 className="font-semibold text-panda-black-900 mb-3">How would you like to receive notifications?</h4>
          <div className="space-y-3">
            {[
              { key: 'pushNotifications', label: 'Push Notifications', description: 'Receive notifications in the app' },
              { key: 'emailNotifications', label: 'Email Notifications', description: 'Get updates via email' },
              { key: 'smsNotifications', label: 'SMS Notifications', description: 'Receive text messages for important updates' }
            ].map((option) => (
              <div key={option.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-600">{option.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[option.key as keyof typeof settings]}
                    onChange={(e) => setSettings(prev => ({ ...prev, [option.key]: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-panda-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-panda-red-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Notification Types */}
        <div>
          <h4 className="font-semibold text-panda-black-900 mb-3">What notifications would you like to receive?</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { key: 'dealAlerts', label: 'Deal Alerts', description: 'Flash sales and special offers' },
              { key: 'pointsUpdates', label: 'Points Updates', description: 'When you earn or redeem points' },
              { key: 'challengeReminders', label: 'Challenge Reminders', description: 'Updates on active challenges' },
              { key: 'reviewRequests', label: 'Review Requests', description: 'Reminders to review purchases' },
              { key: 'tierUpdates', label: 'Tier Updates', description: 'Progress towards next membership tier' }
            ].map((option) => (
              <div key={option.key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-xs text-gray-600">{option.description}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[option.key as keyof typeof settings]}
                    onChange={(e) => setSettings(prev => ({ ...prev, [option.key]: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-panda-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-panda-red-500"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <button className="btn-primary">
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationsSection