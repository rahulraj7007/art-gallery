// Updated Print Page - Using WishlistStore for Print Items with Museum Frame

'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Share2, Info, Truck, Shield, Award, ChevronDown, ChevronUp, Check, Loader2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore, createPrintWishlistItem } from '@/lib/store/wishlistStore';
import Toast from '@/components/ui/Toast';

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

const printSizes = [
  { id: 'a4', name: 'A4', dimensions: '21 x 29.7 cm', inches: '8.3 x 11.7 in', price: 450, popular: false },
  { id: 'a3', name: 'A3', dimensions: '29.7 x 42 cm', inches: '11.7 x 16.5 in', price: 650, popular: true },
  { id: 'a2', name: 'A2', dimensions: '42 x 59.4 cm', inches: '16.5 x 23.4 in', price: 950, popular: false },
  { id: 'a1', name: 'A1', dimensions: '59.4 x 84.1 cm', inches: '23.4 x 33.1 in', price: 1450, popular: false },
  { id: 'poster', name: 'Large Poster', dimensions: '70 x 100 cm', inches: '27.6 x 39.4 in', price: 1850, popular: false }
];

const printTypes = [
  { 
    id: 'paper', 
    name: 'Paper Print',
    description: '310gsm textured cotton rag, museum-grade archival paper with matte finish',
    priceMultiplier: 1,
    popular: true
  },
  { 
    id: 'canvas', 
    name: 'Canvas Print',
    description: '340gsm artist canvas, poly-cotton with 5cm border for stretching',
    priceMultiplier: 1.6,
    popular: false
  }
];

