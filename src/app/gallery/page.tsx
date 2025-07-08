'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import ArtworkCard from '@/components/gallery/ArtworkCard';
import { Search, Filter, Grid, List, SlidersHorizontal } from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState('');
  const [priceRange, setPriceRange] = useState<'all' | 'under-10000' | '10000-25000' | 'over-25000'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'price-low' | 'price-high' | 'title'>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

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
        
        console.log('Loaded artworks:', artworkData); // Debug log
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

  // Get unique categories from artworks
  const categories = useMemo(() => {
    const cats = artworks
      .map(artwork => artwork.category)
      .filter((category): category is string => Boolean(category));
    return [...new Set(cats)].sort();
  }, [artworks]);

  // Filter and sort artworks
  const filteredAndSortedArtworks = useMemo(() => {
    let filtered = artworks.filter((artwork) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          artwork.title.toLowerCase().includes(searchLower) ||
          artwork.artist.toLowerCase().includes(searchLower) ||
          artwork.description?.toLowerCase().includes(searchLower) ||
          artwork.medium?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory && artwork.category !== selectedCategory) {
        return false;
      }

      // Availability filter
      if (selectedAvailability) {
        const availabilityType = artwork.availabilityType || 'for-sale';
        if (availabilityType !== selectedAvailability) {
          return false;
        }
      }

      // Price range filter (only for for-sale items with prices)
      if (priceRange !== 'all' && artwork.availabilityType === 'for-sale' && artwork.price) {
        switch (priceRange) {
          case 'under-10000':
            if (artwork.price >= 10000) return false;
            break;
          case '10000-25000':
            if (artwork.price < 10000 || artwork.price > 25000) return false;
            break;
          case 'over-25000':
            if (artwork.price <= 25000) return false;
            break;
        }
      }

      return true;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        case 'oldest':
          return (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0);
        case 'price-low':
          // For price sorting, prioritize for-sale items with prices
          const aPrice = a.availabilityType === 'for-sale' && a.price ? a.price : Infinity;
          const bPrice = b.availabilityType === 'for-sale' && b.price ? b.price : Infinity;
          return aPrice - bPrice;
        case 'price-high':
          const aPriceHigh = a.availabilityType === 'for-sale' && a.price ? a.price : -1;
          const bPriceHigh = b.availabilityType === 'for-sale' && b.price ? b.price : -1;
          return bPriceHigh - aPriceHigh;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return filtered;
  }, [artworks, searchTerm, selectedCategory, selectedAvailability, priceRange, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-serif font-semibold text-gray-900 mb-2">Loading Artworks...</h2>
              <p className="text-gray-600">Discovering beautiful pieces for you</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Unable to Load Gallery</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
            Gallery
          </h1>
          <p className="text-xl text-gray-600 font-serif max-w-2xl mx-auto">
            Explore the artistic journey of Aja Eriksson von Weissenberg - from vibrant Nordic landscapes to contemplative abstract works
          </p>
          <div className="mt-4 text-sm text-gray-500">
            {artworks.length} artworks • {filteredAndSortedArtworks.length} showing
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search artworks, techniques, or themes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg hover:bg-white transition-colors"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* Availability Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                  <select
                    value={selectedAvailability}
                    onChange={(e) => setSelectedAvailability(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
                  >
                    <option value="">All Artworks</option>
                    <option value="for-sale">For Sale</option>
                    <option value="enquire-only">Contact for Price</option>
                    <option value="exhibition">Exhibition</option>
                    <option value="commissioned">Commissioned</option>
                    <option value="sold">Sold</option>
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
                  >
                    <option value="all">All Prices</option>
                    <option value="under-10000">Under 10,000 SEK</option>
                    <option value="10000-25000">10,000 - 25,000 SEK</option>
                    <option value="over-25000">Over 25,000 SEK</option>
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('');
                    setSelectedAvailability('');
                    setPriceRange('all');
                    setSortBy('newest');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* View Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            {filteredAndSortedArtworks.length} {filteredAndSortedArtworks.length === 1 ? 'artwork' : 'artworks'}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Artworks Grid */}
        {filteredAndSortedArtworks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 mb-4">
              <Filter className="h-16 w-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-gray-900 mb-2">No artworks found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setSelectedAvailability('');
                setPriceRange('all');
              }}
              className="text-yellow-600 hover:text-yellow-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {filteredAndSortedArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}