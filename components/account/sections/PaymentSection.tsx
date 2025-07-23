'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  CreditCard, Plus, Edit3, Trash2, Check, X, 
  Shield, Star, Smartphone, Building, Eye, EyeOff,
  AlertCircle, Lock, Wallet
} from 'lucide-react'

const PaymentSection = () => {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'card',
      brand: 'visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '2025',
      holderName: 'Sarah Wanjiku',
      isDefault: true,
      nickname: 'Personal Card'
    },
    {
      id: 2,
      type: 'card',
      brand: 'mastercard',
      last4: '8888',
      expiryMonth: '08',
      expiryYear: '2026',
      holderName: 'Sarah Wanjiku',
      isDefault: false,
      nickname: 'Work Card'
    },
    {
      id: 3,
      type: 'mpesa',
      phoneNumber: '+254712345678',
      isDefault: false,
      nickname: 'M-Pesa'
    }
  ])

  const [isAddingNew, setIsAddingNew] = useState(false)
  const [newPaymentType, setNewPaymentType] = useState('card')
  const [showCardNumber, setShowCardNumber] = useState(false)
  const [newCard, setNewCard] = useState({
    number: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    holderName: '',
    nickname: ''
  })
  const [newMpesa, setNewMpesa] = useState({
    phoneNumber: '',
    nickname: ''
  })

  const paymentTypes = [
    { value: 'card', label: 'Credit/Debit Card', icon: CreditCard },
    { value: 'mpesa', label: 'M-Pesa', icon: Smartphone },
    { value: 'bank', label: 'Bank Transfer', icon: Building }
  ]

  const getBrandIcon = (brand: string) => {
    switch (brand) {
      case 'visa':
        return '💳'
      case 'mastercard':
        return '💳'
      case 'amex':
        return '💳'
      default:
        return '💳'
    }
  }

  const handleAddPaymentMethod = () => {
    if (newPaymentType === 'card' && newCard.number && newCard.holderName) {
      const method = {
        id: Date.now(),
        type: 'card',
        brand: 'visa', // Would be detected from card number
        last4: newCard.number.slice(-4),
        expiryMonth: newCard.expiryMonth,
        expiryYear: newCard.expiryYear,
        holderName: newCard.holderName,
        isDefault: paymentMethods.length === 0,
        nickname: newCard.nickname || 'Card'
      }
      setPaymentMethods([...paymentMethods, method])
      setNewCard({
        number: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        holderName: '',
        nickname: ''
      })
      setIsAddingNew(false)
    } else if (newPaymentType === 'mpesa' && newMpesa.phoneNumber) {
      const method = {
        id: Date.now(),
        type: 'mpesa',
        phoneNumber: newMpesa.phoneNumber,
        isDefault: paymentMethods.length === 0,
        nickname: newMpesa.nickname || 'M-Pesa'
      }
      setPaymentMethods([...paymentMethods, method])
      setNewMpesa({
        phoneNumber: '',
        nickname: ''
      })
      setIsAddingNew(false)
    }
  }

  const handleSetDefault = (id: number) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    })))
  }

  const handleDeleteMethod = (id: number) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id))
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Payment Methods</h2>
          <p className="text-gray-600">Manage your cards and payment options</p>
        </div>
        <button
          onClick={() => setIsAddingNew(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Payment Method
        </button>
      </div>

      {/* Security Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">Your payments are secure</h3>
            <p className="text-sm text-blue-700 mt-1">
              All payment information is encrypted and stored securely. We never store your full card details.
            </p>
          </div>
        </div>
      </div>

      {/* Add New Payment Method Form */}
      {isAddingNew && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Add Payment Method</h3>
            <button
              onClick={() => setIsAddingNew(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Payment Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Payment Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {paymentTypes.map(type => (
                <button
                  key={type.value}
                  onClick={() => setNewPaymentType(type.value)}
                  className={`flex items-center p-4 border-2 rounded-lg transition-colors ${
                    newPaymentType === type.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <type.icon className={`w-5 h-5 mr-3 ${
                    newPaymentType === type.value ? 'text-blue-600' : 'text-gray-400'
                  }`} />
                  <span className={`font-medium ${
                    newPaymentType === type.value ? 'text-blue-900' : 'text-gray-700'
                  }`}>
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Card Form */}
          {newPaymentType === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type={showCardNumber ? 'text' : 'password'}
                    value={formatCardNumber(newCard.number)}
                    onChange={(e) => setNewCard({...newCard, number: e.target.value.replace(/\s/g, '')})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCardNumber(!showCardNumber)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  >
                    {showCardNumber ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Month
                  </label>
                  <select
                    value={newCard.expiryMonth}
                    onChange={(e) => setNewCard({...newCard, expiryMonth: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Month</option>
                    {Array.from({length: 12}, (_, i) => (
                      <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                        {String(i + 1).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Year
                  </label>
                  <select
                    value={newCard.expiryYear}
                    onChange={(e) => setNewCard({...newCard, expiryYear: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Year</option>
                    {Array.from({length: 10}, (_, i) => (
                      <option key={i} value={2024 + i}>
                        {2024 + i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="password"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({...newCard, cvv: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nickname (Optional)
                  </label>
                  <input
                    type="text"
                    value={newCard.nickname}
                    onChange={(e) => setNewCard({...newCard, nickname: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Personal Card"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={newCard.holderName}
                  onChange={(e) => setNewCard({...newCard, holderName: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Name as it appears on card"
                />
              </div>
            </div>
          )}

          {/* M-Pesa Form */}
          {newPaymentType === 'mpesa' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  M-Pesa Phone Number
                </label>
                <input
                  type="tel"
                  value={newMpesa.phoneNumber}
                  onChange={(e) => setNewMpesa({...newMpesa, phoneNumber: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="+254 700 000 000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nickname (Optional)
                </label>
                <input
                  type="text"
                  value={newMpesa.nickname}
                  onChange={(e) => setNewMpesa({...newMpesa, nickname: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="My M-Pesa"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              onClick={() => setIsAddingNew(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAddPaymentMethod}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Payment Method
            </button>
          </div>
        </motion.div>
      )}

      {/* Payment Methods List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paymentMethods.map((method, index) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-lg ${
              method.isDefault ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${method.isDefault ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {method.type === 'card' ? (
                    <CreditCard className={`w-5 h-5 ${method.isDefault ? 'text-blue-600' : 'text-gray-600'}`} />
                  ) : (
                    <Smartphone className={`w-5 h-5 ${method.isDefault ? 'text-blue-600' : 'text-gray-600'}`} />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{method.nickname}</h3>
                  {method.isDefault && (
                    <div className="flex items-center text-blue-600 text-sm">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      Default Payment
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => console.log('Edit payment method')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => handleDeleteMethod(method.id)}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>

            {/* Payment Method Details */}
            <div className="space-y-3">
              {method.type === 'card' ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Card Number</span>
                    <span className="font-mono">**** **** **** {method.last4}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Expires</span>
                    <span>{method.expiryMonth}/{method.expiryYear}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Cardholder</span>
                    <span>{method.holderName}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Phone Number</span>
                  <span>{method.phoneNumber}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
              {!method.isDefault && (
                <button
                  onClick={() => handleSetDefault(method.id)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Set as Default
                </button>
              )}
              <div className="flex items-center space-x-3">
                <div className="flex items-center text-green-600 text-sm">
                  <Lock className="w-4 h-4 mr-1" />
                  Secure
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {paymentMethods.length === 0 && (
        <div className="text-center py-12">
          <Wallet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
          <p className="text-gray-500 mb-4">Add a payment method to make checkout faster</p>
          <button
            onClick={() => setIsAddingNew(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Payment Method
          </button>
        </div>
      )}
    </div>
  )
}

export default PaymentSection