export default function ArtworkPrintPage() {
  const params = useParams();
  const artworkId = params?.id as string;
  
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('a3');
  const [selectedType, setSelectedType] = useState('paper');
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false); // NEW: Image loading state
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { addItem, isAdding, lastAddedItem, clearLastAdded, openCart } = useCartStore();

  // Updated wishlist store usage
  const { 
    addItem: addToWishlist, 
    removeItem: removeFromWishlist, 
    isInWishlist,
    loadWishlist 
  } = useWishlistStore();

  // Load wishlist on component mount
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // Load artwork from Firebase
  useEffect(() => {
    const loadArtwork = async () => {
      if (!artworkId) return;
      
      try {
        setLoading(true);
        const docRef = doc(db, 'artworks', artworkId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setArtwork({
            id: docSnap.id,
            ...docSnap.data()
          } as Artwork);
        }
      } catch (error) {
        console.error('Error loading artwork:', error);
      } finally {
        setLoading(false);
      }
    };

    loadArtwork();
  }, [artworkId]);

  const currentSize = printSizes.find(size => size.id === selectedSize);
  const currentType = printTypes.find(type => type.id === selectedType);
  const currentPrice = Math.round((currentSize?.price || 0) * (currentType?.priceMultiplier || 1));
  
  const printItemId = `${artwork?.id}-print-${selectedSize}-${selectedType}`;
  const wasJustAdded = lastAddedItem === printItemId;

  // Check if this specific print configuration is in wishlist
  const isInWishlist_Print = artwork ? isInWishlist(printItemId) : false;

  const handleAddToCart = () => {
    if (artwork && currentSize && currentType) {
      const printItem = {
        id: printItemId,
        title: `${artwork.title} - ${currentType.name} (${currentSize.name})`,
        artist: artwork.artist,
        price: currentPrice,
        imageUrl: artwork.imageUrl,
        description: `Fine art print of "${artwork.title}" by ${artwork.artist}`,
        medium: `${currentType.name} - ${artwork.medium || 'Mixed Media'}`,
        dimensions: `${currentSize.dimensions} (${currentSize.inches})`,
        category: 'prints',
        year: artwork.year || new Date().getFullYear(),
        availabilityType: 'for-sale' as const,
        inStock: true,
        createdAt: new Date()
      };
      
      addItem(printItem, quantity);
      
      setToastMessage(`Print "${artwork.title}" (${currentSize.name}) added to cart!`);
      setShowToast(true);
      
      setTimeout(() => {
        clearLastAdded();
      }, 3000);
    }
  };

  const handleViewCart = () => {
    openCart();
  };

  // Updated wishlist handling using wishlist store
  const handleWishlist = () => {
    if (!artwork || !currentSize || !currentType) return;
    
    if (isInWishlist_Print) {
      // Remove from wishlist
      removeFromWishlist(printItemId);
      setToastMessage('Print removed from wishlist');
    } else {
      // Add to wishlist using helper function
      const wishlistItem = createPrintWishlistItem(
        {
          id: artwork.id,
          title: artwork.title,
          artist: artwork.artist,
          imageUrl: artwork.imageUrl
        },
        {
          size: selectedSize,
          sizeName: currentSize.name,
          type: selectedType,
          typeName: currentType.name,
          price: currentPrice
        }
      );
      
      addToWishlist(wishlistItem);
      setToastMessage(`Print "${artwork.title}" (${currentSize.name}, ${currentType.name}) added to wishlist!`);
    }
    
    setShowToast(true);
  };

  const handleShare = async () => {
    if (!artwork) return;

    const shareData = {
      title: `${artwork.title} Fine Art Print - ${artwork.artist}`,
      text: `Check out this beautiful fine art print: "${artwork.title}" by ${artwork.artist}`,
      url: window.location.href
    };

    // Try native share API first (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setToastMessage('Shared successfully!');
        setShowToast(true);
        return;
      } catch (error) {
        // User cancelled sharing or error occurred
        console.log('Share cancelled or failed');
      }
    }

    // Fallback: Copy to clipboard
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToastMessage('Link copied to clipboard!');
      setShowToast(true);
    } catch (error) {
      // Final fallback: Show share options
      setToastMessage('Use your browser\'s share button to share this page');
      setShowToast(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-red-900 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-serif">Loading artwork...</p>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-light text-gray-900 mb-4">Artwork Not Found</h2>
          <p className="text-gray-600 font-serif mb-8">The artwork you're looking for doesn't exist.</p>
          <Link href="/gallery" className="bg-red-900 text-white px-6 py-3 font-serif font-medium hover:bg-red-800 transition-colors">
            Browse Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Toast
        message={toastMessage}
        type="success"
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-16">
          
          {/* UPDATED: Much Larger Product Image with Museum Frame */}
          <div className="lg:col-span-4 mr-8">
            {/* Custom Framed Image - Same as Artwork Page */}
            <div className="inline-block w-full">
              <div className="p-4 shadow-xl border-2 group-hover:shadow-2xl transition-shadow duration-300 w-full" style={{ backgroundColor: '#f6dfb3', borderColor: '#e6cfb3' }}>
                <div className="relative inline-block overflow-hidden w-full">
                  <div className="aspect-[4/5] w-full">
                    <Image
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      width={1200}
                      height={1500}
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setImageLoaded(true)}
                      priority
                    />
                    
                    {/* Loading state */}
                    {!imageLoaded && (
                      <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Interactive Image Actions */}
            <div className="flex items-center justify-center space-x-4 mt-4">
              <button 
                onClick={handleWishlist}
                className={`flex items-center space-x-1 transition-colors ${
                  isInWishlist_Print 
                    ? 'text-red-900' 
                    : 'text-gray-600 hover:text-red-900'
                }`}
              >
                <Heart className={`h-4 w-4 ${isInWishlist_Print ? 'fill-current' : ''}`} />
                <span className="text-xs font-serif">
                  {isInWishlist_Print ? 'In Wishlist' : 'Add to Wishlist'}
                </span>
              </button>
              <button 
                onClick={handleShare}
                className="flex items-center space-x-1 text-gray-600 hover:text-red-900 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span className="text-xs font-serif">Share</span>
              </button>
            </div>
          </div>

          {/* Compact Product Details with left margin */}
          <div className="lg:col-span-3 ml-8 space-y-4">
            
            {/* Header - Price on same line as tax info */}
            <div>
              <h1 className="text-3xl font-serif font-light text-gray-900 mb-3">
                {artwork.title} Fine Art Print
              </h1>
              <div className="flex items-center space-x-3 text-base font-serif text-gray-600 mb-4">
                <span>by {artwork.artist}</span>
                {artwork.year && (
                  <>
                    <span>•</span>
                    <span>{artwork.year}</span>
                  </>
                )}
              </div>
              
              {/* Price with tax info on same line */}
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl font-serif font-medium text-gray-900">
                  {currentPrice} SEK
                </span>
                <span className="text-sm font-serif text-gray-600">
                  • Tax included. Made to order in Sweden.
                </span>
              </div>
            </div>

            {/* Print Type Selection - Bigger Fonts, Smaller Blocks */}
            <div>
              <h3 className="font-serif font-medium text-gray-900 mb-2 text-lg">Print Type</h3>
              <div className="grid grid-cols-2 gap-3 max-w-lg">
                {printTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`p-3 border-2 rounded text-left transition-all ${
                      selectedType === type.id
                        ? 'border-red-900 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif font-bold text-gray-900 text-base">{type.name}</span>
                      {type.popular && (
                        <span className="bg-red-900 text-white text-xs px-2 py-1 rounded font-serif">Popular</span>
                      )}
                    </div>
                    <p className="text-xs font-serif text-gray-600 leading-tight">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection - Enhanced with Bigger Fonts */}
            <div>
              <h3 className="font-serif font-medium text-gray-900 mb-2 text-xl">Size</h3>
              <div className="grid grid-cols-3 lg:grid-cols-5 gap-2">
                {printSizes.map((size) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size.id)}
                    className={`w-22 h-22 p-1 ml-2 border-2 rounded text-center transition-all relative ${
                      selectedSize === size.id
                        ? 'border-red-900 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {size.popular && (
                      <span className="absolute -top-1 -right-1 bg-red-900 text-white text-xs px-1 py-0.5 rounded font-serif">Popular</span>
                    )}
                    <div className="flex flex-col justify-center h-full">
                      <span className="font-serif font-bold text-gray-900 text-base">{size.name}</span>
                      <span className="font-serif font-bold text-red-900 text-sm">
                        {Math.round(size.price * (currentType?.priceMultiplier || 1))} SEK
                      </span>
                      <p className="text-sm font-serif text-gray-600 leading-none">
                        {size.dimensions.split(' x ')[0]}×{size.dimensions.split(' x ')[1]}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart - Same Line */}
            <div className="border-t border-gray-100 pt-4 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <label className="text-base font-serif font-medium text-gray-700">
                    Quantity:
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    disabled={isAdding}
                    className="w-14 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500 focus:border-red-500 font-serif text-base disabled:opacity-50"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className={`py-3 px-6 rounded font-serif font-medium text-base transition-all duration-200 flex items-center justify-center space-x-2 ${
                    wasJustAdded && !isAdding
                      ? 'bg-green-600 text-white'
                      : isAdding
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-red-900 text-white hover:bg-red-800'
                  }`}
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : wasJustAdded ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>
              </div>

              {wasJustAdded && !isAdding && (
                <div className="flex justify-start">
                  <button
                    onClick={handleViewCart}
                    className="py-2 px-4 border-2 border-red-900 text-red-900 font-serif font-medium hover:bg-red-900 hover:text-white transition-colors rounded flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>View Cart</span>
                  </button>
                </div>
              )}

              {wasJustAdded && !isAdding && (
                <div className="text-left">
                  <Link
                    href="/gallery"
                    className="text-sm font-serif text-gray-600 hover:text-red-900 transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </div>
              )}

              <div className="text-left">
                <p className="text-sm font-serif text-gray-600">
                  Buy with confidence - 30-day return policy
                </p>
              </div>

              <div className="text-left">
                <p className="text-sm font-serif text-gray-600">
                  Enjoy FREE worldwide shipping on orders over 1,500 SEK*
                </p>
              </div>
            </div>

            {/* Compact Details Toggle - Bigger Font */}
            <div className="border-t border-gray-100 pt-4">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors rounded text-base"
              >
                <div className="flex items-center space-x-2">
                  <Info className="h-5 w-5 text-red-900" />
                  <span className="font-serif font-medium text-gray-900">Shipping, Quality & Size Details</span>
                </div>
                {showDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>

              {showDetails && (
                <div className="p-4 bg-gray-50 rounded-b space-y-3 text-sm font-serif text-gray-700">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Quality</h4>
                    <p>Paper: 310gsm cotton rag, museum-grade. Canvas: 340gsm artist canvas with 5cm border.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Shipping</h4>
                    <p>Paper prints: 3-5 days. Canvas: 1-2 weeks. Free shipping over 1,500 SEK.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Production</h4>
                    <p>Made to order in Sweden. Certificate of authenticity included.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}