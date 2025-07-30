'use client'

import { useState } from 'react'
import { Package, Truck, CheckCircle, Clock, X, Eye, Star } from 'lucide-react'

interface Order {
  id: string
  date: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: number
  store: string
}

interface OrdersSectionProps {
  orders: Order[]
}

const OrdersSection = ({ orders }: OrdersSectionProps) => {
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'processing':
        return <Package className="w-5 h-5 text-blue-500" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-purple-500" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'cancelled':
        return <X className="w-5 h-5 text-red-500" />
      default:
        return <Package className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      case 'processing':
        return 'text-blue-600 bg-blue-50'
      case 'shipped':
        return 'text-purple-600 bg-purple-50'
      case 'delivered':
        return 'text-green-600 bg-green-50'
      case 'cancelled':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus)

  return (
    <div>
      <h2 className="text-2xl font-bold text-panda-black-900 mb-6">My Orders</h2>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedStatus(option.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedStatus === option.value
                ? 'bg-panda-red-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No orders found</h3>
          <p className="text-gray-500 mb-6">
            {selectedStatus === 'all' 
              ? "You haven't placed any orders yet" 
              : `No ${selectedStatus} orders found`
            }
          </p>
          <button className="btn-primary">Start Shopping</button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <h3 className="font-semibold text-panda-black-900">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString()} • {order.store}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-panda-black-900">
                    KES {order.total.toLocaleString()}
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {order.items} item{order.items !== 1 ? 's' : ''}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center space-x-1 text-panda-red-500 hover:text-panda-red-600 text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View Details</span>
                  </button>
                  {order.status === 'delivered' && (
                    <button className="flex items-center space-x-1 text-panda-red-500 hover:text-panda-red-600 text-sm">
                      <Star className="w-4 h-4" />
                      <span>Rate Order</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Order Progress */}
              {order.status !== 'cancelled' && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className={order.status === 'pending' || order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'text-panda-red-500' : ''}>
                      Order Placed
                    </span>
                    <span className={order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? 'text-panda-red-500' : ''}>
                      Processing
                    </span>
                    <span className={order.status === 'shipped' || order.status === 'delivered' ? 'text-panda-red-500' : ''}>
                      Shipped
                    </span>
                    <span className={order.status === 'delivered' ? 'text-panda-red-500' : ''}>
                      Delivered
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-panda-red-500 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: 
                          order.status === 'pending' ? '25%' :
                          order.status === 'processing' ? '50%' :
                          order.status === 'shipped' ? '75%' :
                          order.status === 'delivered' ? '100%' : '0%'
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OrdersSection