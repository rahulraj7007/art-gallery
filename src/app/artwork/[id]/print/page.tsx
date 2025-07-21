'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Share2, Info, Truck, Shield, Award, ChevronDown, ChevronUp, Check, Loader2, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore, createPrintWishlistItem } from '@/lib/store/wishlistStore';
import Toast from '@/components/ui/Toast';

// Import the Room Gallery component
import ArtworkRoomGallery from '@/components/gallery/ArtworkRoomGallery';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  price?: number;
  imageUrl?: string; // Keep for backward compatibility
  imageUrls?: string[]; // New multiple images array
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
  { id: 'a4', name: 'A4', dimensions: '21 x 29.7 cm', inches: '8.3 x 11.7 in', price: 387, canvasPrice: 966, popular: false },
  { id: 'a3', name: 'A3', dimensions: '29.7 x 42 cm', inches: '11.7 x 16.5 in', price: 580, canvasPrice: 1545, popular: true },
  { id: 'a2', name: 'A2', dimensions: '42 x 59.4 cm', inches: '16.5 x 23.4 in', price: 1159, canvasPrice: 2446, popular: false },
  { id: 'a1', name: 'A1', dimensions: '59.4 x 84.1 cm', inches: '23.4 x 33.1 in', price: 1803, canvasPrice: 3090, popular: false }
];

const printTypes = [
  { 
    id: 'paper', 
    name: 'Paper Print',
    description: 'Enhanced Matte Paper',
    delivery: '7-10 business days',
    shipping: 'Free shipping',
    popular: true
  },
  { 
    id: 'canvas', 
    name: 'Canvas Print',
    description: 'Premium Canvas, 1.25" thick',
    delivery: '2-3 weeks',
    shipping: '588 SEK shipping',
    popular: false
  }
];

