'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { AccountLayout } from './AccountLayout';
import Link from 'next/link';
import { 
  ShoppingBagIcon, 
  HeartIcon, 
  MapPinIcon, 
  CreditCardIcon,
  TruckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export function AccountDashboard() {
  const { user } = useAuth();

  const quickActions = [
    {
      name: 'View Orders',
      description: 'Track your recent purchases',
      href: '/account/orders',
      icon: ShoppingBagIcon,
      color: 'bg-blue-500',
    },
    {
      name: 'Manage Wishlist',
      description: 'Items you want to buy later',
      href: '/account/wishlist',
      icon: HeartIcon,
      color: 'bg-red-500',
    },
    {
      name: 'Update Addresses',
      description: 'Manage shipping addresses',
      href: '/account/addresses',
      icon: MapPinIcon,
      color: 'bg-green-500',
    },
    {
      name: 'Payment Methods',
      description: 'Manage your payment options',
      href: '/account/settings',
      icon: CreditCardIcon,
      color: 'bg-purple-500',
    },
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: '$89.99',
      items: 3,
    },
    {
      id: 'ORD-002',
      date: '2024-01-10',
      status: 'In Transit',
      total: '$156.50',
      items: 2,
    },
  ];

  return (
    <AccountLayout 
      title="Account Dashboard" 
      description={`Welcome back, ${user?.user_metadata?.full_name || user?.email}!`}
    >
      <div className="space-y-8">
        {/* Account Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="flex items-center">
              <ShoppingBagIcon className="h-8 w-8" />
              <div className="ml-4">
                <p className="text-blue-100">Total Orders</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="flex items-center">
              <HeartIcon className="h-8 w-8" />
              <div className="ml-4">
                <p className="text-green-100">Wishlist Items</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="flex items-center">
              <CreditCardIcon className="h-8 w-8" />
              <div className="ml-4">
                <p className="text-purple-100">Total Spent</p>
                <p className="text-2xl font-bold">$1,247</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.name}
                  href={action.href}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-center">
                    <div className={`${action.color} p-2 rounded-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{action.name}</p>
                      <p className="text-xs text-gray-500">{action.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link 
              href="/account/orders" 
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              View all orders
            </Link>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {order.status === 'Delivered' ? (
                          <CheckCircleIcon className="h-8 w-8 text-green-500" />
                        ) : (
                          <TruckIcon className="h-8 w-8 text-blue-500" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Order {order.id}</p>
                        <p className="text-sm text-gray-500">{order.date} • {order.items} items</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{order.total}</p>
                      <p className={`text-xs ${
                        order.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
                <p className="mt-1 text-sm text-gray-500">Start shopping to see your orders here.</p>
                <div className="mt-6">
                  <Link
                    href="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Start Shopping
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AccountLayout>
  );
}