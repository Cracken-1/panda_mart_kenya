'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

const CollectionsPage = () => {
  const categories = [
    {
      id: 1,
      name: "Furniture",
      description: "Transform your space with stylish and comfortable furniture",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop",
      href: "/collections/furniture",
      itemCount: "200+ items",
      featured: true
    },
    {
      id: 2,
      name: "Electronics",
      description: "Latest technology and gadgets for modern living",
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=400&fit=crop",
      href: "/collections/electronics",
      itemCount: "150+ items",
      featured: true
    },
    {
      id: 3,
      name: "Homeware",
      description: "Essential items to make your house feel like home",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop",
      href: "/collections/homeware",
      itemCount: "300+ items",
      featured: true
    },
    {
      id: 4,
      name: "Beauty & Lifestyle",
      description: "Personal care and lifestyle products for your wellbeing",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=400&fit=crop",
      href: "/collections/beauty",
      itemCount: "100+ items",
      featured: false
    },
    {
      id: 5,
      name: "Hardware",
      description: "Tools and hardware for all your DIY and repair needs",
      image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&h=400&fit=crop",
      href: "/collections/hardware",
      itemCount: "80+ items",
      featured: false
    },
    {
      id: 6,
      name: "Household Care",
      description: "Cleaning supplies and household essentials",
      image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500&h=400&fit=crop",
      href: "/collections/household",
      itemCount: "120+ items",
      featured: false
    }
  ]

  const featuredCategories = categories.filter(cat => cat.featured)
  const otherCategories = categories.filter(cat => !cat.featured)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Our <span className="text-yellow-300">Collections</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Discover everything you need for your home and lifestyle, 
              all in one convenient location with unbeatable prices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-panda-black-900 mb-4">
              Featured <span className="text-gradient">Categories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our most popular product categories with the best deals
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {featuredCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={category.href} className="block group">
                  <div className="card overflow-hidden">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-panda-black-900 px-3 py-1 rounded-full text-sm font-semibold">
                        {category.itemCount}
                      </div>

                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-300 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-white/90 text-sm">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <span className="text-panda-red-500 font-semibold">
                          Shop Now
                        </span>
                        <ArrowRight className="w-5 h-5 text-panda-red-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-panda-black-900 mb-4">
              All <span className="text-gradient">Categories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our complete range of products across all categories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={category.href} className="block group">
                  <div className="card overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-panda-black-900 px-3 py-1 rounded-full text-sm font-semibold">
                        {category.itemCount}
                      </div>
                      
                      {category.featured && (
                        <div className="absolute top-4 left-4 bg-panda-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                          Featured
                        </div>
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-xl font-bold text-panda-black-900 group-hover:text-panda-red-500 transition-colors">
                          {category.name}
                        </h3>
                        <ArrowRight className="w-5 h-5 text-panda-red-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-r from-panda-red-500/10 to-transparent rounded-2xl p-12"
          >
            <ShoppingBag className="w-16 h-16 text-panda-red-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-panda-black-900 mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Visit any of our physical stores for personalized assistance and to see our full range of products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/stores" className="btn-primary inline-flex items-center justify-center">
                Find Nearest Store
              </Link>
              <Link href="/deals" className="btn-outline inline-flex items-center justify-center">
                View Current Deals
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default CollectionsPage