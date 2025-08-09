'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Filter, Grid, List, SlidersHorizontal, Star, ShoppingCart } from 'lucide-react'
import { useParams } from 'next/navigation'
import ProductCard from '@/components/products/ProductCard'

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  category: string
  description: string
  rating: number
  reviews: number
  store: string
  sku: string
  inStock: boolean
  maxQuantity: number
  flashSale?: boolean
  timeLeft?: string
  couponEligible?: boolean
}

const CategoryPage = () => {
  const params = useParams()
  const category = params.category as string
  
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 100000])
  const [selectedStore, setSelectedStore] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState('grid')

  // Mock product data - In real app, this would come from API/database
  const mockProducts: Record<string, Product[]> = {
    electronics: [
      {
        id: 'elec-1',
        name: 'Smart LED TV 55"',
        price: 45000,
        originalPrice: 65000,
        discount: 31,
        image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
        category: 'Electronics',
        description: 'Ultra HD Smart TV with streaming capabilities',
        rating: 4.8,
        reviews: 124,
        store: 'Panda Mart Garden City',
        sku: 'TV-55-001',
        inStock: true,
        maxQuantity: 5,
        flashSale: true,
        timeLeft: '2 days left',
        couponEligible: true
      },
      {
        id: 'elec-2',
        name: 'Wireless Bluetooth Headphones',
        price: 3500,
        originalPrice: 5000,
        discount: 30,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
        category: 'Electronics',
        description: 'Premium wireless headphones with noise cancellation',
        rating: 4.6,
        reviews: 89,
        store: 'Panda Mart Garden City',
        sku: 'HP-WL-002',
        inStock: true,
        maxQuantity: 10,
        couponEligible: true
      },
      {
        id: 'elec-3',
        name: 'Smartphone 128GB',
        price: 22000,
        originalPrice: 30000,
        discount: 27,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
        category: 'Electronics',
        description: 'Latest smartphone with advanced camera system',
        rating: 4.4,
        reviews: 312,
        store: 'Panda Mart Galleria',
        sku: 'PH-128-003',
        inStock: true,
        maxQuantity: 3,
        couponEligible: false
      }
    ],
    furniture: [
      {
        id: 'furn-1',
        name: '3-Seater Sofa Set',
        price: 32000,
        originalPrice: 45000,
        discount: 29,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
        category: 'Furniture',
        description: 'Comfortable modern sofa set for living room',
        rating: 4.9,
        reviews: 156,
        store: 'Panda Mart Garden City',
        sku: 'SF-3ST-001',
        inStock: true,
        maxQuantity: 2,
        couponEligible: true
      },
      {
        id: 'furn-2',
        name: 'Dining Table Set',
        price: 18000,
        originalPrice: 25000,
        discount: 28,
        image: 'https://images.unsplash.com/photo-1549497538-303791108f95?w=400&h=300&fit=crop',
        category: 'Furniture',
        description: '6-seater wooden dining table with chairs',
        rating: 4.7,
        reviews: 203,
        store: 'Panda Mart Galleria',
        sku: 'DT-6ST-002',
        inStock: true,
        maxQuantity: 1,
        couponEligible: true
      }
    ],
    homeware: [
      {
        id: 'home-1',
        name: 'Kitchen Appliance Bundle',
        price: 15000,
        originalPrice: 20000,
        discount: 25,
        image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
        category: 'Homeware',
        description: 'Complete kitchen appliance set for modern cooking',
        rating: 4.5,
        reviews: 67,
        store: 'Panda Mart Garden City',
        sku: 'KA-BND-001',
        inStock: true,
        maxQuantity: 5,
        couponEligible: true
      }
    ],
    beauty: [
      {
        id: 'beauty-1',
        name: 'Beauty Care Bundle',
        price: 6500,
        originalPrice: 10000,
        discount: 35,
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop',
        category: 'Beauty',
        description: 'Complete skincare and beauty routine set',
        rating: 4.6,
        reviews: 89,
        store: 'Panda Mart Galleria',
        sku: 'BC-BND-001',
        inStock: true,
        maxQuantity: 8,
        flashSale: true,
        timeLeft: '1 day left',
        couponEligible: true
      }
    ],
    hardware: [
      {
        id: 'hard-1',
        name: 'Power Tool Set',
        price: 12000,
        originalPrice: 18000,
        discount: 33,
        image: 'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=300&fit=crop',
        category: 'Hardware',
        description: 'Professional power tools for DIY projects',
        rating: 4.5,
        reviews: 45,
        store: 'Panda Mart Garden City',
        sku: 'PT-SET-001',
        inStock: true,
        maxQuantity: 3,
        couponEligible: false
      }
    ]
  }

  useEffect(() => {
    // Simulate API call
    setLoading(true)
    setTimeout(() => {
      const categoryProducts = mockProducts[category] || []
      setProducts(categoryProducts)
      setFilteredProducts(categoryProducts)
      setLoading(false)
    }, 500)
  }, [category])

  useEffect(() => {
    let filtered = [...products]

    // Filter by store
    if (selectedStore !== 'all') {
      filtered = filtered.filter(product => product.store === selectedStore)
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    )

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'discount':
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0))
        break
      default:
        // Featured - keep original order
        break
    }

    setFilteredProducts(filtered)
  }, [products, sortBy, priceRange, selectedStore])

  const categoryNames: Record<string, string> = {
    electronics: 'Electronics',
    furniture: 'Furniture', 
    homeware: 'Homeware',
    beauty: 'Beauty & Lifestyle',
    hardware: 'Hardware'
  }

  const stores = ['all', 'Panda Mart Garden City', 'Panda Mart Galleria']

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-panda-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-panda-black-900">
                {categoryNames[category] || 'Products'}
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredProducts.length} products found
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="hidden sm:flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

              {/* Filters Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-panda-red-500 text-white px-4 py-2 rounded-lg hover:bg-panda-red-600 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              {/* Sort By */}
              <div>
                <h3 className="font-semibold text-panda-black-900 mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Best Discount</option>
                </select>
              </div>

              {/* Store Filter */}
              <div>
                <h3 className="font-semibold text-panda-black-900 mb-3">Store</h3>
                <select
                  value={selectedStore}
                  onChange={(e) => setSelectedStore(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
                >
                  <option value="all">All Stores</option>
                  {stores.slice(1).map(store => (
                    <option key={store} value={store}>{store}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-panda-black-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>KES 0</span>
                    <span>KES {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your filters or browse other categories
                </p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPage