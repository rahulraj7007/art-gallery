'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import ArtworkCard from '@/components/gallery/ArtworkCard';
import { X, ZoomIn } from 'lucide-react';

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
}

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<Artwork | null>(null);
  
  const searchParams = useSearchParams();

  // Get filter and sort parameters from URL
  const filterType = searchParams.get('type');
  const sortType = searchParams.get('sort');
  const category = searchParams.get('category');

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

  // Filter and sort artworks based on URL parameters
  const filteredAndSortedArtworks = useMemo(() => {
    let filtered = [...artworks];

    // Apply type filter
    if (filterType) {
      switch (filterType) {
        case 'for-sale':
          filtered = filtered.filter(artwork => 
            artwork.availabilityType === 'for-sale' || !artwork.availabilityType
          );
          break;
        case 'enquire-only':
          filtered = filtered.filter(artwork => 
            artwork.availabilityType === 'enquire-only'
          );
          break;
        case 'exhibition':
          filtered = filtered.filter(artwork => 
            artwork.availabilityType === 'exhibition'
          );
          break;
        case 'commissioned':
          filtered = filtered.filter(artwork => 
            artwork.availabilityType === 'commissioned'
          );
          break;
        case 'sold':
          filtered = filtered.filter(artwork => 
            artwork.availabilityType === 'sold'
          );
          break;
        case 'paper-prints':
          filtered = filtered.filter(artwork => 
            artwork.availabilityType === 'paper-prints' || artwork.category?.toLowerCase().includes('paper')
          );
          break;
        case 'canvas-prints':
          filtered = filtered.filter(artwork => 
            artwork.availabilityType === 'canvas-prints' || artwork.category?.toLowerCase().includes('canvas')
          );
          break;
      }
    }

    // Apply category filter
    if (category) {
      filtered = filtered.filter(artwork => 
        artwork.category?.toLowerCase() === category.toLowerCase()
      );
    }

    // Apply sorting
    if (sortType) {
      switch (sortType) {
        case 'newest':
          filtered.sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || a.createdAt || new Date(0);
            const dateB = b.createdAt?.toDate?.() || b.createdAt || new Date(0);
            return dateB - dateA;
          });
          break;
        case 'oldest':
          filtered.sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || a.createdAt || new Date(0);
            const dateB = b.createdAt?.toDate?.() || b.createdAt || new Date(0);
            return dateA - dateB;
          });
          break;
        case 'price-low':
          filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
          break;
        case 'price-high':
          filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
          break;
        case 'title':
          filtered.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'popular':
          // For now, sort by creation date (could be enhanced with view tracking)
          filtered.sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || a.createdAt || new Date(0);
            const dateB = b.createdAt?.toDate?.() || b.createdAt || new Date(0);
            return dateB - dateA;
          });
          break;
      }
    }

    return filtered;
  }, [artworks, filterType, sortType, category]);

  // Get display title based on filters
  const getDisplayTitle = () => {
    if (filterType && sortType) {
      return `${getFilterLabel(filterType)} - ${getSortLabel(sortType)}`;
    } else if (filterType) {
      return getFilterLabel(filterType);
    } else if (sortType) {
      return getSortLabel(sortType);
    } else if (category) {
      return category;
    }
    return 'Gallery';
  };

  const getFilterLabel = (filter: string) => {
    switch (filter) {
      case 'for-sale': return 'Original Paintings';
      case 'enquire-only': return 'Enquire for Price';
      case 'exhibition': return 'Exhibition Pieces';
      case 'commissioned': return 'Commissioned Works';
      case 'sold': return 'Sold Works';
      case 'paper-prints': return 'Paper Prints';
      case 'canvas-prints': return 'Canvas Prints';
      default: return filter;
    }
  };

  const getSortLabel = (sort: string) => {
    switch (sort) {
      case 'newest': return 'Latest Works';
      case 'oldest': return 'Earlier Works';
      case 'popular': return 'Popular Pieces';
      case 'price-low': return 'Price: Low to High';
      case 'price-high': return 'Price: High to Low';
      case 'title': return 'Alphabetical';
      default: return sort;
    }
  };

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
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-serif">Loading artworks...</p>
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
            <h2 className="text-2xl font-serif font-light text-gray-900 mb-4">Unable to Load Gallery</h2>
            <p className="text-gray-600 font-serif mb-8">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-900 text-white px-8 py-3 font-serif font-medium hover:bg-gray-800 transition-colors"
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
        {/* Header with Filter Info */}
        <section className="pt-12 pb-8 border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-serif font-light text-gray-900">
                  {getDisplayTitle()}
                </h1>
                {(filterType || sortType || category) && (
                  <p className="text-gray-600 font-serif mt-2">
                    {filteredAndSortedArtworks.length} {filteredAndSortedArtworks.length === 1 ? 'artwork' : 'artworks'}
                  </p>
                )}
              </div>
              
              {/* Clear Filters */}
              {(filterType || sortType || category) && (
                <a
                  href="/gallery"
                  className="text-gray-600 hover:text-gray-900 font-serif text-sm transition-colors mt-4 sm:mt-0"
                >
                  View All Artworks
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Artworks Grid */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto px-6">
            {filteredAndSortedArtworks.length === 0 ? (
              <div className="text-center py-16">
                {artworks.length === 0 ? (
                  <>
                    <h3 className="text-xl font-serif font-light text-gray-900 mb-4">Gallery Coming Soon</h3>
                    <p className="text-gray-600 font-serif">New artworks are being prepared for display</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-serif font-light text-gray-900 mb-4">No Artworks Found</h3>
                    <p className="text-gray-600 font-serif mb-6">
                      No artworks match your current filter criteria.
                    </p>
                    <a
                      href="/gallery"
                      className="bg-gray-900 text-white px-6 py-3 font-serif font-medium hover:bg-gray-800 transition-colors"
                    >
                      View All Artworks
                    </a>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAndSortedArtworks.map((artwork) => (
                  <div key={artwork.id} className="group">
                    <div className="relative">
                      <ArtworkCard artwork={artwork} />
                      
                      {/* Zoom Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setZoomedImage(artwork);
                        }}
                        className="absolute top-3 right-3 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg z-10"
                        title="View larger image"
                      >
                        <ZoomIn className="h-4 w-4 text-gray-900" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Zoom Modal */}
      {zoomedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4"
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
            className="relative max-w-5xl max-h-full"
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
                  {zoomedImage.title}
                </h3>
                {zoomedImage.year && (
                  <p className="text-gray-300 font-serif text-sm mb-2">
                    {zoomedImage.year}
                  </p>
                )}
                {zoomedImage.medium && zoomedImage.dimensions && (
                  <p className="text-gray-300 font-serif text-sm">
                    {zoomedImage.medium} • {zoomedImage.dimensions}
                  </p>
                )}
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