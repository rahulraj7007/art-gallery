// Compact Print Page - Dropdown-Based Buying Section
// Updated /app/artwork/[id]/print/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
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

  // Update selectedType when URL parameter changes
  useEffect(() => {
    if (typeParam === 'canvas' || typeParam === 'paper') {
      setSelectedType(typeParam);
    }
  }, [typeParam]);

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
          
          {/* Product Image with Natural Aspect Ratio */}
          <div className="lg:col-span-4 mr-8">
            {/* Custom Framed Image - Same as Artwork Page */}
            <div className="inline-block">
              <div className="p-4 shadow-xl border-2 group-hover:shadow-2xl transition-shadow duration-300" style={{ backgroundColor: '#f6dfb3', borderColor: '#e6cfb3' }}>
                <div className="relative inline-block overflow-hidden">
                  <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    width={600}
                    height={600}
                    className={`transition-all duration-700 max-w-full h-auto ${
                      imageLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ maxHeight: '70vh' }}
                    onLoad={() => setImageLoaded(true)}
                    priority
                  />
                  
                  {/* Loading state */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse min-h-[400px]" />
                  )}
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

          {/* COMPACT BUYING SECTION - Fits in viewport */}
          <div className="lg:col-span-3 ml-8">
            
            {/* Header - Compact */}
            <div className="mb-6">
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
              
              {/* Print Type Selection - Compact Buttons */}
              <div>
                <h3 className="font-serif font-medium text-gray-900 mb-2 text-lg">Print Type</h3>
                <div className="grid grid-cols-2 gap-2">
                  {printTypes.map((type) => (
                    <div key={type.id} className="relative">
                      {type.popular && (
                        <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-red-900 text-white text-xs px-2 py-0.5 rounded font-serif z-10">
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

              {/* Size & Quantity - Dropdown Layout */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-serif font-medium text-gray-900 mb-1.5 text-base">Size</label>
                  <select
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-serif text-base"
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
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-serif text-base disabled:opacity-50"
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
                disabled={isAdding}
                className={`w-full py-4 rounded-lg font-serif font-medium text-base transition-all duration-200 flex items-center justify-center space-x-2 ${
                  wasJustAdded && !isAdding
                    ? 'bg-green-600 text-white'
                    : isAdding
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

              {/* Delivery Summary - Compact */}
              <div className="border-t border-gray-200 pt-3 space-y-1.5">
                <div className="flex items-center space-x-2 text-base text-gray-600 font-serif">
                  <Truck className="h-4 w-4" />
                  <span>
                    {selectedType === 'canvas' ? 
                      '2-3 weeks delivery • 588 SEK shipping' : 
                      '7-10 business days • Free shipping to Sweden'
                    }
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-base text-gray-600 font-serif">
                  <Shield className="h-4 w-4" />
                  <span>30-day quality guarantee • Certificate included</span>
                </div>
              </div>

            </div>

            {/* Compact Information Dropdowns - Below main buying section */}
            <div className="mt-8 space-y-3">
              
              {/* Materials & Specifications Dropdown */}
              <details className="border border-gray-200 rounded-lg">
                <summary className="cursor-pointer p-4 font-serif font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  Materials & Specifications
                </summary>
                <div className="p-4 pt-0 space-y-4 text-sm font-serif text-gray-700">
                  <div>
                    <p className="text-gray-800 leading-relaxed mb-3">
                      <strong>Paper prints</strong> use museum-quality Enhanced Matte Paper with multicolor, 
                      water-based inkjet printing technology for brilliant color reproduction.
                    </p>
                    <p className="text-gray-800 leading-relaxed">
                      <strong>Canvas prints</strong> are printed on premium textured, fade-resistant canvas that creates 
                      gallery-ready artwork with substantial depth and professional presentation.
                    </p>
                  </div>
                  {/*
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-800 mb-2">Enhanced Matte Paper:</p>
                      <ul className="list-disc ml-4 space-y-1 text-xs">
                        <li>Paper weight: 189 g/m²</li>
                        <li>Paper thickness: 10.3 mil (0.26 mm)</li>
                        <li>Opacity: 94% (excellent print clarity)</li>
                        <li>ISO brightness: 104% (vibrant colors)</li>
                        <li>Sourced from Japan (premium quality)</li>
                        <li>Multicolor, water-based inkjet printing</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-800 mb-2">Canvas:</p>
                      <ul className="list-disc ml-4 space-y-1 text-xs">
                        <li>Canvas thickness: 1.25″ (3.18 cm)</li>
                        <li>Fabric weight: 344 g/m² (±25g/m²)</li>
                        <li>Textured, fade-resistant canvas (OBA-Free)</li>
                        <li>Hand-glued solid wood stretcher bars</li>
                        <li>Mounting brackets included - ready to hang</li>
                        <li>Acid-free, pH-neutral for archival quality</li>
                      </ul>
                    </div>
                  </div>
                  */}
                </div>
              </details>

              {/* Size Guide Dropdown */}
              <details className="border border-gray-200 rounded-lg">
                <summary className="cursor-pointer p-4 font-serif font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  Size Guide & Dimensions
                </summary>
                <div className="p-4 pt-0 space-y-3 text-sm font-serif text-gray-700">
                  <div className="grid grid-cols-1 gap-2">
                    <p><strong>A4</strong> - 21 x 30 cm (8.3 x 11.7 in)</p>
                    <p><strong>A3</strong> - 30 x 40 cm (11.7 x 16.5 in)</p>
                    <p><strong>A2</strong> - 42 x 59.4 cm (16.5 x 23.4 in)</p>
                    <p><strong>A1</strong> - 59.4 x 84.1 cm (23.4 x 33.1 in)</p>
                  </div>
                  <p className="text-gray-600 text-xs border-t pt-2">
                    <strong>Note:</strong> Paper poster sizes may vary up to 0.4″ (1 cm) due to production specifications.
                  </p>
                </div>
              </details>

              {/* Shipping & Production Dropdown */}
              <details className="border border-gray-200 rounded-lg">
                <summary className="cursor-pointer p-4 font-serif font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  Shipping & Production Times
                </summary>
                <div className="p-4 pt-0 space-y-3 text-sm font-serif text-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-medium text-gray-800 mb-2">Production Times:</p>
                      <ul className="list-disc ml-4 space-y-1 text-xs">
                        <li><strong>Enhanced Matte Paper:</strong> 4-5 business days</li>
                        <li><strong>Canvas prints:</strong> 9-16 business days</li>
                      </ul>
                    </div>
                    
                    <div>
                      <p className="font-medium text-gray-800 mb-2">Shipping to Sweden:</p>
                      <ul className="list-disc ml-4 space-y-1 text-xs">
                        <li><strong>Paper prints:</strong> Additional 3-5 days (Free shipping)</li>
                        <li><strong>Canvas prints:</strong> Additional shipping time (588 SEK shipping cost)</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-t pt-3">
                    <p className="font-medium text-gray-800 mb-1">Total Delivery Time:</p>
                    <p className="text-xs text-gray-600">
                      <strong>Paper prints:</strong> 7-10 business days • 
                      <strong>Canvas prints:</strong> 2-3 weeks total
                    </p>
                  </div>
                  
                  <p className="text-gray-600 text-xs border-t pt-2">
                    All orders include secure packaging, insured shipping, and tracking information.
                  </p>
                </div>
              </details>

              {/* Quality Guarantee Dropdown */}
              <details className="border border-gray-200 rounded-lg">
                <summary className="cursor-pointer p-4 font-serif font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  Quality Guarantee & Certificate
                </summary>
                <div className="p-4 pt-0 space-y-3 text-sm font-serif text-gray-700">
                  <p>
                    We guarantee museum-quality prints with premium materials and professional printing technology. 
                    30-day satisfaction guarantee - if you're not completely happy, we'll make it right.
                  </p>
                  
                  <div>
                    <p className="font-medium text-gray-800 mb-1">What's Included:</p>
                    <ul className="list-disc ml-4 space-y-1 text-xs">
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
      </div>
    </div>
  );
}