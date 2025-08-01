'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, MapPin, ShoppingCart, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductSearch from '../search/ProductSearch'
import PandaIDSystem from '../auth/PandaIDSystem'
import { useCartStore } from '@/lib/store/cartStore'
import EnhancedCartDrawer from '../cart/EnhancedCartDrawer'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems, openCart } = useCartStore()

  const primaryNavigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Flash Sale', href: '/flash-sale', icon: '⚡', badge: 'Hot' },
    { name: 'Bundles', href: '/bundles', icon: '📦', badge: 'Save' },
    { name: 'Deals', href: '/deals', icon: '🏷️' },
  ]

  const secondaryNavigation = [
    { name: 'Collections', href: '/collections' },
    { name: 'Stores', href: '/stores' },
    { name: 'Community', href: '/community' },
    { name: 'About', href: '/about' },
  ]

  return (
    <header className="bg-white shadow-xl sticky top-0 z-50 border-b border-gray-100">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-panda-red-500 to-red-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                Free delivery in Nairobi
              </span>
              <span className="hidden sm:flex items-center">
                📞 Customer Support: 020 231 1166
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/wholesale" className="hover:underline">Wholesale</Link>
              <Link href="/contact" className="hover:underline">Contact</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="w-14 h-14 gradient-bg rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-2xl">P</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-panda-black-900 group-hover:text-panda-red-500 transition-colors">
                    Panda Mart
                  </h1>
                  <p className="text-sm text-panda-red-500 font-semibold">Kenya</p>
                </div>
              </Link>
            </div>

            {/* Search Bar - Center */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <ProductSearch />
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {/* Find Store */}
              <Link 
                href="/stores" 
                className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-panda-red-500 hover:text-panda-red-600 hover:bg-panda-red-50 rounded-xl transition-all duration-200 border border-panda-red-200 hover:border-panda-red-300"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Find Store
              </Link>
              
              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative p-3 text-gray-700 hover:text-panda-red-500 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-panda-red-200"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-panda-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
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
                className="lg:hidden p-3 text-panda-black-700 hover:text-panda-red-500 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200"
                title="Menu"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            {/* Primary Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {primaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative flex items-center px-4 py-2 text-sm font-medium text-panda-black-700 hover:text-panda-red-500 hover:bg-white rounded-xl transition-all duration-200 group"
                >
                  <span className="mr-2 text-lg group-hover:scale-110 transition-transform">
                    {item.icon}
                  </span>
                  {item.name}
                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 text-xs font-bold text-white bg-panda-red-500 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Secondary Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium text-gray-600 hover:text-panda-red-500 transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
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
            className="lg:hidden bg-white border-t shadow-2xl"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {/* Mobile Search */}
              <div className="mb-6">
                <ProductSearch />
              </div>

              {/* Primary Navigation */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Main Menu
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {primaryNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-4 py-3 text-panda-black-700 hover:text-panda-red-500 hover:bg-panda-red-50 font-medium rounded-xl transition-all duration-200 border border-gray-100 hover:border-panda-red-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="mr-3 text-lg">{item.icon}</span>
                      {item.name}
                      {item.badge && (
                        <span className="ml-auto px-2 py-0.5 text-xs font-bold text-white bg-panda-red-500 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Secondary Navigation */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  More
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {secondaryNavigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center justify-center px-4 py-3 text-gray-600 hover:text-panda-red-500 hover:bg-gray-50 font-medium rounded-xl transition-all duration-200 border border-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Mobile Actions */}
              <div className="border-t pt-4 space-y-2">
                <Link
                  href="/stores"
                  className="flex items-center justify-center px-4 py-3 text-panda-red-500 hover:text-panda-red-600 hover:bg-panda-red-50 font-medium rounded-xl transition-all duration-200 border border-panda-red-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Find Store
                </Link>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Link
                    href="/wholesale"
                    className="flex items-center justify-center px-3 py-2 text-gray-600 hover:text-panda-red-500 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Wholesale
                  </Link>
                  <Link
                    href="/contact"
                    className="flex items-center justify-center px-3 py-2 text-gray-600 hover:text-panda-red-500 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </div>
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