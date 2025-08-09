'use client';

import { useState } from 'react';
import { X, Clock, CreditCard, Calendar, MapPin, Package, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stockCount: number;
}

interface Store {
  id: string;
  name: string;
}

interface ReservationModalProps {
  product: Product;
  store: Store;
  onClose: () => void;
}

export default function ReservationModal({ product, store, onClose }: ReservationModalProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [reservationDays, setReservationDays] = useState(3);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mpesa' | 'bank'>('mpesa');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  const reservationFee = 500; // Fixed reservation fee
  const totalAmount = (product.price * quantity) + reservationFee;
  const pickupDeadline = new Date();
  pickupDeadline.setDate(pickupDeadline.getDate() + reservationDays);

  const handleReservation = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setStep('confirmation');
      setLoading(false);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        {/* Modal */}
        <div className="inline-block w-full max-w-2xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-xl font-bold text-gray-900">
              {step === 'details' && 'Reserve Product'}
              {step === 'payment' && 'Payment Details'}
              {step === 'confirmation' && 'Reservation Confirmed'}
            </h3>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'details' && (
              <div className="space-y-6">
                {/* Product Info */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                    <p className="text-sm text-gray-600 mb-2">Available at {store.name}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-emerald-600">
                        KSh {product.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-500">
                        {product.stockCount} in stock
                      </span>
                    </div>
                  </div>
                </div>

                {/* Reservation Details */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">Reservation Details</h4>
                  
                  {/* Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    >
                      {Array.from({ length: Math.min(product.stockCount, 5) }, (_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>

                  {/* Reservation Period */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reservation Period
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[2, 3, 4].map((days) => (
                        <button
                          key={days}
                          onClick={() => setReservationDays(days)}
                          className={`p-3 border rounded-lg text-center transition-colors ${
                            reservationDays === days
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="font-semibold">{days} Days</div>
                          <div className="text-xs text-gray-500">
                            Until {new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-3">
                    <h5 className="font-medium text-gray-900">Contact Information</h5>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={customerInfo.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          value={customerInfo.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="+254 700 000 000"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Special Notes (Optional)
                      </label>
                      <textarea
                        value={customerInfo.notes}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        rows={3}
                        placeholder="Any special requirements or notes..."
                      />
                    </div>
                  </div>
                </div>

                {/* Important Information */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <div className="font-medium mb-2">Reservation Terms:</div>
                      <ul className="space-y-1 text-xs">
                        <li>• Full payment required to confirm reservation</li>
                        <li>• Product must be collected within {reservationDays} days</li>
                        <li>• Reservation fee of KSh {reservationFee.toLocaleString()} is non-refundable</li>
                        <li>• You'll receive SMS and email confirmations</li>
                        <li>• Bring valid ID when collecting your item</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h5 className="font-medium text-gray-900 mb-3">Price Breakdown</h5>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Product Price ({quantity}x)</span>
                      <span>KSh {(product.price * quantity).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reservation Fee</span>
                      <span>KSh {reservationFee.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                      <span>Total Amount</span>
                      <span className="text-emerald-600">KSh {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>{product.name} ({quantity}x)</span>
                      <span>KSh {(product.price * quantity).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reservation Fee</span>
                      <span>KSh {reservationFee.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-emerald-600">KSh {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Payment Method</h4>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => setPaymentMethod('mpesa')}
                      className={`p-4 border rounded-xl text-center transition-colors ${
                        paymentMethod === 'mpesa'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-semibold">M-Pesa</div>
                      <div className="text-xs text-gray-500">Mobile Money</div>
                    </button>
                    
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border rounded-xl text-center transition-colors ${
                        paymentMethod === 'card'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-semibold">Card</div>
                      <div className="text-xs text-gray-500">Visa/Mastercard</div>
                    </button>
                    
                    <button
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-4 border rounded-xl text-center transition-colors ${
                        paymentMethod === 'bank'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="font-semibold">Bank</div>
                      <div className="text-xs text-gray-500">Transfer</div>
                    </button>
                  </div>
                </div>

                {/* Payment Form */}
                {paymentMethod === 'mpesa' && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      M-Pesa Phone Number
                    </label>
                    <input
                      type="tel"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="+254 700 000 000"
                    />
                    <p className="text-xs text-gray-500">
                      You'll receive an M-Pesa prompt to complete the payment
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 'confirmation' && (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                
                <div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Reservation Confirmed!</h4>
                  <p className="text-gray-600">
                    Your product has been reserved successfully. You'll receive confirmation details via SMS and email.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="text-sm text-green-800">
                    <div className="font-medium mb-2">Reservation Details:</div>
                    <div className="space-y-1 text-left">
                      <div className="flex justify-between">
                        <span>Reservation ID:</span>
                        <span className="font-mono">RES-{Date.now().toString().slice(-6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pickup Deadline:</span>
                        <span>{pickupDeadline.toLocaleDateString()} at 9:00 PM</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Store Location:</span>
                        <span>{store.name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <div className="font-medium mb-1">Important Reminders:</div>
                      <ul className="text-left space-y-1">
                        <li>• Bring a valid ID when collecting your item</li>
                        <li>• Items not collected by the deadline will be returned to stock</li>
                        <li>• Contact the store if you need to extend your reservation</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            {step === 'details' && (
              <>
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep('payment')}
                  disabled={!customerInfo.name || !customerInfo.phone}
                  className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </button>
              </>
            )}

            {step === 'payment' && (
              <>
                <button
                  onClick={() => setStep('details')}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleReservation}
                  disabled={loading}
                  className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pay KSh {totalAmount.toLocaleString()}
                    </>
                  )}
                </button>
              </>
            )}

            {step === 'confirmation' && (
              <button
                onClick={onClose}
                className="w-full px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}