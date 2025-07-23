'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ShoppingCart, Gift, Percent, Tag, Info, 
  CheckCircle, AlertCircle, X, Sparkles,
  Clock, Truck, Shield, Star
} from 'lucide-react'

interface OrderSummaryProps {
  items: any[]
  subtotal: number
  deliveryFee: number
  couponDiscount: number
  total: number
  appliedCoupon: any
  onRemoveCoupon: () => void
  estimatedDelivery?: string
  loyaltyPoints?: number
}

const OrderSummary = ({
  items,
  subtotal,
  deliveryFee,
  couponDiscount,
  total,
  appliedCoupon,
  onRemoveCoupon,
  estimatedDelivery,
  loyaltyPoints = 0
}: OrderSummaryProps) => {
  const [showDetails, setShowDetails] = useState(false)
  
  const pointsToEarn = Math.floor(total / 100) // 1 point per KES 100

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {/* Order Items Preview */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 pb-4 border-b border-gray-200"
        >
          <div className="space-y-3">
            {items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <ShoppingCart className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  KES {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
            {items.length > 3 && (
              <p className="text-sm text-gray-500 text-center">
                +{items.length - 3} more items
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3 mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal ({items.length} items)</span>
          <span className="font-medium">KES {subtotal.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery</span>
          <span className="font-medium">
            {deliveryFee === 0 ? (
              <span className="text-green-600">Free</span>
            ) : (
              `KES ${deliveryFee.toLocaleString()}`
            )}
          </span>
        </div>
        
        {couponDiscount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Coupon Discount</span>
            <span>-KES {couponDiscount.toLocaleString()}</span>
          </div>
        )}
      </div>

      {/* Applied Coupon */}
      {appliedCoupon && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Tag className="w-4 h-4 text-green-600 mr-2" />
              <div>
                <span className="text-green-800 font-medium">{appliedCoupon.code}</span>
                <p className="text-sm text-green-600">{appliedCoupon.description}</p>
              </div>
            </div>
            <button
              onClick={onRemoveCoupon}
              className="text-green-600 hover:text-green-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-blue-600">KES {total.toLocaleString()}</span>
        </div>
      </div>

      {/* Loyalty Points */}
      {pointsToEarn > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <Sparkles className="w-4 h-4 text-yellow-600 mr-2" />
            <div>
              <span className="text-yellow-800 font-medium">Earn {pointsToEarn} Points</span>
              <p className="text-sm text-yellow-600">With this purchase</p>
            </div>
          </div>
        </div>
      )}

      {/* Estimated Delivery */}
      {estimatedDelivery && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <Truck className="w-4 h-4 text-blue-600 mr-2" />
            <div>
              <span className="text-blue-800 font-medium">Estimated Delivery</span>
              <p className="text-sm text-blue-600">{estimatedDelivery}</p>
            </div>
          </div>
        </div>
      )}

      {/* Security Badge */}
      <div className="flex items-center justify-center text-sm text-gray-500 mt-6">
        <Shield className="w-4 h-4 mr-2" />
        <span>Secure checkout powered by Panda Mart</span>
      </div>

      {/* Trust Indicators */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
          <div className="flex items-center">
            <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center">
            <Shield className="w-3 h-3 mr-1 text-blue-500" />
            <span>Secure Payment</span>
          </div>
          <div className="flex items-center">
            <Star className="w-3 h-3 mr-1 text-yellow-500" />
            <span>Trusted Store</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary