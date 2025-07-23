'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CreditCard, MapPin, Truck, CheckCircle, ArrowLeft, 
  ArrowRight, Shield, Lock, Eye, EyeOff, Plus, Edit,
  Trash2, Star, Gift, AlertCircle, Info, Clock,
  Smartphone, Banknote, Wallet, User, Phone, Mail
} from 'lucide-react'

interface SavedPaymentMethod {
  id: string
  type: 'card' | 'mpesa' | 'bank'
  name: string
  details: string
  isDefault: boolean
  lastUsed: string
}

interface CheckoutFlowProps {
  cartItems: any[]
  total: number
  onOrderComplete: (orderData: any) => void
}

const CheckoutFlow = ({ cartItems, total, onOrderComplete }: CheckoutFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<SavedPaymentMethod | null>(null)
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    // Card details
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    // M-Pesa details
    phoneNumber: '',
    // Billing address
    billingAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: 'Kenya'
    }
  })

  const [savedPaymentMethods] = useState<SavedPaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      name: 'Visa ending in 4242',
      details: '**** **** **** 4242',
      isDefault: true,
      lastUsed: '2024-01-15'
    },
    {
      id: '2',
      type: 'mpesa',
      name: 'M-Pesa (+254 712 345 678)',
      details: '+254 712 345 678',
      isDefault: false,
      lastUsed: '2024-01-10'
    }
  ])

  const [securityFeatures] = useState([
    {
      icon: Shield,
      title: '256-bit SSL Encryption',
      description: 'Your payment information is encrypted and secure'
    },
    {
      icon: Lock,
      title: 'PCI DSS Compliant',
      description: 'We meet the highest security standards'
    },
    {
      icon: CheckCircle,
      title: 'Fraud Protection',
      description: 'Advanced fraud detection keeps you safe'
    }
  ])

  useEffect(() => {
    // Set default payment method
    const defaultMethod = savedPaymentMethods.find(method => method.isDefault)
    if (defaultMethod) {
      setSelectedPaymentMethod(defaultMethod)
    }
  }, [])

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({ ...prev, [field]: value }))
    }
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const validatePaymentForm = () => {
    if (!selectedPaymentMethod) {
      return { isValid: false, error: 'Please select a payment method' }
    }

    if (selectedPaymentMethod.type === 'card' && showAddPaymentMethod) {
      if (!formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.cardholderName) {
        return { isValid: false, error: 'Please fill in all card details' }
      }
      if (formData.cardNumber.replace(/\s/g, '').length < 16) {
        return { isValid: false, error: 'Please enter a valid card number' }
      }
    }

    if (selectedPaymentMethod.type === 'mpesa' && showAddPaymentMethod) {
      if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
        return { isValid: false, error: 'Please enter a valid phone number' }
      }
    }

    return { isValid: true, error: null }
  }

  const processPayment = async () => {
    const validation = validatePaymentForm()
    if (!validation.isValid) {
      alert(validation.error)
      return
    }

    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const orderData = {
        orderNumber: `ORD-${Date.now()}`,
        items: cartItems,
        total,
        paymentMethod: selectedPaymentMethod,
        timestamp: new Date().toISOString(),
        status: 'confirmed'
      }
      
      onOrderComplete(orderData)
    } catch (error) {
      alert('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const renderPaymentMethods = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
      
      {/* Saved Payment Methods */}
      <div className="space-y-3">
        {savedPaymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => {
              setSelectedPaymentMethod(method)
              setShowAddPaymentMethod(false)
            }}
            className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
              selectedPaymentMethod?.id === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-2 bg-gray-100 rounded-lg mr-3">
                  {method.type === 'card' && <CreditCard className="w-5 h-5 text-gray-600" />}
                  {method.type === 'mpesa' && <Smartphone className="w-5 h-5 text-green-600" />}
                  {method.type === 'bank' && <Banknote className="w-5 h-5 text-blue-600" />}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{method.name}</h4>
                  <p className="text-sm text-gray-500">{method.details}</p>
                  {method.isDefault && (
                    <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Default
                    </span>
                  )}
                </div>
              </div>
              {selectedPaymentMethod?.id === method.id && (
                <CheckCircle className="w-5 h-5 text-blue-500" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add New Payment Method */}
      <button
        onClick={() => {
          setShowAddPaymentMethod(true)
          setSelectedPaymentMethod(null)
        }}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors flex items-center justify-center text-gray-600"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add New Payment Method
      </button>

      {/* New Payment Method Form */}
      {showAddPaymentMethod && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 border border-gray-200 rounded-lg bg-gray-50"
        >
          <h4 className="font-semibold text-gray-900 mb-4">Add Payment Method</h4>
          
          {/* Payment Type Selection */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { type: 'card', name: 'Card', icon: CreditCard },
              { type: 'mpesa', name: 'M-Pesa', icon: Smartphone },
              { type: 'bank', name: 'Bank', icon: Banknote }
            ].map((option) => (
              <button
                key={option.type}
                onClick={() => setSelectedPaymentMethod({ 
                  id: 'new', 
                  type: option.type as any, 
                  name: option.name, 
                  details: '', 
                  isDefault: false, 
                  lastUsed: '' 
                })}
                className={`p-3 border rounded-lg flex flex-col items-center transition-all ${
                  selectedPaymentMethod?.type === option.type
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <option.icon className="w-6 h-6 mb-2" />
                <span className="text-sm font-medium">{option.name}</span>
              </button>
            ))}
          </div>

          {/* Card Form */}
          {selectedPaymentMethod?.type === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={formData.cardholderName}
                  onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="password"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          )}

          {/* M-Pesa Form */}
          {selectedPaymentMethod?.type === 'mpesa' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                M-Pesa Phone Number
              </label>
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="+254 700 000 000"
              />
              <p className="text-xs text-gray-500 mt-1">
                You'll receive an M-Pesa prompt on this number
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )

  const renderSecurityFeatures = () => (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h4 className="font-semibold text-gray-900 mb-3">Your payment is secure</h4>
      <div className="space-y-2">
        {securityFeatures.map((feature, index) => (
          <div key={index} className="flex items-start">
            <feature.icon className="w-4 h-4 text-green-600 mr-2 mt-0.5" />
            <div>
              <span className="text-sm font-medium text-gray-900">{feature.title}</span>
              <p className="text-xs text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {renderPaymentMethods()}
      {renderSecurityFeatures()}
      
      {/* Payment Button */}
      <button
        onClick={processPayment}
        disabled={isProcessing || !selectedPaymentMethod}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all flex items-center justify-center ${
          isProcessing || !selectedPaymentMethod
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
            Processing Payment...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5 mr-2" />
            Complete Payment - KES {total.toLocaleString()}
          </>
        )}
      </button>
    </div>
  )
}

export default CheckoutFlow