'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Package, Star, ArrowRight, Gift, Percent, Check } from 'lucide-react'
import Link from 'next/link'
import { getAllBundles, getBundlesByCategory } from '@/lib/data/bundleData'

const BundlesPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'All Bundles' },
    { id: 'home', name: 'Home & Living' },
    { id: 'electronics', name: 'Electronics' },
    { id: 'kitchen', name: 'Kitchen' },
    { id: 'office', name: 'Office' },
    { id: 'beauty', name: 'Beauty & Care' }
  ]

  const filteredBundles = getBundlesByCategory(selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-panda-red-600 via-red-700 to-panda-black-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <Package className="w-12 h-12 text-yellow-300 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold">
                Bundle Deals
              </h1>
              <Gift className="w-12 h-12 text-yellow-300 ml-4" />
            </div>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Save more when you buy together! Curated bundles with everything you need at unbeatable prices.
            </p>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 inline-block">
              <div className="flex items-center">
                <Percent className="w-6 h-6 mr-2" />
                <span className="text-lg font-semibold">Save up to 35% with our bundles</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-panda-black-900 mb-2">Choose Your Bundle Category</h2>
            <p className="text-gray-600">Find the perfect bundle for your needs</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-panda-red-500 to-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Bundles Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredBundles.map((bundle, index) => (
              <motion.div
                key={bundle.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden group"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Bundle Image */}
                  <div className="relative">
                    <img
                      src={bundle.image}
                      alt={bundle.name}
                      className="w-full h-64 md:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-panda-red-500 to-red-600 text-white px-4 py-2 rounded-full font-bold">
                      -{bundle.discount}% OFF
                    </div>
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Bundle Deal
                    </div>
                  </div>

                  {/* Bundle Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-panda-black-900 mb-2 group-hover:text-panda-red-600 transition-colors">
                      {bundle.name}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">{bundle.description}</p>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 ml-1">{bundle.rating}</span>
                      <span className="text-sm text-gray-500 ml-2">({bundle.reviews} reviews)</span>
                    </div>

                    {/* Store */}
                    <div className="text-sm text-gray-600 mb-4">{bundle.store}</div>

                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-panda-red-600">
                          KES {bundle.bundlePrice.toLocaleString()}
                        </span>
                        <span className="text-lg text-gray-500 line-through">
                          KES {bundle.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-green-600 font-semibold">
                        You save KES {bundle.savings.toLocaleString()}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Bundle Includes:</h4>
                      <div className="space-y-1">
                        {bundle.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button className="w-full bg-gradient-to-r from-panda-red-500 to-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-red-600 hover:to-panda-red-700 transition-all flex items-center justify-center">
                      <Package className="w-4 h-4 mr-2" />
                      Get This Bundle
                    </button>
                  </div>
                </div>

                {/* Bundle Items List */}
                <div className="border-t border-gray-200 p-6">
                  <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {bundle.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <span className="text-gray-700">{item.name}</span>
                        <span className="text-gray-500">KES {item.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center font-semibold">
                    <span>Individual Total:</span>
                    <span className="text-gray-500 line-through">KES {bundle.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center font-bold text-panda-red-600">
                    <span>Bundle Price:</span>
                    <span>KES {bundle.bundlePrice.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-panda-black-800 to-panda-black-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Gift className="w-16 h-16 text-yellow-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Can't Find What You Need?</h2>
            <p className="text-xl text-white/90 mb-8">
              Let us create a custom bundle just for you. Contact our team for personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="bg-white text-panda-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center">
                Request Custom Bundle
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/deals" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-panda-red-600 transition-colors inline-flex items-center">
                View All Deals
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default BundlesPage