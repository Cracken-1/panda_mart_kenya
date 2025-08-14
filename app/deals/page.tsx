'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import AuthenticationForm from '@/components/auth/AuthenticationForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  Zap,
  Clock,
  Star,
  Heart,
  ShoppingCart,
  Package,
  Percent,
  Gift,
  TrendingUp,
  Filter,
  Grid,
  List,
  Calendar,
  MapPin,
  Eye,
  Share2,
  Bookmark,
  Tag,
  Flame as Fire,
  Crown,
  Sparkles
} from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  category: string;
  brand: string;
  image: string;
  rating: number;
  reviewCount: number;
  stockCount: number;
  endsAt: string;
  type: 'flash' | 'daily' | 'weekly' | 'clearance' | 'bundle';
  isLimited: boolean;
  isFeatured: boolean;
  tags: string[];
  storeAvailability: string[];
}

export default function DealsPage() {
  const { user, isLoading } = useAuth();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('discount');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [timeLeft, setTimeLeft] = useState<Record<string, string>>({});

  const mockDeals: Deal[] = [
    {
      id: '1',
      title: 'iPhone 15 Pro Max 256GB',
      description: 'Latest iPhone with titanium design and A17 Pro chip',
      originalPrice: 185000,
      salePrice: 155000,
      discount: 16,
      category: 'Electronics',
      brand: 'Apple',
      image: '/deals/iphone-15-pro.jpg',
      rating: 4.9,
      reviewCount: 234,
      stockCount: 8,
      endsAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      type: 'flash',
      isLimited: true,
      isFeatured: true,
      tags: ['premium', 'flagship', 'camera'],
      storeAvailability: ['Garden City', 'Westgate']
    },
    {
      id: '2',
      title: 'Samsung 65" QLED 4K Smart TV',
      description: 'Stunning 4K QLED display with smart features',
      originalPrice: 125000,
      salePrice: 89000,
      discount: 29,
      category: 'Electronics',
      brand: 'Samsung',
      image: '/deals/samsung-tv.jpg',
      rating: 4.7,
      reviewCount: 156,
      stockCount: 12,
      endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      type: 'daily',
      isLimited: false,
      isFeatured: true,
      tags: ['entertainment', '4k', 'smart'],
      storeAvailability: ['Garden City', 'Galleria', 'Westgate']
    },
    {
      id: '3',
      title: 'Nike Air Max 270 Bundle',
      description: 'Buy 2 pairs and get 1 free - Premium sneakers collection',
      originalPrice: 37500,
      salePrice: 25000,
      discount: 33,
      category: 'Fashion',
      brand: 'Nike',
      image: '/deals/nike-bundle.jpg',
      rating: 4.5,
      reviewCount: 89,
      stockCount: 25,
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'bundle',
      isLimited: true,
      isFeatured: false,
      tags: ['sneakers', 'bundle', 'sports'],
      storeAvailability: ['Galleria', 'Westgate']
    },
    {
      id: '4',
      title: 'Dyson V15 Detect Cordless Vacuum',
      description: 'Advanced cordless vacuum with laser dust detection',
      originalPrice: 85000,
      salePrice: 65000,
      discount: 24,
      category: 'Home & Garden',
      brand: 'Dyson',
      image: '/deals/dyson-vacuum.jpg',
      rating: 4.8,
      reviewCount: 167,
      stockCount: 5,
      endsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'weekly',
      isLimited: true,
      isFeatured: true,
      tags: ['cleaning', 'premium', 'technology'],
      storeAvailability: ['Garden City']
    },
    {
      id: '5',
      title: 'MacBook Air M3 13" Clearance',
      description: 'Last season model - Ultra-thin laptop with M3 chip',
      originalPrice: 175000,
      salePrice: 145000,
      discount: 17,
      category: 'Electronics',
      brand: 'Apple',
      image: '/deals/macbook-air.jpg',
      rating: 4.9,
      reviewCount: 203,
      stockCount: 3,
      endsAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      type: 'clearance',
      isLimited: true,
      isFeatured: false,
      tags: ['laptop', 'productivity', 'clearance'],
      storeAvailability: ['Westgate']
    },
    {
      id: '6',
      title: 'Sony WH-1000XM5 Headphones',
      description: 'Industry-leading noise canceling headphones',
      originalPrice: 42000,
      salePrice: 29000,
      discount: 31,
      category: 'Electronics',
      brand: 'Sony',
      image: '/deals/sony-headphones.jpg',
      rating: 4.8,
      reviewCount: 445,
      stockCount: 18,
      endsAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      type: 'flash',
      isLimited: false,
      isFeatured: true,
      tags: ['audio', 'wireless', 'premium'],
      storeAvailability: ['Garden City', 'Galleria']
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setDeals(mockDeals);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const updateCountdowns = () => {
      const newTimeLeft: Record<string, string> = {};
      
      deals.forEach(deal => {
        const now = new Date().getTime();
        const endTime = new Date(deal.endsAt).getTime();
        const difference = endTime - now;
        
        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);
          
          if (days > 0) {
            newTimeLeft[deal.id] = `${days}d ${hours}h ${minutes}m`;
          } else if (hours > 0) {
            newTimeLeft[deal.id] = `${hours}h ${minutes}m ${seconds}s`;
          } else {
            newTimeLeft[deal.id] = `${minutes}m ${seconds}s`;
          }
        } else {
          newTimeLeft[deal.id] = 'Expired';
        }
      });
      
      setTimeLeft(newTimeLeft);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    
    return () => clearInterval(interval);
  }, [deals]);

  const getDealTypeIcon = (type: string) => {
    switch (type) {
      case 'flash': return Fire;
      case 'daily': return Calendar;
      case 'weekly': return TrendingUp;
      case 'clearance': return Tag;
      case 'bundle': return Gift;
      default: return Percent;
    }
  };

  const getDealTypeColor = (type: string) => {
    switch (type) {
      case 'flash': return 'bg-red-500';
      case 'daily': return 'bg-blue-500';
      case 'weekly': return 'bg-green-500';
      case 'clearance': return 'bg-orange-500';
      case 'bundle': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredDeals = deals.filter(deal => {
    if (filter === 'all') return true;
    if (filter === 'featured') return deal.isFeatured;
    if (filter === 'limited') return deal.isLimited;
    return deal.type === filter;
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    switch (sortBy) {
      case 'discount':
        return b.discount - a.discount;
      case 'price':
        return a.salePrice - b.salePrice;
      case 'rating':
        return b.rating - a.rating;
      case 'ending':
        return new Date(a.endsAt).getTime() - new Date(b.endsAt).getTime();
      default:
        return 0;
    }
  });

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <AuthenticationForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
              <Fire className="w-12 h-12" />
              Hot Deals & Offers
            </h1>
            <p className="text-xl text-orange-100 mb-8 max-w-3xl mx-auto">
              Discover incredible savings on your favorite products. Limited time offers you don't want to miss!
            </p>
            
            {/* Deal Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold">{deals.length}</div>
                <div className="text-orange-200 text-sm">Active Deals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">Up to 70%</div>
                <div className="text-orange-200 text-sm">Discount</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-orange-200 text-sm">New Deals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">Free</div>
                <div className="text-orange-200 text-sm">Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'all', label: 'All Deals', icon: Percent },
                { id: 'featured', label: 'Featured', icon: Crown },
                { id: 'flash', label: 'Flash Sale', icon: Fire },
                { id: 'daily', label: 'Daily Deals', icon: Calendar },
                { id: 'limited', label: 'Limited Time', icon: Clock },
                { id: 'bundle', label: 'Bundles', icon: Gift }
              ].map((filterOption) => (
                <button
                  key={filterOption.id}
                  onClick={() => setFilter(filterOption.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    filter === filterOption.id
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <filterOption.icon className="w-4 h-4" />
                  {filterOption.label}
                </button>
              ))}
            </div>

            {/* Sort and View Controls */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="discount">Highest Discount</option>
                <option value="price">Lowest Price</option>
                <option value="rating">Highest Rated</option>
                <option value="ending">Ending Soon</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-red-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {sortedDeals.length} deals • Updated every hour
          </div>
        </div>

        {/* Deals Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1'
        }`}>
          {sortedDeals.map((deal) => {
            const DealIcon = getDealTypeIcon(deal.type);
            const isExpiringSoon = new Date(deal.endsAt).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;
            
            return (
              <div
                key={deal.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Deal Image */}
                <div className={`relative ${viewMode === 'list' ? 'w-64 flex-shrink-0' : 'aspect-square'}`}>
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-400" />
                  </div>
                  
                  {/* Deal Type Badge */}
                  <div className={`absolute top-3 left-3 ${getDealTypeColor(deal.type)} text-white px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1`}>
                    <DealIcon className="w-3 h-3" />
                    {deal.type.toUpperCase()}
                  </div>

                  {/* Discount Badge */}
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                    -{deal.discount}%
                  </div>

                  {/* Limited Badge */}
                  {deal.isLimited && (
                    <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      LIMITED
                    </div>
                  )}

                  {/* Featured Badge */}
                  {deal.isFeatured && (
                    <div className="absolute bottom-3 right-3 bg-purple-500 text-white px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      FEATURED
                    </div>
                  )}

                  {/* Quick Actions */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-2">
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                        <Heart className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Deal Info */}
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className="mb-3">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{deal.title}</h3>
                    <p className="text-sm text-gray-600">{deal.brand} • {deal.category}</p>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.floor(deal.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm font-medium">{deal.rating}</span>
                    <span className="ml-1 text-xs text-gray-500">({deal.reviewCount})</span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-red-600">
                        KSh {deal.salePrice.toLocaleString()}
                      </span>
                      <span className="text-lg text-gray-500 line-through">
                        KSh {deal.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-sm text-green-600 font-medium">
                      Save KSh {(deal.originalPrice - deal.salePrice).toLocaleString()}
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div className={`mb-4 p-3 rounded-lg ${
                    isExpiringSoon ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${isExpiringSoon ? 'text-red-600' : 'text-gray-600'}`} />
                        <span className={`text-sm font-medium ${isExpiringSoon ? 'text-red-800' : 'text-gray-800'}`}>
                          {isExpiringSoon ? 'Ending Soon!' : 'Time Left:'}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${isExpiringSoon ? 'text-red-600' : 'text-gray-900'}`}>
                        {timeLeft[deal.id] || 'Loading...'}
                      </span>
                    </div>
                  </div>

                  {/* Stock Info */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Stock:</span>
                      <span className={`font-medium ${
                        deal.stockCount <= 5 ? 'text-red-600' : 'text-green-600'
                      }`}>
                        {deal.stockCount <= 5 ? `Only ${deal.stockCount} left!` : `${deal.stockCount} available`}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          deal.stockCount <= 5 ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min((deal.stockCount / 50) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Store Availability */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Available at:</div>
                    <div className="flex flex-wrap gap-1">
                      {deal.storeAvailability.map((store) => (
                        <span key={store} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {store}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {deal.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
                    </button>
                    <div className="flex gap-2">
                      <button className="flex-1 border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                        <Heart className="w-4 h-4" />
                        Wishlist
                      </button>
                      <button className="flex-1 border-2 border-gray-300 text-gray-700 py-2 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                        <MapPin className="w-4 h-4" />
                        Find in Store
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Results */}
        {sortedDeals.length === 0 && (
          <div className="text-center py-12">
            <Fire className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No deals found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or check back later for new deals</p>
            <button
              onClick={() => setFilter('all')}
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              View All Deals
            </button>
          </div>
        )}
      </div>
    </div>
  );
}