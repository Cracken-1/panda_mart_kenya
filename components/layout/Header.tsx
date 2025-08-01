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
    { name: 'Flash Sale', href: '/flash-sale' },
    { name: 'Bundles', href: '/bundles' },
    { name: 'Deals & Promotions', href: '/deals' },
    { name: 'Our Collections', href: '/collections' },
    { name: 'Stores', href: '/stores' },
    { name: 'Panda Community', href: '/community' },
    { name: 'About Us', href: '/about' },
  ]

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">P</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-panda-black-900">Panda Mart</h1>
                <p className="text-sm text-panda-red-500 font-semibold">Kenya</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-panda-black-700 hover:text-panda-red-500 hover:bg-panda-red-50 rounded-lg transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Section - Search & Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="hidden lg:block">
              <ProductSearch />
            </div>

            {/* Find Store Link */}
            <Link 
              href="/stores" 
              className="hidden md:flex items-center px-3 py-2 text-sm font-medium text-panda-red-500 hover:text-panda-red-600 hover:bg-panda-red-50 rounded-lg transition-all duration-200"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Find Store
            </Link>
            
            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-gray-700 hover:text-panda-red-500 hover:bg-gray-100 rounded-lg transition-all duration-200"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-panda-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </button>
            
            {/* User Account */}
            <div className="flex items-center">
              <PandaIDSystem redirectTo="/account" />
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden p-2 text-panda-black-700 hover:text-panda-red-500 hover:bg-gray-100 rounded-lg transition-all duration-200"
              title="Menu"
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
            className="xl:hidden bg-white border-t shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Mobile Search */}
              <div className="lg:hidden mb-6">
                <ProductSearch />
              </div>

              {/* Mobile Navigation Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center px-4 py-3 text-panda-black-700 hover:text-panda-red-500 hover:bg-panda-red-50 font-medium rounded-lg transition-all duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              
              {/* Mobile Find Store */}
              <div className="border-t pt-4">
                <Link
                  href="/stores"
                  className="flex items-center justify-center px-4 py-3 text-panda-red-500 hover:text-panda-red-600 hover:bg-panda-red-50 font-medium rounded-lg transition-all duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Find Store
                </Link>
              </div>
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