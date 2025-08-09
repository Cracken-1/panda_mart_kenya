'use client';

import { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Star, Navigation, Car, Users, Wifi, ShoppingBag, Calendar, Eye } from 'lucide-react';
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
  distance?: number;
  estimatedTravelTime?: string;
}

interface StoreLocatorProps {
  userLocation: { lat: number; lng: number } | null;
  locationPermission: 'pending' | 'granted' | 'denied';
}

export default function StoreLocator({ userLocation, locationPermission }: StoreLocatorProps) {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'capacity'>('distance');

  // Mock store data - in production, this would come from an API
  const mockStores: Store[] = [
    {
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
      features: ['Free WiFi', 'Parking', 'Pharmacy', 'Electronics', 'Fresh Produce', 'Bakery'],
      currentCapacity: 180,
      maxCapacity: 250,
      parkingSpaces: 500,
      availableParking: 127,
      staffOnDuty: 24,
      specialOffers: ['20% off Electronics', 'Buy 2 Get 1 Free Snacks']
    },
    {
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
      features: ['Free WiFi', 'Parking', 'Home & Garden', 'Fashion', 'Food Court'],
      currentCapacity: 95,
      maxCapacity: 180,
      parkingSpaces: 300,
      availableParking: 45,
      staffOnDuty: 18,
      specialOffers: ['15% off Home Decor', 'Flash Sale: Fashion Items']
    },
    {
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
      features: ['Free WiFi', 'Parking', 'Premium Brands', 'Tech Zone', 'Beauty Corner'],
      currentCapacity: 220,
      maxCapacity: 300,
      parkingSpaces: 800,
      availableParking: 234,
      staffOnDuty: 32,
      specialOffers: ['Premium Brand Showcase', '30% off Beauty Products']
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      let processedStores = [...mockStores];
      
      if (userLocation) {
        processedStores = processedStores.map(store => ({
          ...store,
          distance: calculateDistance(userLocation, store.coordinates),
          estimatedTravelTime: calculateTravelTime(userLocation, store.coordinates)
        }));
      }

      // Sort stores
      processedStores.sort((a, b) => {
        switch (sortBy) {
          case 'distance':
            return (a.distance || 0) - (b.distance || 0);
          case 'rating':
            return b.rating - a.rating;
          case 'capacity':
            return (a.currentCapacity / a.maxCapacity) - (b.currentCapacity / b.maxCapacity);
          default:
            return 0;
        }
      });

      setStores(processedStores);
      setLoading(false);
    }, 1000);
  }, [userLocation, sortBy]);

  const calculateDistance = (from: { lat: number; lng: number }, to: { lat: number; lng: number }) => {
    const R = 6371; // Earth's radius in km
    const dLat = (to.lat - from.lat) * Math.PI / 180;
    const dLng = (to.lng - from.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateTravelTime = (from: { lat: number; lng: number }, to: { lat: number; lng: number }) => {
    const distance = calculateDistance(from, to);
    const timeInMinutes = Math.round(distance * 2.5); // Rough estimate for Nairobi traffic
    return `${timeInMinutes} min`;
  };

  const getCapacityColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage < 50) return 'text-green-600 bg-green-100';
    if (percentage < 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getCapacityText = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage < 50) return 'Low Traffic';
    if (percentage < 80) return 'Moderate Traffic';
    return 'Busy';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {userLocation ? 'Stores Near You' : 'All Store Locations'}
        </h2>
        
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="distance">Distance</option>
            <option value="rating">Rating</option>
            <option value="capacity">Availability</option>
          </select>
        </div>
      </div>

      {/* Store Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
          >
            {/* Store Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{store.name}</h3>
                  <div className="flex items-center text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {store.address}
                  </div>
                </div>
                {store.distance && (
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-600">{store.distance.toFixed(1)} km</div>
                    <div className="text-xs text-gray-500">{store.estimatedTravelTime}</div>
                  </div>
                )}
              </div>

              {/* Rating and Contact */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">{store.rating}</span>
                  <span className="ml-1 text-xs text-gray-500">({store.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-1" />
                  {store.phone}
                </div>
              </div>
            </div>

            {/* Store Status */}
            <div className="p-6 space-y-4">
              {/* Capacity */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">Store Traffic</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCapacityColor(store.currentCapacity, store.maxCapacity)}`}>
                  {getCapacityText(store.currentCapacity, store.maxCapacity)}
                </span>
              </div>

              {/* Parking */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Car className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">Parking</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {store.availableParking} / {store.parkingSpaces} available
                </span>
              </div>

              {/* Staff */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-700">Staff on Duty</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{store.staffOnDuty} available</span>
              </div>

              {/* Features */}
              <div>
                <div className="text-sm text-gray-700 mb-2">Features</div>
                <div className="flex flex-wrap gap-1">
                  {store.features.slice(0, 4).map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
                    >
                      {feature}
                    </span>
                  ))}
                  {store.features.length > 4 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                      +{store.features.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Special Offers */}
              {store.specialOffers.length > 0 && (
                <div>
                  <div className="text-sm text-gray-700 mb-2">Current Offers</div>
                  <div className="space-y-1">
                    {store.specialOffers.map((offer, index) => (
                      <div key={index} className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                        {offer}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 pt-0 space-y-3">
              <Link
                href={`/shop-in-store/${store.id}`}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl text-center block"
              >
                <ShoppingBag className="w-4 h-4 inline mr-2" />
                Browse Store Inventory
              </Link>
              
              <div className="grid grid-cols-2 gap-2">
                <button className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Navigation className="w-4 h-4 mr-1" />
                  Directions
                </button>
                <button className="flex items-center justify-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Schedule Visit
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Location Permission Message */}
      {locationPermission === 'denied' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <MapPin className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            Location Access Denied
          </h3>
          <p className="text-yellow-700 mb-4">
            Enable location access in your browser settings to see distances and get personalized store recommendations.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-500 text-white px-6 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}