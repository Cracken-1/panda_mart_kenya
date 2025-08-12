'use client';

import { MapPin, Clock, Phone, Star, Users, Car, Wifi, Navigation, Calendar, AlertCircle } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  rating: number;
  reviewCount: number;
  currentCapacity: number;
  maxCapacity: number;
  parkingSpaces: number;
  availableParking: number;
  staffOnDuty: number;
  specialOffers: string[];
  description: string;
}

interface StoreHeaderProps {
  store: Store;
  isOpen: boolean;
  currentDayHours: string;
}

export default function StoreHeader({ store, isOpen, currentDayHours }: StoreHeaderProps) {
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
    return 'Busy - Expect longer wait times';
  };

  const getParkingStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50) return { color: 'text-green-600', text: 'Plenty of parking' };
    if (percentage > 20) return { color: 'text-yellow-600', text: 'Limited parking' };
    return { color: 'text-red-600', text: 'Very limited parking' };
  };

  const parkingStatus = getParkingStatus(store.availableParking, store.parkingSpaces);

  return (
    <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Store Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
                <div className="flex items-center text-emerald-100 mb-2">
                  <MapPin className="w-5 h-5 mr-2" />
                  {store.address}
                </div>
                <div className="flex items-center text-emerald-100">
                  <Phone className="w-5 h-5 mr-2" />
                  {store.phone}
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center mb-2">
                  <Star className="w-5 h-5 text-yellow-300 fill-current mr-1" />
                  <span className="text-xl font-bold">{store.rating}</span>
                  <span className="text-emerald-200 ml-1">({store.reviewCount} reviews)</span>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isOpen ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  <Clock className="w-4 h-4 mr-1" />
                  {isOpen ? 'Open Now' : 'Closed'}
                </div>
              </div>
            </div>

            {/* Store Hours */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-medium">Today's Hours</span>
                </div>
                <span className="text-emerald-100">{currentDayHours}</span>
              </div>
            </div>

            {/* Special Offers */}
            {store.specialOffers.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold text-emerald-100">Current Offers</h3>
                {store.specialOffers.map((offer, index) => (
                  <div key={index} className="bg-yellow-400 text-yellow-900 px-3 py-2 rounded-lg text-sm font-medium">
                    🎉 {offer}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Status */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Live Store Status</h3>
            
            {/* Store Capacity */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="font-medium">Store Traffic</span>
                </div>
                <span className="text-sm">{store.currentCapacity}/{store.maxCapacity}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${(store.currentCapacity / store.maxCapacity) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-emerald-100">
                {getCapacityText(store.currentCapacity, store.maxCapacity)}
              </p>
            </div>

            {/* Parking */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Car className="w-5 h-5 mr-2" />
                  <span className="font-medium">Parking</span>
                </div>
                <span className="text-sm">{store.availableParking}/{store.parkingSpaces}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mb-2">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-300"
                  style={{ width: `${(store.availableParking / store.parkingSpaces) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-emerald-100">{parkingStatus.text}</p>
            </div>

            {/* Staff */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  <span className="font-medium">Staff Available</span>
                </div>
                <span className="text-emerald-100">{store.staffOnDuty} on duty</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <button className="w-full bg-white text-emerald-600 py-3 px-4 rounded-xl font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center">
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </button>
              <button className="w-full border-2 border-white/30 text-white py-3 px-4 rounded-xl font-semibold hover:bg-white/10 transition-colors flex items-center justify-center">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Visit
              </button>
            </div>
          </div>
        </div>

        {/* Alert for busy times */}
        {(store.currentCapacity / store.maxCapacity) > 0.8 && (
          <div className="mt-6 bg-yellow-400 text-yellow-900 px-4 py-3 rounded-xl flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span className="font-medium">
              Store is currently busy. Consider visiting during off-peak hours or use our reservation system.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}