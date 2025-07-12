// Enhanced src/components/cart/CartSidebar.tsx (Your exact structure with animations added)

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cartStore';
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2, Loader2 } from 'lucide-react';

export default function CartSidebar() {
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  
  // NEW: Animation states
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const [removingItem, setRemovingItem] = useState<string | null>(null);

  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalItems,
    getTotalPrice,
    // NEW: Enhanced states
    lastAddedItem,
    clearLastAdded,
  } = useCartStore();

  // NEW: Highlight newly added items
  useEffect(() => {
    if (lastAddedItem) {
      setHighlightedItem(lastAddedItem);
      
      // Auto-scroll to newly added item
      setTimeout(() => {
        const element = document.getElementById(`cart-item-${lastAddedItem}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);

      // Remove highlight after animation
      const timer = setTimeout(() => {
        setHighlightedItem(null);
        clearLastAdded();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [lastAddedItem, clearLastAdded]);

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

  // Enhanced remove item with animation
  const handleRemoveItem = async (artworkId: string) => {
    setRemovingItem(artworkId);
    
    // Add removal animation delay
    setTimeout(() => {
      removeItem(artworkId);
      setRemovingItem(null);
    }, 300);
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    setCheckoutError(null);

    try {
      // Get customer email if user is logged in (you might want to get this from your auth context)
      const customerEmail = null; // Replace with actual user email if available

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          items,
          customerEmail 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutError(error instanceof Error ? error.message : 'Checkout failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-serif font-medium text-gray-900">
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
                <h3 className="text-lg font-serif font-medium text-gray-900 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 font-serif mb-6">
                  Add some beautiful artwork to get started
                </p>
                <Link
                  href="/gallery"
                  onClick={closeCart}
                  className="bg-red-900 text-white px-6 py-3 font-serif font-medium hover:bg-red-800 transition-colors rounded-lg"
                >
                  Browse Gallery
                </Link>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {items.map((item) => (
                  <div
                    key={item.artwork.id}
                    id={`cart-item-${item.artwork.id}`}
                    className={`transition-all duration-500 p-4 rounded-lg ${
                      highlightedItem === item.artwork.id
                        ? 'border-2 border-green-500 bg-green-50 shadow-md scale-[1.02]'
                        : removingItem === item.artwork.id
                        ? 'border border-red-300 bg-red-50 opacity-50 scale-95'
                        : 'border border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <div className="flex space-x-4 relative">
                      {/* NEW: New Item Badge */}
                      {highlightedItem === item.artwork.id && (
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-serif animate-pulse z-10">
                          New!
                        </div>
                      )}

                      {/* Artwork Image */}
                      <Link
                        href={`/artwork/${item.artwork.id}`}
                        onClick={closeCart}
                        className="flex-shrink-0"
                      >
                        <img
                          src={item.artwork.imageUrl}
                          alt={item.artwork.title}
                          className="w-20 h-25 object-cover hover:opacity-75 transition-opacity rounded"
                          onError={(e) => {
                            // Fallback for broken images
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgODAgMTAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iODAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAzMEg1NlY3MEgyNFYzMFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+';
                          }}
                        />
                      </Link>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/artwork/${item.artwork.id}`}
                          onClick={closeCart}
                          className="block"
                        >
                          <h3 className="text-sm font-serif font-medium text-gray-900 hover:text-gray-600 transition-colors">
                            {item.artwork.title}
                          </h3>
                          <p className="text-sm text-gray-500 font-serif">
                            by {item.artwork.artist}
                          </p>
                        </Link>

                        <div className="flex items-center justify-between mt-2">
                          <div className="text-sm font-serif font-medium text-gray-900">
                            {(item.artwork.price || 0).toLocaleString()} SEK
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => updateQuantity(item.artwork.id, item.quantity - 1)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                              disabled={item.quantity <= 1 || removingItem === item.artwork.id}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            
                            <span className="w-8 text-center text-sm font-serif font-medium">
                              {item.quantity}
                            </span>
                            
                            <button
                              onClick={() => updateQuantity(item.artwork.id, item.quantity + 1)}
                              className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                              disabled={removingItem === item.artwork.id}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Subtotal and Remove */}
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                          <div className="text-sm font-serif font-medium text-gray-900">
                            Subtotal: {((item.artwork.price || 0) * item.quantity).toLocaleString()} SEK
                          </div>
                          
                          <button
                            onClick={() => handleRemoveItem(item.artwork.id)}
                            className="p-1 text-red-400 hover:text-red-600 transition-colors group disabled:opacity-50"
                            title="Remove item"
                            disabled={removingItem === item.artwork.id}
                          >
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Clear Cart Button */}
                {items.length > 0 && (
                  <div className="pt-4 border-t border-gray-100">
                    <button
                      onClick={clearCart}
                      className="w-full text-sm text-red-600 hover:text-red-700 transition-colors font-serif"
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
            <div className="border-t border-gray-100 p-6 space-y-4">
              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="text-lg font-serif font-medium text-gray-900">Total</span>
                <span className="text-lg font-serif font-bold text-gray-900">
                  {totalPrice.toLocaleString()} SEK
                </span>
              </div>

              {/* Enhanced Shipping Notice */}
              <div className="text-center">
                {totalPrice >= 2000 ? (
                  <p className="text-xs text-green-600 font-serif">
                    ✓ Free shipping included
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 font-serif">
                    Add {(2000 - totalPrice).toLocaleString()} SEK more for free shipping
                  </p>
                )}
                <p className="text-xs text-gray-500 text-center font-serif mt-1">
                  Certificate of authenticity included. Secure packaging and insured shipping.
                </p>
              </div>

              {/* Error Message */}
              {checkoutError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 text-sm font-serif rounded">
                  {checkoutError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full bg-red-900 text-white py-3 font-serif font-medium hover:bg-red-800 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed rounded-lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </button>
                
                <Link
                  href="/gallery"
                  onClick={closeCart}
                  className="block w-full text-center py-2 text-gray-600 hover:text-gray-900 transition-colors font-serif"
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