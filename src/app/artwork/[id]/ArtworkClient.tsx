// Enhanced src/app/artwork/[id]/ArtworkClient.tsx (With Red Theme and Fixed Wishlist)

'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';
import { ArrowLeft, Mail, ShoppingCart, Heart, Share2, Check, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Toast from '@/components/ui/Toast'; // NEW: Import toast component

// Updated interface to match your flexible artwork system
interface Artwork {
  id: string;
  title: string;
  artist: string;
  price?: number; // Optional for enquire-only pieces
  imageUrl: string;
  description?: string; // Optional
  medium?: string; // Optional
  dimensions?: string; // Optional
  category?: string; // Optional
  year?: number; // Optional
  availabilityType?: 'for-sale' | 'enquire-only' | 'exhibition' | 'commissioned' | 'sold';
  inStock?: boolean; // Optional
}

interface ArtworkClientProps {
  artwork: Artwork;
}

export default function ArtworkClient({ artwork }: ArtworkClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // NEW: Toast notification states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Enhanced cart store usage
  const { addItem, isAdding, lastAddedItem, clearLastAdded, openCart } = useCartStore();

  // Fixed wishlist store usage
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

  // Check if artwork is in wishlist
  const isWishlisted = artwork ? isInWishlist(artwork.id) : false;

  // Safety check - if artwork is undefined, show error
  if (!artwork) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-light text-gray-900 mb-4">Artwork Not Found</h1>
          <p className="text-gray-600 font-serif">The artwork you're looking for doesn't exist.</p>
          <Link 
            href="/gallery" 
            className="inline-block mt-6 text-red-900 font-serif font-medium border-b border-red-300 hover:border-red-700 pb-1 transition-colors"
          >
            ← Back to Gallery
          </Link>
        </div>
      </div>
    );
  }
  
  const availabilityType = artwork.availabilityType || 'for-sale';

  // Enhanced handleAddToCart with feedback
  const handleAddToCart = () => {
    if (availabilityType === 'for-sale' && artwork.price) {
      // Convert flexible artwork to cart-compatible format (keeping your exact structure)
      const cartArtwork = {
        id: artwork.id,
        title: artwork.title,
        artist: artwork.artist,
        price: artwork.price, // TypeScript now knows this exists due to the check above
        imageUrl: artwork.imageUrl,
        description: artwork.description || '',
        medium: artwork.medium || '',
        dimensions: artwork.dimensions || '',
        category: artwork.category || '',
        year: artwork.year || new Date().getFullYear(),
        inStock: artwork.inStock !== false,
      };
      
      addItem(cartArtwork, quantity);
      
      // NEW: Show success toast
      setToastMessage(`"${artwork.title}" added to cart!`);
      setShowToast(true);
      
      // Clear last added after showing toast
      setTimeout(() => {
        clearLastAdded();
      }, 3000);
    }
  };

  // NEW: Handle view cart
  const handleViewCart = () => {
    openCart();
  };

  // Check if this item was just added
  const wasJustAdded = lastAddedItem === artwork.id;

  const handleContactInquiry = () => {
    const subject = `Inquiry about "${artwork.title}"`;
    const body = `Hello Aja,\n\nI'm interested in learning more about "${artwork.title}"${artwork.year ? ` (${artwork.year})` : ''}.\n\nThank you for your time.\n\nBest regards`;
    
    try {
      // Try mailto first
      const mailtoLink = `mailto:ajaeriksson@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Create a temporary link and click it
      const link = document.createElement('a');
      link.href = mailtoLink;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show confirmation toast
      setToastMessage('Opening your email client...');
      setShowToast(true);
      
    } catch (error) {
      console.error('Error opening email:', error);
      // Fallback: copy email to clipboard and show instructions
      navigator.clipboard.writeText('ajaeriksson@gmail.com').then(() => {
        setToastMessage('Email address copied to clipboard!');
        setShowToast(true);
      }).catch(() => {
        setToastMessage('Please contact: ajaeriksson@gmail.com');
        setShowToast(true);
      });
    }
  };

  // Fixed wishlist handling using wishlist store
  const handleWishlist = () => {
    if (!artwork) return;
    
    if (isWishlisted) {
      // Remove from wishlist
      removeFromWishlist(artwork.id);
      setToastMessage('Removed from wishlist');
    } else {
      // Add to wishlist
      const wishlistItem = {
        id: artwork.id,
        title: artwork.title,
        artist: artwork.artist,
        imageUrl: artwork.imageUrl,
        price: artwork.price,
        availabilityType: artwork.availabilityType
      };
      addToWishlist(wishlistItem);
      setToastMessage('Added to wishlist!');
    }
    
    setShowToast(true);
  };

  const handleShare = async () => {
    if (!artwork) return;

    const shareData = {
      title: `${artwork.title} - ${artwork.artist}`,
      text: `Check out this artwork: "${artwork.title}" by ${artwork.artist}`,
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

  const getAvailabilityInfo = () => {
    switch (availabilityType) {
      case 'enquire-only':
        return { 
          text: 'Contact for Price', 
          description: 'This piece is available through direct inquiry with the artist.',
          action: 'Contact Artist'
        };
      case 'exhibition':
        return { 
          text: 'Exhibition Piece', 
          description: 'Currently on display as part of a curated exhibition.',
          action: 'Inquire About Viewing'
        };
      case 'commissioned':
        return { 
          text: 'Commissioned Work', 
          description: 'This piece was created as a commissioned artwork.',
          action: 'Commission Similar Work'
        };
      case 'sold':
        return { 
          text: 'Sold', 
          description: 'This artwork has been sold and is no longer available.',
          action: null
        };
      default:
        return { 
          text: artwork.price ? `${artwork.price.toLocaleString()} SEK` : 'Price Available', 
          description: 'This original artwork is available for purchase.',
          action: 'Add to Cart'
        };
    }
  };

  const availability = getAvailabilityInfo();

  return (
    <div className="min-h-screen bg-white">
      {/* NEW: Toast Notification */}
      <Toast
        message={toastMessage}
        type="success"
        show={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Back Navigation */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link 
            href="/gallery" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-serif transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Gallery
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Section with Custom Frame */}
          <div className="space-y-6">
            {/* Custom Framed Image - Maintains Natural Aspect Ratio */}
            <div className="inline-block">
              <div className="p-3 shadow-xl border-2 group-hover:shadow-2xl transition-shadow duration-300" style={{ backgroundColor: '#f6dfb3', borderColor: '#e6cfb3' }}>
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

            {/* Artwork Info */}
            <div className="space-y-3 text-sm font-serif text-gray-600">
              {artwork.medium && (
                <p><span className="font-medium">Medium:</span> {artwork.medium}</p>
              )}
              {artwork.dimensions && (
                <p><span className="font-medium">Dimensions:</span> {artwork.dimensions}</p>
              )}
              {artwork.year && (
                <p><span className="font-medium">Year:</span> {artwork.year}</p>
              )}
              {artwork.category && (
                <p><span className="font-medium">Category:</span> {artwork.category}</p>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-8 lg:pl-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-serif font-light text-gray-900 leading-tight">
                {artwork.title}
              </h1>
              <p className="text-xl font-serif text-gray-600">
                by {artwork.artist}
              </p>
            </div>

            {/* Availability & Price */}
            <div className="space-y-4">
              <div className="text-2xl font-serif font-medium text-gray-900">
                {availability.text}
              </div>
              <p className="text-gray-600 font-serif leading-relaxed">
                {availability.description}
              </p>
            </div>

            {/* Description */}
            {artwork.description && (
              <div className="space-y-4">
                <h3 className="text-lg font-serif font-medium text-gray-900">
                  About this work
                </h3>
                <p className="text-gray-700 font-serif leading-relaxed text-lg">
                  {artwork.description}
                </p>
              </div>
            )}

            {/* Enhanced Action Section */}
            <div className="space-y-6">
              {availabilityType === 'for-sale' && artwork.price && artwork.inStock !== false ? (
                <div className="space-y-4">
                  {/* Quantity Selector - Only show for for-sale items */}
                  <div className="flex items-center space-x-4">
                    <label htmlFor="quantity" className="text-sm font-serif font-medium text-gray-700">
                      Quantity:
                    </label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="border border-gray-200 rounded px-3 py-2 bg-white focus:ring-2 focus:ring-red-900 focus:border-transparent font-serif text-sm"
                      disabled={isAdding}
                    >
                      {[1, 2, 3].map((num) => (
                        <option key={num} value={num}>
                          {num}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-4">
                    {/* Enhanced Add to Cart Button - Red Theme */}
                    <button
                      onClick={handleAddToCart}
                      disabled={isAdding}
                      className={`flex-1 py-4 px-8 font-serif font-medium text-lg transition-all duration-200 flex items-center justify-center space-x-3 ${
                        wasJustAdded && !isAdding
                          ? 'bg-green-600 text-white'
                          : isAdding
                          ? 'bg-gray-400 text-white cursor-not-allowed'
                          : 'bg-red-900 text-white hover:bg-red-800'
                      }`}
                    >
                      {isAdding ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Adding...</span>
                        </>
                      ) : wasJustAdded ? (
                        <>
                          <Check className="h-5 w-5" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-5 w-5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    {/* View Cart Button - Red Theme */}
                    {wasJustAdded && !isAdding && (
                      <button
                        onClick={handleViewCart}
                        className="px-6 py-4 border-2 border-red-900 text-red-900 font-serif font-medium hover:bg-red-900 hover:text-white transition-colors"
                      >
                        View Cart
                      </button>
                    )}

                    <button
                      onClick={handleWishlist}
                      className={`p-4 transition-colors ${
                        isWishlisted
                          ? 'bg-red-900 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={handleShare}
                      className="p-4 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                availabilityType !== 'sold' && (
                  <div className="space-y-4">
                    <button
                      onClick={handleContactInquiry}
                      className="w-full bg-red-900 text-white py-4 px-8 font-serif font-medium text-lg hover:bg-red-800 transition-colors flex items-center justify-center space-x-3"
                    >
                      <Mail className="h-5 w-5" />
                      <span>{availability.action}</span>
                    </button>

                    <div className="flex space-x-4">
                      <button
                        onClick={handleWishlist}
                        className={`flex-1 p-4 transition-colors ${
                          isWishlisted
                            ? 'bg-red-900 text-white'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Heart className={`h-5 w-5 mx-auto ${isWishlisted ? 'fill-current' : ''}`} />
                      </button>

                      <button
                        onClick={handleShare}
                        className="flex-1 p-4 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <Share2 className="h-5 w-5 mx-auto" />
                      </button>
                    </div>
                  </div>
                )
              )}

              {/* Additional Contact Option */}
              {availabilityType !== 'sold' && (
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-sm font-serif text-gray-600 mb-4">
                    Have questions about this piece? Contact the artist directly.
                  </p>
                  <button
                    onClick={handleContactInquiry}
                    className="text-red-900 font-serif font-medium hover:text-red-700 transition-colors border-b border-red-300 hover:border-red-700 pb-1"
                  >
                    Send Inquiry
                  </button>
                </div>
              )}

              {/* Sold Notice */}
              {availabilityType === 'sold' && (
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-sm font-serif text-gray-600">
                    This artwork has found its home. Contact the artist about commissioning a similar piece.
                  </p>
                  <button
                    onClick={handleContactInquiry}
                    className="mt-4 text-red-900 font-serif font-medium hover:text-red-700 transition-colors border-b border-red-300 hover:border-red-700 pb-1"
                  >
                    Commission Similar Work
                  </button>
                </div>
              )}
            </div>

            {/* Detailed Product Information Dropdowns */}
            <div className="pt-6 border-t border-gray-100 space-y-4">
              {/* Product Details Dropdown */}
              <details className="border border-gray-200 rounded-lg">
                <summary className="cursor-pointer p-4 font-serif font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  Product Details
                </summary>
                <div className="p-4 pt-0 space-y-3 text-sm font-serif text-gray-600">
                  <p>
                    <strong>Original artwork by Aja Eriksson von Weissenberg</strong> painted with {artwork.medium || 'high quality paints'} on premium canvas.
                  </p>
                  {artwork.dimensions && (
                    <p>Artwork dimensions: {artwork.dimensions}</p>
                  )}
                  <p>
                    All original artworks are professionally framed and come ready to hang with appropriate hanging hardware included.
                  </p>
                  <p>
                    Price includes VAT/Tax. {availabilityType === 'for-sale' && artwork.inStock === false && (
                      <span className="text-red-600 font-medium">Currently sold out.</span>
                    )}
                  </p>
                  <p>
                    Each artwork is signed by the artist and comes with detailed provenance documentation.
                  </p>
                </div>
              </details>

              {/* Certificate & Authenticity Dropdown */}
              <details className="border border-gray-200 rounded-lg">
                <summary className="cursor-pointer p-4 font-serif font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  Certificate of Authenticity
                </summary>
                <div className="p-4 pt-0 space-y-3 text-sm font-serif text-gray-600">
                  <p>
                    All original artworks come signed with the name of the painting, date, and artist's signature on the back of the canvas.
                  </p>
                  <p>
                    Each piece includes a certificate of authenticity from the artist, documenting its provenance and ensuring its value as an investment piece.
                  </p>
                  <p>
                    The certificate includes detailed information about the artwork's creation, materials used, and verification of its authenticity.
                  </p>
                </div>
              </details>

              {/* Shipping & Returns Dropdown */}
              <details className="border border-gray-200 rounded-lg">
                <summary className="cursor-pointer p-4 font-serif font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  Shipping & Returns
                </summary>
                <div className="p-4 pt-0 space-y-3 text-sm font-serif text-gray-600">
                  <p>
                    <strong>Shipping:</strong> Please note shipping is an added cost depending on your location. 
                    Once you have purchased your artwork we will be in touch with shipping details and costs.
                  </p>
                  <p>
                    All original artworks are carefully packaged with professional art shipping materials to ensure safe delivery.
                  </p>
                  <p>
                    <strong>International Shipping:</strong> Original artworks are available for international delivery. 
                    For international customers, please contact ajaeriksson@gmail.com for shipping quotes and arrangements.
                  </p>
                  <p>
                    <strong>Returns:</strong> Original artwork sales are final and cannot be refunded or exchanged due to the unique nature of original art pieces.
                  </p>
                  <p>
                    For any concerns about your artwork upon delivery, please contact us within 48 hours of receipt.
                  </p>
                </div>
              </details>

              {/* Artist Rights & Reproduction Dropdown */}
              <details className="border border-gray-200 rounded-lg">
                <summary className="cursor-pointer p-4 font-serif font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  Artist Rights & Reproduction
                </summary>
                <div className="p-4 pt-0 space-y-3 text-sm font-serif text-gray-600">
                  <p>
                    The artist reserves the right to reproduce this artwork at any time for print purposes.
                  </p>
                  <p>
                    Original artworks have been professionally photographed and may be reproduced as limited edition prints.
                  </p>
                  <p>
                    All artist rights remain with Aja Eriksson von Weissenberg. Purchase of original artwork does not transfer reproduction rights.
                  </p>
                  <p>
                    The artist retains copyright and intellectual property rights to all original works and their reproductions.
                  </p>
                </div>
              </details>

              {/* Materials & Care Dropdown */}
              <details className="border border-gray-200 rounded-lg">
                <summary className="cursor-pointer p-4 font-serif font-medium text-gray-900 hover:bg-gray-50 transition-colors">
                  Materials & Care Instructions
                </summary>
                <div className="p-4 pt-0 space-y-3 text-sm font-serif text-gray-600">
                  <p>
                    <strong>Materials:</strong> This original artwork has been painted with {artwork.medium || 'professional grade paints'} on high quality canvas.
                  </p>
                  <p>
                    <strong>Frame:</strong> Original works are professionally framed and ready to hang with appropriate mounting hardware.
                  </p>
                  <p>
                    <strong>Care:</strong> To preserve your artwork, avoid direct sunlight and extreme temperature changes. 
                    Clean frame with a soft, dry cloth only.
                  </p>
                  <p>
                    <strong>Hanging:</strong> Artwork comes ready to hang with appropriate hardware. 
                    For large pieces, ensure proper wall anchoring for the weight.
                  </p>
                  <p>
                    For any questions about care or maintenance, please contact the artist directly.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* Print Options Section - Enhanced */}
        <div className="mt-20 border-t border-gray-100 pt-16">
          <div className="bg-gray-50 rounded-lg p-8 lg:p-12">
            <div className="max-w-4xl">
              <h3 className="text-3xl font-serif font-light text-gray-900 mb-6">
                Also Available as Fine Art Prints
              </h3>
              
              <p className="text-lg font-serif text-gray-700 mb-10 leading-relaxed">
                Bring this beautiful artwork into your home with museum-quality prints. 
                Each print is carefully produced using archival inks on premium papers and canvases.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Paper Prints */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xl font-serif font-medium text-gray-900">Paper Prints</h4>
                    <span className="bg-red-900 text-white text-xs px-3 py-1 rounded font-serif">Popular</span>
                  </div>
                  <p className="text-sm font-serif text-gray-600 mb-6">
                    310gsm textured cotton rag, museum-grade archival paper with matte finish
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-serif">
                      <span className="text-gray-600">A4 (21 x 29.7 cm)</span>
                      <span className="text-gray-900 font-medium">450 SEK</span>
                    </div>
                    <div className="flex justify-between text-sm font-serif">
                      <span className="text-gray-600">A3 (29.7 x 42 cm)</span>
                      <span className="text-gray-900 font-medium">650 SEK</span>
                    </div>
                    <div className="flex justify-between text-sm font-serif">
                      <span className="text-gray-600">A2 (42 x 59.4 cm)</span>
                      <span className="text-gray-900 font-medium">950 SEK</span>
                    </div>
                  </div>
                </div>

                {/* Canvas Prints */}
                <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-gray-300 transition-colors">
                  <h4 className="text-xl font-serif font-medium text-gray-900 mb-4">Canvas Prints</h4>
                  <p className="text-sm font-serif text-gray-600 mb-6">
                    340gsm artist canvas, poly-cotton with 5cm border for stretching
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm font-serif">
                      <span className="text-gray-600">A4 (21 x 29.7 cm)</span>
                      <span className="text-gray-900 font-medium">720 SEK</span>
                    </div>
                    <div className="flex justify-between text-sm font-serif">
                      <span className="text-gray-600">A3 (29.7 x 42 cm)</span>
                      <span className="text-gray-900 font-medium">1,040 SEK</span>
                    </div>
                    <div className="flex justify-between text-sm font-serif">
                      <span className="text-gray-600">A2 (42 x 59.4 cm)</span>
                      <span className="text-gray-900 font-medium">1,520 SEK</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 items-start">
                <Link
                  href={`/artwork/${artwork.id}/print`}
                  className="bg-red-900 text-white px-10 py-4 font-serif font-medium hover:bg-red-800 transition-colors text-center rounded-lg inline-block text-lg"
                >
                  Shop Prints & Choose Size
                </Link>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-6 text-sm font-serif text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      </div>
                      <span>Free shipping over 200 EUR</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                      <span>30-day return policy</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-100 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      </div>
                      <span>Certificate of authenticity included</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}