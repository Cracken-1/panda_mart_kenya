'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  ShoppingCart, 
  Heart, 
  Eye, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Package, 
  Star, 
  MapPin,
  Zap,
  TrendingUp,
  Award,
  Percent,
  Camera,
  Share2,
  Download,
  BarChart3,
  Users,
  MessageSquare,
  ThumbsUp,
  Bookmark,
  Compare,
  Gift,
  Truck,
  Shield,
  RefreshCw,
  Bell,
  Calendar,
  Tag,
  Target,
  Layers,
  Settings,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Minus,
  Info,
  ExternalLink,
  Phone,
  Mail,
  Navigation
} from 'lucide-react';
import ReservationModal from './ReservationModal';
import { useCart } from '@/lib/hooks/useCart';
import { useWishlist } from '@/lib/hooks/useWishlist';

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
  specifications?: Record<string, string>;
  warranty?: string;
  returnPolicy?: string;
  availableInOtherStores?: {
    storeId: string;
    storeName: string;
    stockCount: number;
    distance: number;
  }[];
  relatedProducts?: string[];
  tags?: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  isEcoFriendly?: boolean;
  deliveryTime?: string;
  installationAvailable?: boolean;
}

interface Store {
  id: string;
  name: string;
  totalProducts: number;
  categories: string[];
  address: string;
  phone: string;
  email: string;
  hours: string;
  services: string[];
}

interface StoreInventoryProps {
  store: Store;
}

