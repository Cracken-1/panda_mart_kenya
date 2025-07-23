'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, Star, Gift, QrCode, Shield } from 'lucide-react'

interface WelcomeTourProps {
  onComplete: () => void
  onSkip: () => void
}

const WelcomeTour = ({ onComplete, onSkip }: WelcomeTourProps) => {
  const [currentStep, setCurrentStep] = useState(0)

  const tourSteps = [
    {
      title: 'Welcome to Your Account!',
      description: 'Your personalized dashboard where you can manage everything about your Panda Mart experience.',
      icon: Star,
      color: 'from-blue-500 to-purple-600',
      highlight: 'header'
    },
    {
      title: 'Quick Actions',
      description: 'Access your most-used features instantly. Scan QR codes, redeem points, and view coupons.',
      icon: QrCode,
      color: 'from-green-500 to-blue-500',
      highlight: 'actions'
    },
    {
      title: 'Track Your Progress',
      description: 'Monitor your points, savings, and tier progress. Watch your rewards grow with every purchase!',
      icon: Gift,
      color: 'from-yellow-500 to-orange-500',
      highlight: 'stats'
    },
    {
      title: 'Stay Secure',
      description: 'Your security matters. Set up 2FA, manage devices, and control your privacy settings.',
      icon: Shield,
      color: 'from-red-500 to-pink-500',
      highlight: 'security'
    }
  ]

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const currentTour = tourSteps[currentStep]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
    >
      {/* Tour Card */}
      <motion.div
        key={currentStep}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: -20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 500 }}
        className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className={`bg-gradient-to-br ${currentTour.color} p-6 text-white relative overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white transform translate-x-8 -translate-y-8"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-white transform -translate-x-6 translate-y-6"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
              <currentTour.icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">{currentTour.title}</h2>
            <p className="text-white/90 text-sm leading-relaxed">{currentTour.description}</p>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="px-6 py-4">
          <div className="flex justify-center space-x-2 mb-4">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="text-center text-sm text-gray-500 mb-4">
            Step {currentStep + 1} of {tourSteps.length}
          </div>
        </div>

        {/* Navigation */}
        <div className="px-6 pb-6">
          <div className="flex justify-between space-x-4">
            {/* Skip/Previous Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={currentStep === 0 ? onSkip : prevStep}
              className="flex-1 py-3 px-4 text-gray-600 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              {currentStep === 0 ? 'Skip Tour' : 'Previous'}
            </motion.button>

            {/* Next/Complete Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={nextStep}
              className={`flex-1 py-3 px-4 text-white font-semibold rounded-xl transition-colors bg-gradient-to-r ${currentTour.color} hover:shadow-lg`}
            >
              {currentStep === tourSteps.length - 1 ? 'Get Started' : 'Next'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Close Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onSkip}
        className="absolute top-8 right-8 p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
      >
        <X className="w-6 h-6" />
      </motion.button>
    </motion.div>
  )
}

export default WelcomeTour