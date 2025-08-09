'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingCart, CreditCard, MapPin, User, Phone, Mail,
  Truck, Clock, Shield, CheckCircle, AlertCircle, 
  ArrowLeft, ArrowRight, Gift, Percent, Tag, Star,
  Lock, Eye, EyeOff, Smartphone, Banknote, Wallet,
  Plus, Minus, Trash2, Edit, Save, X, Info, Zap
} from 'lucide-react'
import SecurePaymentForm from '../payment/SecurePaymentForm'

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
}

interface Address {
  id: number
  type: 'home' | 'work' | 'other'
  name: string
  street: string
  city: string
  postalCode: string
  phone: string
  isDefault: boolean
}

interface DeliveryOption {
  id: string
  name: string
  description: string
  price: number
  estimatedTime: string
  icon: any
}

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')
  const [toast, setToast] = useState<{message: string, visible: boolean, type: 'success' | 'error' | 'info'}>({message: '', visible: false, type: 'success'})
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    type: 'home',
    name: '',
    street: '',
    city: '',
    postalCode: '',
    phone: ''
  })

  const [addresses] = useState<Address[]>([
    {
      id: 1,
      type: 'home',
      name: 'Home Address',
      street: '123 Nairobi Street, Westlands',
      city: 'Nairobi',
      postalCode: '00100',
      phone: '+254 712 345 678',
      isDefault: true
    },
    {
      id: 2,
      type: 'work',
      name: 'Office Address',
      street: '456 Business District, Upper Hill',
      city: 'Nairobi',
      postalCode: '00200',
      phone: '+254 712 345 678',
      isDefault: false
    }
  ])

  const deliveryOptions: DeliveryOption[] = [
    {
      id: 'standard',
      name: 'Standard Delivery',
      description: 'Delivered within 3-5 business days',
      price: 0,
      estimatedTime: '3-5 days',
      icon: Truck
    },
    {
      id: 'express',
      name: 'Express Delivery',
      description: 'Delivered within 1-2 business days',
      price: 500,
      estimatedTime: '1-2 days',
      icon: Zap
    },
    {
      id: 'same-day',
      name: 'Same Day Delivery',
      description: 'Delivered today before 8 PM',
      price: 1000,
      estimatedTime: 'Today',
      icon: Clock
    }
  ]

  const steps = [
    { id: 1, name: 'Cart Review', icon: ShoppingCart },
    { id: 2, name: 'Delivery', icon: Truck },
    { id: 3, name: 'Payment', icon: CreditCard },
    { id: 4, name: 'Confirmation', icon: CheckCircle }
  ]

  // Load cart items from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('panda_cart')
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        const formattedItems = cartData.map((item: any, index: number) => ({
          id: item.id || index + 1,
          name: item.name || 'Unknown Item',
          price: item.price || 0,
          originalPrice: item.originalPrice,
          quantity: item.quantity || 1,
          image: item.image,
          category: item.category || 'General',
          inStock: item.inStock !== false,
          maxQuantity: item.maxQuantity || 10,
          discount: item.discount
        }))
        setCartItems(formattedItems)
      } catch (error) {
        console.error('Error loading cart:', error)
        showToast('Error loading cart items', 'error')
      }
    }

    // Set default selections
    setSelectedAddress(addresses.find(addr => addr.isDefault) || addresses[0])
    setSelectedDelivery(deliveryOptions[0])
  }, [])

  // Toast notification system
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({message, visible: true, type})
    setTimeout(() => setToast({message: '', visible: false, type: 'success'}), 4000)
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const deliveryFee = selectedDelivery?.price || 0
  const couponDiscount = appliedCoupon ? (subtotal * appliedCoupon.discount / 100) : 0
  const total = subtotal + deliveryFee - couponDiscount

  // Update cart item quantity
  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return
    
    const updatedItems = cartItems.map(item => 
      item.id === itemId 
        ? { ...item, quantity: Math.min(newQuantity, item.maxQuantity) }
        : item
    )
    setCartItems(updatedItems)
    localStorage.setItem('panda_cart', JSON.stringify(updatedItems))
    showToast('Cart updated', 'success')
  }

  // Remove item from cart
  const removeItem = (itemId: number) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId)
    setCartItems(updatedItems)
    localStorage.setItem('panda_cart', JSON.stringify(updatedItems))
    showToast('Item removed from cart', 'success')
  }

  // Apply coupon
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      showToast('Please enter a coupon code', 'error')
      return
    }

    try {
      // Simulate API call to validate coupon
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock coupon validation
      const validCoupons = [
        { code: 'SAVE10', discount: 10, description: '10% off your order' },
        { code: 'WELCOME20', discount: 20, description: '20% off for new customers' },
        { code: 'ELEC15', discount: 15, description: '15% off electronics' }
      ]
      
      const coupon = validCoupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase())
      
      if (coupon) {
        setAppliedCoupon(coupon)
        showToast(`Coupon applied! ${coupon.description}`, 'success')
      } else {
        showToast('Invalid coupon code', 'error')
      }
    } catch (error) {
      showToast('Error applying coupon', 'error')
    }
  }

  // Remove applied coupon
  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode('')
    showToast('Coupon removed', 'info')
  }

  // Handle payment success
  const handlePaymentSuccess = async (paymentData: any) => {
    setIsProcessingPayment(true)
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate order number
      const orderNum = `ORD-${Date.now()}`
      setOrderNumber(orderNum)
      
      // Save order to localStorage
      const orderData = {
        orderNumber: orderNum,
        items: cartItems,
        address: selectedAddress,
        delivery: selectedDelivery,
        payment: paymentData,
        subtotal,
        deliveryFee,
        couponDiscount,
        total,
        orderDate: new Date().toISOString(),
        status: 'confirmed'
      }
      
      const existingOrders = JSON.parse(localStorage.getItem('panda_orders') || '[]')
      existingOrders.push(orderData)
      localStorage.setItem('panda_orders', JSON.stringify(existingOrders))
      
      // Clear cart
      localStorage.removeItem('panda_cart')
      setCartItems([])
      
      // Show success
      setOrderComplete(true)
      setCurrentStep(4)
      showToast('Order placed successfully!', 'success')
      
    } catch (error) {
      showToast('Error processing order', 'error')
    } finally {
      setIsProcessingPayment(false)
    }
  }

  // Handle payment error
  const handlePaymentError = (error: string) => {
    showToast(error, 'error')
  }

  // Add new address
  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.street || !newAddress.city) {
      showToast('Please fill in all required fields', 'error')
      return
    }

    const address: Address = {
      id: Date.now(),
      type: newAddress.type as 'home' | 'work' | 'other',
      name: newAddress.name,
      street: newAddress.street,
      city: newAddress.city,
      postalCode: newAddress.postalCode || '',
      phone: newAddress.phone || '',
      isDefault: false
    }

    // In a real app, this would be saved to backend
    setSelectedAddress(address)
    setShowAddressForm(false)
    setNewAddress({ type: 'home', name: '', street: '', city: '', postalCode: '', phone: '' })
    showToast('Address added successfully', 'success')
  }

  // Navigation functions
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return cartItems.length > 0
      case 2: return selectedAddress && selectedDelivery
      case 3: return true
      default: return false
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out ${
          toast.type === 'success' ? 'bg-green-600 text-white' : 
          toast.type === 'error' ? 'bg-red-600 text-white' : 
          'bg-blue-600 text-white'
        }`}>
          <div className="flex items-center">
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
            {toast.type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
            {toast.type === 'info' && <Info className="w-5 h-5 mr-2" />}
            {toast.message}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your purchase securely</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Cart Review */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Review Your Cart</h2>
                  
                  {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                      <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                      <p className="text-gray-500">Add some items to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <span className="text-gray-400 text-xs">No Image</span>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.category}</p>
                            <div className="flex items-center mt-1">
                              <span className="font-bold text-blue-600">KES {item.price.toLocaleString()}</span>
                              {item.originalPrice && item.originalPrice > item.price && (
                                <span className="text-sm text-gray-500 line-through ml-2">
                                  KES {item.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center border border-gray-300 rounded-lg">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-4 py-2 font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 hover:bg-gray-100 transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Step 2: Delivery */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {/* Delivery Address */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                      <button
                        onClick={() => setShowAddressForm(true)}
                        className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add New
                      </button>
                    </div>

                    {showAddressForm && (
                      <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <h3 className="font-semibold text-gray-900 mb-4">Add New Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address Type</label>
                            <select
                              value={newAddress.type}
                              onChange={(e) => setNewAddress({...newAddress, type: e.target.value as 'home' | 'work' | 'other'})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="home">Home</option>
                              <option value="work">Work</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Address Name</label>
                            <input
                              type="text"
                              value={newAddress.name}
                              onChange={(e) => setNewAddress({...newAddress, name: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="e.g., Home Address"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                            <input
                              type="text"
                              value={newAddress.street}
                              onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Street address"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                              type="text"
                              value={newAddress.city}
                              onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="City"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                            <input
                              type="text"
                              value={newAddress.postalCode}
                              onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                              placeholder="Postal code"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-3 mt-4">
                          <button
                            onClick={handleAddAddress}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Add Address
                          </button>
                          <button
                            onClick={() => setShowAddressForm(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          onClick={() => setSelectedAddress(address)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedAddress?.id === address.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 text-gray-500 mr-2" />
                                <span className="font-semibold text-gray-900">{address.name}</span>
                                {address.isDefault && (
                                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="text-gray-600 mt-1">{address.street}</p>
                              <p className="text-gray-600">{address.city} {address.postalCode}</p>
                              <p className="text-gray-500 text-sm mt-1">{address.phone}</p>
                            </div>
                            {selectedAddress?.id === address.id && (
                              <CheckCircle className="w-5 h-5 text-blue-500" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery Options */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Options</h2>
                    
                    <div className="space-y-3">
                      {deliveryOptions.map((option) => (
                        <div
                          key={option.id}
                          onClick={() => setSelectedDelivery(option)}
                          className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedDelivery?.id === option.id
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="p-2 bg-gray-100 rounded-lg mr-4">
                                <option.icon className="w-5 h-5 text-gray-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">{option.name}</h3>
                                <p className="text-gray-600 text-sm">{option.description}</p>
                                <p className="text-blue-600 text-sm font-medium">
                                  Estimated: {option.estimatedTime}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900">
                                {option.price === 0 ? 'Free' : `KES ${option.price.toLocaleString()}`}
                              </div>
                              {selectedDelivery?.id === option.id && (
                                <CheckCircle className="w-5 h-5 text-blue-500 ml-auto mt-1" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Payment</h2>
                  
                  <SecurePaymentForm
                    amount={total}
                    currency="KES"
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                  />
                </motion.div>
              )}

              {/* Step 4: Confirmation */}
              {currentStep === 4 && orderComplete && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                  <p className="text-gray-600 mb-6">
                    Thank you for your purchase. Your order has been successfully placed.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="text-sm text-gray-500 mb-1">Order Number</div>
                    <div className="text-lg font-bold text-gray-900">{orderNumber}</div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-left">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Delivery Address</h4>
                      <p className="text-gray-600 text-sm">
                        {selectedAddress?.street}<br />
                        {selectedAddress?.city} {selectedAddress?.postalCode}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Delivery Method</h4>
                      <p className="text-gray-600 text-sm">
                        {selectedDelivery?.name}<br />
                        Estimated: {selectedDelivery?.estimatedTime}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={() => window.location.href = '/'}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Track Order
                    </button>
                    <button
                      onClick={() => window.location.href = '/'}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({cartItems.length} items)</span>
                  <span className="font-medium">KES {subtotal.toLocaleString()}</span>
                </div>
                
                {selectedDelivery && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery ({selectedDelivery.name})</span>
                    <span className="font-medium">
                      {deliveryFee === 0 ? 'Free' : `KES ${deliveryFee.toLocaleString()}`}
                    </span>
                  </div>
                )}
                
                {appliedCoupon && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span>-KES {couponDiscount.toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-blue-600">KES {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Coupon Code */}
              {!appliedCoupon && (
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              {appliedCoupon && (
                <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-green-800 font-medium">{appliedCoupon.code}</span>
                      <p className="text-sm text-green-600">{appliedCoupon.description}</p>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="space-y-3">
                {currentStep < 3 && (
                  <button
                    onClick={nextStep}
                    disabled={!canProceedToNext()}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center ${
                      canProceedToNext()
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                )}
                
                {currentStep > 1 && currentStep < 4 && (
                  <button
                    onClick={prevStep}
                    className="w-full py-3 px-4 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </button>
                )}
              </div>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                <Shield className="w-4 h-4 mr-2" />
                <span>Secure checkout powered by Panda Mart</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage