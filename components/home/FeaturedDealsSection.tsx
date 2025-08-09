'use client'

import { motion } from 'framer-motion'
import { Clock, Percent, ArrowRight, Timer } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getFeaturedFlashSaleItems } from '@/lib/data/flashSaleData'
import { getFeaturedBundles } from '@/lib/data/bundleData'

const FeaturedDealsSection = () => {
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

  // Get featured items from shared data
  const flashSaleItems = getFeaturedFlashSaleItems(4)
  const featuredBundles = getFeaturedBundles(2)

  // Transform flash sale items for quick deals display
  const quickDeals = flashSaleItems.map(item => ({
    id: item.id,
    name: item.name,
    price: `KES ${item.salePrice.toLocaleString()}`,
    originalPrice: `KES ${item.originalPrice.toLocaleString()}`,
    discount: `${item.discount}%`,
    image: item.image
  }))

  // Create featured deals from bundle data
  const featuredDeals = [
    {
      id: 1,
      title: "Flash Sale Weekend",
      description: "Up to 60% off on selected electronics and furniture",
      image: flashSaleItems.length > 0 ? flashSaleItems[0].image : "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
      discount: "60% OFF",
      endTime: "Limited Time",
      cta: "Shop Flash Sale"
    },
    {
      id: 2,
      title: featuredBundles.length > 0 ? featuredBundles[0].name : "Home Makeover Bundle",
      description: featuredBundles.length > 0 ? featuredBundles[0].description : "Complete furniture sets at unbeatable prices",
      image: featuredBundles.length > 0 ? featuredBundles[0].image : "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&h=400&fit=crop",
      discount: featuredBundles.length > 0 ? `${Math.round(((featuredBundles[0].originalPrice - featuredBundles[0].bundlePrice) / featuredBundles[0].originalPrice) * 100)}% OFF` : "29% OFF",
      endTime: "This Week Only",
      cta: "View Bundles"
    }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center mb-4"
          >
            <Percent className="w-8 h-8 text-panda-red-500 mr-3" />
            <h2 className="text-3xl md:text-4xl font-bold text-panda-black-900">
              Today's <span className="text-gradient">Steals & Finds</span>
            </h2>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Don't miss out on these incredible deals - limited time offers!
          </motion.p>
        </div>

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-panda-red-500 text-white rounded-2xl p-6 mb-12 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <Timer className="w-6 h-6 mr-2" />
            <h3 className="text-xl font-bold">Flash Sale Ends In:</h3>
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
        </motion.div>

        {/* Featured Deals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {featuredDeals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, x: index === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="card overflow-hidden group"
            >
              <div className="relative">
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                
                {/* Discount Badge */}
                <div className="absolute top-4 left-4 bg-panda-red-500 text-white px-4 py-2 rounded-full font-bold">
                  {deal.discount}
                </div>
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{deal.title}</h3>
                  <p className="text-white/90 mb-4">{deal.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {deal.endTime}
                    </div>
                    <Link 
                      href={deal.id === 1 ? '/flash-sale' : '/bundles'}
                      className="bg-white text-panda-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
                    >
                      {deal.cta}
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Deals Grid */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-panda-black-900 mb-6 text-center">Quick Deals</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickDeals.map((deal, index) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card overflow-hidden group cursor-pointer"
                onClick={() => window.location.href = '/deals'}
              >
                <div className="relative">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 bg-panda-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    -{deal.discount}
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-sm mb-2 text-panda-black-900">{deal.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-panda-red-500">{deal.price}</span>
                    <span className="text-xs text-gray-500 line-through">{deal.originalPrice}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <Link href="/deals" className="btn-primary inline-flex items-center">
            View All Deals
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturedDealsSection