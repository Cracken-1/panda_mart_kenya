'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Clock, Navigation, Star } from 'lucide-react'

interface Store {
  id: number
  name: string
  address: string
  phone: string
  hours: string
  rating: number
  lat: number
  lng: number
  image: string
}

const InteractiveMap = () => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)

  const stores: Store[] = [
    {
      id: 1,
      name: "Panda Mart Garden City",
      address: "Garden City Mall, Thika Road, Nairobi",
      phone: "020 231 1166",
      hours: "10:00 AM - 10:00 PM",
      rating: 4.9,
      lat: -1.2368,
      lng: 36.8856,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      name: "Panda Mart Galleria",
      address: "Galleria Shopping Mall, Langata Road, Nairobi",
      phone: "077 866 6666",
      hours: "10:00 AM - 10:00 PM",
      rating: 4.8,
      lat: -1.3067,
      lng: 36.7834,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop"
    }
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-96">
        {/* Map Placeholder */}
        <div className="relative bg-gray-200 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg font-semibold">Interactive Map</p>
            <p className="text-gray-400 text-sm">Coming Soon</p>
          </div>
          
          {/* Store Markers Simulation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-md">
              {stores.map((store, index) => (
                <motion.button
                  key={store.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  onClick={() => setSelectedStore(store)}
                  className={`absolute w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    selectedStore?.id === store.id
                      ? 'bg-panda-red-500 text-white scale-125'
                      : 'bg-white text-panda-red-500 border-2 border-panda-red-500 hover:scale-110'
                  }`}
                  style={{
                    left: `${20 + index * 25}%`,
                    top: `${30 + index * 15}%`
                  }}
                >
                  <MapPin className="w-4 h-4" />
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Store Details */}
        <div className="p-6">
          {selectedStore ? (
            <motion.div
              key={selectedStore.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full flex flex-col"
            >
              <img
                src={selectedStore.image}
                alt={selectedStore.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              
              <h3 className="text-xl font-bold text-panda-black-900 mb-2">
                {selectedStore.name}
              </h3>
              
              <div className="flex items-center mb-3">
                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                <span className="font-semibold">{selectedStore.rating}</span>
                <span className="text-gray-500 text-sm ml-2">Store Rating</span>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-panda-red-500 mt-1 mr-3 flex-shrink-0" />
                  <span className="text-gray-700">{selectedStore.address}</span>
                </div>
                
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-panda-red-500 mr-3" />
                  <span className="text-gray-700">{selectedStore.phone}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-panda-red-500 mr-3" />
                  <span className="text-gray-700">{selectedStore.hours}</span>
                </div>
              </div>
              
              <div className="mt-auto space-y-3">
                <button className="w-full btn-primary flex items-center justify-center">
                  <Navigation className="w-4 h-4 mr-2" />
                  Get Directions
                </button>
                <button className="w-full btn-outline flex items-center justify-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Store
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-semibold mb-2">
                  Select a Store
                </p>
                <p className="text-gray-400 text-sm">
                  Click on a map marker to view store details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Store List */}
      <div className="border-t border-gray-200 p-4">
        <h4 className="font-semibold text-panda-black-900 mb-3">All Locations</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => setSelectedStore(store)}
              className={`text-left p-3 rounded-lg transition-all ${
                selectedStore?.id === store.id
                  ? 'bg-panda-red-100 border-2 border-panda-red-500'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <div className="font-semibold text-sm">{store.name}</div>
              <div className="text-xs text-gray-500 mt-1">{store.address}</div>
              <div className="flex items-center mt-2">
                <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                <span className="text-xs font-medium">{store.rating}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default InteractiveMap