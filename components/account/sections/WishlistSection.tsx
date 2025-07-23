'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, ShoppingCart, Share2, Trash2, Filter,
  Search, Grid, List, Star, Eye, Plus, Tag,
  TrendingUp, Clock, AlertCircle, CheckCircle,
  ExternalLink, Copy, X, Sparkles
} from 'lucide-react'

interface WishlistItem {
  id: number
  name: string
  price: number
  originalPrice: number
  discount: number
  category: string
  brand: string
  rating: number
  reviews: number
  inStock: boolean
  store: string
  addedDate: string
  image?: string
  description?: string
  features?: string[]
  priceHistory?: { date: string; price: number }[]
}

const WishlistSection = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: 1,
      name: 'Samsung 55" Smart TV 4K UHD',
      price: 89999,
      originalPrice: 109999,
      discount: 18,
      category: 'Electronics',
      brand: 'Samsung',
      rating: 4.5,
      reviews: 234,
      inStock: true,
      store: 'Westgate Mall',
      addedDate: '2024-01-15',
      description: 'Crystal clear 4K UHD display with smart TV features',
      features: ['4K UHD', 'Smart TV', 'HDR10+', 'Voice Control'],
      priceHistory: [
        { date: '2024-01-01', price: 109999 },
        { date: '2024-01-15', price: 89999 }
      ]
    },
    {
      id: 2,
      name: 'Nike Air Max 270 Sneakers',
      price: 12999,
      originalPrice: 15999,
      discount: 19,
      category: 'Fashion',
      brand: 'Nike',
      rating: 4.8,
      reviews: 156,
      inStock: true,
      store: 'Sarit Centre',
      addedDate: '2024-01-18',
      description: 'Comfortable running shoes with Air Max technology',
      features: ['Air Max Cushioning', 'Breathable Mesh', 'Durable Sole'],
      priceHistory: [
        { date: '2024-01-01', price: 15999 },
        { date: '2024-01-18', price: 12999 }
      ]
    },
    {
      id: 3,
      name: 'KitchenAid Stand Mixer Professional',
      price: 45999,
      originalPrice: 52999,
      discount: 13,
      category: 'Home & Kitchen',
      brand: 'KitchenAid',
      rating: 4.7,
      reviews: 89,
      inStock: false,
      store: 'Junction Mall',
      addedDate: '2024-01-20',
      description: 'Professional-grade stand mixer for all your baking needs',
      features: ['6-Quart Bowl', '10 Speeds', 'Tilt-Head Design', 'Multiple Attachments']
    },
    {
      id: 4,
      name: 'Dyson V15 Detect Vacuum Cleaner',
      price: 67999,
      originalPrice: 79999,
      discount: 15,
      category: 'Home & Kitchen',
      brand: 'Dyson',
      rating: 4.9,
      reviews: 312,
      inStock: true,
      store: 'Westgate Mall',
      addedDate: '2024-01-22',
      description: 'Advanced cordless vacuum with laser dust detection',
      features: ['Laser Detection', 'HEPA Filtration', '60min Runtime', 'LCD Display']
    }
  ])

  const categories = ['all', 'Electronics', 'Fashion', 'Home & Kitchen', 'Beauty', 'Sports']
  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'discount', label: 'Highest Discount' },
    { value: 'rating', label: 'Highest Rated' }
  ]

  // Filter and sort items
  const filteredAndSortedItems = wishlistItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
        case 'oldest':
          return new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime()
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'discount':
          return b.discount - a.discount
        case 'rating':
          return b.rating - a.rating
        default:
          return 0
      }
    })

  // Handle actions
  const handleRemoveFromWishlist = async (id: number) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setWishlistItems(items => items.filter(item => item.id !== id))
      setNotification({ type: 'success', message: 'Item removed from wishlist' })
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to remove item' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = async (id: number) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Save to cart in localStorage
      const cartItems = JSON.parse(localStorage.getItem('panda_cart') || '[]')
      const wishlistItem = wishlistItems.find(item => item.id === id)
      
      if (wishlistItem) {
        const cartItem = {
          id: wishlistItem.id,
          name: wishlistItem.name,
          price: wishlistItem.price,
          quantity: 1,
          addedAt: new Date().toISOString()
        }
        cartItems.push(cartItem)
        localStorage.setItem('panda_cart', JSON.stringify(cartItems))
      }
      
      setNotification({ type: 'success', message: 'Item added to cart' })
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to add to cart' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkAddToCart = async () => {
    if (selectedItems.length === 0) return
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setNotification({ type: 'success', message: `${selectedItems.length} items added to cart` })
      setSelectedItems([])
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to add items to cart' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBulkRemove = async () => {
    if (selectedItems.length === 0) return
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setWishlistItems(items => items.filter(item => !selectedItems.includes(item.id)))
      setNotification({ type: 'success', message: `${selectedItems.length} items removed from wishlist` })
      setSelectedItems([])
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to remove items' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleShareWishlist = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Panda Mart Wishlist',
          text: `Check out my wishlist with ${wishlistItems.length} amazing items!`,
          url: window.location.href
        })
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(window.location.href)
        setNotification({ type: 'success', message: 'Wishlist link copied to clipboard' })
      }
    } catch (error) {
      setNotification({ type: 'error', message: 'Failed to share wishlist' })
    }
  }

  const toggleItemSelection = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    )
  }

  const selectAllItems = () => {
    setSelectedItems(filteredAndSortedItems.map(item => item.id))
  }

  const clearSelection = () => {
    setSelectedItems([])
  }

  // Auto-hide notifications
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  return (
    <div className="space-y-6 relative">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out ${
          notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {notification.message}
        </div>
      )}
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
          <p className="text-gray-600">{wishlistItems.length} items saved for later</p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={handleShareWishlist}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Wishlist
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search wishlist..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            <div className="aspect-square bg-gray-100 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-gray-500 text-sm">Product Image</span>
              </div>
              {item.discount > 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  -{item.discount}%
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{item.brand}</p>

              <div className="flex items-center mb-3">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500 ml-2">({item.reviews})</span>
              </div>

              <div className="mb-4">
                <span className="text-lg font-bold text-gray-900">
                  KES {item.price.toLocaleString()}
                </span>
                {item.originalPrice > item.price && (
                  <span className="text-sm text-gray-500 line-through ml-2">
                    KES {item.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <button 
                onClick={() => handleAddToCart(item.id)}
                disabled={!item.inStock || isLoading}
                className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center ${
                  item.inStock && !isLoading
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {!item.inStock ? 'Out of Stock' : isLoading ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default WishlistSection