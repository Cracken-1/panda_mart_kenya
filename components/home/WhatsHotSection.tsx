'use client'

import { motion } from 'framer-motion'
import { Flame, ArrowRight, Star } from 'lucide-react'
import Link from 'next/link'

const WhatsHotSection = () => {
  const hotProducts = [
    {
      id: 1,
      name: "Smart LED TV 43\"",
      category: "Electronics",
      price: "KES 35,000",
      originalPrice: "KES 45,000",
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
      badge: "22% OFF",
      rating: 4.8,
      trending: true
    },
    {
      id: 2,
      name: "Modern Sofa Set",
      category: "Furniture",
      price: "KES 28,000",
      originalPrice: "KES 35,000",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
      badge: "20% OFF",
      rating: 4.9,
      trending: true
    },
    {
      id: 3,
      name: "Kitchen Appliance Set",
      category: "Homeware",
      price: "KES 15,000",
      originalPrice: "KES 20,000",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      badge: "25% OFF",
      rating: 4.7,
      trending: true
    },
    {
      id: 4,
      name: "Beauty Care Bundle",
      category: "Beauty",
      price: "KES 8,500",
      originalPrice: "KES 12,000",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
      badge: "30% OFF",
      rating: 4.6,
      trending: true
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center mb-4"
            >
              <Flame className="w-8 h-8 text-panda-red-500 mr-3" />
              <h2 className="text-3xl md:text-4xl font-bold text-panda-black-900">
                What's Hot Now
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-lg"
            >
              Trending products that our customers love
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link href="/collections" className="hidden md:flex items-center text-panda-red-500 hover:text-panda-red-600 font-semibold">
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Badge */}
                <div className="absolute top-3 left-3 bg-panda-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  {product.badge}
                </div>
                
                {/* Trending Badge */}
                {product.trending && (
                  <div className="absolute top-3 right-3 bg-panda-black-900 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                    <Flame className="w-3 h-3 mr-1" />
                    Hot
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="text-sm text-panda-red-500 font-medium mb-1">
                  {product.category}
                </div>
                <h3 className="font-semibold text-panda-black-900 mb-2 group-hover:text-panda-red-500 transition-colors">
                  {product.name}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center mb-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-lg font-bold text-panda-black-900">
                      {product.price}
                    </span>
                    <span className="text-sm text-gray-500 line-through ml-2">
                      {product.originalPrice}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 md:hidden"
        >
          <Link href="/collections" className="btn-primary inline-flex items-center">
            View All Products
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default WhatsHotSection