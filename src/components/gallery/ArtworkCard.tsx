'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Artwork } from '@/lib/data/sampleArtworks';
import { useCartStore } from '@/lib/store/cartStore';

interface ArtworkCardProps {
  artwork: Artwork;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addItem, openCart, isInCart } = useCartStore();
  const itemInCart = isInCart(artwork.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking cart button
    addItem(artwork, 1);
    openCart(); // Open cart sidebar to show the item was added
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking heart button
    // TODO: Add to wishlist functionality
    console.log('Added to wishlist:', artwork.title);
  };

  return (
    <div 
      className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/artwork/${artwork.id}`}>
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gray-100">
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            className={`object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isHovered ? 'scale-105' : 'scale-100'}`}
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          
          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          )}

          {/* Overlay with actions */}
          <div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="flex space-x-3">
              <button
                onClick={handleAddToCart}
                disabled={!artwork.inStock}
                className={`p-3 rounded-full transition-all duration-200 ${
                  artwork.inStock 
                    ? 'bg-white text-gray-900 hover:bg-indigo-600 hover:text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                title={artwork.inStock ? 'Add to Cart' : 'Out of Stock'}
              >
                <ShoppingCart className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleAddToWishlist}
                className="p-3 bg-white text-gray-900 rounded-full hover:bg-red-500 hover:text-white transition-all duration-200"
                title="Add to Wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
              
              <div className="p-3 bg-white text-gray-900 rounded-full hover:bg-indigo-600 hover:text-white transition-all duration-200">
                <Eye className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Stock Status Badge */}
          {!artwork.inStock && (
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 text-xs font-semibold rounded">
              Sold Out
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 text-xs font-medium rounded">
            {artwork.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title and Artist */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors duration-200">
              {artwork.title}
            </h3>
            <p className="text-sm text-gray-600">by {artwork.artist}</p>
          </div>

          {/* Medium and Dimensions */}
          <div className="mb-3">
            <p className="text-xs text-gray-500">{artwork.medium}</p>
            <p className="text-xs text-gray-500">{artwork.dimensions}</p>
          </div>

          {/* Price and Year */}
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold text-indigo-600">
              ${artwork.price.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">
              {artwork.year}
            </div>
          </div>

          {/* Stock Status */}
          <div className="mt-2">
            <span className={`text-xs font-medium ${
              artwork.inStock ? 'text-green-600' : 'text-red-600'
            }`}>
              {artwork.inStock ? 'In Stock' : 'Sold Out'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}