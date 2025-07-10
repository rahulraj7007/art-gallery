'use client';

// src/app/page.tsx - Clean Homepage for MainLayout integration
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

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

export default function HomePage() {
  const [heroArtwork, setHeroArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);

  // Load hero artwork from Firebase
  useEffect(() => {
    const loadHeroArtwork = async () => {
      try {
        setLoading(true);
        
        // Get the most recent landscape artwork as hero image
        const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'), limit(1));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const artworkData = {
            id: querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data()
          } as Artwork;
          
          setHeroArtwork(artworkData);
        }
        
      } catch (error) {
        console.error('Error loading hero artwork:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHeroArtwork();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-serif">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Image - Full Width Landscape */}
      <section className="relative">
        <div className="w-full h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: heroArtwork 
                ? `url('${heroArtwork.imageUrl}')`
                : `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop')`
            }}
          ></div>
        </div>
      </section>

      {/* Artist Introduction Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 mb-8">
            Step into the contemplative world of Nordic artist, Aja Eriksson von Weissenberg.
          </h2>
          
          <div className="space-y-6 text-lg font-serif text-gray-700 leading-relaxed mb-8">
            <p>
              "My works move between light and dark, longing and farewell. I often depict the stark beauty 
              of Nordic landscapes where shadows dance across snow-covered fields and the aurora borealis 
              illuminates the endless winter nights."
            </p>
            <p>
              "The motifs return, like old friends - the solitary trees, the frozen lakes, the quiet moments 
              of reflection that define the Nordic soul."
            </p>
            <p className="font-medium">
              All works are created with passion in the heart of Scandinavia.
            </p>
          </div>

          <Link
            href="/gallery"
            className="bg-red-900 text-white px-12 py-4 text-lg font-serif font-medium hover:bg-red-800 transition-colors"
          >
            BROWSE ALL ART
          </Link>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎨</span>
              </div>
              <h3 className="font-serif font-medium text-gray-900 mb-2">Made in Scandinavia</h3>
              <p className="text-sm font-serif text-gray-600">
                Authentic Nordic art created in the artist's studio
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🚚</span>
              </div>
              <h3 className="font-serif font-medium text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-sm font-serif text-gray-600">
                Complimentary delivery on orders over €200
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⭐</span>
              </div>
              <h3 className="font-serif font-medium text-gray-900 mb-2">High Quality Materials</h3>
              <p className="text-sm font-serif text-gray-600">
                Professional grade paints and canvas for lasting beauty
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💳</span>
              </div>
              <h3 className="font-serif font-medium text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-sm font-serif text-gray-600">
                Safe and secure checkout with multiple payment options
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm font-serif text-gray-600 leading-relaxed max-w-2xl mx-auto">
              We ship all over the world with free global shipping for orders over €200 excluding original art and framed prints. 
              We currently do not ship framed art overseas as it is costly and at high risk of damage during transit. 
              Please contact us for special shipping arrangements.
            </p>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 mb-4">
              Collections
            </h2>
            <p className="text-lg font-serif text-gray-600">
              Explore curated collections of Nordic-inspired artworks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/gallery?category=landscapes" className="group">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-4">
                <div 
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop')`
                  }}
                ></div>
              </div>
              <h3 className="font-serif font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                Nordic Landscapes
              </h3>
              <p className="text-sm font-serif text-gray-600">
                Capturing the ethereal beauty of Scandinavian nature
              </p>
            </Link>

            <Link href="/gallery?category=abstract" className="group">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-4">
                <div 
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop')`
                  }}
                ></div>
              </div>
              <h3 className="font-serif font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                Abstract Expressions
              </h3>
              <p className="text-sm font-serif text-gray-600">
                Emotional interpretations of light and shadow
              </p>
            </Link>

            <Link href="/gallery?category=portraits" className="group">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-4">
                <div 
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=500&fit=crop')`
                  }}
                ></div>
              </div>
              <h3 className="font-serif font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                Contemplative Portraits
              </h3>
              <p className="text-sm font-serif text-gray-600">
                Intimate studies of the human condition
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Prints Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 mb-6">
                Art Prints & Reproductions
              </h2>
              <div className="space-y-4 text-lg font-serif text-gray-700 leading-relaxed mb-8">
                <p>
                  Bring Aja's Nordic artistry into your home with our carefully curated selection 
                  of high-quality prints and reproductions.
                </p>
                <p>
                  Each print is professionally produced using archival inks and premium papers, 
                  ensuring your artwork maintains its beauty for generations to come.
                </p>
              </div>
              <Link
                href="/gallery?category=prints"
                className="bg-red-900 text-white px-8 py-3 font-serif font-medium hover:bg-red-800 transition-colors"
              >
                Shop Prints
              </Link>
            </div>
            <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1578662535004-051ef0d7e18d?w=600&h=750&fit=crop')`
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Artist Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/5] bg-gray-100 overflow-hidden">
              <div 
                className="w-full h-full bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1494790108755-2616c90b2e5a?w=600&h=750&fit=crop')`
                }}
              ></div>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 mb-6">
                Meet the Artist
              </h2>
              <div className="space-y-4 text-lg font-serif text-gray-700 leading-relaxed mb-8">
                <p>
                  After graduating from HDK in 1972, Aja's broad artistic training encompasses 
                  everything from welding and bookbinding to scriptwriting and fresco painting 
                  at the Royal Institute of Art.
                </p>
                <p>
                  Her impressive portfolio includes exhibitions, short films, illustrations, 
                  and scenographic works, with public commissions throughout Gothenburg that 
                  have shaped the city's cultural landscape.
                </p>
                <p>
                  Today, Aja continues to create works that speak to the eternal themes of human 
                  experience, where unexpected elements emerge and new stories unfold.
                </p>
              </div>
              <Link
                href="/about"
                className="text-gray-900 font-serif font-medium border-b border-gray-300 hover:border-gray-700 pb-1 transition-colors"
              >
                Read Full Biography →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 mb-4">
              What Our Collectors Say
            </h2>
            <p className="text-lg font-serif text-gray-600">
              Testimonials from art lovers worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <blockquote className="text-gray-700 font-serif italic mb-4">
                "Aja's work captures something truly magical about the Nordic landscape. 
                The painting I purchased has become the centerpiece of our living room."
              </blockquote>
              <cite className="text-sm font-serif text-gray-600">
                — Anna L., Stockholm
              </cite>
            </div>

            <div className="bg-white p-8 shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <blockquote className="text-gray-700 font-serif italic mb-4">
                "The quality of the artwork exceeded my expectations. Beautiful packaging 
                and the certificate of authenticity was a wonderful touch."
              </blockquote>
              <cite className="text-sm font-serif text-gray-600">
                — Marcus H., Copenhagen
              </cite>
            </div>

            <div className="bg-white p-8 shadow-sm">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <blockquote className="text-gray-700 font-serif italic mb-4">
                "Working with Aja on a commission was an incredible experience. 
                She truly understood my vision and created something beyond my dreams."
              </blockquote>
              <cite className="text-sm font-serif text-gray-600">
                — Sarah K., London
              </cite>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-red-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-light text-white mb-4">
            Stay Connected
          </h2>
          <p className="text-lg font-serif text-red-100 mb-8">
            Be the first to know about new artworks, exhibitions, and exclusive offers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 font-serif text-gray-900 bg-white border border-gray-300 focus:outline-none focus:border-red-500"
            />
            <button className="bg-white text-red-900 px-8 py-3 font-serif font-medium hover:bg-red-50 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </>
  );
}