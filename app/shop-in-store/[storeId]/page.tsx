'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import AuthenticationForm from '@/components/auth/AuthenticationForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import StoreInventory from '@/components/store/StoreInventory';
import StoreHeader from '@/components/store/StoreHeader';
import { ArrowLeft, MapPin, Clock, Phone, Star, Users, Car, Wifi, ShoppingBag, Calendar, Eye, Share2, Heart } from 'lucide-react';
import Link from 'next/link';

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  coordinates: { lat: number; lng: number };
  hours: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  rating: number;
  reviewCount: number;
  features: string[];
  currentCapacity: number;
  maxCapacity: number;
  parkingSpaces: number;
  availableParking: number;
  staffOnDuty: number;
  specialOffers: string[];
  description: string;
  manager: string;
  totalProducts: number;
  categories: string[];
  images: string[];
}

export default function StorePage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'inventory' | 'info' | 'reviews'>('inventory');

  const storeId = params.storeId as string;

  // Mock store data - in production, this would come from an API
  const mockStoreData: Record<string, Store> = {
    'garden-city': {
      id: 'garden-city',
      name: 'Panda Mart Garden City',
      address: 'Thika Road, Garden City Mall, Nairobi',
      phone: '020 231 1166',
      coordinates: { lat: -1.2197, lng: 36.8965 },
      hours: {
        monday: '8:00 AM - 10:00 PM',
        tuesday: '8:00 AM - 10:00 PM',
        wednesday: '8:00 AM - 10:00 PM',
        thursday: '8:00 AM - 10:00 PM',
        friday: '8:00 AM - 11:00 PM',
        saturday: '8:00 AM - 11:00 PM',
        sunday: '9:00 AM - 9:00 PM'
      },
      rating: 4.8,
      reviewCount: 1247,
      features: ['Free WiFi', 'Parking', 'Pharmacy', 'Electronics', 'Fresh Produce', 'Bakery', 'ATM', 'Customer Service'],
      currentCapacity: 180,
      maxCapacity: 250,
      parkingSpaces: 500,
      availableParking: 127,
      staffOnDuty: 24,
      specialOffers: ['20% off Electronics', 'Buy 2 Get 1 Free Snacks', 'Flash Sale: Home Appliances'],
      description: 'Our flagship store at Garden City Mall offers the complete Panda Mart experience with over 50,000 products across all categories. From the latest electronics to fresh produce, fashion, and home essentials - everything you need under one roof.',
      manager: 'Sarah Wanjiku',
      totalProducts: 52847,
      categories: ['Electronics', 'Fashion', 'Home & Garden', 'Health & Beauty', 'Sports & Outdoors', 'Toys & Games', 'Books & Media', 'Food & Beverages'],
      images: ['/store-garden-city-1.jpg', '/store-garden-city-2.jpg', '/store-garden-city-3.jpg']
    },
    'galleria': {
      id: 'galleria',
      name: 'Panda Mart Galleria',
      address: 'Langata Road, Galleria Shopping Mall, Nairobi',
      phone: '077 866 6666',
      coordinates: { lat: -1.3167, lng: 36.7833 },
      hours: {
        monday: '9:00 AM - 9:00 PM',
        tuesday: '9:00 AM - 9:00 PM',
        wednesday: '9:00 AM - 9:00 PM',
        thursday: '9:00 AM - 9:00 PM',
        friday: '9:00 AM - 10:00 PM',
        saturday: '9:00 AM - 10:00 PM',
        sunday: '10:00 AM - 8:00 PM'
      },
      rating: 4.6,
      reviewCount: 892,
      features: ['Free WiFi', 'Parking', 'Home & Garden', 'Fashion', 'Food Court', 'Customer Service'],
      currentCapacity: 95,
      maxCapacity: 180,
      parkingSpaces: 300,
      availableParking: 45,
      staffOnDuty: 18,
      specialOffers: ['15% off Home Decor', 'Flash Sale: Fashion Items', 'Weekend Special: Garden Tools'],
      description: 'Located in the heart of Langata, our Galleria store specializes in home and lifestyle products. Perfect for families looking to beautify their homes and upgrade their living spaces.',
      manager: 'James Mwangi',
      totalProducts: 38920,
      categories: ['Home & Garden', 'Fashion', 'Health & Beauty', 'Electronics', 'Sports & Outdoors', 'Food & Beverages'],
      images: ['/store-galleria-1.jpg', '/store-galleria-2.jpg']
    },
    'westgate': {
      id: 'westgate',
      name: 'Panda Mart Westgate',
      address: 'Westlands, Westgate Shopping Mall, Nairobi',
      phone: '020 445 7890',
      coordinates: { lat: -1.2667, lng: 36.8000 },
      hours: {
        monday: '8:30 AM - 9:30 PM',
        tuesday: '8:30 AM - 9:30 PM',
        wednesday: '8:30 AM - 9:30 PM',
        thursday: '8:30 AM - 9:30 PM',
        friday: '8:30 AM - 10:30 PM',
        saturday: '8:30 AM - 10:30 PM',
        sunday: '9:30 AM - 8:30 PM'
      },
      rating: 4.7,
      reviewCount: 1056,
      features: ['Free WiFi', 'Parking', 'Premium Brands', 'Tech Zone', 'Beauty Corner', 'VIP Shopping', 'Personal Shopper'],
      currentCapacity: 220,
      maxCapacity: 300,
      parkingSpaces: 800,
      availableParking: 234,
      staffOnDuty: 32,
      specialOffers: ['Premium Brand Showcase', '30% off Beauty Products', 'Tech Zone Grand Opening'],
      description: 'Our premium Westgate location caters to discerning customers with an extensive selection of high-end brands and exclusive products. Experience luxury shopping with personalized service.',
      manager: 'Grace Akinyi',
      totalProducts: 45632,
      categories: ['Premium Electronics', 'Luxury Fashion', 'Beauty & Cosmetics', 'Home Decor', 'Sports & Fitness', 'Books & Media'],
      images: ['/store-westgate-1.jpg', '/store-westgate-2.jpg', '/store-westgate-3.jpg']
    }
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const storeData = mockStoreData[storeId];
      if (storeData) {
        setStore(storeData);
      }
      setLoading(false);
    }, 1000);
  }, [storeId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return <AuthenticationForm />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Store Not Found</h1>
          <p className="text-gray-600 mb-6">The store you're looking for doesn't exist.</p>
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

  const getCurrentDayHours = () => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    return store.hours[today as keyof typeof store.hours];
  };

  const isStoreOpen = () => {
    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const todayHours = getCurrentDayHours();
    
    if (todayHours === 'Closed') return false;
    
    const [openTime, closeTime] = todayHours.split(' - ');
    const openHour = parseInt(openTime.split(':')[0]) + (openTime.includes('PM') && !openTime.includes('12') ? 12 : 0);
    const openMinute = parseInt(openTime.split(':')[1]);
    const closeHour = parseInt(closeTime.split(':')[0]) + (closeTime.includes('PM') && !closeTime.includes('12') ? 12 : 0);
    const closeMinute = parseInt(closeTime.split(':')[1]);
    
    const openTimeNum = openHour * 100 + openMinute;
    const closeTimeNum = closeHour * 100 + closeMinute;
    
    return currentTime >= openTimeNum && currentTime <= closeTimeNum;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link
                href="/shop-in-store"
                className="flex items-center text-gray-600 hover:text-emerald-600 transition-colors mr-6"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Stores
              </Link>
              <h1 className="text-xl font-bold text-gray-900">{store.name}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                <Heart className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Store Header */}
      <StoreHeader store={store} isOpen={isStoreOpen()} currentDayHours={getCurrentDayHours()} />

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'inventory'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <ShoppingBag className="w-4 h-4 inline mr-2" />
              Store Inventory ({store.totalProducts.toLocaleString()})
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'info'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Store Information
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reviews'
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Star className="w-4 h-4 inline mr-2" />
              Reviews ({store.reviewCount})
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'inventory' && <StoreInventory store={store} />}
        {activeTab === 'info' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Store Information</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Store</h3>
                  <p className="text-gray-600 leading-relaxed">{store.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Store Manager</h3>
                  <p className="text-gray-600">{store.manager}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Categories Available</h3>
                  <div className="flex flex-wrap gap-2">
                    {store.categories.map((category) => (
                      <span
                        key={category}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Store Hours</h3>
                  <div className="space-y-2 text-sm">
                    {Object.entries(store.hours).map(([day, hours]) => (
                      <div key={day} className="flex justify-between">
                        <span className="capitalize text-gray-600">{day}</span>
                        <span className="text-gray-900">{hours}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Store Features</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {store.features.map((feature) => (
                      <div key={feature} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Reviews feature coming soon!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}