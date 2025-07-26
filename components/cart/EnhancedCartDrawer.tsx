'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, ShoppingBag, Trash2, Tag, Percent, AlertCircle, Gift } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'

const EnhancedCartDrawer = () => {
  const {
    items,
    isOpen,
    totalItems,
    totalPrice,
    appliedCoupon,
    couponDiscount,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    getTotalWithDiscount
  } = useCartStore()

  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')

  const handleApplyCoupon = () => {
    setCouponError('')
    const success = applyCoupon(couponCode)
    if (success) {
      setCouponCode('')
    } else {
      setCouponError('Invalid coupon code')
    }
  }

  const handleCheckout = () => {
    const authToken = localStorage.getItem('auth-token')
    if (!authToken) {
      window.location.href = '/?redirect=/checkout'
    } else {
      window.location.href = '/checkout'
    }
  }

  const subtotal = totalPrice
  const discount = subtotal * (couponDiscount / 100)
  const total = getTotalWithDiscount()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeCart}
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center">
                <ShoppingBag className="w-6 h-6 text-panda-red-500 mr-3" />
                <h2 className="text-xl font-bold text-panda-black-900">
                  Shopping Cart ({totalItems})
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="text-gray-500 hover:text-panda-red-500 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Add some products to get started
                  </p>
                  <button
                    onClick={closeCart}
                    className="btn-primary"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-panda-black-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-500">{item.store}</p>
                        <div className="flex items-center mt-1">
                          <span className="font-bold text-panda-red-500">
                            KES {item.price.toLocaleString()}
                          </span>
                          {item.originalPrice && (
                            <span className="text-xs text-gray-500 line-through ml-2">
                              KES {item.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxQuantity}
                          className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </motion.div>
                  ))}

                  {items.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="w-full text-center text-sm text-gray-500 hover:text-red-500 transition-colors py-2"
                    >
                      Clear all items
                    </button>
                  )}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 text-panda-red-500 mr-2" />
                    <span className="text-sm font-semibold">Have a coupon?</span>
                  </div>
                  
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                      <div className="flex items-center">
                        <Percent className="w-4 h-4 text-green-600 mr-2" />
                        <span className="text-sm font-semibold text-green-800">
                          {appliedCoupon} ({couponDiscount}% off)
                        </span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Enter coupon code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent text-sm"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={!couponCode.trim()}
                        className="px-4 py-2 bg-panda-red-500 text-white rounded-lg hover:bg-panda-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                  
                  {couponError && (
                    <div className="flex items-center text-red-500 text-sm">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {couponError}
                    </div>
                  )}
                </div>

                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>KES {subtotal.toLocaleString()}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({couponDiscount}%):</span>
                      <span>-KES {discount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between text-lg font-bold text-panda-black-900 pt-2 border-t">
                    <span>Total:</span>
                    <span>KES {total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <Gift className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </button>

                <button
                  onClick={closeCart}
                  className="w-full text-center text-panda-red-500 hover:text-panda-red-600 font-semibold py-2 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default EnhancedCartDrawer