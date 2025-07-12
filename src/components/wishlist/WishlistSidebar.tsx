// components/wishlist/WishlistSidebar.tsx - Updated for Originals and Prints
'use client';

import { useEffect } from 'react';
import { X, Heart, ShoppingBag, ExternalLink, Trash2, Image as ImageIcon, Printer } from 'lucide-react';
import { useWishlistStore, WishlistItem } from '@/lib/store/wishlistStore';
import { useCartStore } from '@/lib/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';

export default function WishlistSidebar() {
  const {
    items,
    isOpen,
    closeWishlist,
    removeItem,
    loadWishlist,
    getOriginals,
    getPrints
  } = useWishlistStore();

  const { addItem: addToCart } = useCartStore();

  // Load wishlist on mount
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  const handleAddToCart = (item: WishlistItem) => {
    let cartItem;

    if (item.type === 'print') {
      // For print items, create cart item with print-specific details
      cartItem = {
        id: item.id, // Already includes print configuration
        title: item.title, // Already formatted with size/type
        artist: item.artist,
        price: item.price || 0,
        imageUrl: item.imageUrl,
        description: `Fine art print of "${item.title.split(' - ')[0]}" by ${item.artist}`,
        medium: `${item.printTypeName} - Print`,
        dimensions: item.printSizeName || '',
        category: 'prints',
        year: new Date().getFullYear(),
        availabilityType: 'for-sale' as const,
        inStock: true,
        createdAt: new Date()
      };
    } else {
      // For original artworks
      cartItem = {
        id: item.id,
        title: item.title,
        artist: item.artist,
        price: item.price || 0,
        imageUrl: item.imageUrl,
        description: `Original artwork by ${item.artist}`,
        medium: 'Original Artwork',
        dimensions: '',
        category: 'original',
        year: new Date().getFullYear(),
        availabilityType: item.availabilityType || 'for-sale',
        inStock: true,
        createdAt: new Date()
      };
    }

    addToCart(cartItem, 1);
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Price on request';
    return `${price.toLocaleString()} SEK`;
  };

  // Get navigation URL based on item type
  const getItemUrl = (item: WishlistItem) => {
    if (item.type === 'print') {
      // For prints, extract the original artwork ID and go to print page
      const artworkId = item.id.split('-print-')[0];
      return `/artwork/${artworkId}/print`;
    }
    // For originals, go to artwork page
    return `/artwork/${item.id}`;
  };

  // Get type indicator component
  const getTypeIndicator = (item: WishlistItem) => {
    if (item.type === 'print') {
      return (
        <div className="flex items-center space-x-1 mb-2">
          <Printer className="h-3 w-3 text-blue-600" />
          <span className="text-xs font-serif text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            Print: {item.printSizeName} {item.printTypeName}
          </span>
        </div>
      );
    }
    return (
      <div className="flex items-center space-x-1 mb-2">
        <ImageIcon className="h-3 w-3 text-green-600" />
        <span className="text-xs font-serif text-green-600 bg-green-50 px-2 py-0.5 rounded">
          Original Artwork
        </span>
      </div>
    );
  };

  // Group items by type for better organization
  const originalItems = getOriginals();
  const printItems = getPrints();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={closeWishlist}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-900 fill-current" />
            <h2 className="text-lg font-serif font-medium text-gray-900">
              My Wishlist
            </h2>
            {items.length > 0 && (
              <span className="bg-red-900 text-white text-xs px-2 py-1 rounded-full font-serif">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={closeWishlist}
            className="p-2 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Heart className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-serif font-medium text-gray-900 mb-2">
                Your wishlist is empty
              </h3>
              <p className="text-gray-600 font-serif mb-6">
                Save artworks and prints you love to view them later
              </p>
              <Link
                href="/gallery"
                onClick={closeWishlist}
                className="bg-red-900 text-white px-6 py-3 font-serif font-medium hover:bg-red-800 transition-colors rounded"
              >
                Browse Gallery
              </Link>
            </div>
          ) : (
            <div className="p-4 space-y-6">
              {/* Show Originals Section */}
              {originalItems.length > 0 && (
                <div>
                  <h3 className="text-sm font-serif font-medium text-gray-700 mb-3 flex items-center space-x-2">
                    <ImageIcon className="h-4 w-4 text-green-600" />
                    <span>Original Artworks ({originalItems.length})</span>
                  </h3>
                  <div className="space-y-3">
                    {originalItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex space-x-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        {/* Image */}
                        <div className="flex-shrink-0">
                          <Link href={getItemUrl(item)} onClick={closeWishlist}>
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              width={80}
                              height={100}
                              className="w-20 h-25 object-cover rounded"
                            />
                          </Link>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          {getTypeIndicator(item)}
                          
                          <Link
                            href={getItemUrl(item)}
                            onClick={closeWishlist}
                            className="group"
                          >
                            <h3 className="font-serif font-medium text-gray-900 group-hover:text-red-900 transition-colors text-sm leading-tight">
                              {item.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-gray-600 font-serif mt-1">
                            by {item.artist}
                          </p>
                          <p className="text-sm font-serif font-medium text-gray-900 mt-2">
                            {formatPrice(item.price)}
                          </p>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 mt-3">
                            {((item.availabilityType === 'for-sale' || !item.availabilityType) && item.price) && (
                              <button
                                onClick={() => handleAddToCart(item)}
                                className="flex items-center space-x-1 bg-red-900 text-white px-3 py-1.5 text-xs font-serif font-medium hover:bg-red-800 transition-colors rounded"
                              >
                                <ShoppingBag className="h-3 w-3" />
                                <span>Add to Cart</span>
                              </button>
                            )}
                            
                            <Link
                              href={getItemUrl(item)}
                              onClick={closeWishlist}
                              className="flex items-center space-x-1 border border-gray-300 text-gray-700 px-3 py-1.5 text-xs font-serif font-medium hover:bg-gray-50 transition-colors rounded"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>View</span>
                            </Link>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Show Prints Section */}
              {printItems.length > 0 && (
                <div>
                  <h3 className="text-sm font-serif font-medium text-gray-700 mb-3 flex items-center space-x-2">
                    <Printer className="h-4 w-4 text-blue-600" />
                    <span>Fine Art Prints ({printItems.length})</span>
                  </h3>
                  <div className="space-y-3">
                    {printItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex space-x-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                      >
                        {/* Image */}
                        <div className="flex-shrink-0">
                          <Link href={getItemUrl(item)} onClick={closeWishlist}>
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              width={80}
                              height={100}
                              className="w-20 h-25 object-cover rounded"
                            />
                          </Link>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          {getTypeIndicator(item)}
                          
                          <Link
                            href={getItemUrl(item)}
                            onClick={closeWishlist}
                            className="group"
                          >
                            <h3 className="font-serif font-medium text-gray-900 group-hover:text-red-900 transition-colors text-sm leading-tight">
                              {item.title}
                            </h3>
                          </Link>
                          <p className="text-xs text-gray-600 font-serif mt-1">
                            by {item.artist}
                          </p>
                          <p className="text-sm font-serif font-medium text-gray-900 mt-2">
                            {formatPrice(item.price)}
                          </p>

                          {/* Actions */}
                          <div className="flex items-center space-x-2 mt-3">
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="flex items-center space-x-1 bg-red-900 text-white px-3 py-1.5 text-xs font-serif font-medium hover:bg-red-800 transition-colors rounded"
                            >
                              <ShoppingBag className="h-3 w-3" />
                              <span>Add to Cart</span>
                            </button>
                            
                            <Link
                              href={getItemUrl(item)}
                              onClick={closeWishlist}
                              className="flex items-center space-x-1 border border-gray-300 text-gray-700 px-3 py-1.5 text-xs font-serif font-medium hover:bg-gray-50 transition-colors rounded"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>Configure</span>
                            </Link>

                            <button
                              onClick={() => removeItem(item.id)}
                              className="flex items-center space-x-1 text-red-600 hover:text-red-800 transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            {/* Summary */}
            <div className="text-xs font-serif text-gray-600 text-center">
              {originalItems.length > 0 && `${originalItems.length} original${originalItems.length !== 1 ? 's' : ''}`}
              {originalItems.length > 0 && printItems.length > 0 && ' • '}
              {printItems.length > 0 && `${printItems.length} print${printItems.length !== 1 ? 's' : ''}`}
            </div>
            
            <Link
              href="/gallery"
              onClick={closeWishlist}
              className="block w-full text-center border border-red-900 text-red-900 px-4 py-3 font-serif font-medium hover:bg-red-900 hover:text-white transition-colors rounded"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </>
  );
}