'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, MapPin, Calendar, Star, Eye, RotateCcw, Download } from 'lucide-react'

const OrderHistory = () => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [toast, setToast] = useState<{message: string, visible: boolean, type: 'success' | 'error'}>({message: '', visible: false, type: 'success'})

  // Load orders from localStorage and merge with default data
  useEffect(() => {
    const defaultOrders = [
      {
        id: 'ORD-2024-001',
        date: '2024-01-20',
        store: 'Panda Mart Garden City',
        items: [
          { name: 'Smart LED TV 43"', quantity: 1, price: 35000, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=100&h=100&fit=crop' },
          { name: 'HDMI Cable', quantity: 2, price: 1500, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop' }
        ],
        total: 38000,
        pointsEarned: 380,
        status: 'Completed',
        paymentMethod: 'M-Pesa',
        canReview: true
      },
      {
        id: 'ORD-2024-002',
        date: '2024-01-15',
        store: 'Garden City',
        items: [
          { name: 'Kitchen Cookware Set', quantity: 1, price: 8500, image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop' },
          { name: 'Dining Table Set', quantity: 1, price: 25000, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop' }
        ],
        total: 33500,
        pointsEarned: 335,
        status: 'Completed',
        paymentMethod: 'Cash',
        canReview: false
      },
      {
        id: 'ORD-2024-003',
        date: '2024-01-10',
        store: 'Panda Mart Galleria',
        items: [
          { name: 'Beauty Care Bundle', quantity: 1, price: 4500, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=100&h=100&fit=crop' }
        ],
        total: 4500,
        pointsEarned: 45,
        status: 'Completed',
        paymentMethod: 'Card',
        canReview: true
      }
    ]

    // Load saved orders from localStorage (from payments)
    const savedPayments = JSON.parse(localStorage.getItem('panda_payments') || '[]')
    const savedOrders = savedPayments.map((payment: any) => ({
      id: payment.reference || payment.id,
      date: payment.timestamp?.split('T')[0] || payment.date,
      store: 'Online Order',
      items: [{ name: 'Online Purchase', quantity: 1, price: payment.amount }],
      total: payment.amount,
      pointsEarned: Math.floor(payment.amount / 100),
      status: payment.status === 'completed' ? 'Completed' : 'Processing',
      paymentMethod: payment.method,
      canReview: payment.status === 'completed'
    }))

    // Merge and sort by date
    const allOrders = [...defaultOrders, ...savedOrders].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    
    setOrders(allOrders)
  }, [])

  // Toast notification system
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({message, visible: true, type})
    setTimeout(() => setToast({message: '', visible: false, type: 'success'}), 3000)
  }

  // Reorder functionality
  const handleReorder = async (order: any) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Add items to cart
      const cartItems = JSON.parse(localStorage.getItem('panda_cart') || '[]')
      order.items.forEach((item: any) => {
        cartItems.push({
          id: Date.now() + Math.random(),
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          addedAt: new Date().toISOString()
        })
      })
      localStorage.setItem('panda_cart', JSON.stringify(cartItems))
      
      showToast(`${order.items.length} items added to cart`, 'success')
    } catch (error) {
      showToast('Failed to reorder items', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Download receipt functionality
  const handleDownloadReceipt = async (order: any) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Create receipt content
      const receiptContent = `
PANDA MART RECEIPT
==================
Order ID: ${order.id}
Date: ${order.date}
Store: ${order.store}
Payment: ${order.paymentMethod}

ITEMS:
${order.items.map((item: any) => `${item.name} x${item.quantity} - KES ${item.price.toLocaleString()}`).join('\n')}

TOTAL: KES ${order.total.toLocaleString()}
Points Earned: ${order.pointsEarned}

Thank you for shopping with Panda Mart!
      `
      
      const blob = new Blob([receiptContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `receipt-${order.id}.txt`
      a.click()
      window.URL.revokeObjectURL(url)
      
      showToast('Receipt downloaded successfully', 'success')
    } catch (error) {
      showToast('Failed to download receipt', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Write review functionality
  const handleWriteReview = (order: any) => {
    // For now, just show a toast - in a real app, this would open a review modal
    showToast('Review feature coming soon!', 'success')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-700'
      case 'Processing': return 'bg-yellow-100 text-yellow-700'
      case 'Cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const OrderModal = ({ order, onClose }: any) => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-panda-black-900">Order Details</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <div className="text-sm text-gray-500">Order ID</div>
              <div className="font-semibold">{order.id}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Date</div>
              <div className="font-semibold">{order.date}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Store</div>
              <div className="font-semibold">{order.store}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Status</div>
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h4 className="font-semibold text-lg mb-4">Items Purchased</h4>
            <div className="space-y-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover mr-4"
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{item.name}</div>
                    <div className="text-sm text-gray-600">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-bold text-panda-red-500">
                    KES {item.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span>Total Amount</span>
              <span className="font-bold text-xl text-panda-red-500">
                KES {order.total.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Points Earned</span>
              <span className="font-semibold text-green-600">+{order.pointsEarned} points</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button 
              onClick={() => handleReorder(order)}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed text-white' 
                  : 'bg-panda-red-500 text-white hover:bg-panda-red-600'
              }`}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {isLoading ? 'Adding...' : 'Reorder Items'}
            </button>
            <button 
              onClick={() => handleDownloadReceipt(order)}
              disabled={isLoading}
              className={`px-6 py-3 border-2 border-panda-red-500 text-panda-red-500 rounded-lg font-semibold transition-colors flex items-center ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-panda-red-50'
              }`}
            >
              <Download className="w-4 h-4 mr-2" />
              {isLoading ? 'Downloading...' : 'Receipt'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {toast.message}
        </div>
      )}
      
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <ShoppingBag className="w-8 h-8 text-panda-red-500 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-panda-black-900">Order History</h2>
              <p className="text-gray-600">Track your purchases and reorder favorites</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-panda-red-500">{orders.length}</div>
            <div className="text-sm text-gray-500">Total Orders</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-panda-black-900">
              KES {orders.reduce((sum, order) => sum + order.total, 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Spent</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-panda-black-900">
              {orders.reduce((sum, order) => sum + order.pointsEarned, 0)}
            </div>
            <div className="text-sm text-gray-600">Points Earned</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-panda-black-900">
              {orders.filter(order => order.canReview).length}
            </div>
            <div className="text-sm text-gray-600">Pending Reviews</div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order, index) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg text-panda-black-900">{order.id}</h3>
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {order.date}
                  </span>
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {order.store}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>

            {/* Items Preview */}
            <div className="flex items-center space-x-3 mb-4 overflow-x-auto">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex-shrink-0 flex items-center bg-gray-50 rounded-lg p-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-8 h-8 rounded object-cover mr-2"
                  />
                  <div className="text-sm">
                    <div className="font-medium truncate max-w-32">{item.name}</div>
                    <div className="text-gray-500">Qty: {item.quantity}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                <div>Payment: {order.paymentMethod}</div>
                <div className="text-green-600 font-semibold">+{order.pointsEarned} points earned</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-panda-red-500">
                  KES {order.total.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">{order.items.length} items</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedOrder(order)}
                className="flex items-center px-4 py-2 bg-panda-red-500 text-white rounded-lg hover:bg-panda-red-600 transition-colors"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </button>
              <button 
                onClick={() => handleReorder(order)}
                disabled={isLoading}
                className={`flex items-center px-4 py-2 border-2 border-panda-red-500 text-panda-red-500 rounded-lg transition-colors ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-panda-red-50'
                }`}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {isLoading ? 'Adding...' : 'Reorder'}
              </button>
              {order.canReview && (
                <button 
                  onClick={() => handleWriteReview(order)}
                  className="flex items-center px-4 py-2 border-2 border-yellow-500 text-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Write Review
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Order Modal */}
      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  )
}

export default OrderHistory