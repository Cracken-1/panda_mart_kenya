'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  X,
  Clock,
  TrendingUp,
  Package,
  Store,
  User,
  Tag,
  ArrowRight,
  Filter,
  MapPin,
  Star,
  ShoppingBag
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'product' | 'store' | 'category' | 'brand' | 'user';
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  url: string;
  metadata?: Record<string, any>;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState<string[]>([
    'iPhone 15 Pro',
    'Samsung TV',
    'Nike Air Max',
    'MacBook Air',
    'Sony Headphones',
    'Instant Pot',
    'Dyson Vacuum'
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'product',
      title: 'iPhone 15 Pro 128GB',
      subtitle: 'Apple',
      description: 'Latest iPhone with titanium design and A17 Pro chip',
      url: '/products/iphone-15-pro',
      metadata: { price: 145000, rating: 4.8, inStock: true }
    },
    {
      id: '2',
      type: 'product',
      title: 'Samsung Galaxy S24 Ultra',
      subtitle: 'Samsung',
      description: 'Premium Android flagship with S Pen',
      url: '/products/samsung-galaxy-s24',
      metadata: { price: 135000, rating: 4.7, inStock: true }
    },
    {
      id: '3',
      type: 'store',
      title: 'Garden City Mall',
      subtitle: 'Thika Road, Nairobi',
      description: '15,420 products available',
      url: '/shop-in-store/garden-city',
      metadata: { distance: '2.3 km', rating: 4.8, status: 'Open' }
    },
    {
      id: '4',
      type: 'category',
      title: 'Electronics',
      subtitle: 'Smartphones, Laptops, TVs & More',
      description: '2,450+ products in this category',
      url: '/categories/electronics',
      metadata: { productCount: 2450 }
    },
    {
      id: '5',
      type: 'brand',
      title: 'Apple',
      subtitle: 'Premium Technology Brand',
      description: 'iPhones, MacBooks, iPads & Accessories',
      url: '/brands/apple',
      metadata: { productCount: 156 }
    }
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      setLoading(true);
      // Simulate API search delay
      const timer = setTimeout(() => {
        const filtered = mockResults.filter(result =>
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.subtitle?.toLowerCase().includes(query.toLowerCase()) ||
          result.description?.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      // Add to recent searches
      const newRecentSearches = [
        searchQuery,
        ...recentSearches.filter(s => s !== searchQuery)
      ].slice(0, 5);
      
      setRecentSearches(newRecentSearches);
      localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
      
      // Navigate to search results
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      onClose();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    handleSearch(result.title);
    router.push(result.url);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        handleResultClick(results[selectedIndex]);
      } else {
        handleSearch(query);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'product': return Package;
      case 'store': return Store;
      case 'category': return Tag;
      case 'brand': return Star;
      case 'user': return User;
      default: return Search;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-20">
      <div className="bg-white rounded-2xl max-w-2xl w-full mx-4 max-h-[70vh] overflow-hidden shadow-2xl">
        {/* Search Input */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products, stores, categories..."
              className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Content */}
        <div className="overflow-y-auto max-h-96">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : query.length > 0 ? (
            // Search Results
            <div className="p-4">
              {results.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Search Results ({results.length})
                  </h3>
                  {results.map((result, index) => {
                    const IconComponent = getResultIcon(result.type);
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleResultClick(result)}
                        className={`w-full flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left ${
                          selectedIndex === index ? 'bg-blue-50 border border-blue-200' : ''
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          result.type === 'product' ? 'bg-blue-100' :
                          result.type === 'store' ? 'bg-green-100' :
                          result.type === 'category' ? 'bg-purple-100' :
                          result.type === 'brand' ? 'bg-yellow-100' :
                          'bg-gray-100'
                        }`}>
                          <IconComponent className={`w-5 h-5 ${
                            result.type === 'product' ? 'text-blue-600' :
                            result.type === 'store' ? 'text-green-600' :
                            result.type === 'category' ? 'text-purple-600' :
                            result.type === 'brand' ? 'text-yellow-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">
                            {result.title}
                          </h4>
                          {result.subtitle && (
                            <p className="text-sm text-gray-600 truncate">
                              {result.subtitle}
                            </p>
                          )}
                          {result.description && (
                            <p className="text-xs text-gray-500 truncate mt-1">
                              {result.description}
                            </p>
                          )}
                          
                          {/* Metadata */}
                          {result.metadata && (
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                              {result.metadata.price && (
                                <span className="font-medium text-gray-900">
                                  KSh {result.metadata.price.toLocaleString()}
                                </span>
                              )}
                              {result.metadata.rating && (
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                  <span>{result.metadata.rating}</span>
                                </div>
                              )}
                              {result.metadata.distance && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span>{result.metadata.distance}</span>
                                </div>
                              )}
                              {result.metadata.productCount && (
                                <span>{result.metadata.productCount} products</span>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">Try searching for something else</p>
                </div>
              )}
            </div>
          ) : (
            // Default State - Recent & Trending
            <div className="p-4 space-y-6">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Recent Searches
                    </h3>
                    <button
                      onClick={clearRecentSearches}
                      className="text-xs text-gray-500 hover:text-gray-700"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuery(search);
                          handleSearch(search);
                        }}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{search}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Searches */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending Searches
                </h3>
                <div className="space-y-1">
                  {trendingSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setQuery(search);
                        handleSearch(search);
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                    >
                      <TrendingUp className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-700">{search}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Categories */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Electronics', icon: Package, url: '/categories/electronics' },
                    { name: 'Fashion', icon: ShoppingBag, url: '/categories/fashion' },
                    { name: 'Home & Garden', icon: Store, url: '/categories/home-garden' },
                    { name: 'Health & Beauty', icon: Star, url: '/categories/health-beauty' }
                  ].map((category) => (
                    <button
                      key={category.name}
                      onClick={() => {
                        router.push(category.url);
                        onClose();
                      }}
                      className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <category.icon className="w-4 h-4 text-gray-600" />
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>Press ↵ to search</span>
              <span>↑↓ to navigate</span>
              <span>ESC to close</span>
            </div>
            <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
              <Filter className="w-3 h-3" />
              Advanced Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}