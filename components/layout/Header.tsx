'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Store,
  ChevronDown,
  Home,
  Smartphone,
  Shirt,
  Sparkles,
  Dumbbell,
  UtensilsCrossed,
  MapPin,
  Phone
} from 'lucide-react';
import GlobalSearch from '@/components/search/GlobalSearch';

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const categories = [
    { name: 'Electronics', icon: Smartphone, href: '/categories/electronics' },
    { name: 'Fashion', icon: Shirt, href: '/categories/fashion' },
    { name: 'Home & Garden', icon: Home, href: '/categories/home-garden' },
    { name: 'Health & Beauty', icon: Sparkles, href: '/categories/health-beauty' },
    { name: 'Sports & Outdoors', icon: Dumbbell, href: '/categories/sports' },
    { name: 'Food & Beverages', icon: UtensilsCrossed, href: '/categories/food' }
  ];

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Hot Deals', href: '/deals' },
    { name: 'Bundles', href: '/bundles' },
    { name: 'Collection', href: '#', hasDropdown: true },
    { name: 'Stores', href: '/stores' },
    { name: 'Community', href: '/community' },
    { name: 'Contact', href: '/contact' }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.user-menu')) {
        setShowUserMenu(false);
      }
      if (!target.closest('.categories-menu')) {
        setShowCategories(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    setShowUserMenu(false);
    router.push('/');
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white shadow-lg">
        {/* Top Red Bar */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-9 text-xs font-medium">
              <div className="flex items-center space-x-4 lg:space-x-8">
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3 h-3 text-red-100" />
                  <span className="hidden sm:inline">Free delivery in Nairobi</span>
                  <span className="sm:hidden">Free delivery</span>
                </div>
                <div className="hidden md:flex items-center space-x-1.5">
                  <Phone className="w-3 h-3 text-red-100" />
                  <span>Support: 020 231 1166</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 lg:space-x-6">
                <Link href="/wholesale" className="hover:text-red-100 transition-colors text-xs font-medium">
                  Wholesale
                </Link>
                <Link href="/contact" className="hover:text-red-100 transition-colors text-xs font-medium">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0 mr-8">
                <Link href="/" className="flex items-center space-x-2 group">
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300">
                      <Store className="w-5 h-5 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">Panda Mart</span>
                    <div className="text-xs text-gray-500 font-medium -mt-1">Kenya</div>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center mr-6">
                <div className="flex items-center space-x-1">
                  {navigation.map((item, index) => (
                    <div key={item.name} className="relative">
                      {item.hasDropdown ? (
                        <div className="categories-menu">
                          <button
                            onClick={() => setShowCategories(!showCategories)}
                            className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                              pathname.startsWith('/collection')
                                ? 'text-red-600 bg-red-50'
                                : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                            }`}
                          >
                            <span>{item.name}</span>
                            <ChevronDown className={`w-3 h-3 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showCategories && (
                            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-100 py-3 z-50">
                              <div className="px-4 py-2 border-b border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-900">Browse Categories</h3>
                              </div>
                              <div className="py-2">
                                {categories.map((category) => (
                                  <Link
                                    key={category.name}
                                    href={category.href}
                                    onClick={() => setShowCategories(false)}
                                    className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors group"
                                  >
                                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                                      <category.icon className="w-4 h-4 text-red-600" />
                                    </div>
                                    <span className="text-gray-700 group-hover:text-red-600 font-medium">{category.name}</span>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <Link
                          href={item.href}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            pathname === item.href
                              ? 'text-red-600 bg-red-50'
                              : 'text-gray-700 hover:text-red-600 hover:bg-red-50'
                          }`}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </nav>

              {/* Compact Search Bar */}
              <div className="flex-1 max-w-md mx-4">
                <button
                  onClick={() => setShowSearch(true)}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-red-300 group"
                >
                  <div className="w-5 h-5 bg-red-500 rounded-lg flex items-center justify-center">
                    <Search className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-600 text-sm flex-1 text-left">Search products...</span>
                  <div className="hidden sm:flex items-center space-x-2">
                    <span className="text-xs text-gray-500">Advanced</span>
                    <div className="px-2 py-1 bg-white rounded border text-xs text-gray-500">⌘K</div>
                  </div>
                </button>
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-2">
                {/* Find Store */}
                <Link
                  href="/stores"
                  className="hidden xl:flex items-center px-3 py-2 text-gray-700 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Stores</span>
                </Link>

                {/* Mobile Search */}
                <button
                  onClick={() => setShowSearch(true)}
                  className="md:hidden p-2 text-gray-700 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Cart */}
                <Link
                  href="/cart"
                  className="relative p-2 text-gray-700 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cart.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                      {cart.itemCount}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                {user ? (
                  <div className="relative user-menu">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div className="hidden lg:block text-left">
                        <div className="text-sm font-medium text-gray-900">{user.firstName}</div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        
                        <div className="py-2">
                          <Link
                            href="/account"
                            onClick={() => setShowUserMenu(false)}
                            className="flex items-center space-x-3 px-4 py-2 hover:bg-red-50 transition-colors"
                          >
                            <User className="w-4 h-4 text-red-600" />
                            <span className="text-gray-700">My Account</span>
                          </Link>
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-gray-50 transition-colors"
                          >
                            <span className="text-gray-700">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/account"
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden lg:inline">Account</span>
                  </Link>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden p-2 text-gray-700 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors ml-2"
                >
                  {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-6 space-y-3">
              {/* Mobile Search */}
              <div className="mb-4">
                <button
                  onClick={() => {
                    setShowSearch(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-700 font-medium">Search products...</span>
                </button>
              </div>

              {navigation.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setShowCategories(!showCategories)}
                        className="flex items-center justify-between w-full px-4 py-3 text-gray-900 hover:bg-red-50 rounded-xl transition-colors font-medium"
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`w-4 h-4 text-red-500 transition-transform ${
                          showCategories ? 'rotate-180' : ''
                        }`} />
                      </button>
                      {showCategories && (
                        <div className="mt-2 ml-4 space-y-2 animate-in slide-in-from-top-1 duration-200">
                          {categories.map((category) => (
                            <Link
                              key={category.name}
                              href={category.href}
                              onClick={() => {
                                setShowMobileMenu(false);
                                setShowCategories(false);
                              }}
                              className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-xl transition-colors group"
                            >
                              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200">
                                <category.icon className="w-4 h-4 text-red-600" />
                              </div>
                              <span className="font-medium group-hover:text-red-600">{category.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setShowMobileMenu(false)}
                      className={`flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${
                        pathname === item.href
                          ? 'text-white bg-red-500 shadow-lg'
                          : 'text-gray-900 hover:bg-red-50 hover:text-red-600'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile Find Store */}
              <Link
                href="/stores"
                onClick={() => setShowMobileMenu(false)}
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-xl transition-colors group mt-4 border-t border-gray-100 pt-6"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-red-100">
                  <MapPin className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                </div>
                <span className="font-medium group-hover:text-red-600">Find Store</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}