'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, MapPin, ShoppingCart, Phone } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductSearch from '../search/ProductSearch'
import { useCartStore } from '@/lib/store/cartStore'
import EnhancedCartDrawer from '../cart/EnhancedCartDrawer'
import MockLoginButton from '../auth/MockLoginButton'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { totalItems, openCart } = useCartStore()

  const primaryNavigation = [
    { name: 'Home', href: '/', icon: '🏠' },
    { name: 'Shop in Store', href: '/shop-in-store', icon: '🏪', badge: 'New' },
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
      {/* Top Bar - Hidden on Mobile */}
      <div className="hidden md:block bg-gradient-to-r from-panda-red-500 to-red-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Contact Information */}
            <div className="flex items-center space-x-4 lg:space-x-8">
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">Garden City:</span>
                <a href="tel:0202311166" className="text-sm font-semibold hover:text-yellow-200 transition-colors">
                  020 231 1166
                </a>
              </div>
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">Galleria:</span>
                <a href="tel:0778666666" className="text-sm font-semibold hover:text-yellow-200 transition-colors">
                  077 866 6666
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="flex items-center space-x-4 text-sm">
              <Link href="/wholesale" className="font-medium hover:text-yellow-200 transition-colors">
                Wholesale
              </Link>
              <span className="text-white/60">|</span>
              <Link href="/contact" className="font-medium hover:text-yellow-200 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center space-x-2 lg:space-x-3 group">
                <div className="w-10 h-10 lg:w-14 lg:h-14 gradient-bg rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-lg lg:text-2xl">P</span>
                </div>
                <div>
                  <h1 className="text-lg lg:text-2xl font-bold text-panda-black-900 group-hover:text-panda-red-500 transition-colors">
                    Panda Mart
                  </h1>
                  <p className="text-xs lg:text-sm text-panda-red-500 font-semibold">Kenya</p>
                </div>
              </Link>
            </div>

            {/* Search Bar - Center */}
            <div className="hidden md:block flex-1 max-w-xl lg:max-w-2xl mx-4 lg:mx-8">
              <ProductSearch />
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-2 lg:space-x-3">
              {/* Find Store */}
              <Link
                href="/stores"
                className="hidden md:flex items-center px-3 lg:px-4 py-2 text-sm font-medium text-panda-red-500 hover:text-panda-red-600 hover:bg-panda-red-50 rounded-lg lg:rounded-xl transition-all duration-200 border border-panda-red-200 hover:border-panda-red-300"
              >
                <MapPin className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden lg:inline">Find Store</span>
                <span className="lg:hidden">Store</span>
              </Link>

              {/* Cart Button */}
              <button
                onClick={openCart}
                className="relative p-2 lg:p-3 text-gray-700 hover:text-panda-red-500 hover:bg-gray-100 rounded-lg lg:rounded-xl transition-all duration-200 border border-gray-200 hover:border-panda-red-200"
                title="Shopping Cart"
              >
                <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-panda-red-500 text-white text-xs rounded-full w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center font-bold shadow-lg animate-pulse">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </button>

              {/* Account Button */}
              <Link
                href="/account"
                className="hidden md:flex items-center px-3 lg:px-4 py-2 text-sm font-medium text-gray-700 hover:text-panda-red-500 hover:bg-gray-100 rounded-lg lg:rounded-xl transition-all duration-200 border border-gray-200 hover:border-panda-red-200"
                title="My Account"
              >
                <svg className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden lg:inline">Account</span>
              </Link>

              {/* Mock Login Button for Testing */}
              {process.env.NODE_ENV === 'development' && (
                <MockLoginButton 
                  size="sm" 
                  variant="outline"
                  className="hidden lg:flex"
                >
                  🧪 Test Login
                </MockLoginButton>
              )}



              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-panda-black-700 hover:text-panda-red-500 hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-200 bg-white shadow-sm"
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
            <div className="max-w-7xl mx-auto px-4 py-4">
              {/* Mobile Search */}
              <div className="mb-4">
                <ProductSearch />
              </div>

              {/* Quick Navigation - Large Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {primaryNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-panda-red-50 hover:to-red-100 rounded-2xl transition-all duration-200 border border-gray-200 hover:border-panda-red-300 shadow-sm hover:shadow-md group"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </span>
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-panda-red-600">
                      {item.name}
                    </span>
                    {item.badge && (
                      <span className="absolute -top-1 -right-1 px-2 py-0.5 text-xs font-bold text-white bg-panda-red-500 rounded-full shadow-lg">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Secondary Navigation - Compact */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                {secondaryNavigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-center px-4 py-3 text-gray-600 hover:text-panda-red-500 hover:bg-panda-red-50 font-medium rounded-xl transition-all duration-200 border border-gray-100 hover:border-panda-red-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              {/* Contact Information - Mobile */}
              <div className="bg-gradient-to-r from-panda-red-50 to-red-100 rounded-xl p-4 mb-4">
                <h4 className="text-sm font-semibold text-panda-red-800 mb-2">Store Contacts</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-panda-red-700">Garden City:</span>
                    <a href="tel:0202311166" className="text-sm font-semibold text-panda-red-800 hover:text-panda-red-900">
                      020 231 1166
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-panda-red-700">Galleria:</span>
                    <a href="tel:0778666666" className="text-sm font-semibold text-panda-red-800 hover:text-panda-red-900">
                      077 866 6666
                    </a>
                  </div>
                </div>
              </div>



              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <Link
                  href="/stores"
                  className="flex items-center justify-center px-4 py-3 bg-emerald-500 text-white hover:bg-emerald-600 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Find Store
                </Link>
                <Link
                  href="/wholesale"
                  className="flex items-center justify-center px-4 py-3 bg-panda-black-800 text-white hover:bg-panda-black-900 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Wholesale
                </Link>
              </div>

              {/* Account Button - Mobile */}
              <Link
                href="/account"
                className="flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-panda-red-500 to-red-600 text-white hover:from-panda-red-600 hover:to-red-700 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                My Account
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