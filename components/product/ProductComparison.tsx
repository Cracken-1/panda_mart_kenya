'use client';

import { useState } from 'react';
import {
  X,
  Star,
  Check,
  Minus,
  ShoppingCart,
  Heart,
  Share2,
  Package,
  Store,
  Zap,
  Award,
  TrendingUp
} from 'lucide-react';
import { Product } from '@/lib/types/product';

interface ProductComparisonProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveProduct: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export default function ProductComparison({
  products,
  isOpen,
  onClose,
  onRemoveProduct,
  onAddToCart
}: ProductComparisonProps) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || products.length === 0) return null;

  const comparisonCategories = [
    { id: 'overview', name: 'Overview', icon: Package },
    { id: 'specifications', name: 'Specifications', icon: Zap },
    { id: 'pricing', name: 'Pricing', icon: TrendingUp },
    { id: 'availability', name: 'Availability', icon: Store }
  ];

  const getSpecificationKeys = () => {
    const allKeys = new Set<string>();
    products.forEach(product => {
      Object.keys(product.specifications).forEach(key => allKeys.add(key));
    });
    return Array.from(allKeys).sort();
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">Name</td>
                {products.map(product => (
                  <td key={product.id} className="py-3 px-4 text-sm text-gray-900">
                    {product.name}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">Brand</td>
                {products.map(product => (
                  <td key={product.id} className="py-3 px-4 text-sm text-gray-900">
                    {product.brand}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">SKU</td>
                {products.map(product => (
                  <td key={product.id} className="py-3 px-4 text-sm text-gray-500">
                    {product.sku}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">Rating</td>
                {products.map(product => (
                  <td key={product.id} className="py-3 px-4">
                    <div className="flex items-center space-x-2">
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
                      <span className="text-sm text-gray-600">
                        {product.rating} ({product.reviewCount})
                      </span>
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">Features</td>
                {products.map(product => (
                  <td key={product.id} className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {product.isNew && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          New
                        </span>
                      )}
                      {product.isFeatured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                      {product.isOnSale && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          On Sale
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSpecificationsTab = () => {
    const specKeys = getSpecificationKeys();
    
    return (
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h4>
        <div className="overflow-x-auto">
          <table className="w-full">
            <tbody className="divide-y divide-gray-200">
              {specKeys.map(key => (
                <tr key={key}>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50 min-w-[150px]">
                    {key}
                  </td>
                  {products.map(product => (
                    <td key={product.id} className="py-3 px-4 text-sm text-gray-900">
                      {product.specifications[key] || (
                        <span className="text-gray-400 flex items-center">
                          <Minus className="w-4 h-4" />
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderPricingTab = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Pricing Comparison</h4>
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">Current Price</td>
              {products.map(product => (
                <td key={product.id} className="py-3 px-4">
                  <span className="text-lg font-bold text-gray-900">
                    KSh {product.price.toLocaleString()}
                  </span>
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">Original Price</td>
              {products.map(product => (
                <td key={product.id} className="py-3 px-4">
                  {product.originalPrice ? (
                    <span className="text-sm text-gray-500 line-through">
                      KSh {product.originalPrice.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-400 flex items-center">
                      <Minus className="w-4 h-4" />
                    </span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">Discount</td>
              {products.map(product => (
                <td key={product.id} className="py-3 px-4">
                  {product.discount ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {product.discount}% OFF
                    </span>
                  ) : (
                    <span className="text-gray-400 flex items-center">
                      <Minus className="w-4 h-4" />
                    </span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">Savings</td>
              {products.map(product => (
                <td key={product.id} className="py-3 px-4">
                  {product.originalPrice ? (
                    <span className="text-sm font-medium text-green-600">
                      Save KSh {(product.originalPrice - product.price).toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-gray-400 flex items-center">
                      <Minus className="w-4 h-4" />
                    </span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderAvailabilityTab = () => (
    <div className="space-y-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-4">Stock & Availability</h4>
      <div className="overflow-x-auto">
        <table className="w-full">
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">Stock Status</td>
              {products.map(product => (
                <td key={product.id} className="py-3 px-4">
                  <div className="flex items-center space-x-2">
                    {product.inStock ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600 font-medium">In Stock</span>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                      </>
                    )}
                  </div>
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">Quantity Available</td>
              {products.map(product => (
                <td key={product.id} className="py-3 px-4 text-sm text-gray-900">
                  {product.inStock ? `${product.stockCount} units` : 'N/A'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 text-sm font-medium text-gray-900 bg-gray-50">Store Availability</td>
              {products.map(product => (
                <td key={product.id} className="py-3 px-4">
                  <div className="text-sm text-gray-900">
                    {product.storeAvailability.filter(store => store.inStock).length} of{' '}
                    {product.storeAvailability.length} stores
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {product.storeAvailability
                      .filter(store => store.inStock)
                      .slice(0, 2)
                      .map(store => store.storeName)
                      .join(', ')}
                    {product.storeAvailability.filter(store => store.inStock).length > 2 && '...'}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'specifications':
        return renderSpecificationsTab();
      case 'pricing':
        return renderPricingTab();
      case 'availability':
        return renderAvailabilityTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Product Comparison</h2>
            <p className="text-gray-600 mt-1">Compare {products.length} products side by side</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-full max-h-[calc(90vh-80px)]">
          {/* Product Cards Header */}
          <div className="flex-1 overflow-hidden">
            {/* Product Images and Basic Info */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex space-x-6">
                <div className="w-32 flex-shrink-0"></div> {/* Spacer for labels */}
                {products.map(product => (
                  <div key={product.id} className="flex-1 min-w-0">
                    <div className="relative">
                      <button
                        onClick={() => onRemoveProduct(product.id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <Package className="w-16 h-16 text-gray-400" />
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      <div className="text-lg font-bold text-gray-900 mb-2">
                        KSh {product.price.toLocaleString()}
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onAddToCart(product)}
                          disabled={!product.inStock}
                          className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add to Cart</span>
                        </button>
                        
                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <Heart className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {comparisonCategories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveTab(category.id)}
                      className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === category.id
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{category.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-400px)]">
              {renderTabContent()}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Comparing {products.length} products
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close Comparison
              </button>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2">
                <Share2 className="w-4 h-4" />
                <span>Share Comparison</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}