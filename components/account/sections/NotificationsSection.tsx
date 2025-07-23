'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, Mail, Smartphone, Settings, Volume2, VolumeX,
  Check, X, Clock, Gift, ShoppingCart, AlertCircle,
  Info, Star, Trash2, Filter
} from 'lucide-react'

interface NotificationsSectionProps {
  user?: any
}

const NotificationsSection = ({ user }: NotificationsSectionProps) => {
  const [activeTab, setActiveTab] = useState('all')
  const [notificationSettings, setNotificationSettings] = useState({
    email: {
      orders: true,
      promotions: true,
      newsletter: false,
      security: true,
      community: true
    },
    push: {
      orders: true,
      promotions: false,
      newsletter: false,
      security: true,
      community: false
    },
    sms: {
      orders: true,
      promotions: false,
      newsletter: false,
      security: true,
      community: false
    }
  })

  const [notifications, setNotifications] = useState(() => {
    // Generate realistic timestamps
    const now = new Date()
    const getRecentTimestamp = (hoursAgo: number) => {
      const date = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000))
      return date.toISOString()
    }

    return [
      {
        id: 1,
        type: 'order',
        title: 'Order Shipped',
        message: 'Your order #ORD-2025-001 has been shipped and is on its way to you.',
        timestamp: getRecentTimestamp(2),
        read: false,
        priority: 'high',
        actionUrl: '/account/orders/ORD-2025-001'
      },
      {
        id: 2,
        type: 'promotion',
        title: 'Flash Sale Alert',
        message: '50% off on Electronics! Limited time offer ending in 2 hours.',
        timestamp: getRecentTimestamp(4),
        read: false,
        priority: 'medium',
        actionUrl: '/deals'
      },
      {
        id: 3,
        type: 'loyalty',
        title: 'Points Earned',
        message: 'You earned 150 Panda Points from your recent purchase at Westgate store.',
        timestamp: getRecentTimestamp(24),
        read: true,
        priority: 'low',
        actionUrl: '/account/loyalty'
      },
      {
        id: 4,
        type: 'security',
        title: 'New Login Detected',
        message: 'A new login was detected from Nairobi, Kenya. If this wasn\'t you, please secure your account.',
        timestamp: getRecentTimestamp(36),
        read: true,
        priority: 'high',
        actionUrl: '/account/security'
      },
      {
        id: 5,
        type: 'community',
        title: 'Challenge Winner',
        message: 'Congratulations! You won the Home Makeover Challenge. Check your rewards.',
        timestamp: getRecentTimestamp(72),
        read: true,
        priority: 'medium',
        actionUrl: '/community'
      },
      {
        id: 6,
        type: 'system',
        title: 'Account Verification',
        message: 'Your account has been successfully verified. Welcome to Panda Mart!',
        timestamp: getRecentTimestamp(120),
        read: true,
        priority: 'low',
        actionUrl: '/account'
      }
    ]
  })

  const tabs = [
    { id: 'all', name: 'All', count: notifications.length },
    { id: 'unread', name: 'Unread', count: notifications.filter(n => !n.read).length },
    { id: 'order', name: 'Orders', count: notifications.filter(n => n.type === 'order').length },
    { id: 'promotion', name: 'Promotions', count: notifications.filter(n => n.type === 'promotion').length },
    { id: 'security', name: 'Security', count: notifications.filter(n => n.type === 'security').length }
  ]

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return ShoppingCart
      case 'promotion': return Gift
      case 'loyalty': return Star
      case 'security': return AlertCircle
      case 'community': return Bell
      case 'system': return Info
      default: return Bell
    }
  }

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return 'border-red-200 bg-red-50'
    if (type === 'order') return 'border-blue-200 bg-blue-50'
    if (type === 'promotion') return 'border-green-200 bg-green-50'
    if (type === 'loyalty') return 'border-yellow-200 bg-yellow-50'
    if (type === 'security') return 'border-red-200 bg-red-50'
    return 'border-gray-200 bg-gray-50'
  }

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return true
    if (activeTab === 'unread') return !notification.read
    return notification.type === activeTab
  })

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ))
  }

  const markAsUnread = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: false } : n
    ))
  }

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id))
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updatedNotifications)
    localStorage.setItem('panda_notifications', JSON.stringify(updatedNotifications))
    showToast('All notifications marked as read')
  }

  const saveNotificationPreferences = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Save to localStorage (already done in updateNotificationSetting)
      showToast('Notification preferences saved successfully')
    } catch (error) {
      showToast('Failed to save preferences')
    }
  }

  const updateNotificationSetting = (channel: string, type: string, value: boolean) => {
    const updatedSettings = {
      ...notificationSettings,
      [channel]: {
        ...notificationSettings[channel as keyof typeof notificationSettings],
        [type]: value
      }
    }
    setNotificationSettings(updatedSettings)
    
    // Save to localStorage
    localStorage.setItem('panda_notification_settings', JSON.stringify(updatedSettings))
    
    // Show toast notification
    showToast(`${channel.charAt(0).toUpperCase() + channel.slice(1)} notifications ${value ? 'enabled' : 'disabled'} for ${type}`)
  }

  // Toast notification system
  const [toast, setToast] = useState<{message: string, visible: boolean}>({message: '', visible: false})
  
  const showToast = (message: string) => {
    setToast({message, visible: true})
    setTimeout(() => setToast({message: '', visible: false}), 3000)
  }

  // Load notification settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('panda_notification_settings')
    if (savedSettings) {
      try {
        setNotificationSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error('Error loading notification settings:', error)
      }
    }
  }, [])

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return date.toLocaleDateString()
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toast.visible && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out">
          {toast.message}
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600">Manage your notification preferences and view recent alerts</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={markAllAsRead}
            className="flex items-center px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Check className="w-4 h-4 mr-2" />
            Mark All Read
          </button>
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </button>
        </div>
      </div>

      {/* Notification Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 p-1">
        <div className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.name}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification, index) => {
              const IconComponent = getNotificationIcon(notification.type)
              return (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 hover:bg-gray-50 transition-colors ${
                    !notification.read ? 'border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${getNotificationColor(notification.type, notification.priority)}`}>
                      <IconComponent className="w-5 h-5 text-gray-600" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className={`font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                            {notification.message}
                          </p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-xs text-gray-500">
                              {formatTimestamp(notification.timestamp)}
                            </span>
                            {notification.priority === 'high' && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                                High Priority
                              </span>
                            )}
                            {!notification.read && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          {notification.actionUrl && (
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              View
                            </button>
                          )}
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => notification.read ? markAsUnread(notification.id) : markAsRead(notification.id)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                              title={notification.read ? 'Mark as unread' : 'Mark as read'}
                            >
                              <Check className="w-4 h-4 text-gray-500" />
                            </button>
                            <button
                              onClick={() => deleteNotification(notification.id)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                              title="Delete notification"
                            >
                              <Trash2 className="w-4 h-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
            <p className="text-gray-500">
              {activeTab === 'unread' 
                ? "You're all caught up! No unread notifications."
                : "You don't have any notifications yet."
              }
            </p>
          </div>
        )}
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h3>
        
        <div className="space-y-8">
          {/* Email Notifications */}
          <div>
            <div className="flex items-center mb-4">
              <Mail className="w-5 h-5 text-gray-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">Email Notifications</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
              {Object.entries(notificationSettings.email).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateNotificationSetting('email', key, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div>
            <div className="flex items-center mb-4">
              <Bell className="w-5 h-5 text-gray-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">Push Notifications</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
              {Object.entries(notificationSettings.push).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateNotificationSetting('push', key, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* SMS Notifications */}
          <div>
            <div className="flex items-center mb-4">
              <Smartphone className="w-5 h-5 text-gray-600 mr-3" />
              <h4 className="text-lg font-semibold text-gray-900">SMS Notifications</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
              {Object.entries(notificationSettings.sms).map(([key, value]) => (
                <label key={key} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <span className="text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateNotificationSetting('sms', key, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <button 
            onClick={saveNotificationPreferences}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationsSection