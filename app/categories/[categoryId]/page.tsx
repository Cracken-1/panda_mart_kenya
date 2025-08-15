'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Grid,
  List,
  Star,
  Heart,
  ShoppingCart,
  MapPin,
  Package,
  Truck,
  Store,
  Eye,
  Share2,
  ChevronDown,
  SlidersHorizontal,
  Tag,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowUpDown,
  Zap,
  Award,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';
import AuthenticationForm from '@/components/auth/AuthenticationForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import ShopInStoreModal from '@/components/product/ShopInStoreModal';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  brand: string;
  sku: string;
  inStock: boolean;
  stockCount: number;
  lowStock: boolean;
  isNew: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  tags: string[];
  specifications: Record<string, string>;
  storeAvailability: StoreAvailability[];
  variants?: ProductVariant[];
}

interface StoreAvailability {
  storeId: string;
  storeName: string;
  storeAddress: string;
  distance: number;
  inStock: boolean;
  stockCount: number;
  price: number;
  lastUpdated: string;
}

interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price?: number;
  inStock: boolean;
}

interface CategoryPageProps {
  params: { categoryId: string };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const router = useRouter();
  const { categoryId } = useParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showShopInStoreModal, setShowShopInStoreModal] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  
  // Filter states
  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    brands: [] as string[],
    rating: 0,
    availability: 'all', // all, in-stock, low-stock
    discount: false,
    newArrivals: false,
    featured: false
  });

  // Mock data - In real app, this would come from API
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      description: 'Latest iPhone with titanium design, A17 Pro chip, and advanced camera system',
      price: 189999,
      originalPrice: 199999,
      discount: 5,
      rating: 4.8,
      reviewCount: 1247,
      images: ['/products/iphone-15-pro.jpg', '/products/iphone-15-pro-2.jpg'],
      category: 'electronics',
      brand: 'Apple',
      sku: 'APL-IP15PM-256-NT',
      inStock: true,
      stockCount: 15,
      lowStock: false,
      isNew: true,
      isFeatured: true,
      isOnSale: true,
      tags: ['smartphone', 'premium', 'latest'],
      specifications: {
        'Display': '6.7" Super Retina XDR',
        'Storage': '256GB',
        'Camera': '48MP Main + 12MP Ultra Wide',
        'Battery': 'Up to 29 hours video playback',
        'Processor': 'A17 Pro chip'
      },
      storeAvailability: [
        {
          storeId: '1',
          storeName: 'Garden City Mall',
          storeAddress: 'Thika Road, Nairobi',
          distance: 2.5,
          inStock: true,
          stockCount: 8,
          price: 189999,
          lastUpdated: '2024-01-15T10:30:00Z'
        },
        {
          storeId: '2',
          storeName: 'Galleria Mall',
          storeAddress: 'Langata Road, Nairobi',
          distance: 5.2,
          inStock: true,
          stockCount: 3,
          price: 189999,
          lastUpdated: '2024-01-15T09:15:00Z'
        },
        {
          storeId: '3',
          storeName: 'Westgate Mall',
          storeAddress: 'Westlands, Nairobi',
          distance: 8.1,
          inStock: false,
          stockCount: 0,
          price: 189999,
          lastUpdated: '2024-01-15T08:45:00Z'
        }
      ],
      variants: [
        { id: '1', name: 'Color', value: 'Natural Titanium', inStock: true },
        { id: '2', name: 'Color', value: 'Blue Titanium', inStock: true },
        { id: '3', name: 'Storage', value: '512GB', price: 219999, inStock: true }
      ]
    },
    {
      id: '2',
      name: 'Samsung Galaxy S24 Ultra',
      description: 'Premium Android smartphone with S Pen, 200MP camera, and AI features',
      price: 159999,
      originalPrice: 169999,
      discount: 6,
      rating: 4.7,
      reviewCount: 892,
      images: ['/products/galaxy-s24-ultra.jpg'],
      category: 'electronics',
      brand: 'Samsung',
      sku: 'SAM-GS24U-256-BK',
      inStock: true,
      stockCount: 7,
      lowStock: true,
      isNew: false,
      isFeatured: true,
      isOnSale: true,
      tags: ['smartphone', 'android', 's-pen'],
      specifications: {
        'Display': '6.8" Dynamic AMOLED 2X',
        'Storage': '256GB',
        'Camera': '200MP Main + 50MP Periscope',
        'Battery': '5000mAh',
        'Processor': 'Snapdragon 8 Gen 3'
      },
      storeAvailability: [
        {
          storeId: '1',
          storeName: 'Garden City Mall',
          storeAddress: 'Thika Road, Nairobi',
          distance: 2.5,
          inStock: true,
          stockCount: 4,
          price: 159999,
          lastUpdated: '2024-01-15T11:00:00Z'
        },
        {
          storeId: '2',
          storeName: 'Galleria Mall',
          storeAddress: 'Langata Road, Nairobi',
          distance: 5.2,
          inStock: true,
          stockCount: 2,
          price: 159999,
          lastUpdated: '2024-01-15T10:30:00Z'
        }
      ]
    }
  ];

  const categoryNames: Record<string, string> = {
    'electronics': 'Electronics',
    'fashion': 'Fashion',
    'home-garden': 'Home & Garden',
    'health-beauty': 'Health & Beauty',
    'sports': 'Sports & Outdoors',
    'food': 'Food & Beverages'
  };

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const filteredProducts = mockProducts.filter(product => 
        product.category === categoryId
      );
      setProducts(filteredProducts);
      setLoading(false);
    }, 1000);
  }, [categoryId]);

  const handleAddToCart = (product: Product) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1
    });
  };

  const handleShopInStore = (product: Product, storeId: string) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    // Map store IDs to match existing store structure
    const storeIdMap: Record<string, string> = {
      '1': 'garden-city',
      '2': 'galleria', 
      '3': 'westgate'
    };
    
    const mappedStoreId = storeIdMap[storeId] || storeId;
    router.push(`/shop-in-store/${mappedStoreId}?product=${product.id}`);
  };

  const getStockStatus = (product: Product) => {
    if (!product.inStock) {
      return { status: 'out-of-stock', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle };
    }
    if (product.lowStock) {
      return { status: 'low-stock', color: 'text-orange-600', bg: 'bg-orange-50', icon: AlertCircle };
    }
    return { status: 'in-stock', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle };
  };

  const filteredProducts = products.filter(product => {
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }
    if (filters.rating > 0 && product.rating < filters.rating) {
      return false;
    }
    if (filters.availability === 'in-stock' && !product.inStock) {
      return false;
    }
    if (filters.availability === 'low-stock' && !product.lowStock) {
      return false;
    }
    if (filters.discount && !product.isOnSale) {
      return false;
    }
    if (filters.newArrivals && !product.isNew) {
      return false;
    }
    if (filters.featured && !product.isFeatured) {
      return false;
    }
    return true;
  });

  if (!user) {
    return <AuthenticationForm />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {categoryNames[categoryId as string] || 'Category'}
              </h1>
              <p className="text-gray-600 mt-2">
                Discover our wide selection of {categoryNames[categoryId as string]?.toLowerCase()} products
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {filteredProducts.length} products found
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({
                      ...filters,
                      priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                    })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>KSh {filters.priceRange[0].toLocaleString()}</span>
                    <span>KSh {filters.priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Availability
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Products' },
                    { value: 'in-stock', label: 'In Stock' },
                    { value: 'low-stock', label: 'Low Stock' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="availability"
                        value={option.value}
                        checked={filters.availability === option.value}
                        onChange={(e) => setFilters({
                          ...filters,
                          availability: e.target.value
                        })}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Filters
                </label>
                <div className="space-y-2">
                  {[
                    { key: 'discount', label: 'On Sale' },
                    { key: 'newArrivals', label: 'New Arrivals' },
                    { key: 'featured', label: 'Featured' }
                  ].map((filter) => (
                    <label key={filter.key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters[filter.key as keyof typeof filters] as boolean}
                        onChange={(e) => setFilters({
                          ...filters,
                          [filter.key]: e.target.checked
                        })}
                        className="text-red-600 focus:ring-red-500 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">{filter.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span>Filters</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="newest">Newest First</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-red-100 text-red-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-red-100 text-red-600' 
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onAddToCart={handleAddToCart}
                    onShopInStore={handleShopInStore}
                    onViewDetails={(product) => {
                      setSelectedProduct(product);
                      setShowProductModal(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {showProductModal && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => {
            setShowProductModal(false);
            setSelectedProduct(null);
          }}
          onAddToCart={handleAddToCart}
          onShopInStore={handleShopInStore}
        />
      )}

      {/* Shop in Store Modal */}
      {showShopInStoreModal && selectedProduct && (
        <ShopInStoreModal
          product={selectedProduct}
          isOpen={showShopInStoreModal}
          onClose={() => {
            setShowShopInStoreModal(false);
            setSelectedProduct(null);
            setSelectedStoreId('');
          }}
          selectedStoreId={selectedStoreId}
        />
      )}
    </div>
  );
}

// Product Card Component
interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onAddToCart: (product: Product) => void;
  onShopInStore: (product: Product, storeId: string) => void;
  onViewDetails: (product: Product) => void;
}

function ProductCard({ product, viewMode, onAddToCart, onShopInStore, onViewDetails }: ProductCardProps) {
  const stockStatus = getStockStatus(product);
  const StockIcon = stockStatus.icon;
  
  const availableStores = product.storeAvailability.filter(store => store.inStock);

  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex gap-6">
          {/* Product Image */}
          <div className="relative w-32 h-32 flex-shrink-0">
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            {product.isNew && (
              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                New
              </span>
            )}
            {product.isOnSale && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs text-gray-500">SKU: {product.sku}</span>
                  <span className="text-xs text-gray-300">•</span>
                  <span className="text-xs text-gray-500">Brand: {product.brand}</span>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    KSh {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      KSh {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center space-x-1">
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
                  <span className="text-sm text-gray-600">({product.reviewCount})</span>
                </div>

                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${stockStatus.bg} ${stockStatus.color}`}>
                  <StockIcon className="w-3 h-3" />
                  <span>
                    {stockStatus.status === 'in-stock' && `${product.stockCount} in stock`}
                    {stockStatus.status === 'low-stock' && `Only ${product.stockCount} left`}
                    {stockStatus.status === 'out-of-stock' && 'Out of stock'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onViewDetails(product)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </button>
                
                {product.inStock && (
                  <button
                    onClick={() => onAddToCart(product)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                )}
              </div>
            </div>

            {/* Store Availability */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Available in {availableStores.length} store{availableStores.length !== 1 ? 's' : ''}
                </span>
                {availableStores.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setSelectedStoreId(availableStores[0].storeId);
                      setShowShopInStoreModal(true);
                    }}
                    className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center space-x-1"
                  >
                    <Store className="w-4 h-4" />
                    <span>Shop in Store</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 flex items-center justify-center">
        <Package className="w-16 h-16 text-gray-400" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-1">
          {product.isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              New
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Featured
            </span>
          )}
        </div>
        
        {product.isOnSale && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            -{product.discount}%
          </span>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
            <Heart className="w-4 h-4 text-gray-600" />
          </button>
          <button 
            onClick={() => onViewDetails(product)}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors">
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
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
          <span className="text-sm text-gray-600">({product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-xl font-bold text-gray-900">
            KSh {product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              KSh {product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium mb-3 ${stockStatus.bg} ${stockStatus.color}`}>
          <StockIcon className="w-3 h-3" />
          <span>
            {stockStatus.status === 'in-stock' && `${product.stockCount} in stock`}
            {stockStatus.status === 'low-stock' && `Only ${product.stockCount} left`}
            {stockStatus.status === 'out-of-stock' && 'Out of stock'}
          </span>
        </div>

        {/* Store Availability */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              Available in {availableStores.length} store{availableStores.length !== 1 ? 's' : ''}
            </span>
            {availableStores.length > 0 && (
              <button
                onClick={() => {
                  setSelectedProduct(product);
                  setSelectedStoreId(availableStores[0].storeId);
                  setShowShopInStoreModal(true);
                }}
                className="text-red-600 hover:text-red-700 font-medium flex items-center space-x-1"
              >
                <Store className="w-3 h-3" />
                <span>Shop in Store</span>
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          {product.inStock ? (
            <button
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          ) : (
            <button
              disabled
              className="flex-1 bg-gray-300 text-gray-500 py-2 px-4 rounded-lg cursor-not-allowed"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Product Details Modal Component
interface ProductDetailsModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onShopInStore: (product: Product, storeId: string) => void;
}

function ProductDetailsModal({ product, onClose, onAddToCart, onShopInStore }: ProductDetailsModalProps) {
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');

  const stockStatus = getStockStatus(product);
  const StockIcon = stockStatus.icon;
  
  const availableStores = product.storeAvailability.filter(store => store.inStock);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex h-full">
          {/* Product Images */}
          <div className="w-1/2 bg-gray-100 flex items-center justify-center">
            <Package className="w-32 h-32 text-gray-400" />
          </div>

          {/* Product Details */}
          <div className="w-1/2 p-8 overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                <p className="text-gray-600 mb-4">{product.description}</p>
                
                {/* Rating */}
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600">({product.reviewCount} reviews)</span>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                KSh {product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  KSh {product.originalPrice.toLocaleString()}
                </span>
              )}
              {product.discount && (
                <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-sm font-medium">
                  Save {product.discount}%
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg mb-6 ${stockStatus.bg}`}>
              <StockIcon className={`w-5 h-5 ${stockStatus.color}`} />
              <span className={`font-medium ${stockStatus.color}`}>
                {stockStatus.status === 'in-stock' && `${product.stockCount} units in stock`}
                {stockStatus.status === 'low-stock' && `Only ${product.stockCount} units left`}
                {stockStatus.status === 'out-of-stock' && 'Currently out of stock'}
              </span>
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Options</h4>
                <div className="space-y-3">
                  {Object.entries(
                    product.variants.reduce((acc, variant) => {
                      if (!acc[variant.name]) acc[variant.name] = [];
                      acc[variant.name].push(variant);
                      return acc;
                    }, {} as Record<string, typeof product.variants>)
                  ).map(([name, variants]) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {variants.map((variant) => (
                          <button
                            key={variant.id}
                            onClick={() => setSelectedVariants({
                              ...selectedVariants,
                              [name]: variant.value
                            })}
                            className={`px-3 py-2 border rounded-lg text-sm font-medium transition-colors ${
                              selectedVariants[name] === variant.value
                                ? 'border-red-500 bg-red-50 text-red-600'
                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                            } ${!variant.inStock ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={!variant.inStock}
                          >
                            {variant.value}
                            {variant.price && (
                              <span className="ml-1 text-xs">
                                (+KSh {(variant.price - product.price).toLocaleString()})
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={quantity >= product.stockCount}
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 mb-6">
              {product.inStock ? (
                <button
                  onClick={() => onAddToCart(product)}
                  className="w-full bg-red-500 text-white py-3 px-6 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center space-x-2 font-medium"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Add to Cart</span>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-300 text-gray-500 py-3 px-6 rounded-lg cursor-not-allowed"
                >
                  Out of Stock
                </button>
              )}
              
              <button className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                <Heart className="w-5 h-5" />
                <span>Add to Wishlist</span>
              </button>
            </div>

            {/* Store Availability */}
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Store Availability</h4>
              <div className="space-y-3">
                {product.storeAvailability.map((store) => (
                  <div key={store.storeId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{store.storeName}</div>
                      <div className="text-sm text-gray-600">{store.storeAddress}</div>
                      <div className="text-xs text-gray-500">{store.distance}km away</div>
                    </div>
                    <div className="text-right">
                      {store.inStock ? (
                        <div>
                          <div className="text-sm font-medium text-green-600">
                            {store.stockCount} in stock
                          </div>
                          <button
                            onClick={() => {
                              setShowProductModal(false);
                              setSelectedStoreId(store.storeId);
                              setShowShopInStoreModal(true);
                            }}
                            className="text-sm text-red-600 hover:text-red-700 font-medium"
                          >
                            Shop in Store
                          </button>
                        </div>
                      ) : (
                        <div className="text-sm text-red-600">Out of stock</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h4 className="font-medium text-gray-900 mb-4">Specifications</h4>
              <div className="space-y-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">{key}</span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function (moved outside component)
function getStockStatus(product: Product) {
  if (!product.inStock) {
    return { status: 'out-of-stock', color: 'text-red-600', bg: 'bg-red-50', icon: XCircle };
  }
  if (product.lowStock) {
    return { status: 'low-stock', color: 'text-orange-600', bg: 'bg-orange-50', icon: AlertCircle };
  }
  return { status: 'in-stock', color: 'text-green-600', bg: 'bg-green-50', icon: CheckCircle };
}