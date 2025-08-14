'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import AuthenticationForm from '@/components/auth/AuthenticationForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import StoreInventory from '@/components/store/StoreInventory';
import { MapPin, Clock, Phone, Star, Navigation, Car, Users, Wifi, ArrowLeft, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  coordinates: { lat: number; lng: number };
  rating: number;
  reviewCount: number;
  totalProducts: number;
  categories: string[];
  services: string[];
  features: string[];
  currentCapacity: number;
  maxCapacity: number;
  parkingSpaces: number;
  availableParking: number;
  staffOnDuty: number;
  specialOffers: string[];
  manager: string;
  established: string;
  size: string;
}

interface StorePageProps {
  params: {
    storeId: string;
  };
}

export default function StorePage({ params }: StorePageProps) {
  const { user, isLoading } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock store data - in production, this would come from an API
  const mockStores: Record<string, Store> = {
    'garden-city': {
      id: 'garden-city',
      name: 'Panda Mart Garden City',
      address: 'Thika Road, Garden City Mall, Level 2, Nairobi',
      phone: '020 231 1166',
      email: 'gardencity@pandamart.co.ke',
      hours: 'Mon-Thu: 8:00 AM - 10:00 PM, Fri-Sat: 8:00 AM - 11:00 PM, Sun: 9:00 AM - 9:00 PM',
      coordinates: { lat: -1.2197, lng: 36.8965 },
      rating: 4.8,
      reviewCount: 1247,
      totalProducts: 15420,
      categories: ['Electronics', 'Fashion', 'Home & Garden', 'Health & Beauty', 'Sports & Outdoors', 'Food & Beverages'],
      services: ['Personal Shopping', 'Home Delivery', 'Installation Service', 'Product Consultation', 'Gift Wrapping', 'Returns & Exchanges'],
      features: ['Free WiFi', 'Parking', 'Pharmacy', 'Electronics', 'Fresh Produce', 'Bakery', 'Customer Lounge', 'Kids Play Area'],
      currentCapacity: 180,
      maxCapacity: 250,
      parkingSpaces: 500,
      availableParking: 127,
      staffOnDuty: 24,
      specialOffers: ['20% off Electronics', 'Buy 2 Get 1 Free Snacks', 'Free Installation on Appliances'],
      manager: 'Sarah Wanjiku',
      established: '2019',
      size: '25,000 sq ft'
    },
    'galleria': {
      id: 'galleria',
      name: 'Panda Mart Galleria',
      address: 'Langata Road, Galleria Shopping Mall, Ground Floor, Nairobi',
      phone: '077 866 6666',
      email: 'galleria@pandamart.co.ke',
      hours: 'Mon-Thu: 9:00 AM - 9:00 PM, Fri-Sat: 9:00 AM - 10:00 PM, Sun: 10:00 AM - 8:00 PM',
      coordinates: { lat: -1.3167, lng: 36.7833 },
      rating: 4.6,
      reviewCount: 892,
      totalProducts: 12800,
      categories: ['Fashion', 'Home & Garden', 'Health & Beauty', 'Sports & Outdoors', 'Food & Beverages', 'Books & Media'],
      services: ['Personal Shopping', 'Home Delivery', 'Gift Wrapping', 'Returns & Exchanges', 'Style Consultation'],
      features: ['Free WiFi', 'Parking', 'Home & Garden Center', 'Fashion Boutique', 'Food Court Access', 'Customer Service Desk'],
      currentCapacity: 95,
      maxCapacity: 180,
      parkingSpaces: 300,
      availableParking: 45,
      staffOnDuty: 18,
      specialOffers: ['15% off Home Decor', 'Flash Sale: Fashion Items', 'Garden Center Grand Opening'],
      manager: 'James Mwangi',
      established: '2020',
      size: '18,000 sq ft'
    },
    'westgate': {
      id: 'westgate',
      name: 'Panda Mart Westgate',
      address: 'Westlands, Westgate Shopping Mall, Level 1, Nairobi',
      phone: '020 445 7890',
      email: 'westgate@pandamart.co.ke',
      hours: 'Mon-Thu: 8:30 AM - 9:30 PM, Fri-Sat: 8:30 AM - 10:30 PM, Sun: 9:30 AM - 8:30 PM',
      coordinates: { lat: -1.2667, lng: 36.8000 },
      rating: 4.7,
      reviewCount: 1056,
      totalProducts: 18900,
      categories: ['Electronics', 'Fashion', 'Home & Garden', 'Health & Beauty', 'Sports & Outdoors', 'Food & Beverages', 'Automotive'],
      services: ['Personal Shopping', 'Home Delivery', 'Installation Service', 'Product Consultation', 'Gift Wrapping', 'Returns & Exchanges', 'Tech Support'],
      features: ['Free WiFi', 'Parking', 'Premium Electronics Section', 'Tech Zone', 'Beauty Corner', 'Express Checkout', 'VIP Lounge'],
      currentCapacity: 220,
      maxCapacity: 300,
      parkingSpaces: 800,
      availableParking: 234,
      staffOnDuty: 32,
      specialOffers: ['Premium Brand Showcase', '30% off Beauty Products', 'Tech Zone Launch Event'],
      manager: 'Grace Njeri',
      established: '2018',
      size: '32,000 sq ft'
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const storeData = mockStores[params.storeId];
      if (storeData) {
        setStore(storeData);
      } else {
        setError('Store not found');
      }
      setLoading(false);
    }, 1000);
  }, [params.storeId]);

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage < 50) return 'text-green-600 bg-green-100';
    if (percentage < 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCapacityText = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage < 50) return 'Low Traffic - Great time to visit!';
    if (percentage < 80) return 'Moderate Traffic - Normal wait times';
    return 'Busy - Consider visiting later';
  };

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

  if (error || !store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Store Not Found</h1>
          <p className="text-gray-600 mb-6">The store you're looking for doesn't exist or has been moved.</p>
          <Link
            href="/shop-in-store"
            className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Back to Store Locator
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Navigation */}
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/shop-in-store"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Store Locator
            </Link>
            
            <div className="flex items-center gap-2 ml-auto">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Store Info */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Info */}
            <div className="lg:col-span-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">{store.name}</h1>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Address</div>
                      <div className="text-gray-600">{store.address}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Phone</div>
                      <div className="text-gray-600">{store.phone}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Hours</div>
                      <div className="text-gray-600">{store.hours}</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-medium">{store.rating}</span>
                    <span className="text-gray-600">({store.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <div><strong>Manager:</strong> {store.manager}</div>
                    <div><strong>Established:</strong> {store.established}</div>
                    <div><strong>Store Size:</strong> {store.size}</div>
                  </div>
                </div>
              </div>

              {/* Store Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">{store.totalProducts.toLocaleString()}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Products</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">{store.categories.length}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Categories</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">{store.staffOnDuty}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Staff Available</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-2xl font-bold text-gray-900">{store.services.length}</div>
                  <div className="text-xs sm:text-sm text-gray-600">Services</div>
                </div>
              </div>
            </div>

            {/* Status Panel */}
            <div className="space-y-6">
              {/* Current Status */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Current Status</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Store Traffic</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCapacityColor(store.currentCapacity, store.maxCapacity)}`}>
                        {Math.round((store.currentCapacity / store.maxCapacity) * 100)}% Full
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {getCapacityText(store.currentCapacity, store.maxCapacity)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Parking</span>
                      <span className="text-sm font-medium text-gray-900">
                        {store.availableParking} / {store.parkingSpaces}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full"
                        style={{ width: `${(store.availableParking / store.parkingSpaces) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors text-sm sm:text-base">
                    <Navigation className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Get Directions</span>
                  </button>
                  
                  <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Call Store</span>
                  </button>
                  
                  <button className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm sm:text-base">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Schedule Visit</span>
                  </button>
                  
                  <button className="w-full flex items-center justify-center gap-2 border border-emerald-300 text-emerald-700 py-2 px-4 rounded-lg hover:bg-emerald-50 transition-colors text-sm sm:text-base">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">Find Nearest Store</span>
                  </button>
                </div>
              </div>

              {/* Special Offers */}
              {store.specialOffers.length > 0 && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200 p-6">
                  <h3 className="font-semibold text-emerald-900 mb-4">Current Offers</h3>
                  <div className="space-y-2">
                    {store.specialOffers.map((offer, index) => (
                      <div key={index} className="text-sm text-emerald-800 bg-emerald-100 px-3 py-2 rounded-lg">
                        {offer}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Services and Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Available Services</h3>
              <div className="grid grid-cols-2 gap-2">
                {store.services.map((service) => (
                  <div key={service} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    {service}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Store Features</h3>
              <div className="grid grid-cols-2 gap-2">
                {store.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Store Inventory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StoreInventory store={store} />
      </div>
    </div>
  );
}