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

        {/* Main Header - Two Row Layout */}
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Top Row - Logo, Search, Cart, Account */}
            <div className="flex items-center justify-between h-14 border-b border-gray-50">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0">
                <Link href="/" className="flex items-center space-x-2 group">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300">
                      <Store className="w-4 h-4 text-white" />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">Panda Mart</span>
                    <div className="text-xs text-gray-500 font-medium -mt-0.5">Kenya</div>
                  </div>
                </Link>
              </div>

              {/* Enhanced Search Bar */}
              <div className="flex-1 max-w-2xl mx-8">
                <div className="relative">
                  <button
                    onClick={() => setShowSearch(true)}
                    className="w-full flex items-center space-x-3 px-5 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 border border-gray-200 hover:border-red-300 shadow-sm hover:shadow-md group"
                  >
                    <div className="w-6 h-6 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm">
                      <Search className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-gray-700 font-medium">Search products, brands, categories...</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="hidden lg:flex items-center space-x-1 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <span className="text-xs text-gray-600 font-medium">Advanced</span>
                      </div>
                      <div className="flex items-center space-x-1 px-2.5 py-1.5 bg-red-50 rounded-lg border border-red-200">
                        <span className="text-xs text-red-600 font-bold">⌘K</span>
                      </div>
                    </div>
                  </button>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                {/* Mobile Search */}
                <button
                  onClick={() => setShowSearch(true)}
                  className="lg:hidden p-2.5 text-gray-600 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Cart */}
                <Link
                  href="/cart"
                  className="relative p-2.5 text-gray-600 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                >
                  <ShoppingCart className="w-5 h-5" />
                  {cart.itemCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-bounce">
                      {cart.itemCount}
                    </div>
                  )}
                </Link>

                {/* Account */}
                {user ? (
                  <div className="relative user-menu">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 p-2 bg-gray-50 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-sm">
                        <span className="text-white text-sm font-bold">
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </span>
                      </div>
                      <div className="hidden lg:block text-left">
                        <div className="text-sm font-medium text-gray-900 group-hover:text-red-600">{user.firstName}</div>
                        <div className="text-xs text-gray-500">My Account</div>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
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
                    className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl group"
                  >
                    <User className="w-4 h-4" />
                    <div className="hidden lg:block text-left">
                      <div className="text-sm font-semibold">Account</div>
                      <div className="text-xs opacity-90">Sign in</div>
                    </div>
                  </Link>
                )}

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden p-2.5 text-gray-600 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Bottom Row - Navigation */}
            <div className="flex items-center justify-between h-12">
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navigation.map((item, index) => (
                  <div key={item.name} className="relative">
                    {item.hasDropdown ? (
                      <div className="categories-menu">
                        <button
                          onClick={() => setShowCategories(!showCategories)}
                          className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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
              </nav>

              {/* Find Store Link */}
              <Link
                href="/stores"
                className="hidden lg:flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Find Stores</span>
              </Link>
            </div>
          </div>
        </div>



        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-4 space-y-2">
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
                        <div className="mt-2 ml-4 space-y-1">
                          {categories.map((category) => (
                            <Link
                              key={category.name}
                              href={category.href}
                              onClick={() => {
                                setShowMobileMenu(false);
                                setShowCategories(false);
                              }}
                              className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-red-50 rounded-lg transition-colors group"
                            >
                              <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200">
                                <category.icon className="w-3 h-3 text-red-600" />
                              </div>
                              <span className="text-sm font-medium group-hover:text-red-600">{category.name}</span>
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
                          ? 'text-white bg-red-500'
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
                className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 rounded-xl transition-colors group border-t border-gray-100 mt-4 pt-4"
              >
                <MapPin className="w-4 h-4 text-red-500" />
                <span className="font-medium">Find Stores</span>
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