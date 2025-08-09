'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, ShoppingCart, Heart, Eye, Clock, CheckCircle, AlertTriangle, Package, Star, MapPin } from 'lucide-react';
import ReservationModal from './ReservationModal';

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

  // Mock product data - in production, this would come from an API
  const mockProducts: Product[] = [
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
      id: 'samsung-tv-55',
      name: 'Samsung 55" QLED 4K Smart TV',
      price: 89000,
      image: '/products/samsung-tv.jpg',
      category: 'Electronics',
      brand: 'Samsung',
      rating: 4.6,
      reviewCount: 156,
      inStock: true,
      stockCount: 5,
      description: 'Stunning 4K QLED display with smart features and HDR support.',
      features: ['4K QLED', 'Smart TV', 'HDR10+', 'Voice Control'],
      isOnSale: false,
      availableInOtherStores: [
        { storeId: 'westgate', storeName: 'Panda Mart Westgate', stockCount: 2, distance: 5.2 }
      ]
    },
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
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
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
                      <button className="w-full border-2 border-emerald-500 text-emerald-600 py-2 px-4 rounded-xl font-semibold hover:bg-emerald-50 transition-colors">
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