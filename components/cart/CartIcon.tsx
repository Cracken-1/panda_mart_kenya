'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface CartIconProps {
  onClick?: () => void
  className?: string
  showBadge?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const CartIcon = ({ onClick, className = '', showBadge = true, size = 'md' }: CartIconProps) => {
  const [itemCount, setItemCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Load cart count from localStorage
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('panda_cart')
      if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart)
          const totalItems = cartItems.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0)
          
          // Animate if count changed
          if (totalItems !== itemCount && itemCount > 0) {
            setIsAnimating(true)
            setTimeout(() => setIsAnimating(false), 300)
          }
          
          setItemCount(totalItems)
        } catch (error) {
          console.error('Error loading cart count:', error)
          setItemCount(0)
        }
      } else {
        setItemCount(0)
      }
    }

    // Initial load
    updateCartCount()

    // Listen for storage changes (when cart is updated from other components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'panda_cart') {
        updateCartCount()
      }
    }

    // Listen for custom cart update events
    const handleCartUpdate = () => {
      updateCartCount()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('cart-updated', handleCartUpdate)

    // Poll for changes (fallback for same-tab updates)
    const interval = setInterval(updateCartCount, 1000)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cart-updated', handleCartUpdate)
      clearInterval(interval)
    }
  }, [itemCount])

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const badgeSizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm'
  }

  return (
    <button
      onClick={onClick}
      className={`relative p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
      title={`Shopping Cart (${itemCount} items)`}
    >
      <motion.div
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        <ShoppingCart className={`${sizeClasses[size]} text-gray-600`} />
      </motion.div>
      
      {showBadge && itemCount > 0 && (
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className={`absolute -top-1 -right-1 ${badgeSizeClasses[size]} bg-red-500 text-white rounded-full flex items-center justify-center font-bold min-w-0`}
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.div>
        </AnimatePresence>
      )}
    </button>
  )
}

export default CartIcon