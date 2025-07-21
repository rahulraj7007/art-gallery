'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ArrowLeft, X, ZoomIn } from 'lucide-react';
import ArtworkCard from '@/components/gallery/ArtworkCard';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  price?: number;
  imageUrl?: string;
  imageUrls?: string[];
  description?: string;
  medium?: string;
  dimensions?: string;
  category?: string;
  year?: number;
  availabilityType?: 'for-sale' | 'enquire-only' | 'exhibition' | 'commissioned' | 'sold';
  inStock?: boolean;
  createdAt?: any;
  collection?: string;
}

// Helper function to get valid image URL
const getValidImageUrl = (artwork: Artwork): string | null => {
  // Check imageUrls array first
  if (artwork.imageUrls && Array.isArray(artwork.imageUrls)) {
    const validUrl = artwork.imageUrls.find(url => url && url.trim() !== '');
    if (validUrl) return validUrl;
  }
  
  // Fallback to single imageUrl
  if (artwork.imageUrl && artwork.imageUrl.trim() !== '') {
    return artwork.imageUrl;
  }
  
  return null;
};

interface CollectionGroup {
  name: string;
  artworks: Artwork[];
  count: number;
  featuredArtwork: Artwork;
  latestYear?: number;
  description?: string;
}

// Collection descriptions - You can move this to Firebase later
const collectionDescriptions: Record<string, string> = {
  "Nordic Landscapes": `Step into the ethereal world of Nordic landscapes, where silence speaks louder than words and every brushstroke captures the profound beauty of Scandinavian nature. These works explore the delicate balance between light and shadow that defines the Nordic experience - the endless summer days that blur into luminous nights, and the deep winter months where darkness becomes a canvas for inner reflection.

Each painting in this collection tells the story of a land shaped by ice and time, where ancient forests meet pristine lakes, and where the horizon seems to stretch into infinity. The Nordic landscape is not just a geographical space; it's a state of mind, a meditation on solitude, resilience, and the quiet strength found in nature's raw beauty.

Through these works, I invite you to experience the contemplative spirit of the North - where every season brings its own poetry, and where the landscape becomes a mirror for our deepest emotions and aspirations.`,

  "Abstract Expressions": `Dive into the realm of pure emotion and color, where traditional forms dissolve to reveal the deeper truths of human experience. This collection represents a journey into the abstract - not as an escape from reality, but as a deeper exploration of it.

These works speak in the language of color, texture, and movement, where each brushstroke carries the weight of feeling and each composition tells a story that words cannot express. Here, the boundaries between the conscious and subconscious blur, allowing for moments of pure creative expression that transcend the limitations of representational art.

In these abstract pieces, I explore themes of transformation, energy, and the invisible forces that shape our lives. Each canvas becomes a meditation on the interplay between chaos and order, spontaneity and intention, creating works that invite the viewer to discover their own meaning within the visual symphony.`,

  "Contemplative Portraits": `Enter the intimate world of human emotion and psychological depth through these contemplative portraits. Each work in this collection seeks to capture not just the physical likeness of the subject, but the essence of their inner world - the thoughts, dreams, and emotions that define our shared humanity.

These portraits move beyond traditional representation to explore the complexity of human experience. Each face tells a story of resilience, vulnerability, hope, and introspection. Through careful attention to light, shadow, and expression, these works invite the viewer into a moment of quiet connection with the subject.

In our increasingly connected yet isolated world, these portraits serve as reminders of our fundamental need for understanding and empathy. They celebrate the beauty found in contemplation, the strength discovered in vulnerability, and the profound connections that bind us all together in the human experience.`,

  "Afternoon tea": `A gentle exploration of life's quieter moments, where time slows down and simple pleasures take center stage. This collection celebrates the art of pause - those precious intervals in our busy lives when we allow ourselves to simply be present.

Inspired by the ritual of afternoon tea, these works capture the poetry found in everyday moments: the play of light through a window, the steam rising from a warm cup, the soft conversation between friends. Each piece invites contemplation of how these small, seemingly ordinary experiences can become extraordinary when viewed through the lens of mindful attention.

These paintings remind us that beauty exists not only in grand gestures but in the intimate details of daily life - in the warmth of shared company, the comfort of familiar rituals, and the gentle rhythm of afternoon light as it moves across our spaces.`
};

