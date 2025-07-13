// app/prints/paper/page.tsx - Paper Prints Gallery with Print-Specific Cards

'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { X, ZoomIn, Heart } from 'lucide-react';
import { useWishlistStore, createPrintWishlistItem } from '@/lib/store/wishlistStore';
import Image from 'next/image';
import Link from 'next/link';

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



// Print-specific ArtworkCard for Paper Prints
function PaperPrintCard({ artwork }: { artwork: Artwork }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const { 
    addItem: addToWishlist, 
    removeItem: removeFromWishlist, 
    isInWishlist 
  } = useWishlistStore();

  // Check if A3 paper print is in wishlist (default popular size)
  const printItemId = `${artwork.id}-print-a3-paper`;
  const printInWishlist = isInWishlist(printItemId);

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (printInWishlist) {
      removeFromWishlist(printItemId);
    } else {
      // Add A3 paper print to wishlist by default
      const wishlistItem = createPrintWishlistItem(
        {
          id: artwork.id,
          title: artwork.title,
          artist: artwork.artist,
          imageUrl: artwork.imageUrl
        },
        {
          size: 'a3',
          sizeName: 'A3',
          type: 'paper',
          typeName: 'Paper Print',
          price: 650
        }
      );
      addToWishlist(wishlistItem);
    }
  };

  return (
    <div className="group">
      {/* Image Container with Custom Light Frame */}
      <div className="relative aspect-[4/5] overflow-hidden mb-4">
        {/* Custom light frame */}
        <div className="relative w-full h-full p-3 shadow-xl border-2 group-hover:shadow-2xl transition-shadow duration-300" style={{ backgroundColor: '#f6dfb3', borderColor: '#e6cfb3' }}>
          {/* Image area */}
          <div className="relative w-full h-full overflow-hidden">
            <Link href={`/artwork/${artwork.id}/print?type=paper`}>
              <Image
                src={artwork.imageUrl}
                alt={`${artwork.title} Fine Art Print`}
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

            {/* Wishlist button */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              title={printInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={`h-5 w-5 transition-colors duration-200 ${
                  printInWishlist 
                    ? 'text-red-900 fill-current' 
                    : 'text-gray-700 hover:text-red-900'
                }`}
              />
            </button>

            {/* Print Type Badge */}
            <div className="absolute top-3 left-3">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-serif text-gray-800">
                Paper Print
              </span>
            </div>


          </div>
        </div>
      </div>

      {/* Print-Specific Content */}
      <div className="space-y-2">
        {/* Single Line: Print Title • Info • Price */}
        <div className="flex items-baseline justify-between space-x-6">
          {/* Left: Print Title */}
          <Link href={`/artwork/${artwork.id}/print`} className="flex-shrink-0">
            <h3 className="font-serif font-medium text-gray-900 hover:text-gray-600 transition-colors text-lg leading-tight">
              {artwork.title} Fine Art Print
            </h3>
          </Link>

          {/* Center: Print Info */}
          <div className="flex-1 text-center">
            <p className="text-sm font-serif text-gray-600">
              Paper Print • Museum Quality
            </p>
          </div>
          
          {/* Right: Print Price Range */}
          <div className="flex-shrink-0">
            <p className="text-sm font-serif text-gray-900 font-medium">
              From 450 SEK
            </p>
          </div>
        </div>


      </div>
    </div>
  );
}

export default function PaperPrintsGallery() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<Artwork | null>(null);

  // Load artworks from Firebase
  useEffect(() => {
    const loadArtworks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const artworkData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Artwork[];
        
        setArtworks(artworkData);
        
      } catch (error) {
        console.error('Error loading artworks:', error);
        setError('Failed to load artworks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadArtworks();
  }, []);

  // Close zoom modal on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setZoomedImage(null);
      }
    };

    if (zoomedImage) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [zoomedImage]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-red-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-serif">Loading paper prints...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center py-32">
          <div className="text-center max-w-md mx-auto px-6">
            <h2 className="text-2xl font-serif font-light text-gray-900 mb-4">Unable to Load Paper Prints</h2>
            <p className="text-gray-600 font-serif mb-8">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-900 text-white px-8 py-3 font-serif font-medium hover:bg-red-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header with Filter Info - EXACT SAME STYLE AS GALLERY */}
        <section className="pt-12 pb-8 border-b border-gray-100">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-serif font-light text-gray-900">
                  Paper Prints Available
                </h1>
                <p className="text-gray-600 font-serif mt-2">
                  {artworks.length} {artworks.length === 1 ? 'artwork' : 'artworks'} available as premium paper prints
                </p>
              </div>
              
              {/* Clear Filters - Same as Gallery */}
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <a
                  href="/prints"
                  className="text-gray-600 hover:text-gray-900 font-serif text-sm transition-colors"
                >
                  ← All Prints
                </a>
                <a
                  href="/prints/canvas"
                  className="text-gray-600 hover:text-gray-900 font-serif text-sm transition-colors"
                >
                  Canvas Prints
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Print Info Banner */}
        <section className="py-6 bg-gray-50 border-b border-gray-100">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="font-serif font-medium text-gray-900 mb-2">Premium Quality</h3>
                <p className="text-sm font-serif text-gray-600">310gsm cotton rag, museum-grade archival paper</p>
              </div>
              <div>
                <h3 className="font-serif font-medium text-gray-900 mb-2">Fast Shipping</h3>
                <p className="text-sm font-serif text-gray-600">3-5 business days, free shipping over 1,500 SEK</p>
              </div>
              <div>
                <h3 className="font-serif font-medium text-gray-900 mb-2">Sizes Available</h3>
                <p className="text-sm font-serif text-gray-600">A4, A3, A2, A1 - 450 to 1,450 SEK</p>
              </div>
            </div>
          </div>
        </section>

        {/* Artworks Grid - EXACT SAME STYLE AS GALLERY */}
        <section className="py-24">
          <div className="max-w-[1400px] mx-auto px-6">
            {artworks.length === 0 ? (
              <div className="text-center py-24">
                <h3 className="text-xl font-serif font-light text-gray-900 mb-4">Gallery Coming Soon</h3>
                <p className="text-gray-600 font-serif mb-6">New artworks are being prepared for display</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/prints"
                    className="bg-red-900 text-white px-6 py-3 font-serif font-medium hover:bg-red-800 transition-colors"
                  >
                    Browse All Prints
                  </a>
                  <a
                    href="/gallery"
                    className="border-2 border-red-900 text-red-900 hover:bg-red-900 hover:text-white px-6 py-3 font-serif font-medium transition-colors"
                  >
                    View Original Gallery
                  </a>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {artworks.map((artwork) => (
                  <div key={artwork.id} className="group">
                    <div className="relative">
                      <PaperPrintCard artwork={artwork} />
                      
                      {/* Zoom Button - Same as Gallery */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setZoomedImage(artwork);
                        }}
                        className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg z-10"
                        title="View larger image"
                      >
                        <ZoomIn className="h-5 w-5 text-gray-900" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Zoom Modal - EXACT SAME AS GALLERY */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-3"
          onClick={() => setZoomedImage(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="h-8 w-8" />
          </button>

          {/* Zoomed Image */}
          <div 
            className="relative max-w-6xl max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={zoomedImage.imageUrl}
              alt={zoomedImage.title}
              className="max-w-full max-h-[90vh] object-contain"
            />
            
            {/* Image Info */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
              <div className="text-white">
                <h3 className="text-xl font-serif font-medium mb-1">
                  {zoomedImage.title} Fine Art Print
                </h3>
                <p className="text-gray-300 font-serif text-sm mb-2">
                  Paper Print • Museum Quality
                </p>
                <p className="text-gray-300 font-serif text-sm">
                  Available in A4, A3, A2, A1 sizes • From 450 SEK
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <p className="text-white text-sm font-serif opacity-75">
              Click outside image or press ESC to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}