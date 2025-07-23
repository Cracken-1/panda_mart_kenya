'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Star, MapPin, Share2, ShoppingBag, Trash2 } from 'lucide-react'

const WishlistSection = () => {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 1,
      name: "Smart LED TV 55\"",
      price: 45000,
      originalPrice: 55000,
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=300&h=200&fit=crop",
      rating: 4.8,
      reviews: 124,
      category: "Electronics",
      availability: "In Stock",
      store: "Westgate Mall",
      addedDate: "2024-01-15",
      onSale: true,
      discount: 18
    },
    {
      id: 2,
      name: "Modern L-Shaped Sofa",
      price: 42000,
      originalPrice: 50000,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=200&fit=crop",
      rating: 4.9,
      reviews: 89,
      category: "Furniture",
      availability: "In Stock",
      store: "Garden City",
      addedDate: "2024-01-12",
      onSale: true,
      discount: 16
    },
    {
      id: 3,
      name: "Premium Coffee Maker",
      price: 12000,
      originalPrice: 12000,
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop",
      rating: 4.7,
      reviews: 156,
      category: "Homeware",
      availability: "Low Stock",
      store: "Sarit Centre",
      addedDate: "2024-01-10",
      onSale: false,
      discount: 0
    },
    {
      id: 4,
      name: "Wireless Headphones Pro",
      price: 8500,
      originalPrice: 12000,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop",
      rating: 4.6,
      reviews: 203,
      category: "Electronics",
      availability: "Out of Stock",
      store: "Westgate Mall",
      addedDate: "2024-01-08",
      onSale: true,
      discount: 29
    },
    {
      id: 5,
      name: "Skincare Essentials Kit",
      price: 4500,
      originalPrice: 6000,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop",
      rating: 4.5,
      reviews: 67,
      category: "Beauty",
      availability: "In Stock",
      store: "Garden City",
      addedDate: "2024-01-05",
      onSale: true,
      discount: 25
    }
  ])

  const removeFromWishlist = (itemId: number) => {
    setWishlistItems(items => items.filter(item => item.id !== itemId))
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'In Stock': return 'text-green-600 bg-green-100'
      case 'Low Stock': return 'text-yellow-600 bg-yellow-100'
      case 'Out of Stock': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const totalValue = wishlistItems.reduce((sum, item) => sum + item.price, 0)
  const totalSavings = wishlistItems.reduce((sum, item) => sum + (item.originalPrice - item.price), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-panda-red-500 mr-3" />
            <div>
              <h2 className="text-2xl font-bold text-panda-black-900">My Wishlist</h2>
              <p className="text-gray-600">Save items you love for later</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-panda-red-500">{wishlistItems.length}</div>
            <div className="text-sm text-gray-500">Saved Items</div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-panda-black-900">
              KES {totalValue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Value</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-green-600">
              KES {totalSavings.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Potential Savings</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-xl font-bold text-panda-black-900">
              {wishlistItems.filter(item => item.onSale).length}
            </div>
            <div className="text-sm text-gray-600">On Sale</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex space-x-3 mt-4">
          <button className="flex items-center px-4 py-2 bg-panda-red-500 text-white rounded-lg hover:bg-panda-red-600 transition-colors">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Add All to Cart
          </button>
          <button className="flex items-center px-4 py-2 border-2 border-panda-red-500 text-panda-red-500 rounded-lg hover:bg-panda-red-50 transition-colors">
            <Share2 className="w-4 h-4 mr-2" />
            Share Wishlist
          </button>
        </div>
      </div>

      {/* Wishlist Items */}
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badges */}
                {item.onSale && (
                  <div className="absolute top-3 left-3 bg-panda-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    -{item.discount}%
                  </div>
                )}
                
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${getAvailabilityColor(item.availability)}`}>
                  {item.availability}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute bottom-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-red-500 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="text-sm text-panda-red-500 font-medium mb-1">
                  {item.category}
                </div>
                <h3 className="font-bold text-lg text-panda-black-900 mb-2 group-hover:text-panda-red-500 transition-colors">
                  {item.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center mb-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
                  <span className="text-sm text-gray-500 ml-2">({item.reviews})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xl font-bold text-panda-red-500">
                      KES {item.price.toLocaleString()}
                    </span>
                    {item.originalPrice > item.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">
                        KES {item.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                {/* Store Location */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-1" />
                  Available at {item.store}
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button 
                    disabled={item.availability === 'Out of Stock'}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                      item.availability === 'Out of Stock'
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-panda-red-500 text-white hover:bg-panda-red-600'
                    }`}
                  >
                    {item.availability === 'Out of Stock' ? 'Out of Stock' : 'Visit Store'}
                  </button>
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                      Share
                    </button>
                    <button className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                      Compare
                    </button>
                  </div>
                </div>

                {/* Added Date */}
                <div className="text-xs text-gray-400 mt-3">
                  Added on {item.addedDate}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Start adding items you love to keep track of them</p>
          <button className="btn-primary">
            Browse Products
          </button>
        </div>
      )}

      {/* Recommendations */}
      {wishlistItems.length > 0 && (
        <div className="card p-6">
          <h3 className="text-lg font-bold text-panda-black-900 mb-4">You Might Also Like</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Bluetooth Speaker", price: "KES 3,500", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&h=150&fit=crop" },
              { name: "Table Lamp", price: "KES 2,800", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150&fit=crop" },
              { name: "Storage Box", price: "KES 1,200", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&h=150&fit=crop" },
              { name: "Wall Clock", price: "KES 1,800", image: "https://images.unsplash.com/photo-1563906267088-b029e7101114?w=200&h=150&fit=crop" }
            ].map((item, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-24 object-cover rounded-lg mb-2 group-hover:scale-105 transition-transform"
                />
                <div className="text-sm font-semibold text-panda-black-900">{item.name}</div>
                <div className="text-sm text-panda-red-500 font-bold">{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default WishlistSection