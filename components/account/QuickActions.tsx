'use client'

import { motion } from 'framer-motion'
import { QrCode, Gift, CreditCard, MapPin, Headphones, ShoppingBag } from 'lucide-react'

interface QuickActionsProps {
  onAction: (action: string) => void
}

const QuickActions = ({ onAction }: QuickActionsProps) => {
  const actions = [
    {
      id: 'scan',
      icon: QrCode,
      label: 'Scan QR',
      color: 'bg-blue-500',
      action: () => onAction('scan')
    },
    {
      id: 'redeem',
      icon: Gift,
      label: 'Redeem',
      color: 'bg-green-500',
      action: () => onAction('redeem')
    },
    {
      id: 'coupons',
      icon: CreditCard,
      label: 'Coupons',
      color: 'bg-purple-500',
      action: () => onAction('coupons')
    },
    {
      id: 'stores',
      icon: MapPin,
      label: 'Stores',
      color: 'bg-red-500',
      action: () => onAction('stores')
    },
    {
      id: 'support',
      icon: Headphones,
      label: 'Support',
      color: 'bg-orange-500',
      action: () => onAction('support')
    },
    {
      id: 'orders',
      icon: ShoppingBag,
      label: 'Orders',
      color: 'bg-indigo-500',
      action: () => onAction('orders')
    }
  ]

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-4 py-6 md:px-6 md:py-8">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Quick Actions</h3>
        
        <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {actions.map((action, index) => (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={action.action}
              className="flex flex-col items-center p-4 md:p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 hover:shadow-md group"
            >
              <div className={`${action.color} p-3 md:p-4 rounded-full mb-2 md:mb-3 shadow-lg group-hover:shadow-xl transition-shadow`}>
                <action.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <span className="text-sm md:text-base font-medium text-gray-700 text-center leading-tight">{action.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuickActions