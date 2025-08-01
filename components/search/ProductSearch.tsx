'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Star, ArrowRight } from 'lucide-react'

interface Product {
  id: number
  name: string
  category: string
  price: string
  image: string
  rating: number
  store: string
}

const ProductSearch = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Mock product data
  const products: Product[] = [
    {
      id: 1,
      name: "Smart LED TV 43\"",
      category: "Electronics",
      price: "KES 35,000",
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=100&h=100&fit=crop",
      rating: 4.8,
      store: "Garden City"
    },
    {
      id: 2,
      name: "Modern L-Shaped Sofa",
      category: "Furniture",
      price: "KES 45,000",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop",
      rating: 4.9,
      store: "Garden City"
    },
    {
      id: 3,
      name: "Kitchen Cookware Set",
      category: "Homeware",
      price: "KES 8,500",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100&h=100&fit=crop",
      rating: 4.7,
      store: "Galleria"
    },
    {
      id: 4,
      name: "Wireless Headphones",
      category: "Electronics",
      price: "KES 3,500",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
      rating: 4.6,
      store: "Garden City"
    },
    {
      id: 5,
      name: "Office Chair",
      category: "Furniture",
      price: "KES 12,000",
      image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=100&h=100&fit=crop",
      rating: 4.5,
      store: "Galleria"
    }
  ]

  useEffect(() => {
    if (searchTerm.length > 2) {
      setIsLoading(true)
      // Simulate API call delay
      const timer = setTimeout(() => {
        const filtered = products.filter(product =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setResults(filtered)
        setIsLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setResults([])
    }
  }, [searchTerm])

  const handleOpen = () => {
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const handleClose = () => {
    setIsOpen(false)
    setSearchTerm('')
    setResults([])
    document.body.style.overflow = 'unset'
  }

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={handleOpen}
        className="flex items-center bg-gray-100 hover:bg-gray-200 rounded-lg px-4 py-2 w-64 transition-colors"
      >
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <span className="text-gray-500">Search products...</span>
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 outline-none text-lg"
                    autoFocus
                  />
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Search Results */}
              <div className="max-h-96 overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-panda-red-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Searching...</p>
                  </div>
                ) : searchTerm.length > 2 && results.length === 0 ? (
                  <div className="p-8 text-center">
                    <p className="text-gray-500 mb-2">No products found for "{searchTerm}"</p>
                    <p className="text-sm text-gray-400">Try searching for electronics, furniture, or homeware</p>
                  </div>
                ) : results.length > 0 ? (
                  <div className="p-4 space-y-3">
                    {results.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer group"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover mr-4"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-panda-red-500 transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <span>{product.category}</span>
                            <span>•</span>
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                              {product.rating}
                            </div>
                            <span>•</span>
                            <span>{product.store}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-panda-red-500">{product.price}</div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-panda-red-500 transition-colors ml-auto" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Start typing to search</p>
                    <p className="text-sm text-gray-400">Find electronics, furniture, homeware and more</p>
                  </div>
                )}
              </div>

              {/* Quick Categories */}
              {searchTerm.length === 0 && (
                <div className="p-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 mb-3">Popular categories:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Electronics', 'Furniture', 'Homeware', 'Beauty', 'Hardware'].map((category) => (
                      <button
                        key={category}
                        onClick={() => setSearchTerm(category)}
                        className="px-3 py-1 bg-gray-100 hover:bg-panda-red-100 hover:text-panda-red-700 rounded-full text-sm transition-colors"
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ProductSearch