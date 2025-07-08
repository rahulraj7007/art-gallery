'use client';

import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { useCartStore } from '@/lib/store/cartStore';
import { XCircle, ArrowLeft, ShoppingCart, Mail, Phone } from 'lucide-react';

export default function CheckoutCancelledContent() {
  const { items, getTotalItems, getTotalPrice, openCart } = useCartStore();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Cancelled Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Checkout Cancelled
            </h1>
            <p className="text-lg text-gray-600">
              No worries! Your items are still in your cart and ready when you are.
            </p>
          </div>

          {/* Cart Summary */}
          {totalItems > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Cart</h2>
              
              <div className="space-y-4 mb-6">
                {items.slice(0, 3).map((item) => (
                  <div key={item.artwork.id} className="flex items-center space-x-4">
                    <img
                      src={item.artwork.imageUrl}
                      alt={item.artwork.title}
                      className="w-16 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.artwork.title}</h3>
                      <p className="text-sm text-gray-500">by {item.artwork.artist}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        ${(item.artwork.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {items.length > 3 && (
                  <p className="text-sm text-gray-500 text-center">
                    ...and {items.length - 3} more item{items.length - 3 !== 1 ? 's' : ''}
                  </p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-bold text-indigo-600">
                    ${totalPrice.toLocaleString()}
                  </span>
                </div>
                
                <button
                  onClick={openCart}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Review Cart & Checkout
                </button>
              </div>
            </div>
          )}

          {/* Why Checkout Might Have Been Cancelled */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Common Reasons for Cancelled Checkout</h2>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Decided to add more items to your cart</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Needed to check shipping costs or delivery time</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Payment method needed updating</p>
              </div>
              <div className="flex items-start">
                <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <p>Wanted to browse more artwork first</p>
              </div>
            </div>
          </div>

          {/* Special Offer */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white mb-8">
            <h2 className="text-xl font-semibold mb-2">Still Interested?</h2>
            <p className="mb-4 opacity-90">
              Your items are safely stored in your cart. Complete your purchase within the next 24 hours 
              and enjoy free expedited shipping on your order!
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={openCart}
                className="px-6 py-2 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Complete Purchase
              </button>
              <Link
                href="/gallery"
                className="px-6 py-2 border border-white text-white rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors text-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Need Help */}
          <div className="bg-gray-100 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-gray-600 mb-4">
              If you experienced any issues during checkout, our team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:aja@erikssonart.se"
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </a>
              <a
                href="tel:+46701234567"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call +46 70 123 4567
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Gallery
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}