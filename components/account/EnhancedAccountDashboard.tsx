'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';
import { useOrders } from '@/lib/hooks/useOrders';
import { useWishlist } from '@/lib/hooks/useWishlist';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Heart, 
  MapPin, 
  CreditCard,
  Truck,
  CheckCircle,
  Star,
  Clock,
  Package,
  Gift,
  Zap,
  TrendingUp,
  Award,
  Bell,
  Settings,
  Store,
  Calendar,
  BarChart3
} from 'lucide-react';

export default function EnhancedAccountDashboard() {
  const { user } = useAuth();
  const { cart } = useCart();
  const { orders } = useOrders();
  const { items: wishlistItems } = useWishlist();
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    pandaPoints: 2450,
    currentTier: 'Gold',
    nextTierPoints: 550
  });

  useEffect(() => {
    // Calculate user stats
    if (orders.length > 0) {
      const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);
      setStats(prev => ({
        ...prev,
        totalOrders: orders.length,
        totalSpent
      }));
    }
  }, [orders]);

  const quickActions = [
    {
      name: 'Checkout',
      description: `${cart.itemCount} items ready`,
      href: '/account/checkout',
      icon: CheckCircle,
      color: 'bg-emerald-500',
      badge: cart.itemCount > 0 ? cart.itemCount.toString() : null,
      disabled: cart.itemCount === 0
    },
    {
      name: 'Shop in Store',
      description: 'Browse store inventory',
      href: '/shop-in-store',
      icon: Store,
      color: 'bg-teal-500',
      badge: 'New'
    },
    {
      name: 'View Orders',
      description: `${stats.totalOrders} total orders`,
      href: '/account/orders',
      icon: ShoppingBag,
      color: 'bg-blue-500',
    },
    {
      name: 'Wishlist',
      description: `${wishlistItems.length} saved items`,
      href: '/account/wishlist',
      icon: Heart,
      color: 'bg-red-500',
    },
    {
      name: 'Addresses',
      description: 'Manage delivery locations',
      href: '/account/addresses',
      icon: MapPin,
      color: 'bg-green-500',
    },
    {
      name: 'Settings',
      description: 'Account preferences',
      href: '/account/settings',
      icon: Settings,
      color: 'bg-purple-500',
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'order',
      title: 'Order #ORD-2024-001 delivered',
      description: 'iPhone 15 Pro and 2 other items',
      time: '2 hours ago',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'points',
      title: 'Earned 150 Panda Points',
      description: 'From your recent purchase',
      time: '1 day ago',
      icon: Star,
      color: 'text-yellow-600'
    },
    {
      id: 3,
      type: 'wishlist',
      title: 'Added to wishlist',
      description: 'Samsung Galaxy S24 Ultra',
      time: '3 days ago',
      icon: Heart,
      color: 'text-red-600'
    }
  ];

  const recommendations = [
    {
      id: 'flash-sale',
      title: 'Flash Sale Ending Soon',
      description: 'Up to 70% off electronics',
      href: '/flash-sale',
      color: 'bg-gradient-to-r from-red-500 to-orange-500',
      icon: Zap
    },
    {
      id: 'new-arrivals',
      title: 'New Arrivals',
      description: 'Latest products just added',
      href: '/collections/new-arrivals',
      color: 'bg-gradient-to-r from-blue-500 to-purple-500',
      icon: TrendingUp
    },
    {
      id: 'loyalty-program',
      title: 'Loyalty Rewards',
      description: 'Redeem your Panda Points',
      href: '/account/rewards',
      color: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      icon: Award
    }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-2xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-emerald-100 text-lg">
              Ready to discover amazing deals today?
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.pandaPoints}</div>
              <div className="text-emerald-200 text-sm">Panda Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.currentTier}</div>
              <div className="text-emerald-200 text-sm">Tier Status</div>
            </div>
          </div>
        </div>
        
        {/* Progress to next tier */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-emerald-100">Progress to Platinum</span>
            <span className="text-emerald-100">{stats.nextTierPoints} points to go</span>
          </div>
          <div className="w-full bg-emerald-400/30 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${((2450) / (2450 + stats.nextTierPoints)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.totalOrders}</div>
          <div className="text-sm text-gray-600">Total Orders</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">KSh {stats.totalSpent.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Total Spent</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Heart className="w-6 h-6 text-red-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{wishlistItems.length}</div>
          <div className="text-sm text-gray-600">Wishlist Items</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 lg:p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.pandaPoints}</div>
          <div className="text-sm text-gray-600">Panda Points</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.name}
              href={action.disabled ? '#' : action.href}
              className={`relative p-6 rounded-xl border-2 border-transparent hover:border-gray-200 transition-all duration-200 group ${
                action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg'
              }`}
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.name}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
              
              {action.badge && (
                <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                  {action.badge}
                </span>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-gray-500" />
            Recent Activity
          </h3>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Gift className="w-5 h-5 mr-2 text-gray-500" />
            Recommended for You
          </h3>
          
          <div className="space-y-4">
            {recommendations.map((rec) => (
              <Link
                key={rec.id}
                href={rec.href}
                className={`block p-4 ${rec.color} text-white rounded-xl hover:shadow-lg transition-all duration-200 group`}
              >
                <div className="flex items-center gap-3">
                  <rec.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <div>
                    <h4 className="font-semibold">{rec.title}</h4>
                    <p className="text-sm opacity-90">{rec.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Order Status & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Current Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-gray-500" />
            Current Orders
          </h3>
          
          {orders.slice(0, 3).map((order) => (
            <div key={order.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg mb-4 last:mb-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Order #{order.order_number}</h4>
                <p className="text-sm text-gray-600">{order.order_items.length} items</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  KSh {order.total_amount.toLocaleString()}
                </div>
                <Link 
                  href={`/account/orders/${order.id}`}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
          
          {orders.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No orders yet</p>
            </div>
          )}
        </div>

        {/* Notifications & Alerts */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2 text-gray-500" />
            Notifications
          </h3>
          
          <div className="space-y-3">
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Flash Sale Alert</p>
                  <p className="text-xs text-yellow-700">Electronics sale ends in 2 hours</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Gift className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Birthday Bonus</p>
                  <p className="text-xs text-blue-700">Special discount waiting for you</p>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Truck className="w-4 h-4 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Free Delivery</p>
                  <p className="text-xs text-green-700">On orders over KSh 5,000</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Analytics */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-gray-500" />
          Your Shopping Analytics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              KSh {(stats.totalSpent / Math.max(stats.totalOrders, 1)).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Average Order Value</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {Math.round(stats.pandaPoints / 10)}%
            </div>
            <div className="text-sm text-gray-600">Savings This Year</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.currentTier}
            </div>
            <div className="text-sm text-gray-600">Loyalty Tier</div>
          </div>
        </div>
      </div>
    </div>
  );
}