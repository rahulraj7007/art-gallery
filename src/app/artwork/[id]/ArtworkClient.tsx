'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store/cartStore';
import { Heart, Share2, ShoppingCart } from 'lucide-react';
import Image from 'next/image';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
  description: string;
  medium: string;
  dimensions: string;
  category: string;
  year: number;
  inStock: boolean;
}

interface ArtworkClientProps {
  artwork: Artwork;
}

export default function ArtworkClient({ artwork }: ArtworkClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem, openCart, isInCart } = useCartStore();

  const handleAddToCart = () => {
    addItem(artwork, quantity);
    openCart();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: artwork.title,
        text: `Check out this artwork by ${artwork.artist}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const itemInCart = isInCart(artwork.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream via-pastel-yellow to-light-blue">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden shadow-xl bg-white">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">
                {artwork.title}
              </h1>
              <p className="text-xl text-gray-600 font-serif">
                by {artwork.artist}
              </p>
            </div>

            <div className="text-3xl font-bold text-oak-red">
              ${artwork.price.toLocaleString()}
            </div>

            <div className="prose prose-lg">
              <p className="text-gray-700 font-serif leading-relaxed">
                {artwork.description}
              </p>
            </div>

            {/* Specifications */}
            <div className="bg-white bg-opacity-50 rounded-lg p-6 space-y-3">
              <h3 className="text-lg font-serif font-semibold text-gray-900">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Medium:</span>
                  <p className="text-gray-900">{artwork.medium}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Dimensions:</span>
                  <p className="text-gray-900">{artwork.dimensions}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Category:</span>
                  <p className="text-gray-900">{artwork.category}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Year:</span>
                  <p className="text-gray-900">{artwork.year}</p>
                </div>
              </div>
            </div>

            {/* Purchase Section */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="border rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-algae-green focus:border-transparent"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  disabled={!artwork.inStock}
                  className="flex-1 bg-oak-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>
                    {!artwork.inStock 
                      ? 'Out of Stock' 
                      : itemInCart 
                      ? 'Add More to Cart' 
                      : 'Add to Cart'
                    }
                  </span>
                </button>

                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    isWishlisted
                      ? 'bg-oak-red text-white border-oak-red'
                      : 'bg-white text-oak-red border-oak-red hover:bg-oak-red hover:text-white'
                  }`}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-3 rounded-lg border-2 border-algae-green text-algae-green hover:bg-algae-green hover:text-white transition-colors bg-white"
                >
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {artwork.inStock && (
              <div className="bg-algae-green bg-opacity-10 border border-algae-green rounded-lg p-4">
                <p className="text-sm text-algae-green font-medium">
                  ✓ In Stock - Ready to ship within 2-3 business days
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}