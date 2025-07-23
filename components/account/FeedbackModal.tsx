'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Send, Star, MessageSquare, Camera, 
  CheckCircle, AlertCircle, Smile, Meh, Frown,
  ThumbsUp, ThumbsDown, Heart, Zap
} from 'lucide-react'

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  user?: any
}

const FeedbackModal = ({ isOpen, onClose, user }: FeedbackModalProps) => {
  const [step, setStep] = useState(1)
  const [feedback, setFeedback] = useState({
    type: '',
    rating: 0,
    category: '',
    subject: '',
    message: '',
    email: user?.email || '',
    allowContact: true,
    attachments: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const feedbackTypes = [
    {
      id: 'compliment',
      name: 'Compliment',
      description: 'Share what you love about Panda Mart',
      icon: Heart,
      color: 'green'
    },
    {
      id: 'suggestion',
      name: 'Suggestion',
      description: 'Help us improve with your ideas',
      icon: Zap,
      color: 'blue'
    },
    {
      id: 'complaint',
      name: 'Complaint',
      description: 'Tell us about issues you\'ve experienced',
      icon: AlertCircle,
      color: 'red'
    },
    {
      id: 'question',
      name: 'Question',
      description: 'Ask us anything about our services',
      icon: MessageSquare,
      color: 'purple'
    }
  ]

  const categories = {
    compliment: [
      'Customer Service',
      'Product Quality',
      'Store Experience',
      'Website/App',
      'Delivery Service',
      'Other'
    ],
    suggestion: [
      'New Products',
      'Website/App Features',
      'Store Layout',
      'Customer Service',
      'Delivery Options',
      'Other'
    ],
    complaint: [
      'Product Issues',
      'Customer Service',
      'Website/App Problems',
      'Delivery Issues',
      'Store Experience',
      'Billing/Payment',
      'Other'
    ],
    question: [
      'Products',
      'Orders',
      'Account',
      'Loyalty Program',
      'Store Locations',
      'Other'
    ]
  }

  const ratingEmojis = [
    { value: 1, emoji: Frown, label: 'Very Poor', color: 'text-red-500' },
    { value: 2, emoji: Frown, label: 'Poor', color: 'text-orange-500' },
    { value: 3, emoji: Meh, label: 'Average', color: 'text-yellow-500' },
    { value: 4, emoji: Smile, label: 'Good', color: 'text-green-500' },
    { value: 5, emoji: Smile, label: 'Excellent', color: 'text-green-600' }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      console.log('Feedback submitted:', feedback)
      setSubmitted(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false)
        setStep(1)
        setFeedback({
          type: '',
          rating: 0,
          category: '',
          subject: '',
          message: '',
          email: user?.email || '',
          allowContact: true,
          attachments: []
        })
        onClose()
      }, 3000)
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">We'd Love Your Feedback!</h3>
        <p className="text-gray-600">Help us improve your Panda Mart experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {feedbackTypes.map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setFeedback(prev => ({ ...prev, type: type.id }))
              setStep(2)
            }}
            className={`p-6 border-2 rounded-xl transition-all text-left ${
              feedback.type === type.id
                ? `border-${type.color}-500 bg-${type.color}-50`
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${
              type.color === 'green' ? 'bg-green-100 text-green-600' :
              type.color === 'blue' ? 'bg-blue-100 text-blue-600' :
              type.color === 'red' ? 'bg-red-100 text-red-600' :
              'bg-purple-100 text-purple-600'
            }`}>
              <type.icon className="w-6 h-6" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{type.name}</h4>
            <p className="text-gray-600 text-sm">{type.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {feedbackTypes.find(t => t.id === feedback.type)?.name} Details
        </h3>
        <p className="text-gray-600">Please provide more information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating (for complaints and compliments) */}
        {(feedback.type === 'complaint' || feedback.type === 'compliment') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you rate your overall experience?
            </label>
            <div className="flex justify-center space-x-4">
              {ratingEmojis.map((rating) => (
                <button
                  key={rating.value}
                  type="button"
                  onClick={() => setFeedback(prev => ({ ...prev, rating: rating.value }))}
                  className={`p-3 rounded-full transition-all ${
                    feedback.rating === rating.value
                      ? 'bg-blue-100 ring-2 ring-blue-500'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <rating.emoji className={`w-8 h-8 ${
                    feedback.rating === rating.value ? rating.color : 'text-gray-400'
                  }`} />
                </button>
              ))}
            </div>
            {feedback.rating > 0 && (
              <p className="text-center text-sm text-gray-600 mt-2">
                {ratingEmojis.find(r => r.value === feedback.rating)?.label}
              </p>
            )}
          </div>
        )}

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={feedback.category}
            onChange={(e) => setFeedback(prev => ({ ...prev, category: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select a category</option>
            {categories[feedback.type as keyof typeof categories]?.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
          <input
            type="text"
            value={feedback.subject}
            onChange={(e) => setFeedback(prev => ({ ...prev, subject: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief summary of your feedback"
            required
          />
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
          <textarea
            value={feedback.message}
            onChange={(e) => setFeedback(prev => ({ ...prev, message: e.target.value }))}
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Please provide detailed feedback..."
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email (Optional)</label>
          <input
            type="email"
            value={feedback.email}
            onChange={(e) => setFeedback(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your.email@example.com"
          />
        </div>

        {/* Contact Permission */}
        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowContact"
            checked={feedback.allowContact}
            onChange={(e) => setFeedback(prev => ({ ...prev, allowContact: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="allowContact" className="ml-2 text-sm text-gray-700">
            Allow Panda Mart to contact me about this feedback
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={() => setStep(1)}
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
                Submit Feedback
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
        Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.
      </p>
      
      {feedback.allowContact && feedback.email && (
        <p className="text-sm text-gray-500">
          We'll get back to you at {feedback.email} if we need more information.
        </p>
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
                <MessageSquare className="w-6 h-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-semibold text-gray-900">Send Feedback</h2>
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
              {submitted ? renderSuccess() : step === 1 ? renderStep1() : renderStep2()}
            </div>

            {/* Progress Indicator */}
            {!submitted && (
              <div className="px-6 pb-6">
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                  <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default FeedbackModal