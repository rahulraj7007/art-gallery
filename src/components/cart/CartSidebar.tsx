'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';

export default function CartSidebar() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useCartStore();

  // Close cart on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCart();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when cart is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={closeCart}
      />

      {/* Cart Sidebar */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 transform transition-transform">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Shopping Cart ({totalItems})
            </h2>
            <button
              onClick={closeCart}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 mb-6">
                  Add some beautiful artwork to get started
                </p>
                <Link
                  href="/gallery"
                  onClick={closeCart}
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Browse Gallery
                </Link>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.artwork.id}
                    className="flex space-x-4 bg-gray-50 rounded-lg p-3"
                  >
                    {/* Artwork Image */}
                    <Link
                      href={`/artwork/${item.artwork.id}`}
                      onClick={closeCart}
                      className="flex-shrink-0"
                    >
                      <Image
                        src={item.artwork.imageUrl}
                        alt={item.artwork.title}
                        width={80}
                        height={100}
                        className="w-20 h-25 object-cover rounded-lg hover:opacity-75 transition-opacity"
                      />
                    </Link>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/artwork/${item.artwork.id}`}
                        onClick={closeCart}
                        className="block"
                      >
                        <h3 className="text-sm font-medium text-gray-900 hover:text-indigo-600 transition-colors">
                          {item.artwork.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          by {item.artwork.artist}
                        </p>
                      </Link>

                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm font-medium text-indigo-600">
                          ${item.artwork.price.toLocaleString()}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.artwork.id, item.quantity - 1)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          
                          <button
                            onClick={() => updateQuantity(item.artwork.id, item.quantity + 1)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal and Remove */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm font-semibold text-gray-900">
                          Subtotal: ${(item.artwork.price * item.quantity).toLocaleString()}
                        </div>
                        
                        <button
                          onClick={() => removeItem(item.artwork.id)}
                          className="p-1 text-red-400 hover:text-red-600 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                {items.length > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={clearCart}
                      className="w-full text-sm text-red-600 hover:text-red-700 transition-colors"
                    >
                      Clear all items
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 p-4 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total</span>
                <span className="text-lg font-bold text-indigo-600">
                  ${totalPrice.toLocaleString()}
                </span>
              </div>

              {/* Shipping Notice */}
              <p className="text-xs text-gray-500 text-center">
                Free shipping on all orders. Taxes calculated at checkout.
              </p>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center">
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                
                <Link
                  href="/gallery"
                  onClick={closeCart}
                  className="block w-full text-center py-2 text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}