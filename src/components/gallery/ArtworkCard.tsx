'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Eye, Mail, CheckCircle, DollarSign } from 'lucide-react';
import { useState } from 'react';

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
}

interface ArtworkCardProps {
  artwork: Artwork;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

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

  return (
    <div className="group">
      {/* Image Container - Clean */}
      <div className="relative aspect-[4/5] overflow-hidden bg-gray-50 mb-4">
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
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <Heart
            className={`h-5 w-5 transition-colors duration-200 ${
              isLiked ? 'text-gray-900 fill-current' : 'text-gray-700'
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

      {/* Content - Ultra Clean */}
      <div className="space-y-2">
        {/* Title */}
        <Link href={`/artwork/${artwork.id}`}>
          <h3 className="font-serif font-medium text-gray-900 hover:text-gray-600 transition-colors text-lg leading-tight">
            {artwork.title}
          </h3>
        </Link>

        {/* Artist */}
        <p className="text-sm font-serif text-gray-600">
          by {artwork.artist}
        </p>

        {/* Price or Availability */}
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

        {/* Technical details - Minimal */}
        <div className="space-y-1">
          {artwork.medium && (
            <p className="text-xs font-serif text-gray-500">{artwork.medium}</p>
          )}
          {artwork.dimensions && (
            <p className="text-xs font-serif text-gray-500">{artwork.dimensions}</p>
          )}
          <div className="flex items-center justify-between">
            {artwork.year && (
              <p className="text-xs font-serif text-gray-500">{artwork.year}</p>
            )}
            {artwork.category && (
              <span className="text-xs font-serif text-gray-500">
                {artwork.category}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}