'use client'

import { motion } from 'framer-motion'
import { Shield, Truck, CreditCard, Users, Star, MapPin } from 'lucide-react'

const ValuePropositionSection = () => {
  const values = [
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "Every product meets our high standards for durability and performance"
    },
    {
      icon: CreditCard,
      title: "Unbeatable Prices",
      description: "Best value for money with regular deals and promotions"
    },
    {
      icon: MapPin,
      title: "Convenient Locations",
      description: "Multiple stores across Kenya for easy access and pickup"
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "Supporting Kenyan families with products that matter"
    },
    {
      icon: Star,
      title: "Trusted Brand",
      description: "Thousands of satisfied customers across Kenya"
    },
    {
      icon: Truck,
      title: "Easy Shopping",
      description: "Browse online, buy in-store for the best experience"
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-panda-black-900 mb-4"
          >
            Why Choose <span className="text-gradient">Panda Mart</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            We're committed to bringing you the best products at the best prices, 
            with the convenience and service you deserve.
          </motion.p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="card p-6 text-center group hover:shadow-2xl"
            >
              <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <value.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-panda-black-900 mb-3">
                {value.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 gradient-bg rounded-2xl p-8 text-white"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">10+</div>
              <div className="text-white/90">Store Locations</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">50K+</div>
              <div className="text-white/90">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">1000+</div>
              <div className="text-white/90">Products Available</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold mb-2">5★</div>
              <div className="text-white/90">Customer Rating</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default ValuePropositionSection