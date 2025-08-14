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
            <div className="flex items-center justify-between h-18 py-3">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <Store className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                </div>
                <div className="hidden sm:block">
                  <span className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">Panda Mart</span>
                  <div className="text-xs text-gray-500 font-medium">Kenya</div>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center">
              <div className="flex items-center bg-gray-50 rounded-full p-1 space-x-1">
                {navigation.map((item, index) => (
                  <div key={item.name} className="relative">
                    {item.hasDropdown ? (
                      <div className="categories-menu">
                        <button
                          onClick={() => setShowCategories(!showCategories)}
                          className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                            pathname.startsWith('/collection')
                              ? 'text-white bg-red-500 shadow-md'
                              : 'text-gray-700 hover:text-red-600 hover:bg-white hover:shadow-sm'
                          }`}
                        >
                          <span>{item.name}</span>
                          <ChevronDown className={`w-3 h-3 transition-transform ${showCategories ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {showCategories && (
                          <div className="absolute top-full left-0 mt-3 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in slide-in-from-top-2 duration-200">
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
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                          pathname === item.href
                            ? 'text-white bg-red-500 shadow-md'
                            : 'text-gray-700 hover:text-red-600 hover:bg-white hover:shadow-sm'
                        }`}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </nav>

            {/* Search Bar */}
            <div className="hidden lg:flex flex-1 max-w-md mx-6">
              <div className="relative w-full group">
                <button
                  onClick={() => setShowSearch(true)}
                  className="w-full flex items-center space-x-3 px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 border border-gray-200 hover:border-red-200 hover:shadow-lg group-hover:scale-[1.02]"
                >
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <Search className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-600 text-left flex-1 font-medium">Search products, brands...</span>
                  <div className="hidden sm:flex items-center space-x-1 px-2 py-1 bg-white rounded-lg border border-gray-200">
                    <span className="text-xs text-gray-400">⌘</span>
                    <span className="text-xs text-gray-400">K</span>
                  </div>
                </button>
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Find Store */}
              <Link
                href="/stores"
                className="hidden xl:flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-red-600 transition-all duration-200 rounded-xl hover:bg-red-50 group"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                  <MapPin className="w-4 h-4 group-hover:text-red-600" />
                </div>
                <div className="hidden 2xl:block">
                  <div className="text-sm font-medium">Find Store</div>
                  <div className="text-xs text-gray-500">Locate nearby</div>
                </div>
              </Link>

              {/* Mobile Search */}
              <button
                onClick={() => setShowSearch(true)}
                className="lg:hidden relative p-3 text-gray-700 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 group"
              >
                <Search className="w-5 h-5" />
                <div className="absolute inset-0 bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-3 text-gray-700 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 group"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {cart.itemCount > 0 && (
                    <>
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                        {cart.itemCount}
                      </span>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-ping"></div>
                    </>
                  )}
                </div>
                <div className="absolute inset-0 bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative user-menu">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-red-50 transition-all duration-200 group"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <span className="text-white text-sm font-bold">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-medium text-gray-900 group-hover:text-red-600">
                        {user.firstName}
                      </div>
                      <div className="text-xs text-gray-500">My Account</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-red-600 transition-colors" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold">
                              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          href="/account"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors group"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200">
                            <User className="w-4 h-4 text-red-600" />
                          </div>
                          <span className="text-gray-700 group-hover:text-red-600 font-medium">My Account</span>
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-3 w-full text-left hover:bg-gray-50 transition-colors group"
                        >
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200">
                            <span className="text-gray-600 text-sm">→</span>
                          </div>
                          <span className="text-gray-700 group-hover:text-gray-900 font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-gray-700 hover:text-red-600 font-medium rounded-xl hover:bg-red-50 transition-all duration-200"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="xl:hidden p-3 text-gray-700 hover:text-red-600 rounded-xl hover:bg-red-50 transition-all duration-200 group ml-2"
              >
                <div className="relative">
                  {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </div>
                <div className="absolute inset-0 bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 -z-10"></div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="xl:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-6 space-y-3">
              {/* Mobile Search */}
              <div className="lg:hidden mb-4">
                <button
                  onClick={() => {
                    setShowSearch(true);
                    setShowMobileMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-gray-600 font-medium">Search products...</span>
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
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}