// src/app/gallery/page.tsx - Äja Eriksson Art Gallery
'use client';

import { useState, useMemo, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import ArtworkCard from '@/components/gallery/ArtworkCard';
import { Search, Grid, List, SlidersHorizontal, Palette } from 'lucide-react';

// Define the Artwork interface
interface Artwork {
  id: string;
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
  description: string;
  medium: string;
  dimensions: string;
  inStock: boolean;
  category: string;
  year: number;
  createdAt: any;
}

type SortOption = 'title' | 'price-low' | 'price-high' | 'artist' | 'year';

// Define categories and price ranges
const categories = [
  'All',
  'Abstract',
  'Landscape', 
  'Portrait',
  'Still Life',
  'Contemporary',
  'Classical'
];

const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $500', min: 0, max: 500 },
  { label: '$500 - $1,000', min: 500, max: 1000 },
  { label: '$1,000 - $2,500', min: 1000, max: 2500 },
  { label: '$2,500 - $5,000', min: 2500, max: 5000 },
  { label: 'Over $5,000', min: 5000, max: Infinity },
];

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All Prices');
  const [sortBy, setSortBy] = useState<SortOption>('title');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Load artworks from Firebase
  useEffect(() => {
    loadArtworks();
  }, []);

  const loadArtworks = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const artworkData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Artwork[];
      
      console.log('Loaded artworks:', artworkData);
      setArtworks(artworkData);
      setError('');
    } catch (error) {
      console.error('Error loading artworks:', error);
      setError('Failed to load artworks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort artworks
  const filteredAndSortedArtworks = useMemo(() => {
    const filtered = artworks.filter((artwork) => {
      // Search filter
      const matchesSearch = 
        artwork.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artwork.description.toLowerCase().includes(searchTerm.toLowerCase());

      // Category filter
      const matchesCategory = selectedCategory === 'All' || artwork.category === selectedCategory;

      // Price filter
      const priceRange = priceRanges.find(range => range.label === selectedPriceRange);
      const matchesPrice = priceRange ? 
        artwork.price >= priceRange.min && artwork.price <= priceRange.max : true;

      return matchesSearch && matchesCategory && matchesPrice;
    });

    // Sort artworks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'artist':
          return a.artist.localeCompare(b.artist);
        case 'year':
          return b.year - a.year;
        case 'title':
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return filtered;
  }, [artworks, searchTerm, selectedCategory, selectedPriceRange, sortBy]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedPriceRange('All Prices');
    setSortBy('title');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-yellow-400 mx-auto"></div>
            <Palette className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-gray-600" />
          </div>
          <p className="text-gray-700 font-serif text-lg">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-md mx-auto shadow-lg">
            <h2 className="text-xl font-serif font-medium text-red-800 mb-3">Unable to Load Gallery</h2>
            <p className="text-red-600 font-serif mb-6">{error}</p>
            <button
              onClick={loadArtworks}
              className="bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-full hover:from-red-700 hover:to-red-600 transition-all duration-300 font-serif font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-yellow-50 to-blue-50">
      {/* Hero Header Section */}
      <div className="relative bg-white shadow-sm overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-yellow-200/40 to-orange-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-bl from-blue-200/30 to-cyan-300/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-gradient-to-tr from-green-600/20 to-emerald-500/15 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-serif font-light text-gray-900 mb-6 leading-tight">
              Original
              <span className="block font-serif font-normal text-gray-800 relative">
                Paintings
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full opacity-70"></div>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 font-serif font-light max-w-3xl mx-auto leading-relaxed mb-8">
              Works that move between light and dark, longing and farewell. Motifs return like old friends, 
              each carrying new stories from Gothenburg&apos;s distinguished cultural landscape.
            </p>
            {artworks.length > 0 && (
              <p className="text-gray-600 font-serif">
                {artworks.length} original artwork{artworks.length !== 1 ? 's' : ''} available
              </p>
            )}
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative max-w-lg mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 to-blue-100 rounded-2xl opacity-50"></div>
            <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search paintings, styles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-transparent border-none focus:outline-none focus:ring-0 font-serif text-lg placeholder-gray-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          {/* Mobile Filter Toggle */}
          <div className="flex items-center justify-between mb-6 lg:hidden">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 font-serif"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-serif font-medium text-gray-700 mb-3">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 font-serif bg-white shadow-sm transition-all duration-200"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-sm font-serif font-medium text-gray-700 mb-3">Price Range</label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 font-serif bg-white shadow-sm transition-all duration-200"
                >
                  {priceRanges.map((range) => (
                    <option key={range.label} value={range.label}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-serif font-medium text-gray-700 mb-3">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 font-serif bg-white shadow-sm transition-all duration-200"
                >
                  <option value="title">Title A-Z</option>
                  <option value="artist">Artist A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="year">Newest First</option>
                </select>
              </div>

              {/* View Mode */}
              <div>
                <label className="block text-sm font-serif font-medium text-gray-700 mb-3">View</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 font-serif ${
                      viewMode === 'grid' 
                        ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg' 
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 font-serif ${
                      viewMode === 'list' 
                        ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg' 
                        : 'border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Info and Clear Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-6 border-t border-gray-100">
              <p className="text-gray-600 font-serif mb-3 sm:mb-0">
                Showing {filteredAndSortedArtworks.length} of {artworks.length} paintings
              </p>
              {(searchTerm || selectedCategory !== 'All' || selectedPriceRange !== 'All Prices') && (
                <button
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-900 font-serif font-medium transition-colors relative group"
                >
                  Clear all filters
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 group-hover:w-full transition-all duration-300"></span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Artwork Grid */}
        {filteredAndSortedArtworks.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'
              : 'space-y-6'
          }>
            {filteredAndSortedArtworks.map((artwork) => (
              <ArtworkCard key={artwork.id} artwork={artwork} />
            ))}
          </div>
        ) : artworks.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-yellow-100 via-blue-100 to-green-100 rounded-full flex items-center justify-center shadow-lg">
                <Palette className="w-16 h-16 text-gray-400" />
              </div>
              <h3 className="text-2xl font-serif font-light text-gray-900 mb-4">Gallery Coming Soon</h3>
              <p className="text-gray-600 font-serif leading-relaxed mb-8">
                New paintings are being added to the collection. Check back soon to discover beautiful original artworks.
              </p>
              <button
                onClick={() => window.location.href = '/admin'}
                className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-4 rounded-full hover:from-gray-800 hover:to-gray-700 transition-all duration-300 font-serif font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Add Artwork (Admin)
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full flex items-center justify-center shadow-lg">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 mb-3">No paintings found</h3>
              <p className="text-gray-600 font-serif leading-relaxed mb-6">
                Try adjusting your search or filter criteria to discover more artworks.
              </p>
              <button
                onClick={clearFilters}
                className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-3 rounded-full hover:from-gray-800 hover:to-gray-700 transition-all duration-300 font-serif font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}