export default function ArtworkPrintPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const artworkId = params?.id as string;
  
  // Get the type parameter from URL (canvas/paper)
  const typeParam = searchParams?.get('type');
  const defaultType = (typeParam === 'canvas' || typeParam === 'paper') ? typeParam : 'paper';
  
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('a3');
  const [selectedType, setSelectedType] = useState(defaultType);
  const [quantity, setQuantity] = useState(1);
  const [showDetails, setShowDetails] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // NEW: For image carousel
  
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

  // Get all available images with proper fallbacks
  const getAvailableImages = (): string[] => {
    if (!artwork) return [];
    
    // First check for new imageUrls array
    if (artwork.imageUrls && artwork.imageUrls.length > 0) {
      // Filter out empty strings
      return artwork.imageUrls.filter(url => url && url.trim() !== '');
    }
    // Fallback to old imageUrl property for backward compatibility
    if (artwork.imageUrl && artwork.imageUrl.trim() !== '') {
      return [artwork.imageUrl];
    }
    // No images available
    return [];
  };

  const availableImages = getAvailableImages();
  const hasMultipleImages = availableImages.length > 1;
  const currentImageUrl = availableImages[currentImageIndex] || null;

  // Navigation functions for multiple images
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
    setImageLoaded(false); // Reset loading state
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + availableImages.length) % availableImages.length);
    setImageLoaded(false); // Reset loading state
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
    setImageLoaded(false); // Reset loading state
  };

  // Load wishlist on component mount
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // Update selectedType when URL parameter changes
  useEffect(() => {
    if (typeParam === 'canvas' || typeParam === 'paper') {
      setSelectedType(typeParam);
    }
  }, [typeParam]);

  // Keyboard navigation for multiple images
  useEffect(() => {
    if (!hasMultipleImages) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setCurrentImageIndex((prev) => (prev - 1 + availableImages.length) % availableImages.length);
        setImageLoaded(false);
      } else if (e.key === 'ArrowRight') {
        setCurrentImageIndex((prev) => (prev + 1) % availableImages.length);
        setImageLoaded(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [hasMultipleImages, availableImages.length]);

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
  
  // Calculate price based on type
  const currentPrice = currentSize ? 
    (selectedType === 'canvas' ? currentSize.canvasPrice : currentSize.price) : 0;
  
  const printItemId = `${artwork?.id}-print-${selectedSize}-${selectedType}`;
  const wasJustAdded = lastAddedItem === printItemId;

  // Check if this specific print configuration is in wishlist
  const isInWishlist_Print = artwork ? isInWishlist(printItemId) : false;

  const handleAddToCart = () => {
    if (artwork && currentSize && currentType && currentImageUrl) {
      const printItem = {
        id: printItemId,
        title: `${artwork.title} - ${currentType.name} (${currentSize.name})`,
        artist: artwork.artist,
        price: currentPrice,
        imageUrl: currentImageUrl, // Use currently displayed image
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
    if (!artwork || !currentSize || !currentType || !currentImageUrl) return;
    
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
          imageUrl: currentImageUrl // Use currently displayed image
        },
        {
          size: selectedSize,
          sizeName: currentSize.name,
          type: selectedType,
          typeName: currentType.name,
          price: selectedType === 'canvas' ? currentSize.canvasPrice : currentSize.price
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
          
          {/* FIXED Image Section - NO CROPPING, Natural Aspect Ratio */}
          <div className="lg:col-span-4 mr-8">
            {/* Multiple Images Gallery Container - COMPLETELY CLEAN */}
            <div className="space-y-6">
              {/* Main Image Display with Navigation - NO FRAMES, NO CROPPING */}
              <div className="relative group">
                <div className="w-full max-w-2xl mx-auto">
                  {/* FIXED: Removed aspect-square, added max-h-[600px] for reasonable height limit */}
                  <div className="w-full relative overflow-hidden bg-gray-50" style={{ maxHeight: '600px' }}>
                    {currentImageUrl ? (
                      <>
                        {/* FIXED: Changed from object-cover to object-contain to show full image */}
                        <Image
                          src={currentImageUrl}
                          alt={`${artwork.title} - Image ${currentImageIndex + 1}`}
                          width={800}
                          height={600}
                          className={`transition-all duration-700 w-full h-auto object-contain group-hover:scale-[1.01] ${
                            imageLoaded ? 'opacity-100' : 'opacity-0'
                          }`}
                          style={{ 
                            userSelect: 'none',
                            WebkitUserDrag: 'none',
                            pointerEvents: 'none',
                            maxHeight: '600px'
                          } as React.CSSProperties & { WebkitUserDrag: string }}
                          onLoad={() => setImageLoaded(true)}
                          onContextMenu={(e) => e.preventDefault()}
                          draggable={false}
                          priority
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        
                        {/* Loading state */}
                        {!imageLoaded && (
                          <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
                            <div className="text-gray-400 text-sm">Loading...</div>
                          </div>
                        )}

                        {/* Navigation Arrows - Only show if multiple images */}
                        {hasMultipleImages && (
                          <>
                            <button
                              onClick={prevImage}
                              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                              aria-label="Previous image"
                            >
                              <ChevronLeft className="h-6 w-6 text-gray-900" />
                            </button>

                            <button
                              onClick={nextImage}
                              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                              aria-label="Next image"
                            >
                              <ChevronRight className="h-6 w-6 text-gray-900" />
                            </button>

                            {/* Image Counter */}
                            <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                              {currentImageIndex + 1} / {availableImages.length}
                            </div>
                          </>
                        )}

                        {/* Wishlist button overlay */}
                        <button
                          onClick={handleWishlist}
                          className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                          title={isInWishlist_Print ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-sm">
                            <Heart
                              className={`h-5 w-5 transition-colors duration-200 ${
                                isInWishlist_Print 
                                  ? 'text-red-900 fill-current' 
                                  : 'text-gray-700 hover:text-red-900'
                              }`}
                            />
                          </div>
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-6xl mb-4">🖼️</div>
                          <p className="text-gray-500 text-lg">No image available</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Image Thumbnails - Only show if multiple images */}
              {hasMultipleImages && (
                <div className="w-full max-w-2xl mx-auto">
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                    {availableImages.map((imageUrl, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 ${
                          index === currentImageIndex
                            ? 'ring-2 ring-red-900 ring-offset-2 shadow-lg'
                            : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <Image
                          src={imageUrl}
                          alt={`${artwork.title} - Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100px"
                          draggable={false}
                        />
                        {/* Thumbnail overlay for current image */}
                        {index === currentImageIndex && (
                          <div className="absolute inset-0 bg-red-900/10" />
                        )}
                      </button>
                    ))}
                  </div>

                </div>
              )}
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

          {/* COMPACT BUYING SECTION - Fits in viewport */}
          <div className="lg:col-span-3 ml-8">
            
            {/* Header - Compact */}
            <div className="mb-4">
              <h1 className="text-3xl font-serif font-light text-gray-900 mb-2">
                {artwork.title}
              </h1>
              <p className="text-lg font-serif text-gray-600 mb-1">
                Fine Art Print by {artwork.artist}
              </p>
              {artwork.year && (
                <p className="text-sm font-serif text-gray-500">{artwork.year}</p>
              )}
            </div>

            {/* COMPACT BUYING FORM */}
            <div className="space-y-3">
              
              {/* Print Type Selection - Compact Buttons with Popular in Right Corner */}
              <div>
                <h3 className="font-serif font-medium text-gray-900 mb-2 text-lg">Print Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  {printTypes.map((type) => (
                    <div key={type.id} className="relative">
                      {type.popular && (
                        <span className="absolute -top-2 -right-2 bg-red-900 text-white text-xs px-2 py-0.5 rounded font-serif z-10">
                          Popular
                        </span>
                      )}
                      <button
                        onClick={() => setSelectedType(type.id)}
                        className={`w-full p-2.5 border-2 rounded-lg text-center transition-all ${
                          selectedType === type.id
                            ? 'border-red-900 bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-serif font-medium text-gray-900 text-base">
                          {type.name}
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Size & Quantity - Dropdown Layout with Dark Red Borders */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-serif font-medium text-gray-900 mb-1.5 text-base">Size</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-red-900 font-serif text-base"
                  >
                    {printSizes.map((size) => (
                      <option key={size.id} value={size.id}>
                        {size.name} - {size.dimensions}{size.popular ? ' (Popular)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block font-serif font-medium text-gray-900 mb-1.5 text-base">Quantity</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    disabled={isAdding}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-red-900 font-serif text-base disabled:opacity-50"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price Display - Prominent */}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-serif text-gray-600">
                      {currentType?.name} • {currentSize?.name}
                    </p>
                    <p className="text-sm font-serif text-gray-500">
                      {currentSize?.dimensions}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-serif font-medium text-gray-900">
                      {currentPrice} SEK
                    </p>
                    <p className="text-sm font-serif text-gray-600">
                      Tax included
                    </p>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button - Prominent */}
              <button
                onClick={handleAddToCart}
                disabled={isAdding || !currentImageUrl}
                className={`w-full py-4 rounded-lg font-serif font-medium text-base transition-all duration-200 flex items-center justify-center space-x-2 ${
                  wasJustAdded && !isAdding
                    ? 'bg-green-600 text-white'
                    : isAdding
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : !currentImageUrl
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-red-900 text-white hover:bg-red-800 shadow-sm hover:shadow-md'
                }`}
              >
                {isAdding ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Adding to Cart...</span>
                  </>
                ) : wasJustAdded ? (
                  <>
                    <Check className="h-5 w-5" />
                    <span>Added to Cart!</span>
                  </>
                ) : !currentImageUrl ? (
                  <>
                    <span>No Image Available</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              {/* Action Buttons After Add to Cart */}
              {wasJustAdded && !isAdding && (
                <div className="flex space-x-3">
                  <button
                    onClick={handleViewCart}
                    className="flex-1 py-3 border-2 border-red-900 text-red-900 font-serif font-medium hover:bg-red-900 hover:text-white transition-colors rounded-lg flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>View Cart</span>
                  </button>
                  <Link
                    href="/gallery"
                    className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-serif font-medium hover:bg-gray-50 transition-colors rounded-lg text-center"
                  >
                    Continue Shopping
                  </Link>
                </div>
              )}

            </div>

            {/* Compact Information Dropdowns - Below main buying section */}
            <div className="mt-6 space-y-2">
              
              {/* Materials & Specifications Dropdown */}
              <details className="border border-gray-200 rounded-lg">
                <summary className="cursor-pointer p-3 font-serif font-medium text-gray-900 hover:bg-gray-50 transition-colors text-lg">
                  Materials & Specifications
                </summary>
                <div className="p-3 pt-0 space-y-3 font-serif text-gray-700">
                  <div>
                    <p className="text-gray-800 leading-relaxed mb-2 text-lg">
                      <strong>Paper prints</strong> use museum-quality Enhanced Matte Paper with multicolor, 
                      water-based inkjet printing technology for brilliant color reproduction.
                    </p>
                    <p className="text-gray-800 leading-relaxed text-lg">
                      <strong>Canvas prints</strong> are printed on premium textured, fade-resistant canvas that creates 
                      gallery-ready artwork with substantial depth and professional presentation.
                    </p>
                  </div>
                </div>
              </details>

              {/* Size Guide Dropdown */}
              <details className="border border-gray-200 rounded-lg">
                <summary className="cursor-pointer p-3 font-serif font-medium text-gray-900 hover:bg-gray-50 transition-colors text-lg">
                  Size Guide & Dimensions
                </summary>
                <div className="p-3 pt-0 space-y-2 text-lg font-serif text-gray-700">
                  <div className="grid grid-cols-1 gap-1.5">
                    <p><strong>A4</strong> - 21 x 30 cm (8.3 x 11.7 in)</p>
                    <p><strong>A3</strong> - 30 x 40 cm (11.7 x 16.5 in)</p>
                    <p><strong>A2</strong> - 42 x 59.4 cm (16.5 x 23.4 in)</p>
                    <p><strong>A1</strong> - 59.4 x 84.1 cm (23.4 x 33.1 in)</p>
                  </div>
                  <p className="text-gray-600 text-base border-t pt-2">
                    <strong>Note:</strong> Paper poster sizes may vary up to 0.4″ (1 cm) due to production specifications.
                  </p>
                </div>
              </details>

              {/* Shipping & Production Dropdown */}
              <details className="border border-gray-200 rounded-lg">
                <summary className="cursor-pointer p-3 font-serif font-medium text-gray-900 hover:bg-gray-50 transition-colors text-lg">
                  Shipping & Production Times
                </summary>
                <div className="p-3 pt-0 space-y-2 text-lg font-serif text-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <p className="font-medium text-gray-800 mb-1.5">Production Times:</p>
                      <ul className="list-disc ml-4 space-y-1 text-base">
                        <li><strong>Enhanced Matte Paper:</strong> 4-5 business days</li>
                        <li><strong>Canvas prints:</strong> 9-16 business days</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-800 mb-1.5">Shipping to Sweden:</p>
                      <ul className="list-disc ml-4 space-y-1 text-base">
                        <li><strong>Paper prints:</strong> Additional 3-5 days (Free shipping)</li>
                        <li><strong>Canvas prints:</strong> Additional shipping time (588 SEK shipping cost)</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-t pt-2">
                    <p className="font-medium text-gray-800 mb-1">Total Delivery Time:</p>
                    <p className="text-base text-gray-600">
                      <strong>Paper prints:</strong> 7-10 business days • 
                      <strong>Canvas prints:</strong> 2-3 weeks total
                    </p>
                  </div>
                  
                  <p className="text-gray-600 text-base border-t pt-1.5">
                    All orders include secure packaging, insured shipping, and tracking information.
                  </p>
                </div>
              </details>

              {/* Quality Guarantee Dropdown */}
              <details className="border border-gray-200 rounded-lg">
                <summary className="cursor-pointer p-3 font-serif font-medium text-gray-900 hover:bg-gray-50 transition-colors text-lg">
                  Quality Guarantee & Certificate
                </summary>
                <div className="p-3 pt-0 space-y-2 text-lg font-serif text-gray-700">
                  <p>
                    We guarantee museum-quality prints with premium materials and professional printing technology. 
                    30-day satisfaction guarantee - if you're not completely happy, we'll make it right.
                  </p>
                  
                  <div>
                    <p className="font-medium text-gray-800 mb-1">What's Included:</p>
                    <ul className="list-disc ml-4 space-y-1 text-base">
                      <li>Certificate of authenticity signed by the artist</li>
                      <li>Premium print-on-demand with no minimums</li>
                      <li>Professional secure packaging</li>
                      <li>Tracking information for all orders</li>
                      <li>30-day quality guarantee</li>
                    </ul>
                  </div>
                </div>
              </details>

            </div>

          </div>
        </div>

        {/* Room Gallery Section - See It In Your Space */}
        <div className="mt-20 border-t border-gray-100 pt-16">
          {currentImageUrl && (
            <ArtworkRoomGallery 
              artworkImageUrl={currentImageUrl}
              artworkTitle={artwork.title}
            />
          )}
        </div>
      </div>
    </div>
  );
}