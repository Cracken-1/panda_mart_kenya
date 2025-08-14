'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import AuthenticationForm from '@/components/auth/AuthenticationForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Heart,
  ShoppingCart,
  Package,
  Eye,
  TrendingUp,
  Award,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin,
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  UtensilsCrossed,
  ArrowLeft,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  brand: string;
  rating: number;
  reviewCount: number;
  image: string;
  inStock: boolean;
  stockCount: number;
  isOnSale: boolean;
  isFeatured: boolean;
  isNew: boolean;
  tags: string[];
  category: string;
  subcategory: string;
}

interface CategoryPageProps {
  params: {
    categoryId: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { user, isLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [showOnlyOnSale, setShowOnlyOnSale] = useState(false);

  const categoryInfo = {
    electronics: {
      name: 'Electronics',
      icon: Smartphone,
      description: 'Latest technology and gadgets for modern living',
      subcategories: ['Smartphones', 'Laptops', 'TVs', 'Audio', 'Gaming', 'Accessories'],
      totalProducts: 2450
    },
    fashion: {
      name: 'Fashion',
      icon: Shirt,
      description: 'Trendy clothing and accessories for every style',
      subcategories: ['Men\'s Clothing', 'Women\'s Clothing', 'Shoes', 'Accessories', 'Bags', 'Jewelry'],
      totalProducts: 1890
    },
    'home-garden': {
      name: 'Home & Garden',
      icon: Home,
      description: 'Everything for your home and outdoor spaces',
      subcategories: ['Furniture', 'Appliances', 'Decor', 'Kitchen', 'Garden', 'Tools'],
      totalProducts: 1560
    },
    'health-beauty': {
      name: 'Health & Beauty',
      icon: Sparkles,
      description: 'Personal care and wellness products',
      subcategories: ['Skincare', 'Makeup', 'Hair Care', 'Health', 'Fragrances', 'Personal Care'],
      totalProducts: 980
    },
    sports: {
      name: 'Sports & Outdoors',
      icon: Dumbbell,
      description: 'Gear for active lifestyles and outdoor adventures',
      subcategories: ['Fitness', 'Outdoor', 'Sports Equipment', 'Activewear', 'Footwear', 'Accessories'],
      totalProducts: 750
    },
    food: {
      name: 'Food & Beverages',
      icon: UtensilsCrossed,
      description: 'Fresh groceries and gourmet selections',
      subcategories: ['Fresh Produce', 'Pantry', 'Beverages', 'Snacks', 'Frozen', 'Organic'],
      totalProducts: 3200
    }
  };

  const currentCategory = categoryInfo[params.categoryId as keyof typeof categoryInfo];

  // Mock products data
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro 128GB',
      price: 145000,
      originalPrice: 155000,
      brand: 'Apple',
      rating: 4.8,
      reviewCount: 324,
      image: '/products/iphone-15-pro.jpg',
      inStock: true,
      stockCount: 12,
      isOnSale: true,
      isFeatured: true,
      isNew: true,
      tags: ['flagship', 'premium', 'camera'],
      category: 'Electronics',
      subcategory: 'Smartphones'
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24 Ultra',
      price: 135000,
      originalPrice: 145000,
      brand: 'Samsung',
      rating: 4.7,
      reviewCount: 289,
      image: '/products/samsung-s24.jpg',
      inStock: true,
      stockCount: 8,
      isOnSale: true,
      isFeatured: true,
      isNew: false,
      tags: ['android', 'stylus', 'camera'],
      category: 'Electronics',
      subcategory: 'Smartphones'
    },
    {
      id: '3',
      name: 'MacBook Air M3 13"',
      price: 165000,
      brand: 'Apple',
      rating: 4.9,
      reviewCount: 156,
      image: '/products/macbook-air.jpg',
      inStock: true,
      stockCount: 4,
      isOnSale: false,
      isFeatured: true,
      isNew: true,
      tags: ['laptop', 'productivity', 'portable'],
      category: 'Electronics',
      subcategory: 'Laptops'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by subcategory
    if (selectedSubcategory !== 'all') {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }

    // Filter by brand
    if (selectedBrand !== 'all') {
      filtered = filtered.filter(product => product.brand === selectedBrand);
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by stock
    if (showOnlyInStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Filter by sale
    if (showOnlyOnSale) {
      filtered = filtered.filter(product => product.isOnSale);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'popular':
          return b.reviewCount - a.reviewCount;
        case 'featured':
        default:
          return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedSubcategory, selectedBrand, priceRange, sortBy, showOnlyInStock, showOnlyOnSale]);

  const uniqueBrands = [...new Set(products.map(p => p.brand))];

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

  if (!currentCategory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Category Not Found</h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const CategoryIcon = currentCategory.icon;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CategoryIcon className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {currentCategory.name}
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {currentCategory.description}
            </p>
            
            <div className="text-lg">
              <span className="font-semibold">{currentCategory.totalProducts.toLocaleString()}</span>
              <span className="text-blue-200"> products available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search in ${currentCategory.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setShowOnlyInStock(!showOnlyInStock)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                showOnlyInStock ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              In Stock Only
            </button>
            <button
              onClick={() => setShowOnlyOnSale(!showOnlyOnSale)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                showOnlyOnSale ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              On Sale
            </button>
            <button
              onClick={() => setSortBy('featured')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                sortBy === 'featured' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => setSortBy('newest')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                sortBy === 'newest' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              New Arrivals
            </button>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Advanced Filters
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
                  <select
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Subcategories</option>
                    {currentCategory.subcategories.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Brands</option>
                    {uniqueBrands.map((brand) => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range: KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="5000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                      className="flex-1"
                    />
                    <input
                      type="range"
                      min="0"
                      max="200000"
                      step="5000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Product Image */}
              <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}`}>
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {product.isOnSale && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      SALE
                    </span>
                  )}
                  {product.isNew && (
                    <span className="bg-blue-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      NEW
                    </span>
                  )}
                  {product.isFeatured && (
                    <span className="bg-purple-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      FEATURED
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium ${
                  !product.inStock ? 'bg-red-100 text-red-800' :
                  product.stockCount <= 5 ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {!product.inStock ? 'Out of Stock' :
                   product.stockCount <= 5 ? `${product.stockCount} left` :
                   'In Stock'}
                </div>

                {/* Quick Actions */}
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="mb-3">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.brand} • {product.subcategory}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating) 
                            ? 'text-yellow-400 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium">{product.rating}</span>
                  <span className="ml-1 text-xs text-gray-500">({product.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-gray-900">
                      KSh {product.price.toLocaleString()}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        KSh {product.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <div className="text-sm text-green-600 font-medium">
                      Save KSh {(product.originalPrice - product.price).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {product.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    disabled={!product.inStock}
                    className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                      product.inStock
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
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
          ))}
        </div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSubcategory('all');
                setSelectedBrand('all');
                setPriceRange([0, 200000]);
                setShowOnlyInStock(false);
                setShowOnlyOnSale(false);
              }}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}