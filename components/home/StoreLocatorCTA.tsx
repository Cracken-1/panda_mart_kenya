'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Navigation } from 'lucide-react'
import Link from 'next/link'

const StoreLocatorCTA = () => {
  const featuredStores = [
    {
      id: 1,
      name: "Panda Mart Garden City",
      address: "Garden City Mall, Thika Road, Nairobi",
      hours: "Mon-Sun: 10:00 AM - 10:00 PM",
      phone: "020 231 1166",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      name: "Panda Mart Galleria",
      address: "Galleria Shopping Mall, Langata Road, Nairobi",
      hours: "Mon-Sun: 10:00 AM - 10:00 PM",
      phone: "077 866 6666",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop"
    }
  ]

  return (
    <section className="py-16 bg-panda-black-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center mb-4"
          >
            <MapPin className="w-8 h-8 text-panda-red-500 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold">
              Visit Our <span className="text-panda-red-500">Stores</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Experience our products in person at any of our convenient locations across Kenya
          </motion.p>
        </div>

        {/* Featured Stores */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {featuredStores.map((store, index) => (
            <motion.div
              key={store.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden hover:bg-white/20 transition-all duration-300 group"
            >
              {/* Store Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>

              {/* Store Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 group-hover:text-panda-red-500 transition-colors">
                  {store.name}
                </h3>
                
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 mt-1 text-panda-red-500 flex-shrink-0" />
                    <span className="text-sm">{store.address}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-panda-red-500 flex-shrink-0" />
                    <span className="text-sm">{store.hours}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-panda-red-500 flex-shrink-0" />
                    <span className="text-sm">{store.phone}</span>
                  </div>
                </div>

                <button className="w-full mt-4 bg-panda-red-500 hover:bg-panda-red-600 text-white py-2 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center">
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-panda-red-500/20 to-transparent rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold mb-4">
            Ready to Experience Panda Mart?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Find your nearest store, check our latest deals, and discover why thousands of Kenyan families choose Panda Mart for their shopping needs.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/stores" className="btn-primary inline-flex items-center justify-center">
              <MapPin className="w-5 h-5 mr-2" />
              Find All Stores
            </Link>
            <Link href="/deals" className="btn-outline border-white text-white hover:bg-white hover:text-panda-black-900 inline-flex items-center justify-center">
              View Current Deals
            </Link>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 text-center"
        >
          <div>
            <div className="text-3xl font-bold text-panda-red-500 mb-2">10+</div>
            <div className="text-gray-300">Store Locations</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-panda-red-500 mb-2">7</div>
            <div className="text-gray-300">Days a Week</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-panda-red-500 mb-2">12+</div>
            <div className="text-gray-300">Hours Daily</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-panda-red-500 mb-2">Free</div>
            <div className="text-gray-300">Parking Available</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default StoreLocatorCTA