'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCard, Smartphone, Banknote, Shield, 
  Lock, CheckCircle, AlertCircle, Eye, EyeOff,
  Info, ArrowRight
} from 'lucide-react'

interface SecurePaymentFormProps {
  amount: number
  currency?: string
  onPaymentSuccess?: (paymentData: any) => void
  onPaymentError?: (error: string) => void
}

const SecurePaymentForm = ({ 
  amount, 
  currency = 'KES',
  onPaymentSuccess,
  onPaymentError 
}: SecurePaymentFormProps) => {
  const [selectedMethod, setSelectedMethod] = useState('mpesa')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCardDetails, setShowCardDetails] = useState(false)
  const [formData, setFormData] = useState({
    // M-Pesa
    phoneNumber: '',
    
    // Card
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    
    // Cash
    storeLocation: '',
    pickupTime: ''
  })

  const paymentMethods = [
    {
      id: 'mpesa',
      name: 'M-Pesa',
      description: 'Pay securely with your M-Pesa account',
      icon: Smartphone,
      color: 'bg-green-600',
      popular: true
    },
    {
      id: 'card',
      name: 'Credit/Debit Card',
      description: 'Visa, Mastercard, and other major cards',
      icon: CreditCard,
      color: 'bg-blue-600',
      popular: false
    },
    {
      id: 'cash',
      name: 'Cash on Pickup',
      description: 'Pay when you collect your items',
      icon: Banknote,
      color: 'bg-gray-600',
      popular: false
    }
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
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

  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const validateForm = () => {
    switch (selectedMethod) {
      case 'mpesa':
        if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
          setErrorMessage('Please enter a valid phone number')
          return false
        }
        break
      case 'card':
        if (!formData.cardholderName || !formData.cardNumber || !formData.expiryDate || !formData.cvv) {
          setErrorMessage('Please fill in all card details')
          return false
        }
        if (formData.cardNumber.replace(/\s/g, '').length < 16) {
          setErrorMessage('Please enter a valid card number')
          return false
        }
        break
      case 'cash':
        if (!formData.storeLocation || !formData.pickupTime) {
          setErrorMessage('Please select store location and pickup time')
          return false
        }
        break
    }
    return true
  }

  const handlePayment = async () => {
    if (!validateForm()) {
      setPaymentStatus('error')
      setTimeout(() => setPaymentStatus('idle'), 3000)
      return
    }

    setIsProcessing(true)
    setPaymentStatus('processing')
    setErrorMessage('')
    
    try {
      // Simulate payment processing with realistic delays
      if (selectedMethod === 'mpesa') {
        await new Promise(resolve => setTimeout(resolve, 2000)) // M-Pesa processing
      } else if (selectedMethod === 'card') {
        await new Promise(resolve => setTimeout(resolve, 3000)) // Card processing
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000)) // Cash reservation
      }
      
      const paymentData = {
        id: `PAY-${Date.now()}`,
        method: selectedMethod,
        amount,
        currency,
        reference: `${selectedMethod.toUpperCase()}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: selectedMethod === 'cash' ? 'reserved' : 'completed',
        ...formData
      }
      
      // Save payment to localStorage
      const existingPayments = JSON.parse(localStorage.getItem('panda_payments') || '[]')
      existingPayments.push(paymentData)
      localStorage.setItem('panda_payments', JSON.stringify(existingPayments))
      
      setPaymentStatus('success')
      onPaymentSuccess?.(paymentData)
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          phoneNumber: '',
          cardNumber: '',
          expiryDate: '',
          cvv: '',
          cardholderName: '',
          storeLocation: '',
          pickupTime: ''
        })
        setPaymentStatus('idle')
      }, 3000)
      
    } catch (error) {
      setPaymentStatus('error')
      setErrorMessage('Payment failed. Please try again.')
      onPaymentError?.('Payment failed. Please try again.')
      setTimeout(() => setPaymentStatus('idle'), 3000)
    } finally {
      setIsProcessing(false)
    }
  }

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'mpesa':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                M-Pesa Phone Number
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  placeholder="+254 700 000 000"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                You'll receive an M-Pesa prompt on this number
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <Info className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">How M-Pesa Payment Works</h4>
                  <ol className="text-sm text-green-700 mt-2 space-y-1">
                    <li>1. Enter your M-Pesa registered phone number</li>
                    <li>2. Click "Pay with M-Pesa" button</li>
                    <li>3. Check your phone for M-Pesa prompt</li>
                    <li>4. Enter your M-Pesa PIN to complete payment</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )

      case 'card':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                  maxLength={19}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                  maxLength={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <div className="relative">
                  <input
                    type={showCardDetails ? 'text' : 'password'}
                    placeholder="123"
                    value={formData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCardDetails(!showCardDetails)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showCardDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <h4 className="font-medium text-blue-800">Secure Payment</h4>
                  <p className="text-sm text-blue-700">Your card details are encrypted and secure</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'cash':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Store Location
              </label>
              <select
                value={formData.storeLocation}
                onChange={(e) => handleInputChange('storeLocation', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="">Choose a store...</option>
                <option value="garden-city">Panda Mart Garden City</option>
                <option value="galleria">Panda Mart Galleria</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Pickup Time
              </label>
              <select
                value={formData.pickupTime}
                onChange={(e) => handleInputChange('pickupTime', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              >
                <option value="">Select time...</option>
                <option value="morning">Morning (9:00 AM - 12:00 PM)</option>
                <option value="afternoon">Afternoon (12:00 PM - 5:00 PM)</option>
                <option value="evening">Evening (5:00 PM - 8:00 PM)</option>
              </select>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Cash Payment Instructions</h4>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• Your order will be reserved for 24 hours</li>
                    <li>• Bring exact change if possible</li>
                    <li>• Present your order confirmation at the store</li>
                    <li>• Valid ID may be required for pickup</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Payment Amount */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white mb-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Complete Your Payment</h2>
          <div className="text-4xl font-bold">{currency} {amount.toLocaleString()}</div>
          <p className="text-blue-100 mt-2">Secure checkout powered by Panda Mart</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentMethods.map((method) => (
            <motion.button
              key={method.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedMethod(method.id)}
              className={`relative p-4 border-2 rounded-xl transition-all ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {method.popular && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}
              
              <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <method.icon className="w-6 h-6 text-white" />
              </div>
              
              <h4 className="font-semibold text-gray-900 mb-1">{method.name}</h4>
              <p className="text-sm text-gray-600">{method.description}</p>
              
              {selectedMethod === method.id && (
                <div className="absolute top-2 right-2">
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>
        
        {/* Status Messages */}
        {paymentStatus === 'success' && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Payment successful!</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              {selectedMethod === 'cash' 
                ? 'Your order has been reserved. Please collect within 24 hours.' 
                : 'Your payment has been processed successfully.'}
            </p>
          </div>
        )}
        
        {paymentStatus === 'error' && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-red-800 font-medium">Payment failed</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
          </div>
        )}
        
        {renderPaymentForm()}
      </div>

      {/* Security Notice */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-center text-gray-600">
          <Lock className="w-4 h-4 mr-2" />
          <span className="text-sm">Your payment information is encrypted and secure</span>
        </div>
      </div>

      {/* Payment Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handlePayment}
        disabled={isProcessing}
        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all flex items-center justify-center ${
          isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
        }`}
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
            Processing Payment...
          </>
        ) : (
          <>
            {selectedMethod === 'mpesa' && 'Pay with M-Pesa'}
            {selectedMethod === 'card' && 'Pay with Card'}
            {selectedMethod === 'cash' && 'Reserve for Cash Payment'}
            <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </motion.button>

      {/* Terms */}
      <p className="text-xs text-gray-500 text-center mt-4">
        By completing this payment, you agree to our{' '}
        <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
      </p>
    </div>
  )
}

export default SecurePaymentForm