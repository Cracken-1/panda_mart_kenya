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
  Bell,
  Menu,
  X,
  Heart,
  Package,
  MapPin,
  Phone,
  Mail,
  Store,
  Gift,
  Settings,
  LogOut,
  ChevronDown,
  Home,
  Smartphone,
  Shirt,
  Leaf,
  Sparkles,
  Dumbbell,
  UtensilsCrossed
} from 'lucide-react';
import GlobalSearch from '@/components/search/GlobalSearch';
import NotificationCenter from '@/components/notifications/NotificationCenter';

export default function Header() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    { name: 'Shop in Store', href: '/shop-in-store' },
    { name: 'Categories', href: '#', hasDropdown: true },
    { name: 'Deals', href: '/deals' },
    { name: 'Support', href: '/support' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const unreadNotifications = 3; // This would come from your notification state

  return (
    <>
      <header className={`sticky top-0 z-40 bg-white transition-all duration-200 ${
        scrolled ? 'shadow-lg' : 'shadow-sm'
      }`}>
        {/* Top Bar */}
        <div className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-10 text-sm">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Phone className="w-3 h-3" />
                  <span>+254 712 345 678</span>
                </div>
                <div className="hidden sm:flex items-center space-x-2">
                  <Mail className="w-3 h-3" />
                  <span>support@pandamart.co.ke</span>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/shop-in-store" className="hover:text-emerald-400 transition-colors">
                  Find Store
                </Link>
                <Link href="/support" className="hover:text-emerald-400 transition-colors">
                  Help
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
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Panda Mart</span>
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
                          pathname.startsWith('/categories')
                            ? 'text-emerald-600 bg-emerald-50'
                            : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
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
                              <category.icon className="w-5 h-5 text-gray-400" />
                              <span className="text-gray-700">{category.name}</span>
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
                          ? 'text-emerald-600 bg-emerald-50'
                          : 'text-gray-700 hover:text-emerald-600 hover:bg-gray-50'
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
                <Search className="w-5 h-5 text-gray-400" />
                <span className="text-gray-500 text-left flex-1">Search products, stores...</span>
                <kbd className="hidden sm:inline-block px-2 py-1 text-xs text-gray-500 bg-white rounded border">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Mobile Search */}
              <button
                onClick={() => setShowSearch(true)}
                className="md:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Notifications */}
              {user && (
                <button
                  onClick={() => setShowNotifications(true)}
                  className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
              )}

              {/* Wishlist */}
              {user && (
                <Link
                  href="/account/wishlist"
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <Heart className="w-5 h-5" />
                </Link>
              )}

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <ShoppingCart className="w-5 h-5" />
                {cart.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
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
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      
                      <div className="py-2">
                        <Link
                          href="/account"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">Account Dashboard</span>
                        </Link>
                        
                        <Link
                          href="/account/orders"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <Package className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">My Orders</span>
                        </Link>
                        
                        <Link
                          href="/account/wishlist"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">Wishlist</span>
                        </Link>
                        
                        <Link
                          href="/account/loyalty"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <Gift className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">Loyalty Program</span>
                        </Link>
                        
                        <Link
                          href="/shop-in-store"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">Find Stores</span>
                        </Link>
                        
                        <Link
                          href="/account/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">Settings</span>
                        </Link>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-2">
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-gray-50 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-700">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-gray-700 hover:text-emerald-600 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
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
                        className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
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
                              className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                            >
                              <category.icon className="w-4 h-4" />
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
                          ? 'text-emerald-600 bg-emerald-50'
                          : 'text-gray-700 hover:bg-gray-50'
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

      {/* Notifications Modal */}
      <NotificationCenter 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </>
  );
}