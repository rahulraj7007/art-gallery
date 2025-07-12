// Compact ArtworkCard Component - src/components/gallery/ArtworkCard.tsx

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, Mail, CheckCircle, ShoppingBag } from 'lucide-react';
import { useWishlistStore } from '@/lib/store/wishlistStore';

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

  const artworkInWishlist = isInWishlist(artwork.id);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (artworkInWishlist) {
      removeFromWishlist(artwork.id);
    } else {
      const wishlistItem = {
        id: artwork.id,
        title: artwork.title,
        artist: artwork.artist,
        imageUrl: artwork.imageUrl,
        price: artwork.price,
        availabilityType: artwork.availabilityType
      };
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
      {/* Image Container with Custom Light Frame */}
      <div className="relative aspect-[4/5] overflow-hidden mb-4">
        {/* Custom light frame with reduced width */}
        <div className="relative w-full h-full p-3 shadow-xl border-2 group-hover:shadow-2xl transition-shadow duration-300" style={{ backgroundColor: '#f6dfb3', borderColor: '#e6cfb3' }}>
          {/* Image area */}
          <div className="relative w-full h-full overflow-hidden">
            <Link href={`/artwork/${artwork.id}`}>
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className={`object-cover transition-all duration-700 group-hover:scale-[1.02] ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                onLoad={() => setImageLoaded(true)}
              />
              
              {/* Loading state */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
              )}

              {/* Minimal overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
            </Link>

            {/* Wishlist button - Minimal */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Heart
                className={`h-5 w-5 transition-colors duration-200 ${
                  artworkInWishlist ? 'text-gray-900 fill-current' : 'text-gray-700'
                }`}
              />
            </button>

            {/* Minimal availability badge */}
            {availabilityInfo && (
              <div className="absolute top-3 left-3">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-serif text-gray-800">
                  {availabilityInfo.label}
                </span>
              </div>
            )}

            {/* Out of stock indicator */}
            {(artwork.availabilityType === 'for-sale' || !artwork.availabilityType) && artwork.inStock === false && (
              <div className="absolute top-3 left-3">
                <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-serif text-gray-800">
                  Out of Stock
                </span>
              </div>
            )}
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

        {/* Compact Print Options - Single Line */}
        <div className="flex items-center space-x-2 text-xs font-serif text-gray-600">
          <span>Also available as fine art prints</span>
          <Link
            href={`/artwork/${artwork.id}/print`}
            className="inline-flex items-center space-x-1 bg-red-900 text-white px-2 py-1 text-xs font-serif font-medium hover:bg-red-800 transition-colors rounded"
          >
            <ShoppingBag className="h-3 w-3" />
            <span>Shop Prints</span>
          </Link>
          <span>from 450 SEK</span>
        </div>
      </div>
    </div>
  );
}