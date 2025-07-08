'use client';

// src/app/page.tsx - Clean Minimal Homepage
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
        
        // Get the most recent artwork as hero image
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
    <div className="min-h-screen bg-white">
      {/* Hero Section with Real Painting */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Hero Background - Real Artwork */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: heroArtwork 
              ? `url('${heroArtwork.imageUrl}')`
              : `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1920&h=1080&fit=crop')`
          }}
        >
          {/* Clean overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-light text-white mb-8 leading-tight">
            Contemporary Nordic Art
          </h1>
          
          <p className="text-xl md:text-2xl font-serif font-light text-white/90 leading-relaxed mb-8 max-w-3xl mx-auto">
            Aja Eriksson von Weissenberg
          </p>

          <blockquote className="text-lg md:text-xl font-serif italic text-white/80 leading-relaxed mb-12 max-w-2xl mx-auto">
            "My works move between light and dark, longing and farewell. The motifs return, 
            like old friends."
          </blockquote>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/gallery"
              className="bg-white text-gray-900 px-10 py-3 text-lg font-serif font-medium hover:bg-gray-100 transition-colors"
            >
              Browse Gallery
            </Link>

            {/* Featured Artwork Link */}
            {heroArtwork && (
              <Link
                href={`/artwork/${heroArtwork.id}`}
                className="border-2 border-white text-white px-10 py-3 text-lg font-serif font-medium hover:bg-white hover:text-gray-900 transition-all"
              >
                View This Artwork
              </Link>
            )}
          </div>

          {/* Hero Artwork Credit */}
          {heroArtwork && (
            <div className="mt-8 text-white/60 font-serif text-sm">
              "{heroArtwork.title}" 
              {heroArtwork.year && ` (${heroArtwork.year})`}
              {heroArtwork.medium && ` • ${heroArtwork.medium}`}
            </div>
          )}
        </div>
      </section>

      {/* Navigation Sections - Clean Grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Original Paintings */}
            <Link href="/gallery?type=for-sale" className="group">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-4 group-hover:bg-gray-200 transition-colors">
                <div 
                  className="w-full h-full bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop')`
                  }}
                ></div>
              </div>
              <h3 className="font-serif font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                Original Paintings
              </h3>
              <p className="text-sm font-serif text-gray-600">
                Unique artworks available for purchase
              </p>
            </Link>

            {/* Gallery */}
            <Link href="/gallery" className="group">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-4 group-hover:bg-gray-200 transition-colors">
                <div 
                  className="w-full h-full bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=500&fit=crop')`
                  }}
                ></div>
              </div>
              <h3 className="font-serif font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                Complete Gallery
              </h3>
              <p className="text-sm font-serif text-gray-600">
                View all artworks and collections
              </p>
            </Link>

            {/* Exhibitions */}
            <Link href="/gallery?type=exhibition" className="group">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-4 group-hover:bg-gray-200 transition-colors">
                <div 
                  className="w-full h-full bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=400&h=500&fit=crop')`
                  }}
                ></div>
              </div>
              <h3 className="font-serif font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                Exhibitions
              </h3>
              <p className="text-sm font-serif text-gray-600">
                Current and past exhibitions
              </p>
            </Link>

            {/* Commissioned Works */}
            <Link href="/contact" className="group">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-4 group-hover:bg-gray-200 transition-colors">
                <div 
                  className="w-full h-full bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{
                    backgroundImage: `url('https://images.unsplash.com/photo-1578662535004-051ef0d7e18d?w=400&h=500&fit=crop')`
                  }}
                ></div>
              </div>
              <h3 className="font-serif font-medium text-gray-900 mb-2 group-hover:text-gray-600 transition-colors">
                Commissions
              </h3>
              <p className="text-sm font-serif text-gray-600">
                Custom artworks and collaborations
              </p>
            </Link>

          </div>
        </div>
      </section>

      {/* About Artist Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-light text-gray-900 mb-8">
              About the Artist
            </h2>
          </div>
          
          <div className="space-y-6 text-center">
            <p className="text-lg font-serif text-gray-700 leading-relaxed">
              After graduating from HDK in 1972, Aja's broad artistic training encompasses 
              everything from welding and bookbinding to scriptwriting and fresco painting 
              at the Royal Institute of Art.
            </p>
            <p className="text-lg font-serif text-gray-700 leading-relaxed">
              Her impressive portfolio includes exhibitions, short films, illustrations, 
              and scenographic works, with public commissions throughout Gothenburg that 
              have shaped the city's cultural landscape.
            </p>
            <p className="text-lg font-serif text-gray-700 leading-relaxed">
              Aja continues to create works that speak to the eternal themes of human experience, 
              where unexpected elements emerge and new stories unfold.
            </p>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/about"
              className="text-gray-900 font-serif font-medium border-b border-gray-300 hover:border-gray-700 pb-1 transition-colors"
            >
              Read Full Biography →
            </Link>
          </div>
        </div>
      </section>

      {/* Clean Values Section */}
      <section className="py-20 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <h3 className="font-serif font-medium text-gray-900 mb-3">Original Artworks</h3>
              <p className="text-sm font-serif text-gray-600 leading-relaxed">
                Each piece is a unique, one-of-a-kind creation with its own story and character.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-serif font-medium text-gray-900 mb-3">Certificate of Authenticity</h3>
              <p className="text-sm font-serif text-gray-600 leading-relaxed">
                Professional documentation and provenance included with every artwork.
              </p>
            </div>

            <div className="text-center">
              <h3 className="font-serif font-medium text-gray-900 mb-3">Direct from Artist</h3>
              <p className="text-sm font-serif text-gray-600 leading-relaxed">
                Personal connection with the artist and the stories behind each creation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Current Exhibition Banner */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-light text-white mb-4">
            Current Exhibition
          </h2>
          <div className="space-y-2 mb-8">
            <p className="text-xl font-serif text-white">"Echoes of the North"</p>
            <p className="text-lg font-serif text-gray-300">Galleri Anna H, Göteborg</p>
            <p className="text-sm font-serif text-gray-400">Through August 2025</p>
          </div>
          <Link
            href="/gallery"
            className="bg-white text-gray-900 px-8 py-3 font-serif font-medium hover:bg-gray-100 transition-colors"
          >
            View Available Works
          </Link>
        </div>
      </section>
    </div>
  );
}