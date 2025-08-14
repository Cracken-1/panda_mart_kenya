'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ShoppingCart, Heart, Eye, Clock, CheckCircle, AlertTriangle, Package, Star, MapPin } from 'lucide-react';
import ReservationModal from './ReservationModal';
import { useCart } from '@/lib/hooks/useCart';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  description: string;
  features: string[];
  isOnSale: boolean;
  saleEndDate?: string;
  availableInOtherStores?: {
    storeId: string;
    storeName: string;
    stockCount: number;
    distance: number;
  }[];
}

interface Store {
  id: string;
  name: string;
  totalProducts: number;
  categories: string[];
}

interface StoreInventoryProps {
  store: Store;
}

export default function StoreInventory({ store }: StoreInventoryProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'stock'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  
  // Cart functionality
  const { addToCart, cart } = useCart();

  // Expanded product catalog - in production, this would come from an API
  const mockProducts: Product[] = [
    // Electronics
    {
      id: 'iphone-15-pro',
      name: 'iPhone 15 Pro 128GB',
      price: 145000,
      originalPrice: 155000,
      image: '/products/iphone-15-pro.jpg',
      category: 'Electronics',
      brand: 'Apple',
      rating: 4.8,
      reviewCount: 324,
      inStock: true,
      stockCount: 12,
      description: 'The most advanced iPhone yet with titanium design and A17 Pro chip.',
      features: ['A17 Pro Chip', 'Titanium Design', '48MP Camera', '5G Ready'],
      isOnSale: true,
      saleEndDate: '2024-12-31',
      availableInOtherStores: [
        { storeId: 'westgate', storeName: 'Panda Mart Westgate', stockCount: 8, distance: 5.2 },
        { storeId: 'galleria', storeName: 'Panda Mart Galleria', stockCount: 3, distance: 8.1 }
      ]
    },
    {
      id: 'samsung-galaxy-s24',
      name: 'Samsung Galaxy S24 Ultra 256GB',
      price: 135000,
      originalPrice: 145000,
      image: '/products/samsung-s24.jpg',
      category: 'Electronics',
      brand: 'Samsung',
      rating: 4.7,
      reviewCount: 289,
      inStock: true,
      stockCount: 8,
      description: 'Premium Android flagship with S Pen and AI features.',
      features: ['S Pen Included', 'AI Photography', '200MP Camera', '5000mAh Battery'],
      isOnSale: true,
      saleEndDate: '2024-12-28',
      availableInOtherStores: [
        { storeId: 'westgate', storeName: 'Panda Mart Westgate', stockCount: 5, distance: 5.2 }
      ]
    },
    {
      id: 'macbook-air-m3',
      name: 'MacBook Air M3 13" 256GB',
      price: 165000,
      image: '/products/macbook-air.jpg',
      category: 'Electronics',
      brand: 'Apple',
      rating: 4.9,
      reviewCount: 156,
      inStock: true,
      stockCount: 4,
      description: 'Ultra-thin laptop with M3 chip for incredible performance.',
      features: ['M3 Chip', '18hr Battery', 'Liquid Retina Display', 'MagSafe Charging'],
      isOnSale: false
    },
    {
      id: 'samsung-tv-55',
      name: 'Samsung 55" QLED 4K Smart TV',
      price: 89000,
      originalPrice: 95000,
      image: '/products/samsung-tv.jpg',
      category: 'Electronics',
      brand: 'Samsung',
      rating: 4.6,
      reviewCount: 156,
      inStock: true,
      stockCount: 5,
      description: 'Stunning 4K QLED display with smart features and HDR support.',
      features: ['4K QLED', 'Smart TV', 'HDR10+', 'Voice Control'],
      isOnSale: true,
      saleEndDate: '2024-12-30',
      availableInOtherStores: [
        { storeId: 'westgate', storeName: 'Panda Mart Westgate', stockCount: 2, distance: 5.2 }
      ]
    },
    {
      id: 'sony-headphones',
      name: 'Sony WH-1000XM5 Wireless Headphones',
      price: 35000,
      originalPrice: 42000,
      image: '/products/sony-headphones.jpg',
      category: 'Electronics',
      brand: 'Sony',
      rating: 4.8,
      reviewCount: 445,
      inStock: true,
      stockCount: 15,
      description: 'Industry-leading noise canceling with premium sound quality.',
      features: ['Active Noise Canceling', '30hr Battery', 'Quick Charge', 'Multipoint Connection'],
      isOnSale: true,
      saleEndDate: '2024-12-26'
    },
    {
      id: 'nintendo-switch',
      name: 'Nintendo Switch OLED Console',
      price: 45000,
      image: '/products/nintendo-switch.jpg',
      category: 'Electronics',
      brand: 'Nintendo',
      rating: 4.7,
      reviewCount: 234,
      inStock: true,
      stockCount: 7,
      description: 'Portable gaming console with vibrant OLED screen.',
      features: ['7" OLED Screen', 'Enhanced Audio', '64GB Storage', 'Joy-Con Controllers'],
      isOnSale: false
    },

    // Fashion
    {
      id: 'nike-air-max',
      name: 'Nike Air Max 270 Sneakers',
      price: 12500,
      originalPrice: 15000,
      image: '/products/nike-air-max.jpg',
      category: 'Fashion',
      brand: 'Nike',
      rating: 4.4,
      reviewCount: 89,
      inStock: false,
      stockCount: 0,
      description: 'Comfortable and stylish sneakers perfect for everyday wear.',
      features: ['Air Max Technology', 'Breathable Mesh', 'Durable Sole', 'Multiple Colors'],
      isOnSale: true,
      saleEndDate: '2024-12-25',
      availableInOtherStores: [
        { storeId: 'galleria', storeName: 'Panda Mart Galleria', stockCount: 15, distance: 8.1 },
        { storeId: 'westgate', storeName: 'Panda Mart Westgate', stockCount: 7, distance: 5.2 }
      ]
    },
    {
      id: 'adidas-ultraboost',
      name: 'Adidas Ultraboost 22 Running Shoes',
      price: 18500,
      originalPrice: 22000,
      image: '/products/adidas-ultraboost.jpg',
      category: 'Fashion',
      brand: 'Adidas',
      rating: 4.6,
      reviewCount: 167,
      inStock: true,
      stockCount: 12,
      description: 'Premium running shoes with responsive Boost cushioning.',
      features: ['Boost Midsole', 'Primeknit Upper', 'Continental Rubber', 'Energy Return'],
      isOnSale: true,
      saleEndDate: '2024-12-29'
    },
    {
      id: 'levis-jeans',
      name: "Levi's 501 Original Fit Jeans",
      price: 8500,
      image: '/products/levis-jeans.jpg',
      category: 'Fashion',
      brand: "Levi's",
      rating: 4.3,
      reviewCount: 203,
      inStock: true,
      stockCount: 25,
      description: 'Classic straight-leg jeans with authentic vintage styling.',
      features: ['100% Cotton', 'Button Fly', 'Straight Leg', 'Multiple Washes'],
      isOnSale: false
    },
    {
      id: 'polo-shirt',
      name: 'Ralph Lauren Classic Polo Shirt',
      price: 6500,
      originalPrice: 8000,
      image: '/products/polo-shirt.jpg',
      category: 'Fashion',
      brand: 'Ralph Lauren',
      rating: 4.5,
      reviewCount: 134,
      inStock: true,
      stockCount: 18,
      description: 'Timeless polo shirt in premium cotton piqué.',
      features: ['Cotton Piqué', 'Ribbed Collar', 'Two-Button Placket', 'Multiple Colors'],
      isOnSale: true,
      saleEndDate: '2024-12-27'
    },

    // Home & Garden
    {
      id: 'dyson-vacuum',
      name: 'Dyson V15 Detect Cordless Vacuum',
      price: 65000,
      image: '/products/dyson-vacuum.jpg',
      category: 'Home & Garden',
      brand: 'Dyson',
      rating: 4.9,
      reviewCount: 234,
      inStock: true,
      stockCount: 3,
      description: 'Advanced cordless vacuum with laser dust detection technology.',
      features: ['Laser Detection', 'Cordless', 'HEPA Filter', '60min Runtime'],
      isOnSale: false
    },
    {
      id: 'instant-pot',
      name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
      price: 15500,
      originalPrice: 18000,
      image: '/products/instant-pot.jpg',
      category: 'Home & Garden',
      brand: 'Instant Pot',
      rating: 4.7,
      reviewCount: 892,
      inStock: true,
      stockCount: 8,
      description: 'Multi-functional pressure cooker for quick and easy meals.',
      features: ['7-in-1 Functions', '6Qt Capacity', 'Smart Programs', 'Stainless Steel'],
      isOnSale: true,
      saleEndDate: '2024-12-31'
    },
    {
      id: 'air-fryer',
      name: 'Philips Airfryer XXL Digital',
      price: 22000,
      originalPrice: 25000,
      image: '/products/air-fryer.jpg',
      category: 'Home & Garden',
      brand: 'Philips',
      rating: 4.6,
      reviewCount: 456,
      inStock: true,
      stockCount: 6,
      description: 'Large capacity air fryer for healthier cooking with less oil.',
      features: ['7.3L Capacity', 'Digital Display', 'Rapid Air Technology', 'Dishwasher Safe'],
      isOnSale: true,
      saleEndDate: '2024-12-28'
    },
    {
      id: 'coffee-maker',
      name: 'Breville Barista Express Coffee Machine',
      price: 45000,
      image: '/products/coffee-maker.jpg',
      category: 'Home & Garden',
      brand: 'Breville',
      rating: 4.8,
      reviewCount: 178,
      inStock: true,
      stockCount: 4,
      description: 'Professional espresso machine with built-in grinder.',
      features: ['Built-in Grinder', 'Steam Wand', '15 Bar Pressure', 'Stainless Steel'],
      isOnSale: false
    },

    // Health & Beauty
    {
      id: 'skincare-set',
      name: 'CeraVe Daily Skincare Routine Set',
      price: 4500,
      originalPrice: 5500,
      image: '/products/skincare-set.jpg',
      category: 'Health & Beauty',
      brand: 'CeraVe',
      rating: 4.4,
      reviewCount: 267,
      inStock: true,
      stockCount: 20,
      description: 'Complete skincare routine with cleanser, moisturizer, and sunscreen.',
      features: ['Ceramides', 'Hyaluronic Acid', 'SPF 30', 'Dermatologist Recommended'],
      isOnSale: true,
      saleEndDate: '2024-12-30'
    },
    {
      id: 'electric-toothbrush',
      name: 'Oral-B Pro 3000 Electric Toothbrush',
      price: 8500,
      originalPrice: 10000,
      image: '/products/electric-toothbrush.jpg',
      category: 'Health & Beauty',
      brand: 'Oral-B',
      rating: 4.6,
      reviewCount: 345,
      inStock: true,
      stockCount: 12,
      description: 'Advanced electric toothbrush with pressure sensor and timer.',
      features: ['Pressure Sensor', '2-Minute Timer', '3 Cleaning Modes', 'Rechargeable'],
      isOnSale: true,
      saleEndDate: '2024-12-26'
    },

    // Sports & Outdoors
    {
      id: 'yoga-mat',
      name: 'Manduka PRO Yoga Mat',
      price: 7500,
      image: '/products/yoga-mat.jpg',
      category: 'Sports & Outdoors',
      brand: 'Manduka',
      rating: 4.7,
      reviewCount: 189,
      inStock: true,
      stockCount: 15,
      description: 'Professional-grade yoga mat with superior grip and cushioning.',
      features: ['6mm Thickness', 'Non-Slip Surface', 'Lifetime Guarantee', 'Eco-Friendly'],
      isOnSale: false
    },
    {
      id: 'dumbbells',
      name: 'Adjustable Dumbbell Set 5-50lbs',
      price: 35000,
      originalPrice: 40000,
      image: '/products/dumbbells.jpg',
      category: 'Sports & Outdoors',
      brand: 'PowerBlock',
      rating: 4.8,
      reviewCount: 123,
      inStock: true,
      stockCount: 5,
      description: 'Space-saving adjustable dumbbells for home workouts.',
      features: ['5-50lbs Range', 'Quick Weight Change', 'Compact Design', 'Expandable'],
      isOnSale: true,
      saleEndDate: '2024-12-31'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'rating':
          return b.rating - a.rating;
        case 'stock':
          return b.stockCount - a.stockCount;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, sortBy]);

  const handleReserveProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowReservationModal(true);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const getStockStatus = (product: Product) => {
    if (!product.inStock) {
      return { color: 'text-red-600 bg-red-100', text: 'Out of Stock', icon: AlertTriangle };
    }
    if (product.stockCount <= 3) {
      return { color: 'text-yellow-600 bg-yellow-100', text: `Only ${product.stockCount} left`, icon: Clock };
    }
    return { color: 'text-green-600 bg-green-100', text: 'In Stock', icon: CheckCircle };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
            />
          </div>

          {/* Mobile Filter Toggle */}
          <div className="flex items-center justify-between sm:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            
            {/* Mobile View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="hidden sm:flex items-center gap-4 flex-wrap">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="all">All Categories</option>
              {store.categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
              <option value="rating">Sort by Rating</option>
              <option value="stock">Sort by Stock</option>
            </select>

            {/* View Mode */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <div className="sm:hidden space-y-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="all">All Categories</option>
                  {store.categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price">Sort by Price</option>
                  <option value="rating">Sort by Rating</option>
                  <option value="stock">Sort by Stock</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product);
          const StatusIcon = stockStatus.icon;

          return (
            <div
              key={product.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Product Image */}
              <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-square'}`}>
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
                
                {/* Sale Badge */}
                {product.isOnSale && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                    SALE
                  </div>
                )}

                {/* Stock Status Badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium ${stockStatus.color}`}>
                  <StatusIcon className="w-3 h-3 inline mr-1" />
                  {stockStatus.text}
                </div>

                {/* Quick Actions */}
                <div className="absolute bottom-3 right-3 flex gap-2">
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
                  <p className="text-sm text-gray-600">{product.brand}</p>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{product.rating}</span>
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
                  {product.isOnSale && product.originalPrice && (
                    <div className="text-xs text-green-600 font-medium">
                      Save KSh {(product.originalPrice - product.price).toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Features */}
                {viewMode === 'list' && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 3).map((feature) => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Store Availability */}
                {!product.inStock && product.availableInOtherStores && product.availableInOtherStores.length > 0 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-xs font-medium text-blue-800 mb-1">Available at other stores:</div>
                    {product.availableInOtherStores.slice(0, 2).map((store) => (
                      <div key={store.storeId} className="text-xs text-blue-700 flex items-center justify-between">
                        <span>{store.storeName}</span>
                        <span>{store.stockCount} in stock • {store.distance}km away</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  {product.inStock ? (
                    <>
                      <button
                        onClick={() => handleReserveProduct(product)}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        <Clock className="w-4 h-4 inline mr-2" />
                        Reserve & Pay
                      </button>
                      <button 
                        onClick={() => handleAddToCart(product)}
                        className="w-full border-2 border-emerald-500 text-emerald-600 py-2 px-4 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4 inline mr-2" />
                        Add to Cart
                      </button>
                    </>
                  ) : (
                    <div className="space-y-2">
                      <button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-xl font-semibold cursor-not-allowed"
                      >
                        Out of Stock
                      </button>
                      {product.availableInOtherStores && product.availableInOtherStores.length > 0 && (
                        <button className="w-full border-2 border-blue-500 text-blue-600 py-2 px-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                          <MapPin className="w-4 h-4 inline mr-2" />
                          Find at Other Stores
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Reservation Modal */}
      {showReservationModal && selectedProduct && (
        <ReservationModal
          product={selectedProduct}
          store={store}
          onClose={() => {
            setShowReservationModal(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}