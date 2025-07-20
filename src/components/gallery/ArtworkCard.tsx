'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, Mail, CheckCircle } from 'lucide-react';
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
    return parts.join(' • ');
  };

  return (
    <div className="group">
      {/* CLEAN IMAGE CONTAINER - NO FRAMES */}
      <div className="relative mb-4">
        {/* Simple container for uploaded images with frames already applied */}
        <div className="w-full aspect-square relative overflow-hidden bg-white rounded-sm shadow-sm group-hover:shadow-md transition-shadow duration-300">
          {/* Direct image display - no additional styling */}
          <Link href={`/artwork/${artwork.id}`} className="block w-full h-full">
            <Image
              src={artwork.imageUrl}
              alt={artwork.title}
              fill
              className="transition-all duration-300 group-hover:scale-[1.02] object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Subtle overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/2 transition-colors duration-300"></div>
          </Link>

          {/* Wishlist button - Enhanced with red theme */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
            title={artworkInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm">
              <Heart
                className={`h-4 w-4 transition-colors duration-200 ${
                  artworkInWishlist 
                    ? 'text-red-900 fill-current' 
                    : 'text-gray-700 hover:text-red-900'
                }`}
              />
            </div>
          </button>

          {/* Availability badge */}
          {availabilityInfo && (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-serif text-gray-800 shadow-sm rounded">
                {availabilityInfo.label}
              </span>
            </div>
          )}

          {/* Out of stock indicator */}
          {(artwork.availabilityType === 'for-sale' || !artwork.availabilityType) && artwork.inStock === false && (
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 text-xs font-serif text-gray-800 shadow-sm rounded">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content Section - Clean Typography */}
      <div className="space-y-3">
        {/* Title and Price Row */}
        <div className="flex items-baseline justify-between space-x-4">
          {/* Left: Title */}
          <Link href={`/artwork/${artwork.id}`} className="flex-shrink-0">
            <h3 className="font-serif font-medium text-gray-900 hover:text-gray-600 transition-colors text-lg leading-tight">
              {artwork.title}
            </h3>
          </Link>

          {/* Right: Price or Availability */}
          <div className="flex-shrink-0">
            {showPrice ? (
              <p className="text-base font-serif text-gray-900 font-medium">
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

        {/* Dimensions and Details */}
        {getSecondLineInfo() && (
          <div className="text-center">
            <p className="text-sm font-serif text-gray-600">{getSecondLineInfo()}</p>
          </div>
        )}
      </div>
    </div>
  );
}