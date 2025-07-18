// Fixed ArtworkCard Component - Uniform Gallery Grid with Preserved Aspect Ratios
// Updated src/components/gallery/ArtworkCard.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, Mail, CheckCircle, ShoppingBag } from 'lucide-react';
import { useWishlistStore, createOriginalWishlistItem } from '@/lib/store/wishlistStore';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  price?: number;
  imageUrl: string;
  description?: string;
  medium?: string;
  dimensions?: string;
  category?: string;
  year?: number;
  availabilityType?: 'for-sale' | 'enquire-only' | 'exhibition' | 'commissioned' | 'sold';
  inStock?: boolean;
  createdAt?: any;
  collection?: string;
  tags?: string[];
}

interface ArtworkCardProps {
  artwork: Artwork;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const { 
    addItem: addToWishlist, 
    removeItem: removeFromWishlist, 
    isInWishlist 
  } = useWishlistStore();

  // Check if original artwork is in wishlist (not prints)
  const artworkInWishlist = isInWishlist(artwork.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (artworkInWishlist) {
      removeFromWishlist(artwork.id);
    } else {
      // Use the helper function to create properly typed original wishlist item
      const wishlistItem = createOriginalWishlistItem(artwork);
      addToWishlist(wishlistItem);
    }
  };

  const getAvailabilityInfo = () => {
    const availabilityType = artwork.availabilityType || 'for-sale';
    
    switch (availabilityType) {
      case 'enquire-only':
        return {
          label: 'Contact for Price',
          color: 'text-gray-600',
          icon: <Mail className="h-3 w-3" />
        };
      case 'exhibition':
        return {
          label: 'Exhibition',
          color: 'text-gray-600',
          icon: <Eye className="h-3 w-3" />
        };
      case 'commissioned':
        return {
          label: 'Commissioned',
          color: 'text-gray-600',
          icon: <CheckCircle className="h-3 w-3" />
        };
      case 'sold':
        return {
          label: 'Sold',
          color: 'text-gray-500',
          icon: <CheckCircle className="h-3 w-3" />
        };
      default: // 'for-sale'
        return null;
    }
  };

  const availabilityInfo = getAvailabilityInfo();
  const showPrice = (artwork.availabilityType === 'for-sale' || !artwork.availabilityType) && artwork.price;

  // Create the second line info (dimensions, category, year)
  const getSecondLineInfo = () => {
    const parts = [];
    if (artwork.dimensions) parts.push(artwork.dimensions);
    if (artwork.category) parts.push(artwork.category);
    if (artwork.year) parts.push(artwork.year.toString());
    return parts.join(' • ');
  };

  return (
    <div className="group">
      {/* UPDATED: Uniform Frame Size with Larger Images */}
      <div className="relative mb-4">
        {/* FIXED: Consistent frame dimensions for all artworks */}
        <div className="w-full h-80">
          <div 
            className="p-1 shadow-xl group-hover:shadow-2xl transition-shadow duration-300 w-full h-full" 
            style={{ 
              backgroundColor: '#f6dfb3', // Original cream color
              borderColor: '#e6cfb3',     // Original border color
              border: '3px solid #e6cfb3' // Explicit uniform border
            }}
          >
            {/* FIXED: Larger images within consistent frame */}
            <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
              <Link href={`/artwork/${artwork.id}`} className="flex items-center justify-center">
                <Image
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  width={600}
                  height={600}
                  className={`transition-all duration-700 group-hover:scale-[1.02] object-contain ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '100%',
                    width: 'auto',
                    height: 'auto'
                  }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onLoad={() => setImageLoaded(true)}
                />
                
                {/* Loading state */}
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                )}

                {/* Minimal overlay on hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
              </Link>

              {/* Wishlist button - Enhanced with red theme */}
              <button
                onClick={handleWishlist}
                className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                title={artworkInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  className={`h-5 w-5 transition-colors duration-200 ${
                    artworkInWishlist 
                      ? 'text-red-900 fill-current' 
                      : 'text-gray-700 hover:text-red-900'
                  }`}
                />
              </button>

              {/* Minimal availability badge */}
              {availabilityInfo && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-serif text-gray-800">
                    {availabilityInfo.label}
                  </span>
                </div>
              )}

              {/* Out of stock indicator */}
              {(artwork.availabilityType === 'for-sale' || !artwork.availabilityType) && artwork.inStock === false && (
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-serif text-gray-800">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Compact Content - Single Line Layout */}
      <div className="space-y-4">
        {/* Single Line: Title • Info • Price/Availability */}
        <div className="flex items-baseline justify-between space-x-6">
          {/* Left: Title */}
          <Link href={`/artwork/${artwork.id}`} className="flex-shrink-0">
            <h3 className="font-serif font-medium text-gray-900 hover:text-gray-600 transition-colors text-lg leading-tight">
              {artwork.title}
            </h3>
          </Link>

          {/* Center: Dimensions • Category • Year */}
          <div className="flex-1 text-center">
            {getSecondLineInfo() && (
              <p className="text-sm font-serif text-gray-600">{getSecondLineInfo()}</p>
            )}
          </div>
          
          {/* Right: Price or Availability */}
          <div className="flex-shrink-0">
            {showPrice ? (
              <p className="text-sm font-serif text-gray-900 font-medium">
                {artwork.price?.toLocaleString()} SEK
              </p>
            ) : availabilityInfo ? (
              <p className={`text-sm font-serif ${availabilityInfo.color}`}>
                {availabilityInfo.label}
              </p>
            ) : (
              <p className="text-sm font-serif text-gray-600">
                Contact for price
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}