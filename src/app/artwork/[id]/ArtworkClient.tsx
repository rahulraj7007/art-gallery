'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store/cartStore';
import { ArrowLeft, Mail, ShoppingCart, Heart, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Updated interface to match your flexible artwork system
interface Artwork {
  id: string;
  title: string;
  artist: string;
  price?: number; // Optional for enquire-only pieces
  imageUrl: string;
  description?: string; // Optional
  medium?: string; // Optional
  dimensions?: string; // Optional
  category?: string; // Optional
  year?: number; // Optional
  availabilityType?: 'for-sale' | 'enquire-only' | 'exhibition' | 'commissioned' | 'sold';
  inStock?: boolean; // Optional
}

interface ArtworkClientProps {
  artwork: Artwork;
}

export default function ArtworkClient({ artwork }: ArtworkClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCartStore();

  // Safety check - if artwork is undefined, show error
  if (!artwork) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-light text-gray-900 mb-4">Artwork Not Found</h1>
          <p className="text-gray-600 font-serif">The artwork you're looking for doesn't exist.</p>
          <Link 
            href="/gallery" 
            className="inline-block mt-6 text-gray-900 font-serif font-medium border-b border-gray-300 hover:border-gray-700 pb-1 transition-colors"
          >
            ← Back to Gallery
          </Link>
        </div>
      </div>
    );
  }
  
  const availabilityType = artwork.availabilityType || 'for-sale';

  const handleAddToCart = () => {
    if (availabilityType === 'for-sale' && artwork.price) {
      // Convert flexible artwork to cart-compatible format
      const cartArtwork = {
        id: artwork.id,
        title: artwork.title,
        artist: artwork.artist,
        price: artwork.price, // TypeScript now knows this exists due to the check above
        imageUrl: artwork.imageUrl,
        description: artwork.description || '',
        medium: artwork.medium || '',
        dimensions: artwork.dimensions || '',
        category: artwork.category || '',
        year: artwork.year || new Date().getFullYear(),
        inStock: artwork.inStock !== false,
      };
      
      addItem(cartArtwork, quantity);
    }
  };

  const handleContactInquiry = () => {
    const subject = `Inquiry about "${artwork.title}"`;
    const body = `Hello Aja,\n\nI'm interested in learning more about "${artwork.title}"${artwork.year ? ` (${artwork.year})` : ''}.\n\nThank you for your time.\n\nBest regards`;
    
    try {
      // Try mailto first
      const mailtoLink = `mailto:ajaeriksson@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Create a temporary link and click it
      const link = document.createElement('a');
      link.href = mailtoLink;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show confirmation
      alert('Opening your email client...\n\nIf your email doesn\'t open, please contact: ajaeriksson@gmail.com');
      
    } catch (error) {
      console.error('Error opening email:', error);
      // Fallback: copy email to clipboard and show instructions
      navigator.clipboard.writeText('ajaeriksson@gmail.com').then(() => {
        alert('Email address copied to clipboard!\n\nPlease email: ajaeriksson@gmail.com\n\nSubject: ' + subject);
      }).catch(() => {
        alert('Please contact the artist at:\najaeriksson@gmail.com\n\nSubject: ' + subject);
      });
    }
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

  const getAvailabilityInfo = () => {
    switch (availabilityType) {
      case 'enquire-only':
        return { 
          text: 'Contact for Price', 
          description: 'This piece is available through direct inquiry with the artist.',
          action: 'Contact Artist'
        };
      case 'exhibition':
        return { 
          text: 'Exhibition Piece', 
          description: 'Currently on display as part of a curated exhibition.',
          action: 'Inquire About Viewing'
        };
      case 'commissioned':
        return { 
          text: 'Commissioned Work', 
          description: 'This piece was created as a commissioned artwork.',
          action: 'Commission Similar Work'
        };
      case 'sold':
        return { 
          text: 'Sold', 
          description: 'This artwork has been sold and is no longer available.',
          action: null
        };
      default:
        return { 
          text: artwork.price ? `${artwork.price.toLocaleString()} SEK` : 'Price Available', 
          description: 'This original artwork is available for purchase.',
          action: 'Add to Cart'
        };
    }
  };

  const availability = getAvailabilityInfo();

  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href="/gallery" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-serif transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Section */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>

            {/* Artwork Info */}
            <div className="space-y-3 text-sm font-serif text-gray-600">
              {artwork.medium && (
                <p><span className="font-medium">Medium:</span> {artwork.medium}</p>
              )}
              {artwork.dimensions && (
                <p><span className="font-medium">Dimensions:</span> {artwork.dimensions}</p>
              )}
              {artwork.year && (
                <p><span className="font-medium">Year:</span> {artwork.year}</p>
              )}
              {artwork.category && (
                <p><span className="font-medium">Category:</span> {artwork.category}</p>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-8 lg:pl-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-serif font-light text-gray-900 leading-tight">
                {artwork.title}
              </h1>
              <p className="text-xl font-serif text-gray-600">
                by {artwork.artist}
              </p>
            </div>

            {/* Availability & Price */}
            <div className="space-y-4">
              <div className="text-2xl font-serif font-medium text-gray-900">
                {availability.text}
              </div>
              <p className="text-gray-600 font-serif leading-relaxed">
                {availability.description}
              </p>
            </div>

            {/* Description */}
            {artwork.description && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-medium text-gray-900">
                  About this work
                </h3>
                <p className="text-gray-700 font-serif leading-relaxed text-lg">
                  {artwork.description}
                </p>
              </div>
            )}

            {/* Action Section */}
            <div className="space-y-6">
              {availabilityType === 'for-sale' && artwork.price && artwork.inStock !== false ? (
                <div className="space-y-4">
                  {/* Quantity Selector - Only show for for-sale items */}
                  <div className="flex items-center space-x-4">
                    <label htmlFor="quantity" className="text-sm font-serif font-medium text-gray-700">
                      Quantity:
                    </label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="border border-gray-200 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-gray-900 focus:border-transparent font-serif text-sm"
                    >
                      {[1, 2, 3].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={handleAddToCart}
                      className="flex-1 bg-gray-900 text-white py-4 px-8 font-serif font-medium text-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-3"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Add to Cart</span>
                    </button>

                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`p-4 transition-colors ${
                        isWishlisted
                          ? 'bg-gray-900 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={handleShare}
                      className="p-4 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                availabilityType !== 'sold' && (
                  <div className="space-y-4">
                    <button
                      onClick={handleContactInquiry}
                      className="w-full bg-gray-900 text-white py-4 px-8 font-serif font-medium text-lg hover:bg-gray-800 transition-colors flex items-center justify-center space-x-3"
                    >
                      <Mail className="h-5 w-5" />
                      <span>{availability.action}</span>
                    </button>

                    <div className="flex space-x-4">
                      <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className={`flex-1 p-4 transition-colors ${
                          isWishlisted
                            ? 'bg-gray-900 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Heart className={`h-5 w-5 mx-auto ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={handleShare}
                        className="flex-1 p-4 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Share2 className="h-5 w-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                )
              )}

              {/* Additional Contact Option */}
              {availabilityType !== 'sold' && (
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-sm font-serif text-gray-600 mb-4">
                    Have questions about this piece? Contact the artist directly.
                  </p>
                  <button
                    onClick={handleContactInquiry}
                    className="text-gray-900 font-serif font-medium hover:text-gray-700 transition-colors border-b border-gray-300 hover:border-gray-700 pb-1"
                  >
                    Send Inquiry
                  </button>
                </div>
              )}

              {/* Sold Notice */}
              {availabilityType === 'sold' && (
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-sm font-serif text-gray-600">
                    This artwork has found its home. Contact the artist about commissioning a similar piece.
                  </p>
                  <button
                    onClick={handleContactInquiry}
                    className="mt-4 text-gray-900 font-serif font-medium hover:text-gray-700 transition-colors border-b border-gray-300 hover:border-gray-700 pb-1"
                  >
                    Commission Similar Work
                  </button>
                </div>
              )}
            </div>

            {/* Certificate Notice */}
            {(availabilityType === 'for-sale' || availabilityType === 'enquire-only') && (
              <div className="pt-6 border-t border-gray-100">
                <div className="bg-gray-50 p-6 space-y-2">
                  <h4 className="font-serif font-medium text-gray-900">Certificate of Authenticity</h4>
                  <p className="text-sm font-serif text-gray-600 leading-relaxed">
                    This original artwork comes with a signed certificate of authenticity 
                    from the artist, documenting its provenance and ensuring its value as an investment piece.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}