'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, Star, ArrowRight, Zap, Flame, Timer } from 'lucide-react'
import Link from 'next/link'
import { getAllFlashSaleItems } from '@/lib/data/flashSaleData'

const FlashSalePage = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const flashSaleItems = getAllFlashSaleItems()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-panda-red-500 via-red-600 to-panda-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-4">
              <Flame className="w-12 h-12 text-yellow-300 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold">
                Flash Sale
              </h1>
              <Flame className="w-12 h-12 text-yellow-300 ml-4" />
            </div>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Lightning deals with up to 60% off! Limited time, limited stock - grab them before they're gone!
            </p>

            {/* Countdown Timer */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
              <div className="flex items-center justify-center mb-4">
                <Timer className="w-6 h-6 mr-2" />
                <h3 className="text-xl font-bold">Sale Ends In:</h3>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <div className="bg-white/20 rounded-lg p-3 min-w-[60px]">
                  <div className="text-2xl font-bold">{timeLeft.hours.toString().padStart(2, '0')}</div>
                  <div className="text-sm opacity-90">Hours</div>
                </div>
                <div className="text-2xl">:</div>
                <div className="bg-white/20 rounded-lg p-3 min-w-[60px]">
                  <div className="text-2xl font-bold">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                  <div className="text-sm opacity-90">Minutes</div>
                </div>
                <div className="text-2xl">:</div>
                <div className="bg-white/20 rounded-lg p-3 min-w-[60px]">
                  <div className="text-2xl font-bold">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                  <div className="text-sm opacity-90">Seconds</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Flash Sale Items */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-panda-black-900 mb-4">Lightning Deals</h2>
            <p className="text-gray-600">Hurry! These deals won't last long</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {flashSaleItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden group relative"
              >
                {/* Flash Sale Badge */}
                <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10 flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  -{item.discount}%
                </div>

                {/* Stock Indicator */}
                <div className="absolute top-3 right-3 bg-panda-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold z-10">
                  {item.stock} left
                </div>

                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-3">
                    <div className="flex justify-between text-white text-xs mb-1">
                      <span>Sold: {item.sold}</span>
                      <span>Available: {item.stock}</span>
                    </div>
                    <div className="w-full bg-white/30 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(item.sold / (item.sold + item.stock)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-panda-black-900 mb-2 group-hover:text-panda-red-500 transition-colors">
                    {item.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{item.rating}</span>
                    <span className="text-sm text-gray-500 ml-2">({item.reviews} reviews)</span>
                  </div>

                  {/* Store */}
                  <div className="text-sm text-gray-600 mb-3">{item.store}</div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-panda-red-500">
                        KES {item.salePrice.toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-500 line-through ml-2">
                        KES {item.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-green-600 font-semibold">
                      Save KES {(item.originalPrice - item.salePrice).toLocaleString()}
                    </div>
                  </div>

                  {/* Action Button */}
                  <button 
                    className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-semibold transition-all ${
                      item.stock > 0 
                        ? 'bg-gradient-to-r from-panda-red-500 to-red-600 text-white hover:from-red-600 hover:to-panda-red-700' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                    disabled={item.stock === 0}
                  >
                    {item.stock > 0 ? (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Grab This Deal
                      </>
                    ) : (
                      'Sold Out'
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-panda-black-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Flame className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Don't Miss Out!</h2>
            <p className="text-xl text-gray-300 mb-8">
              Flash sales happen fast. Follow us to get notified about upcoming lightning deals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/deals" className="btn-primary inline-flex items-center">
                View All Deals
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <button className="btn-outline inline-flex items-center" disabled>
                Set Deal Alerts (Coming Soon)
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default FlashSalePage