function CollectionsContent() {
  const [collections, setCollections] = useState<CollectionGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<Artwork | null>(null);

  // Get search parameters
  const searchParams = useSearchParams();
  const selectedCollection = searchParams ? searchParams.get('collection') : null;

  // Load collections from Firebase
  useEffect(() => {
    const loadCollections = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all artworks
        const artworksRef = collection(db, 'artworks');
        const artworksQuery = query(artworksRef, orderBy('createdAt', 'desc'));
        const artworksSnapshot = await getDocs(artworksQuery);
        const allArtworks = artworksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Artwork[];

        // Group artworks by collection
        const collectionMap = new Map<string, Artwork[]>();
        
        allArtworks.forEach(artwork => {
          if (artwork.collection && artwork.collection.trim()) {
            const collectionName = artwork.collection.trim();
            if (!collectionMap.has(collectionName)) {
              collectionMap.set(collectionName, []);
            }
            collectionMap.get(collectionName)?.push(artwork);
          }
        });

        // Convert to array and sort by count (largest collections first)
        const collectionsArray = Array.from(collectionMap.entries())
          .map(([name, artworks]) => {
            // Sort artworks within collection by creation date (newest first)
            const sortedArtworks = artworks.sort((a, b) => {
              const dateA = a.createdAt?.toDate?.() || a.createdAt || new Date(0);
              const dateB = b.createdAt?.toDate?.() || b.createdAt || new Date(0);
              return dateB.getTime() - dateA.getTime();
            });

            // Get latest year from artworks in collection
            const latestYear = Math.max(...artworks.map(artwork => artwork.year || 0).filter(year => year > 0));

            return {
              name,
              artworks: sortedArtworks,
              count: artworks.length,
              featuredArtwork: sortedArtworks[0], // Use newest artwork as featured
              latestYear: latestYear > 0 ? latestYear : undefined,
              description: collectionDescriptions[name] || `Explore the "${name}" collection, featuring ${artworks.length} unique ${artworks.length === 1 ? 'artwork' : 'artworks'} that showcase distinctive artistic vision and creative expression.`
            };
          })
          .filter(collection => collection.count > 0) // Only collections with artworks
          .sort((a, b) => b.count - a.count); // Sort by size (largest first)

        setCollections(collectionsArray);
        
      } catch (error) {
        console.error('Error loading collections:', error);
        setError('Failed to load collections. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadCollections();
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
            <p className="text-gray-600 font-serif">Loading collections...</p>
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
            <h2 className="text-2xl font-serif font-light text-gray-900 mb-4">Unable to Load Collections</h2>
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

  // If a specific collection is selected, show individual collection view
  if (selectedCollection) {
    const currentCollection = collections.find(c => 
      c.name.toLowerCase() === selectedCollection.toLowerCase()
    );

    if (!currentCollection) {
      return (
        <div className="min-h-screen bg-white">
          <div className="flex items-center justify-center py-32">
            <div className="text-center max-w-md mx-auto px-6">
              <h2 className="text-2xl font-serif font-light text-gray-900 mb-4">Collection Not Found</h2>
              <p className="text-gray-600 font-serif mb-8">The collection "{selectedCollection}" could not be found.</p>
              <Link
                href="/collections"
                className="bg-red-900 text-white px-8 py-3 font-serif font-medium hover:bg-red-800 transition-colors"
              >
                Browse All Collections
              </Link>
            </div>
          </div>
        </div>
      );
    }

    // Individual Collection View
    return (
      <>
        <div className="min-h-screen bg-white">
          {/* Back Navigation */}
          <section className="pt-8 pb-4">
            <div className="max-w-[1400px] mx-auto px-6">
              <Link
                href="/collections"
                className="inline-flex items-center text-gray-600 hover:text-gray-900 font-serif text-sm transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Collections
              </Link>
            </div>
          </section>

          {/* Collection Header & Description */}
          <section className="pt-8 pb-16">
            <div className="max-w-4xl mx-auto px-6">
              <h1 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-8">
                {currentCollection.name}
              </h1>
              
              <div className="prose prose-lg max-w-none">
                {currentCollection.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-lg font-serif text-gray-700 leading-relaxed mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <p className="text-gray-600 font-serif">
                  {currentCollection.count} {currentCollection.count === 1 ? 'artwork' : 'artworks'} in this collection
                </p>
              </div>
            </div>
          </section>

          {/* Collection Artworks Grid */}
          <section className="pb-24">
            <div className="max-w-[1400px] mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentCollection.artworks.map((artwork) => (
                  <div key={artwork.id} className="group relative">
                    <ArtworkCard artwork={artwork} />
                    
                    {/* Zoom Button */}
                    {getValidImageUrl(artwork) && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setZoomedImage(artwork);
                        }}
                        className="absolute top-3 left-3 bg-white/90 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg z-20"
                        title="View larger image"
                      >
                        <ZoomIn className="h-4 w-4 text-gray-900" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        {/* Zoom Modal */}
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
              {getValidImageUrl(zoomedImage) ? (
                <img
                  src={getValidImageUrl(zoomedImage)!}
                  alt={zoomedImage.title}
                  className="max-w-full max-h-[90vh] object-contain"
                />
              ) : (
                <div className="flex items-center justify-center w-[600px] h-[400px] bg-gray-100">
                  <p className="text-gray-500 font-serif">No image available</p>
                </div>
              )}
              
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

  // Default Collections Overview
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-12 pb-8 border-b border-gray-100">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-light text-gray-900 mb-4">
              Collections
            </h1>
            <p className="text-gray-600 font-serif max-w-2xl mx-auto">
              Explore curated groups of artworks that tell unique stories and showcase different aspects of artistic expression.
            </p>
            {collections.length > 0 && (
              <p className="text-gray-600 font-serif mt-4">
                {collections.length} {collections.length === 1 ? 'collection' : 'collections'}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-6">
          {collections.length === 0 ? (
            <div className="text-center py-24">
              <h3 className="text-xl font-serif font-light text-gray-900 mb-4">No Collections Yet</h3>
              <p className="text-gray-600 font-serif mb-6">
                Collections are being organized. Check back soon to explore grouped artworks.
              </p>
              <Link
                href="/gallery"
                className="bg-red-900 text-white px-6 py-3 font-serif font-medium hover:bg-red-800 transition-colors"
              >
                Browse All Artworks
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collections.map((collection) => (
                <Link
                  key={collection.name}
                  href={`/collections?collection=${encodeURIComponent(collection.name)}`}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 hover:border-red-900 transition-all duration-300 overflow-hidden">
                    {/* Collection Preview */}
                    <div className="aspect-[4/5] relative overflow-hidden bg-gray-100">
                      {collection.artworks.length === 1 ? (
                        getValidImageUrl(collection.featuredArtwork) ? (
                          <Image
                            src={getValidImageUrl(collection.featuredArtwork)!}
                            alt={collection.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <p className="text-gray-500 font-serif">No image</p>
                          </div>
                        )
                      ) : (
                        <div className="grid grid-cols-2 gap-1 h-full">
                          {collection.artworks.slice(0, 4).map((artwork, index) => {
                            const imageUrl = getValidImageUrl(artwork);
                            return (
                              <div
                                key={artwork.id}
                                className={`relative overflow-hidden ${
                                  collection.artworks.length === 3 && index === 0 ? 'col-span-2' : ''
                                }`}
                              >
                                {imageUrl ? (
                                  <Image
                                    src={imageUrl}
                                    alt={artwork.title}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400 text-xs">No image</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    
                    {/* Collection Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-serif font-medium text-gray-900 group-hover:text-red-900 transition-colors">
                          {collection.name}
                        </h3>
                        {collection.latestYear && (
                          <span className="text-sm font-serif text-gray-500">
                            {collection.latestYear}
                          </span>
                        )}
                      </div>
                      
                      <p className="text-sm font-serif text-gray-600 mb-4">
                        {collection.count} {collection.count === 1 ? 'artwork' : 'artworks'}
                      </p>
                      
                      <div className="flex items-center text-red-900 text-sm font-serif font-medium">
                        <span>Explore Collection</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      {collections.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-2xl font-serif font-light text-gray-900 mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-gray-600 font-serif mb-8">
              Browse our complete gallery to discover all available artworks, 
              or contact us for commissioned pieces and special requests.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/gallery"
                className="bg-red-900 text-white px-8 py-3 font-serif font-medium hover:bg-red-800 transition-colors"
              >
                Browse All Artworks
              </Link>
              <Link
                href="/contact"
                className="border-2 border-red-900 text-red-900 px-8 py-3 font-serif font-medium hover:bg-red-900 hover:text-white transition-colors"
              >
                Contact Artist
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Loading component for Suspense
function CollectionsLoading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-red-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-serif">Loading collections...</p>
        </div>
      </div>
    </div>
  );
}

export default function CollectionsPage() {
  return (
    <Suspense fallback={<CollectionsLoading />}>
      <CollectionsContent />
    </Suspense>
  );
}