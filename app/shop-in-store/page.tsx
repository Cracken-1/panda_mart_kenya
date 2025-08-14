'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import AuthenticationForm from '@/components/auth/AuthenticationForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import StoreLocator from '@/components/store/StoreLocator';
import { MapPin, Clock, Phone, Star, Users, Car, Wifi, CreditCard, X } from 'lucide-react';

export default function ShopInStorePage() {
  const { user, isLoading } = useAuth();
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    if (user && 'geolocation' in navigator) {
      checkLocationPermission();
    }
  }, [user]);

  const checkLocationPermission = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      if (permission.state === 'granted') {
        setLocationPermission('granted');
        getCurrentLocation();
      } else if (permission.state === 'denied') {
        setLocationPermission('denied');
      } else {
        setLocationPermission('pending');
      }
      
      // Listen for permission changes
      permission.onchange = () => {
        if (permission.state === 'granted') {
          setLocationPermission('granted');
          getCurrentLocation();
        } else if (permission.state === 'denied') {
          setLocationPermission('denied');
        }
      };
    } catch (error) {
      console.log('Permission API not supported, trying direct geolocation');
      // Fallback for browsers that don't support permissions API
      setLocationPermission('pending');
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      setLocationPermission('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationPermission('granted');
        console.log('Location obtained successfully');
      },
      (error) => {
        console.error('Error getting location:', error);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            setLocationPermission('denied');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationPermission('denied');
            break;
          case error.TIMEOUT:
            setLocationPermission('pending');
            break;
          default:
            setLocationPermission('denied');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  const requestLocationAccess = () => {
    setLocationPermission('pending');
    getCurrentLocation();
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
              Shop in Store
            </h1>
            <p className="text-lg sm:text-xl text-emerald-100 mb-8 max-w-3xl mx-auto px-4">
              Experience the best of both worlds - browse online, shop in person. 
              Find your nearest Panda Mart store and discover our full product range.
            </p>
            
            {/* Store Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-12">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">12</div>
                <div className="text-emerald-200 text-xs sm:text-sm">Store Locations</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">50K+</div>
                <div className="text-emerald-200 text-xs sm:text-sm">Products Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">98%</div>
                <div className="text-emerald-200 text-xs sm:text-sm">Stock Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">4.8★</div>
                <div className="text-emerald-200 text-xs sm:text-sm">Customer Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Permission Section */}
      {locationPermission === 'pending' && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <div className="text-center">
              <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-emerald-500 mx-auto mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                Find Your Nearest Store
              </h2>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto text-sm sm:text-base px-4">
                Allow location access to find the closest Panda Mart store and check real-time inventory. 
                We'll show you exactly what's available at each location.
              </p>
              <button
                onClick={requestLocationAccess}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
              >
                Enable Location Access
              </button>
              <p className="text-xs text-gray-500 mt-3 px-4">
                Your location data is only used to find nearby stores and is never stored.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Store Locator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <StoreLocator 
          userLocation={userLocation} 
          locationPermission={locationPermission}
        />
      </div>

      {/* Features Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Why Shop in Store?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm sm:text-base px-4">
              Get the full Panda Mart experience with personalized service, 
              instant gratification, and exclusive in-store benefits.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100">
              <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Real-Time Inventory</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                See exactly what's in stock at each store with live inventory updates every 5 minutes.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
              <Users className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Expert Assistance</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Get personalized recommendations from our knowledgeable staff and product experts.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
              <Star className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Exclusive Deals</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Access store-only promotions, flash sales, and member-exclusive discounts.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100">
              <Car className="w-10 h-10 sm:w-12 sm:h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Convenient Parking</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Free parking at all locations with real-time availability tracking.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <Wifi className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Free WiFi & Charging</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Stay connected while you shop with complimentary high-speed internet and device charging.
              </p>
            </div>

            <div className="text-center p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100">
              <CreditCard className="w-10 h-10 sm:w-12 sm:h-12 text-pink-600 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Flexible Payment</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Pay with cash, card, mobile money, or use your Panda Points for instant discounts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-slate-800 to-gray-900 text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Experience Panda Mart?
          </h2>
          <p className="text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg px-4">
            Visit any of our stores today and discover why thousands of customers 
            choose the in-store shopping experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto sm:max-w-none">
            <button 
              onClick={requestLocationAccess}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 sm:px-8 py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Find Nearest Store</span>
            </button>
            <button 
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center justify-center gap-2 border-2 border-gray-400 text-gray-300 hover:text-white hover:border-white px-6 sm:px-8 py-3 rounded-xl font-semibold transition-all duration-200 text-sm sm:text-base"
            >
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">Schedule a Visit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Visit Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Schedule Your Visit</h3>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Store</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option>Garden City Mall</option>
                  <option>Galleria Shopping Mall</option>
                  <option>Westgate Shopping Mall</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500">
                  <option>9:00 AM - 11:00 AM</option>
                  <option>11:00 AM - 1:00 PM</option>
                  <option>1:00 PM - 3:00 PM</option>
                  <option>3:00 PM - 5:00 PM</option>
                  <option>5:00 PM - 7:00 PM</option>
                  <option>7:00 PM - 9:00 PM</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Visit (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="e.g., Looking for electronics, need product consultation..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  // Here you would typically send the data to your backend
                  alert('Visit scheduled! We\'ll send you a confirmation email shortly.');
                }}
                className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Schedule Visit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}