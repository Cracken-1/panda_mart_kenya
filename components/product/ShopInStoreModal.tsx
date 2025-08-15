'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  MapPin,
  Phone,
  Clock,
  Navigation,
  Calendar,
  User,
  Package,
  CheckCircle,
  AlertCircle,
  Star,
  Truck,
  Store,
  Timer,
  Shield,
  CreditCard
} from 'lucide-react';
import { Product, StoreAvailability } from '@/lib/types/product';

interface ShopInStoreModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  selectedStoreId?: string;
}

interface ReservationData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  visitDate: string;
  visitTime: string;
  notes: string;
}

export default function ShopInStoreModal({ 
  product, 
  isOpen, 
  onClose, 
  selectedStoreId 
}: ShopInStoreModalProps) {
  const router = useRouter();
  const [selectedStore, setSelectedStore] = useState<StoreAvailability | null>(null);
  const [showReservation, setShowReservation] = useState(false);
  const [reservationData, setReservationData] = useState<ReservationData>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    visitDate: '',
    visitTime: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedStoreId) {
      const store = product.storeAvailability.find(s => s.storeId === selectedStoreId);
      if (store) {
        setSelectedStore(store);
      }
    } else if (product.storeAvailability.length > 0) {
      // Select first available store
      const availableStore = product.storeAvailability.find(s => s.inStock);
      setSelectedStore(availableStore || product.storeAvailability[0]);
    }
  }, [selectedStoreId, product.storeAvailability]);

  const handleReserveProduct = async () => {
    if (!selectedStore) return;
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would make an API call to reserve the product
      console.log('Reserving product:', {
        productId: product.id,
        storeId: selectedStore.storeId,
        ...reservationData
      });
      
      // Show success and redirect to shop-in-store
      alert('Product reserved successfully! Redirecting to store page...');
      router.push(`/shop-in-store/${selectedStore.storeId}?reserved=${product.id}`);
      onClose();
    } catch (error) {
      console.error('Reservation failed:', error);
      alert('Failed to reserve product. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVisitStore = () => {
    if (selectedStore) {
      router.push(`/shop-in-store/${selectedStore.storeId}?product=${product.id}`);
      onClose();
    }
  };

  const getStoreHours = () => {
    // Mock store hours - in real app, this would come from store data
    return {
      monday: '8:00 AM - 10:00 PM',
      tuesday: '8:00 AM - 10:00 PM',
      wednesday: '8:00 AM - 10:00 PM',
      thursday: '8:00 AM - 10:00 PM',
      friday: '8:00 AM - 10:00 PM',
      saturday: '8:00 AM - 10:00 PM',
      sunday: '9:00 AM - 9:00 PM'
    };
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 20) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex h-full max-h-[90vh]">
          {/* Store Selection Sidebar */}
          <div className="w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Select Store</h3>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                {product.storeAvailability.map((store) => (
                  <button
                    key={store.storeId}
                    onClick={() => setSelectedStore(store)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selectedStore?.storeId === store.storeId
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{store.storeName}</h4>
                      <div className="flex items-center space-x-1">
                        {store.inStock ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3 h-3" />
                        <span>{store.storeAddress}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Navigation className="w-3 h-3" />
                        <span>{store.distance}km away</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3 h-3" />
                        <span>{store.storePhone}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      {store.inStock ? (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-600">
                            {store.stockCount} in stock
                          </span>
                          <span className="text-sm font-bold text-gray-900">
                            KSh {store.price.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-red-600">Out of stock</span>
                          {store.estimatedRestockDate && (
                            <span className="text-xs text-gray-500">
                              Restock: {new Date(store.estimatedRestockDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {selectedStore ? (
              <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Shop in Store
                      </h2>
                      <p className="text-gray-600">
                        Visit {selectedStore.storeName} to see and purchase this product
                      </p>
                    </div>
                  </div>

                  {/* Product Summary */}
                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                        <div className="flex items-center space-x-4">
                          <span className="text-lg font-bold text-gray-900">
                            KSh {selectedStore.price.toLocaleString()}
                          </span>
                          <div className="flex items-center space-x-1">
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
                            <span className="text-sm text-gray-600">({product.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Information */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Store Information</h3>
                  
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">{selectedStore.storeName}</h4>
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-red-500" />
                            <span>{selectedStore.storeAddress}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-red-500" />
                            <span>{selectedStore.storePhone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Navigation className="w-4 h-4 text-red-500" />
                            <span>{selectedStore.distance}km from your location</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Store Hours</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          {Object.entries(getStoreHours()).map(([day, hours]) => (
                            <div key={day} className="flex justify-between">
                              <span className="capitalize">{day}</span>
                              <span>{hours}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">In Stock</div>
                            <div className="text-xs text-gray-600">{selectedStore.stockCount} available</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                          <Shield className="w-5 h-5 text-blue-500" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">Warranty</div>
                            <div className="text-xs text-gray-600">Full manufacturer warranty</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                          <CreditCard className="w-5 h-5 text-purple-500" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">Payment</div>
                            <div className="text-xs text-gray-600">Cash, Card, M-Pesa</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {!showReservation ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button
                        onClick={handleVisitStore}
                        className="flex items-center justify-center space-x-2 bg-red-500 text-white py-3 px-6 rounded-xl hover:bg-red-600 transition-colors font-medium"
                      >
                        <Store className="w-5 h-5" />
                        <span>Visit Store Now</span>
                      </button>
                      
                      {selectedStore.canReserve && selectedStore.inStock && (
                        <button
                          onClick={() => setShowReservation(true)}
                          className="flex items-center justify-center space-x-2 border border-red-500 text-red-500 py-3 px-6 rounded-xl hover:bg-red-50 transition-colors font-medium"
                        >
                          <Timer className="w-5 h-5" />
                          <span>Reserve for Pickup</span>
                        </button>
                      )}
                    </div>

                    {selectedStore.canReserve && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                          <Timer className="w-5 h-5 text-blue-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900">Reserve for Pickup</h4>
                            <p className="text-sm text-blue-700 mt-1">
                              Reserve this product and we'll hold it for you for up to {selectedStore.reservationHours} hours. 
                              You can then visit the store at your convenience to complete the purchase.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Reservation Form */
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Reserve Product</h3>
                      <button
                        onClick={() => setShowReservation(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-900">Reservation Policy</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            We'll hold this product for {selectedStore.reservationHours} hours. Please visit the store 
                            within this time to complete your purchase. No payment is required to reserve.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={reservationData.customerName}
                          onChange={(e) => setReservationData({
                            ...reservationData,
                            customerName: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={reservationData.customerPhone}
                          onChange={(e) => setReservationData({
                            ...reservationData,
                            customerPhone: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="+254 7XX XXX XXX"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={reservationData.customerEmail}
                          onChange={(e) => setReservationData({
                            ...reservationData,
                            customerEmail: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="your@email.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Visit Date
                        </label>
                        <input
                          type="date"
                          value={reservationData.visitDate}
                          onChange={(e) => setReservationData({
                            ...reservationData,
                            visitDate: e.target.value
                          })}
                          min={getTomorrowDate()}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preferred Time
                        </label>
                        <select
                          value={reservationData.visitTime}
                          onChange={(e) => setReservationData({
                            ...reservationData,
                            visitTime: e.target.value
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        >
                          <option value="">Select time</option>
                          {getTimeSlots().map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Additional Notes
                        </label>
                        <textarea
                          value={reservationData.notes}
                          onChange={(e) => setReservationData({
                            ...reservationData,
                            notes: e.target.value
                          })}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          placeholder="Any special requests or questions..."
                        />
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button
                        onClick={handleReserveProduct}
                        disabled={isSubmitting || !reservationData.customerName || !reservationData.customerPhone}
                        className="flex-1 bg-red-500 text-white py-3 px-6 rounded-xl hover:bg-red-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Reserving...</span>
                          </>
                        ) : (
                          <>
                            <Calendar className="w-5 h-5" />
                            <span>Reserve Product</span>
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => setShowReservation(false)}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center">
                <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Store</h3>
                <p className="text-gray-600">Choose a store from the list to view details and options</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}