'use client';

import { useState } from 'react';
import { MapPin, Store, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';

interface ShopInStoreButtonProps {
  productId?: string;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  showStoreCount?: boolean;
}

export default function ShopInStoreButton({ 
  productId, 
  className = '', 
  variant = 'primary',
  size = 'md',
  showStoreCount = true
}: ShopInStoreButtonProps) {
  const { user } = useAuth();
  const [showTooltip, setShowTooltip] = useState(false);

  // Mock data - in production, this would come from an API
  const availableStores = 3;
  const nearestStore = 'Garden City Mall';
  const estimatedTime = '15 min';

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl';
    
    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-6 py-4 text-base'
    };

    const variantClasses = {
      primary: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-xl',
      secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300',
      outline: 'border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50'
    };

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
  };

  const handleClick = () => {
    if (!user) {
      // Redirect to login with return URL
      window.location.href = '/account?redirect=/shop-in-store';
      return;
    }
  };

  return (
    <div className="relative">
      <Link
        href={user ? '/shop-in-store' : '/account?redirect=/shop-in-store'}
        className={getButtonClasses()}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={handleClick}
      >
        <Store className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} mr-2`} />
        <span>Shop in Store</span>
        {showStoreCount && (
          <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
            {availableStores} stores
          </span>
        )}
      </Link>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-3 h-3" />
              <span>Nearest: {nearestStore}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3 h-3" />
              <span>{estimatedTime} away</span>
            </div>
            {!user && (
              <div className="mt-1 pt-1 border-t border-gray-700 text-yellow-300">
                Sign in required
              </div>
            )}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}
    </div>
  );
}