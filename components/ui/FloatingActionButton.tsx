'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Phone, MapPin, X, Headphones } from 'lucide-react'

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const actions = [
    {
      icon: Phone,
      label: 'Call Us',
      color: 'bg-green-500',
      action: () => window.open('tel:+254700000000')
    },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      color: 'bg-green-600',
      action: () => window.open('https://wa.me/254700000000')
    },
    {
      icon: MapPin,
      label: 'Find Store',
      color: 'bg-blue-500',
      action: () => router.push('/stores')
    },
    {
      icon: Headphones,
      label: 'Live Chat',
      color: 'bg-purple-500',
      action: () => console.log('Open live chat')
    }
  ]

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {actions.map((action, index) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                onClick={action.action}
                className={`${action.color} text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center group`}
              >
                <action.icon className="w-5 h-5" />
                <span className="ml-3 pr-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-sm font-medium">
                  {action.label}
                </span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="gradient-bg text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="help"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Headphones className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}

export default FloatingActionButton