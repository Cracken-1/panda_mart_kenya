'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Filter, Clock, Percent, Star, ArrowRight } from 'lucide-react'

const DealsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all')
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

    const categories = [
        { id: 'all', name: 'All Deals' },
        { id: 'electronics', name: 'Electronics' },
        { id: 'furniture', name: 'Furniture' },
        { id: 'homeware', name: 'Homeware' },
        { id: 'beauty', name: 'Beauty' },
        { id: 'hardware', name: 'Hardware' }
    ]

    const deals = [
        {
            id: 1,
            name: "Smart LED TV 55\"",
            category: "electronics",
            price: "KES 45,000",
            originalPrice: "KES 65,000",
            discount: "31%",
            image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop",
            rating: 4.8,
            reviews: 124,
            timeLeft: "2 days",
            badge: "Flash Sale"
        },
        {
            id: 2,
            name: "3-Seater Sofa Set",
            category: "furniture",
            price: "KES 32,000",
            originalPrice: "KES 45,000",
            discount: "29%",
            image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop",
            rating: 4.9,
            reviews: 89,
            timeLeft: "5 days",
            badge: "Limited Time"
        },
        {
            id: 3,
            name: "Kitchen Appliance Bundle",
            category: "homeware",
            price: "KES 18,000",
            originalPrice: "KES 25,000",
            discount: "28%",
            image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
            rating: 4.7,
            reviews: 156,
            timeLeft: "3 days",
            badge: "Bundle Deal"
        },
        {
            id: 4,
            name: "Beauty Care Set",
            category: "beauty",
            price: "KES 6,500",
            originalPrice: "KES 10,000",
            discount: "35%",
            image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=300&fit=crop",
            rating: 4.6,
            reviews: 203,
            timeLeft: "1 day",
            badge: "Hot Deal"
        },
        {
            id: 5,
            name: "Power Tool Set",
            category: "hardware",
            price: "KES 12,000",
            originalPrice: "KES 18,000",
            discount: "33%",
            image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400&h=300&fit=crop",
            rating: 4.5,
            reviews: 67,
            timeLeft: "4 days",
            badge: "Weekend Special"
        },
        {
            id: 6,
            name: "Smartphone 128GB",
            category: "electronics",
            price: "KES 22,000",
            originalPrice: "KES 30,000",
            discount: "27%",
            image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop",
            rating: 4.4,
            reviews: 312,
            timeLeft: "6 days",
            badge: "New Arrival"
        }
    ]

    const filteredDeals = selectedCategory === 'all'
        ? deals
        : deals.filter(deal => deal.category === selectedCategory)

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
                            Today's <span className="text-yellow-300">Steals & Finds</span>
                        </h1>
                        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                            Don't miss out on these incredible deals - limited time offers with savings up to 50%!
                        </p>

                        {/* Flash Sale Timer */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 inline-block">
                            <div className="flex items-center justify-center mb-4">
                                <Clock className="w-6 h-6 mr-2" />
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
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Filters */}
            <section className="py-8 bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-panda-black-900">All Deals</h2>
                        <div className="flex items-center text-gray-600">
                            <Filter className="w-5 h-5 mr-2" />
                            <span>Filter by category</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === category.id
                                    ? 'bg-panda-red-500 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category.name}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Deals Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDeals.map((deal, index) => (
                            <motion.div
                                key={deal.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card overflow-hidden group"
                            >
                                {/* Product Image */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={deal.image}
                                        alt={deal.name}
                                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                    />

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 bg-panda-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                                        -{deal.discount}
                                    </div>
                                    <div className="absolute top-3 right-3 bg-panda-black-900 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                        {deal.badge}
                                    </div>

                                    {/* Time Left */}
                                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-panda-black-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {deal.timeLeft} left
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-6">
                                    <h3 className="font-bold text-lg text-panda-black-900 mb-2 group-hover:text-panda-red-500 transition-colors">
                                        {deal.name}
                                    </h3>

                                    {/* Rating */}
                                    <div className="flex items-center mb-3">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm text-gray-600 ml-1">{deal.rating}</span>
                                        <span className="text-sm text-gray-500 ml-2">({deal.reviews} reviews)</span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <span className="text-2xl font-bold text-panda-red-500">
                                                {deal.price}
                                            </span>
                                            <span className="text-lg text-gray-500 line-through ml-2">
                                                {deal.originalPrice}
                                            </span>
                                        </div>
                                    </div>

                                    <button className="w-full btn-primary flex items-center justify-center">
                                        View in Store
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default DealsPage