const ProductComparison = ({ products, onClose }: { products: Product[], onClose: () => void }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Product Comparison</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-400" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{product.name}</h4>
                <div className="text-lg font-bold text-emerald-600 mb-4">
                  KSh {product.price.toLocaleString()}
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Brand:</span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <span className="font-medium">{product.rating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock:</span>
                    <span className="font-medium">{product.stockCount} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Warranty:</span>
                    <span className="font-medium">{product.warranty || 'N/A'}</span>
                  </div>
                </div>
                
                <div className="mt-4 space-y-2">
                  <h5 className="font-medium text-gray-900">Key Features:</h5>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {product.features.slice(0, 4).map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetails = ({ product, onClose }: { product: Product, onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
              <Package className="w-32 h-32 text-gray-400" />
            </div>
            
            {/* Product Info */}
            <div>
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">{product.brand}</span>
                  {product.isNew && <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">New</span>}
                  {product.isFeatured && <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">Featured</span>}
                  {product.isEcoFriendly && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Eco-Friendly</span>}
                </div>
                
                <div className="flex items-center mb-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{product.rating}</span>
                  <span className="ml-1 text-xs text-gray-500">({product.reviewCount} reviews)</span>
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    KSh {product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">
                      KSh {product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-4">
                <div className="flex space-x-8">
                  {['overview', 'specifications', 'reviews'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                        activeTab === tab
                          ? 'border-emerald-500 text-emerald-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Tab Content */}
              <div className="mb-6">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <p className="text-gray-600">{product.description}</p>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Key Features:</h4>
                      <ul className="space-y-1">
                        {product.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                
                {activeTab === 'specifications' && (
                  <div className="space-y-2">
                    {product.specifications ? Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">{key}:</span>
                        <span className="font-medium">{value}</span>
                      </div>
                    )) : (
                      <p className="text-gray-500">No specifications available</p>
                    )}
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Reviews coming soon</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                {product.warranty && (
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-blue-500" />
                    <span className="text-gray-600">Warranty: {product.warranty}</span>
                  </div>
                )}
                {product.deliveryTime && (
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-green-500" />
                    <span className="text-gray-600">Delivery: {product.deliveryTime}</span>
                  </div>
                )}
                {product.installationAvailable && (
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-purple-500" />
                    <span className="text-gray-600">Installation Available</span>
                  </div>
                )}
                {product.returnPolicy && (
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-orange-500" />
                    <span className="text-gray-600">Returns: {product.returnPolicy}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ComprehensiveStoreInventory({ store }: StoreInventoryProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rating' | 'stock' | 'newest' | 'popularity'>('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showOnlyInStock, setShowOnlyInStock] = useState(false);
  const [showOnlyOnSale, setShowOnlyOnSale] = useState(false);
  
  // Cart and wishlist functionality
  const { addToCart, cart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Enhanced product catalog with more comprehensive data
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
      description: 'The most advanced iPhone yet with titanium design, A17 Pro chip, and revolutionary camera system.',
      features: ['A17 Pro Chip', 'Titanium Design', '48MP Camera System', '5G Ready', 'Face ID', 'MagSafe Compatible'],
      isOnSale: true,
      saleEndDate: '2024-12-31',
      specifications: {
        'Display': '6.1" Super Retina XDR',
        'Processor': 'A17 Pro',
        'Storage': '128GB',
        'Camera': '48MP Main + 12MP Ultra Wide',
        'Battery': 'Up to 23 hours video',
        'OS': 'iOS 17'
      },
      warranty: '1 Year Apple Warranty',
      returnPolicy: '14 days',
      deliveryTime: '1-2 days',
      installationAvailable: false,
      tags: ['flagship', 'premium', 'camera', '5g'],
      isNew: true,
      isFeatured: true,
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
      description: 'Premium Android flagship with S Pen, AI features, and exceptional camera capabilities.',
      features: ['S Pen Included', 'AI Photography', '200MP Camera', '5000mAh Battery', 'Snapdragon 8 Gen 3', 'S Pen Support'],
      isOnSale: true,
      saleEndDate: '2024-12-28',
      specifications: {
        'Display': '6.8" Dynamic AMOLED 2X',
        'Processor': 'Snapdragon 8 Gen 3',
        'Storage': '256GB',
        'Camera': '200MP Main + 50MP Periscope',
        'Battery': '5000mAh',
        'OS': 'Android 14'
      },
      warranty: '2 Years Samsung Warranty',
      returnPolicy: '30 days',
      deliveryTime: '1-2 days',
      installationAvailable: false,
      tags: ['android', 'stylus', 'camera', 'premium'],
      isFeatured: true,
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
      description: 'Ultra-thin laptop with M3 chip for incredible performance and all-day battery life.',
      features: ['M3 Chip', '18hr Battery Life', 'Liquid Retina Display', 'MagSafe Charging', 'Touch ID', 'Thunderbolt Ports'],
      isOnSale: false,
      specifications: {
        'Display': '13.6" Liquid Retina',
        'Processor': 'Apple M3',
        'Storage': '256GB SSD',
        'Memory': '8GB Unified Memory',
        'Battery': 'Up to 18 hours',
        'Weight': '1.24 kg'
      },
      warranty: '1 Year Apple Warranty',
      returnPolicy: '14 days',
      deliveryTime: '2-3 days',
      installationAvailable: true,
      tags: ['laptop', 'productivity', 'portable', 'premium'],
      isNew: true
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
      description: 'Stunning 4K QLED display with smart features, HDR support, and immersive sound.',
      features: ['4K QLED Display', 'Smart TV Platform', 'HDR10+ Support', 'Voice Control', 'Gaming Mode', 'Multiple HDMI'],
      isOnSale: true,
      saleEndDate: '2024-12-30',
      specifications: {
        'Screen Size': '55 inches',
        'Resolution': '4K UHD (3840x2160)',
        'Display Type': 'QLED',
        'Smart Platform': 'Tizen OS',
        'HDR': 'HDR10+',
        'Refresh Rate': '60Hz'
      },
      warranty: '2 Years Samsung Warranty',
      returnPolicy: '7 days',
      deliveryTime: '3-5 days',
      installationAvailable: true,
      tags: ['tv', 'entertainment', '4k', 'smart'],
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
      description: 'Industry-leading noise canceling with premium sound quality and all-day comfort.',
      features: ['Active Noise Canceling', '30hr Battery Life', 'Quick Charge', 'Multipoint Connection', 'Touch Controls', 'Voice Assistant'],
      isOnSale: true,
      saleEndDate: '2024-12-26',
      specifications: {
        'Driver': '30mm',
        'Battery Life': '30 hours',
        'Charging': 'USB-C Quick Charge',
        'Connectivity': 'Bluetooth 5.2',
        'Weight': '250g',
        'Noise Canceling': 'Yes'
      },
      warranty: '1 Year Sony Warranty',
      returnPolicy: '30 days',
      deliveryTime: '1-2 days',
      installationAvailable: false,
      tags: ['audio', 'wireless', 'noise-canceling', 'premium'],
      isFeatured: true
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
      description: 'Portable gaming console with vibrant OLED screen and versatile play modes.',
      features: ['7" OLED Screen', 'Enhanced Audio', '64GB Storage', 'Joy-Con Controllers', 'Dock Included', 'Portable Mode'],
      isOnSale: false,
      specifications: {
        'Screen': '7" OLED Multi-touch',
        'Storage': '64GB Internal',
        'Battery': '4.5-9 hours',
        'Connectivity': 'Wi-Fi, Bluetooth',
        'Modes': 'TV, Tabletop, Handheld',
        'Controllers': 'Joy-Con (L)/(R)'
      },
      warranty: '1 Year Nintendo Warranty',
      returnPolicy: '14 days',
      deliveryTime: '1-2 days',
      installationAvailable: false,
      tags: ['gaming', 'portable', 'family', 'entertainment'],
      isNew: false
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
      description: 'Comfortable and stylish sneakers perfect for everyday wear and light sports activities.',
      features: ['Air Max Technology', 'Breathable Mesh Upper', 'Durable Rubber Sole', 'Multiple Color Options', 'Lightweight Design', 'Cushioned Insole'],
      isOnSale: true,
      saleEndDate: '2024-12-25',
      specifications: {
        'Upper Material': 'Mesh and Synthetic',
        'Sole': 'Rubber',
        'Closure': 'Lace-up',
        'Heel Height': '32mm',
        'Weight': '310g (Size 9)',
        'Available Sizes': '6-12 US'
      },
      warranty: '6 Months Nike Warranty',
      returnPolicy: '30 days',
      deliveryTime: '2-3 days',
      installationAvailable: false,
      tags: ['sneakers', 'casual', 'sports', 'comfort'],
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
      description: 'Premium running shoes with responsive Boost cushioning and energy return technology.',
      features: ['Boost Midsole', 'Primeknit Upper', 'Continental Rubber Outsole', 'Energy Return', 'Adaptive Fit', 'Torsion System'],
      isOnSale: true,
      saleEndDate: '2024-12-29',
      specifications: {
        'Upper': 'Primeknit',
        'Midsole': 'Boost',
        'Outsole': 'Continental Rubber',
        'Drop': '10mm',
        'Weight': '320g (Size 9)',
        'Support': 'Neutral'
      },
      warranty: '6 Months Adidas Warranty',
      returnPolicy: '30 days',
      deliveryTime: '1-2 days',
      installationAvailable: false,
      tags: ['running', 'performance', 'boost', 'premium'],
      isFeatured: true
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
      description: 'Advanced cordless vacuum with laser dust detection technology and powerful suction.',
      features: ['Laser Dust Detection', 'Cordless Design', 'HEPA Filtration', '60min Runtime', 'LCD Screen', 'Multiple Attachments'],
      isOnSale: false,
      specifications: {
        'Suction Power': '230 Air Watts',
        'Battery Life': 'Up to 60 minutes',
        'Bin Capacity': '0.77L',
        'Weight': '3.1kg',
        'Filtration': 'Advanced HEPA',
        'Attachments': '8 included'
      },
      warranty: '2 Years Dyson Warranty',
      returnPolicy: '30 days',
      deliveryTime: '2-3 days',
      installationAvailable: true,
      tags: ['cleaning', 'cordless', 'premium', 'technology'],
      isNew: true,
      isFeatured: true
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
      description: 'Multi-functional pressure cooker for quick and easy meals with 7 cooking functions.',
      features: ['7-in-1 Functions', '6Qt Capacity', 'Smart Programs', 'Stainless Steel Inner Pot', 'Safety Features', 'Recipe App'],
      isOnSale: true,
      saleEndDate: '2024-12-31',
      specifications: {
        'Capacity': '6 Quarts',
        'Functions': '7 (Pressure Cook, Slow Cook, Rice, Yogurt, Steam, Sauté, Keep Warm)',
        'Material': 'Stainless Steel',
        'Power': '1000W',
        'Pressure': '10.15-11.6 psi',
        'Safety': '10+ safety features'
      },
      warranty: '1 Year Instant Pot Warranty',
      returnPolicy: '30 days',
      deliveryTime: '1-2 days',
      installationAvailable: false,
      tags: ['cooking', 'kitchen', 'multi-function', 'convenience'],
      isFeatured: true
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
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Filter by brands
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(product => selectedBrands.includes(product.brand));
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(product => 
        product.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    // Filter by stock status
    if (showOnlyInStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // Filter by sale status
    if (showOnlyOnSale) {
      filtered = filtered.filter(product => product.isOnSale);
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
        case 'newest':
          return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
        case 'popularity':
          return b.reviewCount - a.reviewCount;
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, sortBy, priceRange, selectedBrands, selectedTags, showOnlyInStock, showOnlyOnSale]);

  const handleReserveProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowReservationModal(true);
  };

  const handleAddToCart = async (product: Product) => {
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleToggleWishlist = async (product: Product) => {
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  };

  const handleToggleCompare = (product: Product) => {
    if (compareProducts.find(p => p.id === product.id)) {
      setCompareProducts(compareProducts.filter(p => p.id !== product.id));
    } else if (compareProducts.length < 3) {
      setCompareProducts([...compareProducts, product]);
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

  const uniqueBrands = [...new Set(products.map(p => p.brand))];
  const uniqueTags = [...new Set(products.flatMap(p => p.tags || []))];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Store Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">{store.name}</h1>
            <p className="text-emerald-100 mb-4">{store.address}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {store.phone}
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {store.email}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {store.hours}
              </div>
            </div>
          </div>
          
          <div className="mt-4 lg:mt-0 text-center">
            <div className="text-2xl font-bold">{products.length}</div>
            <div className="text-emerald-200 text-sm">Products Available</div>
          </div>
        </div>
        
        {/* Store Services */}
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Available Services:</h3>
          <div className="flex flex-wrap gap-2">
            {store.services?.map((service) => (
              <span key={service} className="bg-emerald-400/30 px-3 py-1 rounded-full text-sm">
                {service}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products, brands, or features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowOnlyInStock(!showOnlyInStock)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                showOnlyInStock ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
            {uniqueTags.slice(0, 5).map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  if (selectedTags.includes(tag)) {
                    setSelectedTags(selectedTags.filter(t => t !== tag));
                  } else {
                    setSelectedTags([...selectedTags, tag]);
                  }
                }}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors capitalize ${
                  selectedTags.includes(tag) ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Mobile Filter Toggle */}
          <div className="flex items-center justify-between sm:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filters
              {showFilters ? <ChevronUp className="w-4 h-4 ml-2" /> : <ChevronDown className="w-4 h-4 ml-2" />}
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

            {/* Brand Filter */}
            <select
              value={selectedBrands.length === 1 ? selectedBrands[0] : 'all'}
              onChange={(e) => {
                if (e.target.value === 'all') {
                  setSelectedBrands([]);
                } else {
                  setSelectedBrands([e.target.value]);
                }
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-900 bg-white"
            >
              <option value="all">All Brands</option>
              {uniqueBrands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
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
              <option value="newest">Newest First</option>
              <option value="popularity">Most Popular</option>
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

            {/* Compare Button */}
            {compareProducts.length > 0 && (
              <button
                onClick={() => setShowComparison(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Compare className="w-4 h-4" />
                Compare ({compareProducts.length})
              </button>
            )}
          </div>

          {/* Advanced Filters Dropdown */}
          {(showFilters || window.innerWidth >= 640) && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range: KSh {priceRange[0].toLocaleString()} - KSh {priceRange[1].toLocaleString()}
                </label>
                <div className="flex items-center gap-4">
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
          )}
        </div>

        {/* Results Count and Active Filters */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </div>
          
          {/* Active Filters */}
          <div className="flex items-center gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                {tag}
                <button
                  onClick={() => setSelectedTags(selectedTags.filter(t => t !== tag))}
                  className="hover:text-blue-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selectedBrands.map((brand) => (
              <span
                key={brand}
                className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
              >
                {brand}
                <button
                  onClick={() => setSelectedBrands(selectedBrands.filter(b => b !== brand))}
                  className="hover:text-purple-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
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
          const isInCompare = compareProducts.find(p => p.id === product.id);
          const isWishlisted = isInWishlist(product.id);

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
                  {product.isEcoFriendly && (
                    <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                      ECO
                    </span>
                  )}
                </div>

                {/* Stock Status Badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-xs font-medium ${stockStatus.color}`}>
                  <StatusIcon className="w-3 h-3 inline mr-1" />
                  {stockStatus.text}
                </div>

                {/* Quick Actions */}
                <div className="absolute bottom-3 right-3 flex gap-2">
                  <button
                    onClick={() => handleToggleWishlist(product)}
                    className={`p-2 backdrop-blur-sm rounded-lg transition-colors ${
                      isWishlisted 
                        ? 'bg-red-500 text-white' 
                        : 'bg-white/90 hover:bg-white text-gray-600'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowProductDetails(true);
                    }}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => handleToggleCompare(product)}
                    className={`p-2 backdrop-blur-sm rounded-lg transition-colors ${
                      isInCompare 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white/90 hover:bg-white text-gray-600'
                    }`}
                    disabled={!isInCompare && compareProducts.length >= 3}
                  >
                    <Compare className="w-4 h-4" />
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
                  {product.isOnSale && product.originalPrice && (
                    <div className="text-xs text-green-600 font-medium">
                      Save KSh {(product.originalPrice - product.price).toLocaleString()} 
                      ({Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off)
                    </div>
                  )}
                </div>

                {/* Features */}
                {viewMode === 'list' && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {product.features.slice(0, 4).map((feature) => (
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

                {/* Additional Info */}
                <div className="mb-4 space-y-1 text-xs text-gray-600">
                  {product.deliveryTime && (
                    <div className="flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      Delivery: {product.deliveryTime}
                    </div>
                  )}
                  {product.warranty && (
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Warranty: {product.warranty}
                    </div>
                  )}
                  {product.installationAvailable && (
                    <div className="flex items-center gap-1">
                      <Settings className="w-3 h-3" />
                      Installation Available
                    </div>
                  )}
                </div>

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
          <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedBrands([]);
              setSelectedTags([]);
              setPriceRange([0, 200000]);
              setShowOnlyInStock(false);
              setShowOnlyOnSale(false);
            }}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Modals */}
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

      {showProductDetails && selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          onClose={() => {
            setShowProductDetails(false);
            setSelectedProduct(null);
          }}
        />
      )}

      {showComparison && compareProducts.length > 0 && (
        <ProductComparison
          products={compareProducts}
          onClose={() => setShowComparison(false)}
        />
      )}
    </div>
  );
}