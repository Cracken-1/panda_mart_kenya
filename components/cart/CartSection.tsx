'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, Plus, Minus, Trash2, Heart, 
  ArrowRight, Tag, Percent, Gift, MapPin,
  Clock, CreditCard, Smartphone, AlertCircle,
  CheckCircle, X, Star, Info
} from 'lucide-react'

interface CartItem {
  id: number
  name: string
  price: number
  originalPrice?: number
  quantity: number
  image?: string
  category: string
  inStock: boolean
  maxQuantity: number
  discount?: number
  addedAt: string
}

interface CartSectionProps {
  onCheckout?: () => void
  onClose?: () => void
}

const CartSection = ({ onCheckout, onClose }: CartSectionProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [toast, setToast] = useState<{message: string, visible: boolean, type: 'success' | 'error'}>({message: '', visible: false, type: 'success'})
  const [selectedStore, setSelectedStore] = useState('garden-city')

  // Load cart items from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('panda_cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        // Convert saved cart items to full cart items with defaults
        const fullCartItems = parsedCart.map((item: any) => ({
          id: item.id || Date.now() + Math.random(),
          name: item.name || 'Unknown Item',
          price: item.price || 0,
          originalPrice: item.originalPrice,
          quantity: item.quantity || 1,
          image: item.image,
          category: item.category || 'General',
          inStock: item.inStock !== false,
          maxQuantity: item.maxQuantity || 10,
          discount: item.discount,
          addedAt: item.addedAt || new Date().toISOString()
        }))
        setCartItems(fullCartItems)
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('panda_cart', JSON.stringify(cartItems))
  }, [cartItems])

  // Toast notification system
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({message, visible: true, type})
    setTimeout(() => setToast({message: '', visible: false, type: 'success'}), 3000)
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discount = appliedCoupon ? (subtotal * (appliedCoupon.discount / 100)) : 0
  const deliveryFee = subtotal > 5000 ? 0 : 200 // Free delivery over KES 5000
  const total = subtotal - discount + deliveryFee

  // Update item quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
      return
    }

    setCartItems(items => 
      items.map(item => {
        if (item.id === id) {
          const quantity = Math.min(newQuantity, item.maxQuantity)
          return { ...item, quantity }
        }
        return item
      })
    )
    showToast('Quantity updated', 'success')
  }

  // Remove item from cart
  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id))
    showToast('Item removed from cart', 'success')
  }

  // Move item to wishlist
  const moveToWishlist = async (id: number) => {
    const item = cartItems.find(item => item.id === id)
    if (!item) return

    try {
      // Add to wishlist
      const wishlist = JSON.parse(localStorage.getItem('panda_wishlist') || '[]')
      const wishlistItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        category: item.category,
        inStock: item.inStock,
        addedDate: new Date().toISOString().split('T')[0]
      }
      wishlist.push(wishlistItem)
      localStorage.setItem('panda_wishlist', JSON.stringify(wishlist))

      // Remove from cart
      removeItem(id)
      showToast('Item moved to wishlist', 'success')
    } catch (error) {
      showToast('Failed to move item to wishlist', 'error')
    }
  }

  // Apply coupon
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      showToast('Please enter a coupon code', 'error')
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Check available coupons
      const availableCoupons = JSON.parse(localStorage.getItem('panda_active_coupons') || '[]')
      const coupon = availableCoupons.find((c: any) => c.id === couponCode.toUpperCase())

      if (coupon) {
        // Check minimum spend requirement
        const minSpend = parseInt(coupon.minSpend.replace(/[^\d]/g, '')) || 0
        if (subtotal >= minSpend) {
          const discountPercent = parseInt(coupon.discount.replace('%', '')) || 0
          setAppliedCoupon({ ...coupon, discount: discountPercent })
          showToast(`Coupon applied! ${discountPercent}% discount`, 'success')
        } else {
          showToast(`Minimum spend of ${coupon.minSpend} required`, 'error')
        }
      } else {
        showToast('Invalid coupon code', 'error')
      }
    } catch (error) {
      showToast('Failed to apply coupon', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    showToast('Coupon removed', 'success')
  }

  // Clear entire cart
  const clearCart = () => {
    if (confirm('Are you sure you want to clear your entire cart?')) {
      setCartItems([])
      setAppliedCoupon(null)
      setCouponCode('')
      showToast('Cart cleared', 'success')
    }
  }

  // Proceed to checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showToast('Your cart is empty', 'error')
      return
    }

    // Save checkout data
    const checkoutData = {
      items: cartItems,
      subtotal,
      discount,
      deliveryFee,
      total,
      coupon: appliedCoupon,
      store: selectedStore,
      timestamp: new Date().toISOString()
    }
    localStorage.setItem('panda_checkout_data', JSON.stringify(checkoutData))

    if (onCheckout) {
      onCheckout()
    } else {
      showToast('Proceeding to checkout...', 'success')
    }
  }

  const stores = [
    { id: 'garden-city', name: 'Panda Mart Garden City', address: 'Garden City Mall, Thika Road, Nairobi' },
    { id: 'galleria', name: 'Panda Mart Galleria', address: 'Galleria Shopping Mall, Langata Road, Nairobi' }
  ]

  if (cartItems.length === 0) {
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

        {/* Empty Cart */}
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Add some items to get started with your shopping</p>
          <button
            onClick={onClose}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
          <p className="text-gray-600">{cartItems.length} items in your cart</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={clearCart}
            className="flex items-center px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Cart
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 p-6"
              >
                <div className="flex items-center space-x-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <ShoppingCart className="w-8 h-8 text-gray-400" />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    
                    <div className="flex items-center mt-2">
                      <span className="text-lg font-bold text-gray-900">
                        KES {item.price.toLocaleString()}
                      </span>
                      {item.originalPrice && item.originalPrice > item.price && (
                        <span className="text-sm text-gray-500 line-through ml-2">
                          KES {item.originalPrice.toLocaleString()}
                        </span>
                      )}
                      {item.discount && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium ml-2">
                          -{item.discount}%
                        </span>
                      )}
                    </div>

                    {!item.inStock && (
                      <div className="flex items-center mt-2">
                        <AlertCircle className="w-4 h-4 text-red-500 mr-1" />
                        <span className="text-sm text-red-600">Out of stock</span>
                      </div>
                    )}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 py-2 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 transition-colors"
                        disabled={item.quantity >= item.maxQuantity}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => moveToWishlist(item.id)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        title="Move to wishlist"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          {/* Store Selection */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pickup Store</h3>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {stores.map(store => (
                <option key={store.id} value={store.id}>
                  {store.name} - {store.address}
                </option>
              ))}
            </select>
            <div className="flex items-center mt-3 text-sm text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              Ready for pickup in 2-4 hours
            </div>
          </div>

          {/* Coupon */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Coupon Code</h3>
            {appliedCoupon ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-green-800">{appliedCoupon.title}</div>
                    <div className="text-sm text-green-600">{appliedCoupon.discount}% discount applied</div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={applyCoupon}
                  disabled={isLoading}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    isLoading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white`}
                >
                  {isLoading ? 'Applying...' : 'Apply'}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">KES {subtotal.toLocaleString()}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({appliedCoupon?.discount}%)</span>
                  <span>-KES {discount.toLocaleString()}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-medium">
                  {deliveryFee === 0 ? 'FREE' : `KES ${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              
              {subtotal < 5000 && (
                <div className="text-sm text-blue-600 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  Add KES {(5000 - subtotal).toLocaleString()} more for free delivery
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>KES {total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full mt-6 bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              Proceed to Checkout
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>

            <div className="mt-4 text-center">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-1" />
                  Card
                </div>
                <div className="flex items-center">
                  <Smartphone className="w-4 h-4 mr-1" />
                  M-Pesa
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  Cash
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartSection