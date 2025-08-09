'use client';

import { useState, useEffect } from 'react';
import { AccountLayout } from './AccountLayout';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  HeartIcon, 
  ShoppingCartIcon, 
  TrashIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

interface WishlistItem {
  id: string;
  product_id: string;
  product: {
    name: string;
    price: number;
    image_url: string;
    rating: number;
    reviews_count: number;
    in_stock: boolean;
  };
  created_at: string;
}

export function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    setRemovingItems(prev => new Set(prev).add(itemId));
    
    try {
      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      }
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const addToCart = async (productId: string) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: productId,
          quantity: 1,
        }),
      });
      
      if (response.ok) {
        // Show success message or update UI
        console.log('Added to cart successfully');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  if (loading) {
    return (
      <AccountLayout title="My Wishlist" description="Items you want to buy later">
        <div className="flex justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      </AccountLayout>
    );
  }

  return (
    <AccountLayout 
      title="My Wishlist" 
      description={`${wishlistItems.length} item${wishlistItems.length !== 1 ? 's' : ''} saved for later`}
    >
      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={item.product.image_url || '/placeholder-product.jpg'}
                  alt={item.product.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  disabled={removingItems.has(item.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 disabled:opacity-50"
                >
                  {removingItems.has(item.id) ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <HeartSolidIcon className="h-5 w-5 text-red-500" />
                  )}
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                  {item.product.name}
                </h3>
                
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(item.product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    ({item.product.reviews_count})
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-gray-900">
                    ${item.product.price.toFixed(2)}
                  </span>
                  <span className={`text-sm ${
                    item.product.in_stock ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.product.in_stock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => addToCart(item.product_id)}
                    disabled={!item.product.in_stock}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    <ShoppingCartIcon className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    disabled={removingItems.has(item.id)}
                    className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
                
                <p className="mt-2 text-xs text-gray-500">
                  Added {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-gray-500">
            Save items you love to buy them later.
          </p>
          <div className="mt-6">
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Start Shopping
            </a>
          </div>
        </div>
      )}
    </AccountLayout>
  );
}