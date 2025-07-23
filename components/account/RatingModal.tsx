'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Star, Send, CheckCircle, Heart, 
  ThumbsUp, MessageSquare, Camera, Share2
} from 'lucide-react'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  user?: any
}

const RatingModal = ({ isOpen, onClose, user }: RatingModalProps) => {
  const [step, setStep] = useState(1)
  const [rating, setRating] = useState({
    overall: 0,
    categories: {
      products: 0,
      service: 0,
      website: 0,
      delivery: 0,
      value: 0
    },
    review: '',
    recommend: null as boolean | null,
    improvements: [] as string[],
    allowPublic: true,
    allowContact: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const categories = [
    {
      key: 'products',
      name: 'Product Quality',
      description: 'Quality and variety of products',
      icon: '📦'
    },
    {
      key: 'service',
      name: 'Customer Service',
      description: 'Helpfulness and friendliness of staff',
      icon: '👥'
    },
    {
      key: 'website',
      name: 'Website Experience',
      description: 'Ease of use and functionality',
      icon: '💻'
    },
    {
      key: 'delivery',
      name: 'Store Pickup',
      description: 'Convenience and speed of pickup',
      icon: '🚚'
    },
    {
      key: 'value',
      name: 'Value for Money',
      description: 'Pricing and deals offered',
      icon: '💰'
    }
  ]

  const improvementOptions = [
    'More product variety',
    'Better website search',
    'Faster customer service',
    'Extended store hours',
    'More store locations',
    'Better mobile app',
    'More payment options',
    'Loyalty program improvements',
    'Better product descriptions',
    'Faster checkout process'
  ]

  const handleOverallRating = (value: number) => {
    setRating(prev => ({ ...prev, overall: value }))
    if (value > 0) {
      setTimeout(() => setStep(2), 500)
    }
  }

  const handleCategoryRating = (category: string, value: number) => {
    setRating(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: value
      }
    }))
  }

  const handleImprovementToggle = (improvement: string) => {
    setRating(prev => ({
      ...prev,
      improvements: prev.improvements.includes(improvement)
        ? prev.improvements.filter(i => i !== improvement)
        : [...prev.improvements, improvement]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Rating submitted:', rating)
      setSubmitted(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
        setStep(1)
        setRating({
          overall: 0,
          categories: {
            products: 0,
            service: 0,
            website: 0,
            delivery: 0,
            value: 0
          },
          review: '',
          recommend: null,
          improvements: [],
          allowPublic: true,
          allowContact: false
        })
        onClose()
      }, 3000)
    } catch (error) {
      console.error('Error submitting rating:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStarRating = (value: number, onChange: (value: number) => void, size = 'w-8 h-8') => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`${size} transition-all hover:scale-110 ${
            star <= value ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
          }`}
        >
          <Star className={`w-full h-full ${star <= value ? 'fill-current' : ''}`} />
        </button>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="text-center space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Rate Your Experience</h3>
        <p className="text-gray-600">How would you rate Panda Mart overall?</p>
      </div>

      <div className="flex justify-center">
        {renderStarRating(rating.overall, handleOverallRating, 'w-12 h-12')}
      </div>

      {rating.overall > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-lg font-medium text-gray-900">
            {rating.overall === 5 ? 'Excellent! 🌟' :
             rating.overall === 4 ? 'Great! 👍' :
             rating.overall === 3 ? 'Good 👌' :
             rating.overall === 2 ? 'Fair 😐' :
             'Poor 😞'}
          </p>
          <p className="text-gray-600 mt-2">
            {rating.overall >= 4 ? 'We\'re thrilled you had a great experience!' :
             rating.overall === 3 ? 'Thanks for your feedback. We\'ll keep improving!' :
             'We\'re sorry to hear that. Let us know how we can do better.'}
          </p>
        </motion.div>
      )}
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Tell Us More</h3>
        <p className="text-gray-600">Rate specific aspects of your experience</p>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{category.icon}</span>
              <div>
                <h4 className="font-medium text-gray-900">{category.name}</h4>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            </div>
            {renderStarRating(
              rating.categories[category.key as keyof typeof rating.categories],
              (value) => handleCategoryRating(category.key, value),
              'w-6 h-6'
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={() => setStep(3)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Share Your Thoughts</h3>
        <p className="text-gray-600">Help us improve with your detailed feedback</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Recommendation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Would you recommend Panda Mart to friends and family?
          </label>
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={() => setRating(prev => ({ ...prev, recommend: true }))}
              className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all ${
                rating.recommend === true
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-300 hover:border-green-300'
              }`}
            >
              <ThumbsUp className="w-5 h-5 mr-2" />
              Yes
            </button>
            <button
              type="button"
              onClick={() => setRating(prev => ({ ...prev, recommend: false }))}
              className={`flex items-center px-4 py-2 rounded-lg border-2 transition-all ${
                rating.recommend === false
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 hover:border-red-300'
              }`}
            >
              <X className="w-5 h-5 mr-2" />
              No
            </button>
          </div>
        </div>

        {/* Written Review */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Write a review (optional)
          </label>
          <textarea
            value={rating.review}
            onChange={(e) => setRating(prev => ({ ...prev, review: e.target.value }))}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Share your experience with other customers..."
          />
        </div>

        {/* Improvements */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What could we improve? (Select all that apply)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {improvementOptions.map((improvement) => (
              <label key={improvement} className="flex items-center">
                <input
                  type="checkbox"
                  checked={rating.improvements.includes(improvement)}
                  onChange={() => handleImprovementToggle(improvement)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">{improvement}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Privacy Options */}
        <div className="space-y-3 pt-4 border-t border-gray-200">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowPublic"
              checked={rating.allowPublic}
              onChange={(e) => setRating(prev => ({ ...prev, allowPublic: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="allowPublic" className="ml-2 text-sm text-gray-700">
              Allow this review to be displayed publicly (your name will be shown as "{user?.name || 'Anonymous'}")
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="allowContact"
              checked={rating.allowContact}
              onChange={(e) => setRating(prev => ({ ...prev, allowContact: e.target.checked }))}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="allowContact" className="ml-2 text-sm text-gray-700">
              Allow Panda Mart to contact me about this review
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Rating
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )

  const renderSuccess = () => (
    <div className="text-center py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <CheckCircle className="w-8 h-8 text-green-600" />
      </motion.div>
      
      <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
      <p className="text-gray-600 mb-4">
        Your rating has been submitted successfully. Your feedback helps us serve you better.
      </p>
      
      {rating.overall >= 4 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-blue-800 mb-3">Love Panda Mart? Share with your friends!</p>
          <div className="flex justify-center space-x-3">
            <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </button>
            <button className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
              <Heart className="w-4 h-4 mr-2" />
              Follow Us
            </button>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <Star className="w-6 h-6 text-yellow-500 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Rate Our Service</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {submitted ? renderSuccess() : 
               step === 1 ? renderStep1() : 
               step === 2 ? renderStep2() : 
               renderStep3()}
            </div>

            {/* Progress Indicator */}
            {!submitted && (
              <div className="px-6 pb-6">
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  <div className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default RatingModal