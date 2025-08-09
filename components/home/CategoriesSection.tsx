'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const CategoriesSection = () => {
  const categories = [
    {
      id: 1,
      name: "Furniture",
      description: "Transform your space with stylish and comfortable furniture",
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400&fit=crop",
      href: "/collections/furniture",
      itemCount: "200+ items"
    },
    {
      id: 2,
      name: "Electronics",
      description: "Latest technology and gadgets for modern living",
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=400&fit=crop",
      href: "/collections/electronics",
      itemCount: "150+ items"
    },
    {
      id: 3,
      name: "Homeware",
      description: "Essential items to make your house feel like home",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=400&fit=crop",
      href: "/collections/homeware",
      itemCount: "300+ items"
    },
    {
      id: 4,
      name: "Beauty & Lifestyle",
      description: "Personal care and lifestyle products for your wellbeing",
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=400&fit=crop",
      href: "/collections/beauty",
      itemCount: "100+ items"
    },
    {
      id: 5,
      name: "Hardware",
      description: "Tools and hardware for all your DIY and repair needs",
      image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=500&h=400&fit=crop",
      href: "/collections/hardware",
      itemCount: "80+ items"
    },
    {
      id: 6,
      name: "Household Care",
      description: "Cleaning supplies and household essentials",
      image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=500&h=400&fit=crop",
      href: "/collections/household",
      itemCount: "120+ items"
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-panda-black-900 mb-4"
          >
            Explore Our <span className="text-gradient">Collections</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Discover everything you need for your home and lifestyle, 
            all in one convenient location.
          </motion.p>
        </div>

        {/* Categories Grid */}
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
                  {/* Category Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    
                    {/* Item Count Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-panda-black-900 px-3 py-1 rounded-full text-sm font-semibold">
                      {category.itemCount}
                    </div>
                  </div>

                  {/* Category Info */}
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

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/collections" className="btn-primary inline-flex items-center">
            Browse All Categories
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default CategoriesSection