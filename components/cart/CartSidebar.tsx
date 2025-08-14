'use client';

import { useState } from 'react';
import { useCart } from '@/lib/hooks/useCart';
import Link from 'next/link';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Heart,
  Package,
  Truck,
  Shield,
  Clock,
  Gift,
  Tag,
  CreditCard,
  MapPin
} from 'lucide-react';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = appliedPromo ? subtotal * 0.1 : 0; // 10% discount example
  const shipping = subtotal > 5000 ? 0 : 500; // Free shipping over KSh 5,000
  const tax = (subtotal - discount) * 0.16; // 16% VAT
  const total = subtotal - discount + shipping + tax;

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === 'save10') {
      setAppliedPromo(promoCode);
      setPromoCode('');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 2);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-end z-50">
      <div className="w-full max-w-md bg-white h-full overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Shopping Cart ({cart.itemCount})
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6">
              <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 text-center mb-6">
                Add some products to get started with your shopping
              </p>
              <Link
                href="/shop-in-store"
                onClick={onClose}
                className="bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors font-medium"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Delivery Info */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="w-5 h-5 text-emerald-600" />
                  <span className="font-medium text-emerald-900">
                    {shipping === 0 ? 'Free Delivery' : 'Standard Delivery'}
                  </span>
                </div>
                <p className="text-sm text-emerald-700">
                  {shipping === 0 
                    ? 'Congratulations! You qualify for free delivery'
                    : `Add KSh ${(5000 - subtotal).toLocaleString()} more for free delivery`
                  }
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-emerald-600">
                  <Clock className="w-4 h-4" />
                  <span>Estimated delivery: {estimatedDelivery.toLocaleDateString()}</span>
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-600 truncate">{item.brand}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-semibold text-gray-900">
                          KSh {item.price.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 rounded">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Promo Code
                </h4>
                
                {appliedPromo ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">
                        {appliedPromo} applied
                      </span>
                    </div>
                    <button
                      onClick={handleRemovePromo}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Enter promo code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <button
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Order Summary</h4>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cart.itemCount} items)</span>
                    <span className="font-medium">KSh {subtotal.toLocaleString()}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-KSh {discount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className={`font-medium ${shipping === 0 ? 'text-green-600' : ''}`}>
                      {shipping === 0 ? 'Free' : `KSh ${shipping.toLocaleString()}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (VAT 16%)</span>
                    <span className="font-medium">KSh {tax.toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="font-bold text-lg text-gray-900">
                        KSh {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Shield className="w-6 h-6 text-emerald-600 mb-2" />
                  <span className="text-xs font-medium text-gray-900">Secure Payment</span>
                  <span className="text-xs text-gray-600">SSL Encrypted</span>
                </div>
                
                <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
                  <Truck className="w-6 h-6 text-emerald-600 mb-2" />
                  <span className="text-xs font-medium text-gray-900">Fast Delivery</span>
                  <span className="text-xs text-gray-600">1-2 Business Days</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {cart.items.length > 0 && (
          <div className="p-6 border-t border-gray-200 space-y-3">
            <Link
              href="/account/checkout"
              onClick={onClose}
              className="w-full bg-emerald-500 text-white py-3 px-4 rounded-lg hover:bg-emerald-600 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <div className="flex gap-3">
              <Link
                href="/cart"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
              >
                View Cart
              </Link>
              
              <Link
                href="/shop-in-store"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
              >
                Continue Shopping
              </Link>
            </div>
            
            <button
              onClick={clearCart}
              className="w-full text-red-600 hover:text-red-700 py-2 text-sm font-medium"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}