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
          color: 'bg-blue-100 text-blue-700 border-blue-200',
          icon: <Mail className="h-3 w-3" />
        };
      case 'exhibition':
        return {
          label: 'Exhibition',
          color: 'bg-purple-100 text-purple-700 border-purple-200',
          icon: <Eye className="h-3 w-3" />
        };
      case 'commissioned':
        return {
          label: 'Commissioned',
          color: 'bg-green-100 text-green-700 border-green-200',
          icon: <CheckCircle className="h-3 w-3" />
        };
      case 'sold':
        return {
          label: 'Sold',
          color: 'bg-gray-100 text-gray-600 border-gray-200',
          icon: <CheckCircle className="h-3 w-3" />
        };
      default: // 'for-sale'
        return null;
    }
  };

  const availabilityInfo = getAvailabilityInfo();
  const showPrice = (artwork.availabilityType === 'for-sale' || !artwork.availabilityType) && artwork.price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
        <Link href={`/artwork/${artwork.id}`}>
          <Image
            src={artwork.imageUrl}
            alt={artwork.title}
            fill
            className={`object-cover transition-all duration-500 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Loading state */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-blue-50 to-white animate-pulse" />
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <div className="transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                View Details
              </span>
            </div>
          </div>
        </Link>

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 rounded-full shadow-md hover:bg-opacity-100 transition-all duration-200"
        >
          <Heart
            className={`h-4 w-4 transition-colors duration-200 ${
              isLiked ? 'text-red-500 fill-current' : 'text-gray-600'
            }`}
          />
        </button>

        {/* Availability badge */}
        {availabilityInfo && (
          <div className={`absolute top-3 left-3 px-3 py-1 rounded-full border backdrop-blur-sm ${availabilityInfo.color}`}>
            <div className="flex items-center space-x-1">
              {availabilityInfo.icon}
              <span className="text-xs font-medium">{availabilityInfo.label}</span>
            </div>
          </div>
        )}

        {/* Stock status for for-sale items */}
        {(artwork.availabilityType === 'for-sale' || !artwork.availabilityType) && artwork.inStock === false && (
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-100 border border-red-200 backdrop-blur-sm">
            <span className="text-xs font-medium text-red-600">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and Artist */}
        <div className="mb-3">
          <Link href={`/artwork/${artwork.id}`}>
            <h3 className="font-serif font-semibold text-gray-900 hover:text-yellow-600 transition-colors duration-200 line-clamp-2 text-lg">
              {artwork.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 font-serif mt-1">
            by {artwork.artist}
          </p>
        </div>

        {/* Technical details */}
        {(artwork.medium || artwork.year || artwork.dimensions) && (
          <div className="mb-3 space-y-1">
            {artwork.medium && (
              <p className="text-xs text-gray-500 font-serif">{artwork.medium}</p>
            )}
            {artwork.dimensions && (
              <p className="text-xs text-gray-500">{artwork.dimensions}</p>
            )}
            {artwork.year && (
              <p className="text-xs text-gray-500">{artwork.year}</p>
            )}
          </div>
        )}

        {/* Price or Availability */}
        <div className="flex justify-between items-center">
          {showPrice ? (
            <div className="text-lg font-bold text-gray-900 flex items-center">
              <DollarSign className="h-4 w-4 text-green-600 mr-1" />
              {artwork.price?.toLocaleString()} SEK
            </div>
          ) : availabilityInfo ? (
            <div className={`text-sm font-medium flex items-center px-2 py-1 rounded-md ${availabilityInfo.color}`}>
              {availabilityInfo.icon}
              <span className="ml-1">{availabilityInfo.label}</span>
            </div>
          ) : (
            <div className="text-sm text-gray-500 font-serif">
              Contact for price
            </div>
          )}

          {/* Category badge */}
          {artwork.category && (
            <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full border border-gray-200 font-serif">
              {artwork.category}
            </span>
          )}
        </div>

        {/* Action hint */}
        <div className="mt-3 pt-3 border-t border-gray-100">
          {(artwork.availabilityType === 'for-sale' || !artwork.availabilityType) ? (
            <p className="text-xs text-gray-500 text-center font-serif">
              Click to view details and add to cart
            </p>
          ) : (
            <p className="text-xs text-gray-500 text-center font-serif">
              Click to view details and contact artist
            </p>
          )}
        </div>
      </div>
    </div>
  );
}