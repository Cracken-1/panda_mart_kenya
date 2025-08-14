'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  Bell,
  X,
  Check,
  Clock,
  Package,
  Heart,
  Star,
  Gift,
  Zap,
  Truck,
  CreditCard,
  ShoppingBag,
  AlertCircle,
  Info,
  CheckCircle,
  Settings,
  Filter,
  MoreVertical,
  Trash2,
  MarkAsUnread,
  Archive
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system' | 'loyalty' | 'delivery' | 'payment';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  actionText?: string;
  metadata?: Record<string, any>;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'important'>('all');
  const [loading, setLoading] = useState(true);

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      type: 'order',
      title: 'Order Delivered',
      message: 'Your order #ORD-2024-001 has been delivered successfully',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      priority: 'high',
      actionUrl: '/account/orders/ORD-2024-001',
      actionText: 'View Order'
    },
    {
      id: '2',
      type: 'promotion',
      title: 'Flash Sale Alert',
      message: 'Electronics flash sale - Up to 70% off! Ends in 2 hours',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      priority: 'urgent',
      actionUrl: '/flash-sale',
      actionText: 'Shop Now'
    },
    {
      id: '3',
      type: 'loyalty',
      title: 'Points Earned',
      message: 'You earned 150 Panda Points from your recent purchase',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      priority: 'medium',
      actionUrl: '/account/loyalty',
      actionText: 'View Points'
    },
    {
      id: '4',
      type: 'delivery',
      title: 'Out for Delivery',
      message: 'Your order #ORD-2024-002 is out for delivery',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      priority: 'medium',
      actionUrl: '/account/orders/ORD-2024-002',
      actionText: 'Track Order'
    },
    {
      id: '5',
      type: 'system',
      title: 'Account Security',
      message: 'New device login detected from Nairobi, Kenya',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      priority: 'high',
      actionUrl: '/account/security',
      actionText: 'Review'
    },
    {
      id: '6',
      type: 'promotion',
      title: 'Birthday Special',
      message: 'Happy Birthday! Enjoy 25% off your next purchase',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      priority: 'medium',
      actionUrl: '/birthday-sale',
      actionText: 'Claim Offer'
    },
    {
      id: '7',
      type: 'payment',
      title: 'Payment Successful',
      message: 'Payment of KSh 45,000 processed successfully',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      priority: 'low',
      actionUrl: '/account/payments',
      actionText: 'View Receipt'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order': return Package;
      case 'promotion': return Zap;
      case 'system': return AlertCircle;
      case 'loyalty': return Star;
      case 'delivery': return Truck;
      case 'payment': return CreditCard;
      default: return Bell;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-300 bg-gray-50';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60));
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread': return !notification.isRead;
      case 'important': return notification.priority === 'high' || notification.priority === 'urgent';
      default: return true;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-16">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount} unread notifications
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Mark all read
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mt-4">
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: 'Unread' },
              { id: 'important', label: 'Important' }
            ].map((filterOption) => (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === filterOption.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => {
                const IconComponent = getNotificationIcon(notification.type);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${
                      !notification.isRead ? 'bg-blue-50/50' : ''
                    } ${getPriorityColor(notification.priority)}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        notification.type === 'order' ? 'bg-blue-100' :
                        notification.type === 'promotion' ? 'bg-red-100' :
                        notification.type === 'system' ? 'bg-orange-100' :
                        notification.type === 'loyalty' ? 'bg-yellow-100' :
                        notification.type === 'delivery' ? 'bg-green-100' :
                        'bg-purple-100'
                      }`}>
                        <IconComponent className={`w-5 h-5 ${
                          notification.type === 'order' ? 'text-blue-600' :
                          notification.type === 'promotion' ? 'text-red-600' :
                          notification.type === 'system' ? 'text-orange-600' :
                          notification.type === 'loyalty' ? 'text-yellow-600' :
                          notification.type === 'delivery' ? 'text-green-600' :
                          'text-purple-600'
                        }`} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(notification.timestamp)}
                              </span>
                              {notification.actionUrl && (
                                <a
                                  href={notification.actionUrl}
                                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  {notification.actionText}
                                </a>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1 ml-4">
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            <div className="relative">
                              <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
              <Settings className="w-4 h-4" />
              Notification Settings
            </button>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}