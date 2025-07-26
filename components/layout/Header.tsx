'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, MapPin, ShoppingCart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductSearch from '../search/ProductSearch'
import PandaIDSystem from '../auth/PandaIDSystem'
import { useCartStore } from '@/lib/store/cartStore'
import EnhancedCartDrawer from '../cart/EnhancedCartDrawer'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems, openCart } = useCartStore()

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Deals & Promotions', href: '/deals' },
    { name: 'Our Collections', href: '/collections' },
    { name: 'Stores', href: '/stores' },
    { name: 'Panda Community', href: '/community' },
    { name: 'About Us', href: '/about' },
  ]

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-panda-black-900">Panda Mart</h1>
              <p className="text-xs text-panda-red-500 font-medium">Kenya</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-panda-black-700 hover:text-panda-red-500 font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:block">
            <ProductSearch />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/stores" className="hidden sm:flex items-center text-panda-red-500 hover:text-panda-red-600 font-medium">
              <MapPin className="w-5 h-5 mr-1" />
              Find Store
            </Link>
            
            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative text-gray-700 hover:text-panda-red-500 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-panda-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
            
            <PandaIDSystem redirectTo="/account" />

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-panda-black-700 hover:text-panda-red-500"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="md:hidden">
                <ProductSearch />
              </div>

              {/* Mobile Navigation Links */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-panda-black-700 hover:text-panda-red-500 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <Link
                href="/stores"
                className="flex items-center text-panda-red-500 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <MapPin className="w-5 h-5 mr-2" />
                Find Store
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Enhanced Cart Drawer */}
      <EnhancedCartDrawer />
    </header>
  )
}

export default Header