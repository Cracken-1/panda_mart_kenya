'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  X, Bell, Mail, MessageSquare, Smartphone, 
  ShoppingBag, Gift, Star, TrendingUp, Save 
} from 'lucide-react'

interface NotificationPreferences {
  notifications: {
    push: boolean
    email: boolean
    sms: boolean
    marketing: boolean
  }
  privacy: {
    profileVisible: boolean
    shareActivity: boolean
  }
}

interface NotificationsModalProps {
  preferences: NotificationPreferences
  onClose: () => void
  onSave: (preferences: NotificationPreferences) => void
}

const NotificationsModal = ({ preferences, onClose, onSave }: NotificationsModalProps) => {
  const [settings, setSettings] = useState(preferences)
  const [isLoading, setIsLoading] = useState(false)

  const notificationTypes = [
    {
      id: 'orders',
      title: 'Order Updates',
      description: 'Get notified about your order status',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      push: true,
      email: true,
      sms: false
    },
    {
      id: 'offers',
      title: 'Special Offers',
      description: 'Receive exclusive deals and promotions',
      icon: Gift,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      push: true,
      email: true,
      sms: true
    },
    {
      id: 'points',
      title: 'Points & Rewards',
      description: 'Updates on your points and tier status',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      push: true,
      email: false,
      sms: false
    },
    {
      id: 'trends',
      title: 'Trending Products',
      description: 'Discover what\'s popular right now',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      push: false,
      email: true,
      sms: false
    }
  ]

  const handleSave = async () => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    onSave(settings)
    setIsLoading(false)
    onClose()
  }

  const toggleNotification = (type: 'push' | 'email' | 'sms' | 'marketing') => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [type]: !settings.notifications[type]
      }
    })
  }

  const togglePrivacy = (type: 'profileVisible' | 'shareActivity') => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [type]: !settings.privacy[type]
      }
    })
  }

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
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* General Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Push Notifications</p>
                    <p className="text-xs text-gray-500">Receive notifications on your device</p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleNotification('push')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.notifications.push ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.notifications.push ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                  />
                </motion.button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                    <p className="text-xs text-gray-500">Receive updates via email</p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleNotification('email')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.notifications.email ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.notifications.email ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                  />
                </motion.button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">SMS Notifications</p>
                    <p className="text-xs text-gray-500">Receive important updates via SMS</p>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleNotification('sms')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.notifications.sms ? 'bg-purple-500' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.notifications.sms ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                  />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Notification Types */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h3>
            
            <div className="space-y-3">
              {notificationTypes.map((type) => (
                <div key={type.id} className={`${type.bgColor} rounded-xl p-4`}>
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-white p-2 rounded-lg">
                      <type.icon className={`w-5 h-5 ${type.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{type.title}</p>
                      <p className="text-xs text-gray-600">{type.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 text-xs">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={type.push}
                        className="rounded border-gray-300"
                        readOnly
                      />
                      <span>Push</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={type.email}
                        className="rounded border-gray-300"
                        readOnly
                      />
                      <span>Email</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={type.sms}
                        className="rounded border-gray-300"
                        readOnly
                      />
                      <span>SMS</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">Profile Visibility</p>
                  <p className="text-xs text-gray-500">Make your profile visible to other users</p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => togglePrivacy('profileVisible')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.privacy.profileVisible ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.privacy.profileVisible ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                  />
                </motion.button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">Share Activity</p>
                  <p className="text-xs text-gray-500">Share your shopping activity with friends</p>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => togglePrivacy('shareActivity')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    settings.privacy.shareActivity ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                >
                  <motion.div
                    animate={{ x: settings.privacy.shareActivity ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm"
                  />
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                Save Preferences
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default NotificationsModal