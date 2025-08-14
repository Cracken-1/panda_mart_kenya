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
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        {/* Top Red Bar */}
        <div className="bg-red-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-10 text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3 h-3" />
                  <span>Free delivery in Nairobi</span>
                </div>
                <div className="hidden sm:flex items-center space-x-2">
                  <Phone className="w-3 h-3" />
                  <span>Customer Support: 020 231 1166</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/wholesale" className="hover:text-red-200 transition-colors">
                  Wholesale
                </Link>
                <Link href="/contact" className="hover:text-red-200 transition-colors">
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-black">Panda Mart</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigation.map((item) => (
                <div key={item.name} className="relative">
                  {item.hasDropdown ? (
                    <div className="categories-menu">
                      <button
                        onClick={() => setShowCategories(!showCategories)}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          pathname.startsWith('/collection')
                            ? 'text-red-600 bg-red-50'
                            : 'text-black hover:text-red-600 hover:bg-gray-50'
                        }`}
                      >
                        <span>{item.name}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      
                      {showCategories && (
                        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                          {categories.map((category) => (
                            <Link
                              key={category.name}
                              href={category.href}
                              onClick={() => setShowCategories(false)}
                              className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            >
                              <category.icon className="w-5 h-5 text-red-500" />
                              <span className="text-black">{category.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        pathname === item.href
                          ? 'text-red-600 bg-red-50'
                          : 'text-black hover:text-red-600 hover:bg-gray-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            {/* Search Bar */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <button
                onClick={() => setShowSearch(true)}
                className="w-full flex items-center space-x-3 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Search className="w-5 h-5 text-red-500" />
                <span className="text-black text-left flex-1">Search products...</span>
              </button>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Find Store */}
              <Link
                href="/stores"
                className="hidden lg:flex items-center space-x-2 px-3 py-2 text-black hover:text-red-600 transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Find Store</span>
              </Link>

              {/* Mobile Search */}
              <button
                onClick={() => setShowSearch(true)}
                className="md:hidden p-2 text-black hover:text-red-600 rounded-lg hover:bg-gray-100"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-black hover:text-red-600 rounded-lg hover:bg-gray-100"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {cart.itemCount}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative user-menu">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-black" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-black">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          href="/account"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-red-500" />
                          <span className="text-black">My Account</span>
                        </Link>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-gray-50 transition-colors"
                        >
                          <span className="text-black">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-black hover:text-red-600 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-black hover:text-red-600 rounded-lg hover:bg-gray-100"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.hasDropdown ? (
                    <div>
                      <button
                        onClick={() => setShowCategories(!showCategories)}
                        className="flex items-center justify-between w-full px-3 py-2 text-black hover:bg-gray-50 rounded-lg"
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${
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
                              className="flex items-center space-x-3 px-3 py-2 text-black hover:bg-gray-50 rounded-lg"
                            >
                              <category.icon className="w-4 h-4 text-red-500" />
                              <span>{category.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => setShowMobileMenu(false)}
                      className={`block px-3 py-2 rounded-lg font-medium ${
                        pathname === item.href
                          ? 'text-red-600 bg-red-50'
                          : 'text-black hover:bg-gray-50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}