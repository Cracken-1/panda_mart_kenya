'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Shield, Star, Users, Zap, Eye, EyeOff, Mail, Lock, User, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { validateEmail, validatePhone, validatePassword, formatPhone, getPasswordStrengthColor } from '@/lib/utils/validation'

export default function AuthenticationForm() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
    phone: ''
  })
  const [passwordStrength, setPasswordStrength] = useState({
    strength: 'weak' as 'weak' | 'medium' | 'strong' | 'very-strong',
    checks: {
      length: false,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false,
      common: false
    }
  })
  const [fieldTouched, setFieldTouched] = useState({
    email: false,
    password: false,
    phone: false
  })

  const { login, register, mockLogin } = useAuth()

  const features = [
    {
      icon: Shield,
      title: 'Secure & Safe',
      description: 'Your data is protected with bank-level security'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Quick checkout and instant order updates'
    },
    {
      icon: Star,
      title: 'Exclusive Deals',
      description: 'Member-only discounts up to 70% off'
    },
    {
      icon: Users,
      title: 'Trusted by Thousands',
      description: 'Join our growing community of happy shoppers'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Mark all fields as touched for validation display
    setFieldTouched({
      email: true,
      password: true,
      phone: true
    })

    // Validate all fields
    if (!isFormValid()) {
      setError('Please fix the validation errors before submitting')
      setLoading(false)
      return
    }

    try {
      if (isSignUp) {
        const result = await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone
        })
        if (!result.success) {
          setError(result.message)
        }
      } else {
        const result = await login({
          email: formData.email,
          password: formData.password
        })
        if (!result.success) {
          setError(result.message)
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Format phone number as user types
    let formattedValue = value
    if (name === 'phone') {
      formattedValue = formatPhone(value)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }))

    // Real-time validation
    validateField(name, value)
  }

  const validateField = (fieldName: string, value: string) => {
    let validation = { isValid: true, message: '' }

    switch (fieldName) {
      case 'email':
        validation = validateEmail(value)
        setValidationErrors(prev => ({ ...prev, email: validation.message }))
        break
      case 'phone':
        validation = validatePhone(value)
        setValidationErrors(prev => ({ ...prev, phone: validation.message }))
        break
      case 'password':
        const passwordValidation = validatePassword(value)
        setValidationErrors(prev => ({ ...prev, password: passwordValidation.message }))
        setPasswordStrength({
          strength: passwordValidation.strength,
          checks: passwordValidation.checks
        })
        break
    }

    return validation.isValid
  }

  const handleFieldBlur = (fieldName: string) => {
    setFieldTouched(prev => ({ ...prev, [fieldName]: true }))
  }

  const isFormValid = () => {
    const emailValid = validateEmail(formData.email).isValid
    const passwordValid = validatePassword(formData.password).isValid
    const phoneValid = isSignUp ? validatePhone(formData.phone).isValid : true
    const namesValid = isSignUp ? (formData.firstName.trim() && formData.lastName.trim()) : true

    return emailValid && passwordValid && phoneValid && namesValid
  }

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex">
      {/* Left Side - Branding & Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-panda-red-500 via-red-600 to-orange-600 p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <img src="/panda.ico" alt="Panda" className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Panda Mart</h1>
              <p className="text-white/80 text-sm">Kenya</p>
            </div>
          </Link>

          {/* Main Message */}
          <div className="mt-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold text-white mb-6"
            >
              Your World of
              <br />
              Amazing Deals
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/90 text-lg leading-relaxed"
            >
              Join thousands of happy customers who save money every day with exclusive deals, 
              flash sales, and member-only discounts.
            </motion.p>
          </div>
        </div>

        {/* Features */}
        <div className="relative z-10 space-y-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-start space-x-4"
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                <p className="text-white/80 text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center text-gray-600 hover:text-panda-red-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <img src="/panda.ico" alt="Panda" className="w-12 h-12" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-600">
              {isSignUp 
                ? 'Join Panda Mart and start saving today' 
                : 'Sign in to access your account and exclusive deals'
              }
            </p>
          </motion.div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <AnimatePresence mode="wait">
                {isSignUp && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                          placeholder="John"
                          required={isSignUp}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                          placeholder="Doe"
                          required={isSignUp}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('email')}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent ${
                      fieldTouched.email && validationErrors.email
                        ? 'border-red-300 bg-red-50'
                        : fieldTouched.email && !validationErrors.email && formData.email
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="john@example.com"
                    required
                  />
                  {fieldTouched.email && formData.email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {validationErrors.email ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  )}
                </div>
                {fieldTouched.email && validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={() => handleFieldBlur('phone')}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent ${
                        fieldTouched.phone && validationErrors.phone
                          ? 'border-red-300 bg-red-50'
                          : fieldTouched.phone && !validationErrors.phone && formData.phone
                          ? 'border-green-300 bg-green-50'
                          : 'border-gray-300'
                      }`}
                      placeholder="+254 700 000 000"
                      required={isSignUp}
                    />
                    {fieldTouched.phone && formData.phone && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {validationErrors.phone ? (
                          <XCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    )}
                  </div>
                  {fieldTouched.phone && validationErrors.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {validationErrors.phone}
                    </p>
                  )}
                </motion.div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('password')}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent ${
                      fieldTouched.password && validationErrors.password
                        ? 'border-red-300 bg-red-50'
                        : fieldTouched.password && !validationErrors.password && formData.password
                        ? 'border-green-300 bg-green-50'
                        : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">Password Strength:</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getPasswordStrengthColor(passwordStrength.strength)}`}>
                        {passwordStrength.strength.charAt(0).toUpperCase() + passwordStrength.strength.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                    
                    {/* Strength Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          passwordStrength.strength === 'weak' ? 'w-1/4 bg-red-500' :
                          passwordStrength.strength === 'medium' ? 'w-2/4 bg-yellow-500' :
                          passwordStrength.strength === 'strong' ? 'w-3/4 bg-blue-500' :
                          'w-full bg-green-500'
                        }`}
                      ></div>
                    </div>

                    {/* Password Requirements */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={`flex items-center ${passwordStrength.checks.length ? 'text-green-600' : 'text-gray-400'}`}>
                        {passwordStrength.checks.length ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        8+ characters
                      </div>
                      <div className={`flex items-center ${passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                        {passwordStrength.checks.uppercase ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        Uppercase letter
                      </div>
                      <div className={`flex items-center ${passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                        {passwordStrength.checks.lowercase ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        Lowercase letter
                      </div>
                      <div className={`flex items-center ${passwordStrength.checks.numbers ? 'text-green-600' : 'text-gray-400'}`}>
                        {passwordStrength.checks.numbers ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        Number
                      </div>
                      <div className={`flex items-center ${passwordStrength.checks.symbols ? 'text-green-600' : 'text-gray-400'}`}>
                        {passwordStrength.checks.symbols ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        Special character
                      </div>
                      <div className={`flex items-center ${passwordStrength.checks.common ? 'text-green-600' : 'text-red-600'}`}>
                        {passwordStrength.checks.common ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                        Not common
                      </div>
                    </div>
                  </div>
                )}

                {fieldTouched.password && validationErrors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {validationErrors.password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid()}
                className="w-full bg-gradient-to-r from-panda-red-500 to-red-600 text-white py-3 px-4 rounded-lg hover:from-panda-red-600 hover:to-red-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {isSignUp ? 'Creating Account...' : 'Signing In...'}
                  </div>
                ) : (
                  isSignUp ? 'Create Account' : 'Sign In'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError('')
                    setFormData({
                      email: '',
                      password: '',
                      firstName: '',
                      lastName: '',
                      phone: ''
                    })
                    setValidationErrors({
                      email: '',
                      password: '',
                      phone: ''
                    })
                    setFieldTouched({
                      email: false,
                      password: false,
                      phone: false
                    })
                    setPasswordStrength({
                      strength: 'weak',
                      checks: {
                        length: false,
                        uppercase: false,
                        lowercase: false,
                        numbers: false,
                        symbols: false,
                        common: false
                      }
                    })
                  }}
                  className="text-panda-red-500 hover:text-panda-red-600 font-medium"
                >
                  {isSignUp 
                    ? 'Already have an account? Sign In' 
                    : "Don't have an account? Sign Up"
                  }
                </button>

                {/* Mock Login Button for Testing */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-2 text-center">For testing purposes:</p>
                  <button
                    type="button"
                    onClick={async () => {
                      setLoading(true)
                      setError('')
                      try {
                        const result = await mockLogin()
                        if (!result.success) {
                          setError(result.error || 'Mock login failed')
                        }
                      } catch (err) {
                        setError('Mock login failed')
                      } finally {
                        setLoading(false)
                      }
                    }}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Signing In...
                      </div>
                    ) : (
                      '🧪 Mock Login (Testing)'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center"
          >
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Your data is protected with bank-level security</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}