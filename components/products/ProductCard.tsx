'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Zap, Heart, Star, Clock, Tag, Eye } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import Link from 'next/link'

interface ProductCardProps {
  product: {
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
  index?: number
}

const ProductCard = ({ product, index = 0 }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { addItem, openCart } = useCartStore()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.image,
      category: product.category,
      description: product.description,
      maxQuantity: product.maxQuantity,
      store: product.store,
      sku: product.sku,
      inStock: product.inStock,
      flashSale: product.flashSale,
      couponEligible: product.couponEligible
    })
    
    openCart()
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : product.discount || 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/products/${product.id}`}>
        <div 
          className="card overflow-hidden cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Product Image */}
          <div className="relative overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discountPercentage > 0 && (
                <div className="bg-panda-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                  -{discountPercentage}%
                </div>
              )}
              {product.flashSale && (
                <div className="bg-panda-black-900 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  Flash
                </div>
              )}
              {!product.inStock && (
                <div className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isWishlisted 
                  ? 'bg-panda-red-500 text-white' 
                  : 'bg-white/80 text-gray-600 hover:bg-white hover:text-panda-red-500'
              }`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>

            {/* Time Left for Flash Sale */}
            {product.flashSale && product.timeLeft && (
              <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-panda-black-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {product.timeLeft}
              </div>
            )}

            {/* Quick Actions Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              className="absolute inset-0 bg-black/20 flex items-center justify-center"
            >
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`btn-primary flex items-center ${
                    !product.inStock ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button className="bg-white/90 hover:bg-white text-panda-black-900 px-3 py-2 rounded-lg font-semibold transition-colors flex items-center">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Product Info */}
          <div className="p-4">
            {/* Category */}
            <div className="text-sm text-panda-red-500 font-medium mb-1">
              {product.category}
            </div>

            {/* Product Name */}
            <h3 className="font-semibold text-panda-black-900 mb-2 group-hover:text-panda-red-500 transition-colors line-clamp-2">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {product.rating} ({product.reviews})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-panda-black-900">
                  KES {product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    KES {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.couponEligible && (
                <div className="flex items-center text-xs text-panda-red-500">
                  <Tag className="w-3 h-3 mr-1" />
                  Coupon
                </div>
              )}
            </div>

            {/* Store Info */}
            <div className="text-xs text-gray-500 mb-3">
              Available at {product.store}
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`w-full btn-primary flex items-center justify-center ${
                !product.inStock ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default ProductCard