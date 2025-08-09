'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Clock, Phone, Mail, Navigation, Star, Filter } from 'lucide-react'
import InteractiveMap from '../../components/stores/InteractiveMap'

const StoresPage = () => {
  const [selectedCity, setSelectedCity] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const cities = [
    { id: 'all', name: 'All Cities' },
    { id: 'nairobi', name: 'Nairobi' }
  ]

  const stores = [
    {
      id: 1,
      name: "Panda Mart Garden City",
      city: "nairobi",
      address: "Garden City Mall, Thika Road, Nairobi",
      phone: "020 231 1166",
      email: "gardencity@pandamart.co.ke",
      hours: {
        weekdays: "10:00 AM - 10:00 PM",
        weekends: "10:00 AM - 10:00 PM"
      },
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
      rating: 4.9,
      reviews: 456,
      features: ["Free Parking", "Customer Service", "Home Delivery", "Gift Wrapping"],
      specialties: ["Electronics", "Furniture", "Homeware", "Beauty & Lifestyle"]
    },
    {
      id: 2,
      name: "Panda Mart Galleria",
      city: "nairobi",
      address: "Galleria Shopping Mall, Langata Road, Nairobi",
      phone: "077 866 6666",
      email: "galleria@pandamart.co.ke",
      hours: {
        weekdays: "10:00 AM - 10:00 PM",
        weekends: "10:00 AM - 10:00 PM"
      },
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
      rating: 4.8,
      reviews: 324,
      features: ["Free Parking", "Customer Service", "Home Delivery", "Installation Service"],
      specialties: ["Electronics", "Furniture", "Homeware", "Hardware"]
    }
  ]

  const filteredStores = stores.filter(store => {
    const matchesCity = selectedCity === 'all' || store.city === selectedCity
    const matchesSearch = store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         store.address.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCity && matchesSearch
  })

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
              Find Your Nearest <span className="text-yellow-300">Store</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Visit any of our convenient locations across Kenya for the best shopping experience
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by store name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-panda-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-3">
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city.id)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedCity === city.id
                      ? 'bg-panda-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
            
            <div className="text-gray-600">
              {filteredStores.length} stores found
            </div>
          </div>
        </div>
      </section>

      {/* Stores Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredStores.map((store, index) => (
              <motion.div
                key={store.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden"
              >
                {/* Store Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-semibold text-panda-black-900">{store.rating}</span>
                  </div>
                </div>

                {/* Store Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-panda-black-900 mb-1">
                        {store.name}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                        <span>{store.rating} ({store.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start space-x-3 mb-4">
                    <MapPin className="w-5 h-5 text-panda-red-500 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{store.address}</span>
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-panda-red-500" />
                      <span className="text-sm text-gray-700">{store.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-panda-red-500" />
                      <span className="text-sm text-gray-700">{store.email}</span>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex items-start space-x-3 mb-4">
                    <Clock className="w-5 h-5 text-panda-red-500 mt-1 flex-shrink-0" />
                    <div className="text-sm text-gray-700">
                      <div>Mon-Fri: {store.hours.weekdays}</div>
                      <div>Sat-Sun: {store.hours.weekends}</div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-panda-black-900 mb-2">Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {store.features.map((feature, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-panda-black-900 mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {store.specialties.map((specialty, idx) => (
                        <span
                          key={idx}
                          className="bg-panda-red-100 text-panda-red-700 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="flex-1 btn-primary flex items-center justify-center">
                      <Navigation className="w-4 h-4 mr-2" />
                      Get Directions
                    </button>
                    <button className="flex-1 btn-outline flex items-center justify-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Call Store
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-panda-black-900 mb-4">
              Interactive Store Locator
            </h2>
            <p className="text-gray-600">
              Find your nearest Panda Mart store and get directions
            </p>
          </div>
          
          <InteractiveMap />
        </div>
      </section>
    </div>
  )
}

export default StoresPage