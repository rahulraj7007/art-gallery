// Enhanced src/components/layout/Header.tsx (With Fixed Shop Links)

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, ShoppingBag, User, LogOut, Settings, Package, ChevronDown, Heart } from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/auth/AuthContext';
import { useCartStore } from '@/lib/store/cartStore';
import { useWishlistStore } from '@/lib/store/wishlistStore';

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
  collection?: string;
}

interface CollectionGroup {
  name: string;
  count: number;
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [isCollectionsMenuOpen, setIsCollectionsMenuOpen] = useState(false);
  const [shopHoverTimeout, setShopHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [collectionsHoverTimeout, setCollectionsHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Collections state
  const [collections, setCollections] = useState<CollectionGroup[]>([]);
  const [collectionsLoading, setCollectionsLoading] = useState(false);
  
  // Animation states for cart and wishlist icons
  const [cartAnimate, setCartAnimate] = useState(false);
  const [wishlistAnimate, setWishlistAnimate] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const shopMenuRef = useRef<HTMLDivElement>(null);
  const collectionsMenuRef = useRef<HTMLDivElement>(null);
  
  const { user, userProfile, logout, isAdmin } = useAuth();
  const router = useRouter();
  
  // Cart store usage
  const { items: cartItems, toggleCart, lastAddedItem } = useCartStore();
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Wishlist store usage
  const { 
    items: wishlistItems, 
    toggleWishlist, 
    lastAddedItem: lastAddedWishlistItem,
    loadWishlist 
  } = useWishlistStore();

  // Load collections from Firebase
  useEffect(() => {
    const loadCollections = async () => {
      try {
        setCollectionsLoading(true);
        
        // Fetch all artworks to group by collection
        const artworksRef = collection(db, 'artworks');
        const artworksQuery = query(artworksRef, orderBy('createdAt', 'desc'));
        const artworksSnapshot = await getDocs(artworksQuery);
        const allArtworks = artworksSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Artwork[];

        // Group artworks by collection
        const collectionMap = new Map<string, number>();
        
        allArtworks.forEach(artwork => {
          if (artwork.collection && artwork.collection.trim()) {
            const collectionName = artwork.collection.trim();
            collectionMap.set(collectionName, (collectionMap.get(collectionName) || 0) + 1);
          }
        });

        // Convert to array and sort by count (largest collections first)
        const collectionsArray = Array.from(collectionMap.entries())
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        setCollections(collectionsArray);
        
      } catch (error) {
        console.error('Error loading collections:', error);
      } finally {
        setCollectionsLoading(false);
      }
    };

    loadCollections();
  }, []);

  // Load wishlist on component mount
  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // Animate cart icon when item is added
  useEffect(() => {
    if (lastAddedItem) {
      setCartAnimate(true);
      const timer = setTimeout(() => setCartAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [lastAddedItem]);

  // Animate wishlist icon when item is added
  useEffect(() => {
    if (lastAddedWishlistItem) {
      setWishlistAnimate(true);
      const timer = setTimeout(() => setWishlistAnimate(false), 600);
      return () => clearTimeout(timer);
    }
  }, [lastAddedWishlistItem]);

  // Handle shop menu hover with delay
  const handleShopMenuEnter = () => {
    if (shopHoverTimeout) {
      clearTimeout(shopHoverTimeout);
      setShopHoverTimeout(null);
    }
    // Close collections menu when opening shop menu
    setIsCollectionsMenuOpen(false);
    if (collectionsHoverTimeout) {
      clearTimeout(collectionsHoverTimeout);
      setCollectionsHoverTimeout(null);
    }
    setIsShopMenuOpen(true);
  };

  const handleShopMenuLeave = () => {
    const timeout = setTimeout(() => {
      setIsShopMenuOpen(false);
    }, 150);
    setShopHoverTimeout(timeout);
  };

  // Handle collections menu hover with delay
  const handleCollectionsMenuEnter = () => {
    if (collectionsHoverTimeout) {
      clearTimeout(collectionsHoverTimeout);
      setCollectionsHoverTimeout(null);
    }
    // Close shop menu when opening collections menu
    setIsShopMenuOpen(false);
    if (shopHoverTimeout) {
      clearTimeout(shopHoverTimeout);
      setShopHoverTimeout(null);
    }
    setIsCollectionsMenuOpen(true);
  };

  const handleCollectionsMenuLeave = () => {
    const timeout = setTimeout(() => {
      setIsCollectionsMenuOpen(false);
    }, 150);
    setCollectionsHoverTimeout(timeout);
  };

  // Close menus when clicking outside (only for user menu now)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (shopHoverTimeout) {
        clearTimeout(shopHoverTimeout);
      }
      if (collectionsHoverTimeout) {
        clearTimeout(collectionsHoverTimeout);
      }
    };
  }, [shopHoverTimeout, collectionsHoverTimeout]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-100 relative z-50 mb-10">
      {/* Top Section - Artist Name and User Actions */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">
            {/* Artist Name - Centered */}
            <div className="flex-1"></div>
            <Link href="/" className="flex items-center group">
              <div className="text-center group-hover:opacity-80 transition-opacity">
                <img 
                  src="/aja-logo.jpg" 
                  alt="Aja Eriksson von Weissenberg konstnär"
                  className="h-14 w-auto mb-4"
                />
              </div>
            </Link>

            {/* Right side - Wishlist, Cart and User */}
            <div className="flex-1 flex items-center justify-end space-x-4">
              {/* Wishlist Button */}
              <button
                onClick={toggleWishlist}
                className={`relative p-2 text-gray-700 hover:text-red-900 transition-all duration-200 ${
                  wishlistAnimate ? 'scale-110' : 'scale-100'
                }`}
              >
                <Heart className={`h-5 w-5 ${wishlistItems.length > 0 ? 'fill-current text-red-900' : ''}`} />
                {wishlistItems.length > 0 && (
                  <span className={`absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium transition-all duration-200 ${
                    wishlistAnimate ? 'scale-125 bg-green-600' : 'scale-100 bg-red-900'
                  }`}>
                    {wishlistItems.length}
                  </span>
                )}
              </button>

              {/* Enhanced Shopping Cart with Animation */}
              <button
                onClick={toggleCart}
                className={`relative p-2 text-gray-700 hover:text-red-900 transition-all duration-200 ${
                  cartAnimate ? 'scale-110' : 'scale-100'
                }`}
              >
                <ShoppingBag className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className={`absolute -top-1 -right-1 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium transition-all duration-200 ${
                    cartAnimate ? 'scale-125 bg-green-600' : 'scale-100 bg-red-900'
                  }`}>
                    {cartItemCount}
                  </span>
                )}
              </button>

              {/* User Authentication */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-gray-700 text-xs font-serif font-medium">
                        {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="hidden md:block text-sm font-serif text-gray-700">
                      {userProfile?.displayName || 'User'}
                    </span>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 shadow-lg py-2 rounded-lg">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-serif font-medium text-gray-900">{userProfile?.displayName}</p>
                        <p className="text-xs text-gray-600 font-serif">{userProfile?.email}</p>
                        {isAdmin && (
                          <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-serif rounded">
                            Administrator
                          </span>
                        )}
                      </div>
                      
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-serif transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                      
                      <Link
                        href="/orders"
                        className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 font-serif transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Package className="h-4 w-4" />
                        <span>My Orders</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 font-serif transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-serif transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <Link
                    href="/auth/login"
                    className="text-sm font-serif text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-red-900 text-white px-4 py-2 text-sm font-serif font-medium hover:bg-red-800 transition-colors rounded"
                  >
                    Sign up
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Navigation Links */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-center items-center h-16 py-4">
          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/gallery?type=originals"
              className="relative text-sm font-serif font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wide pb-2 group"
            >
              ORIGINAL PAINTINGS
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-200 via-blue-200 to-yellow-200 group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>

            <Link
              href="/gallery?sort=newest"
              className="relative text-sm font-serif font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wide pb-2 group"
            >
              NEW RELEASE
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-200 via-blue-200 to-yellow-200 group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>

            <Link
              href="/gallery?sort=popular"
              className="relative text-sm font-serif font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wide pb-2 group"
            >
              MOST POPULAR
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-200 via-blue-200 to-yellow-200 group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>

            {/* Collections Dropdown */}
            {collections.length > 0 && (
              <div 
                className="relative" 
                ref={collectionsMenuRef}
                onMouseEnter={handleCollectionsMenuEnter}
                onMouseLeave={handleCollectionsMenuLeave}
              >
                <div className="relative flex items-center space-x-1 text-sm font-serif font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wide pb-2 group cursor-pointer">
                  <span>COLLECTIONS</span>
                  <ChevronDown className="h-3 w-3" />
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-200 via-blue-200 to-yellow-200 group-hover:w-full transition-all duration-300 ease-out"></span>
                </div>

                {isCollectionsMenuOpen && (
                  <div 
                    className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-100 shadow-lg py-2 rounded-lg z-50 max-h-80 overflow-y-auto"
                    onMouseEnter={handleCollectionsMenuEnter}
                    onMouseLeave={handleCollectionsMenuLeave}
                  >
                    {collectionsLoading ? (
                      <div className="px-4 py-3 text-sm font-serif text-gray-500">
                        Loading collections...
                      </div>
                    ) : (
                      <>
                        <Link
                          href="/collections"
                          className="relative block px-4 py-2 text-sm font-serif text-gray-700 hover:bg-gray-50 transition-colors group"
                          onClick={() => setIsCollectionsMenuOpen(false)}
                        >
                          VIEW ALL COLLECTIONS
                          <span className="absolute bottom-0 left-4 w-0 h-px bg-gradient-to-r from-yellow-300 to-blue-300 group-hover:w-[calc(100%-2rem)] transition-all duration-200"></span>
                        </Link>
                        {collections.map((collection) => (
                          <Link
                            key={collection.name}
                            href={`/gallery?collection=${encodeURIComponent(collection.name)}`}
                            className="relative block px-4 py-2 text-sm font-serif text-gray-700 hover:bg-gray-50 transition-colors group"
                            onClick={() => setIsCollectionsMenuOpen(false)}
                          >
                            {collection.name}
                            <span className="absolute bottom-0 left-4 w-0 h-px bg-gradient-to-r from-yellow-300 to-blue-300 group-hover:w-[calc(100%-2rem)] transition-all duration-200"></span>
                          </Link>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Shop Art Dropdown - FIXED */}
            <div 
              className="relative" 
              ref={shopMenuRef}
              onMouseEnter={handleShopMenuEnter}
              onMouseLeave={handleShopMenuLeave}
            >
              <div className="relative flex items-center space-x-1 text-sm font-serif font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wide pb-2 group cursor-pointer">
                <span>SHOP ART</span>
                <ChevronDown className="h-3 w-3" />
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-200 via-blue-200 to-yellow-200 group-hover:w-full transition-all duration-300 ease-out"></span>
              </div>

              {isShopMenuOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-52 bg-white border border-gray-100 shadow-lg py-2 rounded-lg z-50"
                  onMouseEnter={handleShopMenuEnter}
                  onMouseLeave={handleShopMenuLeave}
                >
                  <Link
                    href="/gallery?type=originals"
                    className="relative block px-4 py-2 text-sm font-serif text-gray-700 hover:bg-gray-50 transition-colors group"
                    onClick={() => setIsShopMenuOpen(false)}
                  >
                    ORIGINALS
                    <span className="absolute bottom-0 left-4 w-0 h-px bg-gradient-to-r from-yellow-300 to-blue-300 group-hover:w-[calc(100%-2rem)] transition-all duration-200"></span>
                  </Link>
                  <Link
                    href="/gallery?type=all-prints"
                    className="relative block px-4 py-2 text-sm font-serif text-gray-700 hover:bg-gray-50 transition-colors group"
                    onClick={() => setIsShopMenuOpen(false)}
                  >
                    SHOP ALL PRINTS
                    <span className="absolute bottom-0 left-4 w-0 h-px bg-gradient-to-r from-yellow-300 to-blue-300 group-hover:w-[calc(100%-2rem)] transition-all duration-200"></span>
                  </Link>
                  <Link
                    href="/gallery?type=paper-prints"
                    className="relative block px-4 py-2 text-sm font-serif text-gray-700 hover:bg-gray-50 transition-colors group"
                    onClick={() => setIsShopMenuOpen(false)}
                  >
                    PAPER PRINTS
                    <span className="absolute bottom-0 left-4 w-0 h-px bg-gradient-to-r from-yellow-300 to-blue-300 group-hover:w-[calc(100%-2rem)] transition-all duration-200"></span>
                  </Link>
                  <Link
                    href="/gallery?type=canvas-prints"
                    className="relative block px-4 py-2 text-sm font-serif text-gray-700 hover:bg-gray-50 transition-colors group"
                    onClick={() => setIsShopMenuOpen(false)}
                  >
                    CANVAS PRINTS
                    <span className="absolute bottom-0 left-4 w-0 h-px bg-gradient-to-r from-yellow-300 to-blue-300 group-hover:w-[calc(100%-2rem)] transition-all duration-200"></span>
                  </Link>
                  <Link
                    href="/gallery?type=enquire-only"
                    className="relative block px-4 py-2 text-sm font-serif text-gray-700 hover:bg-gray-50 transition-colors group"
                    onClick={() => setIsShopMenuOpen(false)}
                  >
                    CONTACT FOR PRICE
                    <span className="absolute bottom-0 left-4 w-0 h-px bg-gradient-to-r from-yellow-300 to-blue-300 group-hover:w-[calc(100%-2rem)] transition-all duration-200"></span>
                  </Link>
                  <Link
                    href="/gallery?type=commissioned"
                    className="relative block px-4 py-2 text-sm font-serif text-gray-700 hover:bg-gray-50 transition-colors group"
                    onClick={() => setIsShopMenuOpen(false)}
                  >
                    COMMISSIONED WORKS
                    <span className="absolute bottom-0 left-4 w-0 h-px bg-gradient-to-r from-yellow-300 to-blue-300 group-hover:w-[calc(100%-2rem)] transition-all duration-200"></span>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="relative text-sm font-serif font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wide pb-2 group"
            >
              ABOUT
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-200 via-blue-200 to-yellow-200 group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>

            <Link
              href="/contact"
              className="relative text-sm font-serif font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wide pb-2 group"
            >
              CONTACT
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-200 via-blue-200 to-yellow-200 group-hover:w-full transition-all duration-300 ease-out"></span>
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="relative text-sm font-serif font-medium text-gray-500 hover:text-gray-700 transition-colors tracking-wide pb-2 group"
              >
                ADMIN
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-200 via-blue-200 to-yellow-200 group-hover:w-full transition-all duration-300 ease-out"></span>
              </Link>
            )}
          </nav>
        </div>
      </div>

      {/* Mobile Navigation - FIXED */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 py-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-6">
              <Link
                href="/gallery?type=originals"
                className="block text-sm font-serif font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ORIGINAL PAINTINGS
              </Link>

              <Link
                href="/gallery?sort=newest"
                className="block text-sm font-serif font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                NEW RELEASE
              </Link>

              <Link
                href="/gallery?sort=popular"
                className="block text-sm font-serif font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                MOST POPULAR
              </Link>

              {/* Mobile Collections Section */}
              {collections.length > 0 && (
                <div className="space-y-2">
                  <div className="text-sm font-serif font-medium text-gray-900 tracking-wide">COLLECTIONS</div>
                  <div className="pl-4 space-y-2">
                    <Link
                      href="/collections"
                      className="block text-sm font-serif text-gray-600 hover:text-gray-900 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      VIEW ALL COLLECTIONS
                    </Link>
                    {collections.slice(0, 8).map((collection) => (
                      <Link
                        key={collection.name}
                        href={`/gallery?collection=${encodeURIComponent(collection.name)}`}
                        className="block text-sm font-serif text-gray-600 hover:text-gray-900 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {collection.name}
                      </Link>
                    ))}
                    {collections.length > 8 && (
                      <Link
                        href="/collections"
                        className="block text-xs font-serif text-gray-500 hover:text-gray-700 transition-colors italic"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        + {collections.length - 8} more collections
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Mobile Shop Art Section - FIXED */}
              <div className="space-y-2">
                <div className="text-sm font-serif font-medium text-gray-900 tracking-wide">SHOP ART</div>
                <div className="pl-4 space-y-2">
                  <Link
                    href="/gallery?type=originals"
                    className="block text-sm font-serif text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ORIGINALS
                  </Link>
                  <Link
                    href="/gallery?type=all-prints"
                    className="block text-sm font-serif text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    SHOP ALL PRINTS
                  </Link>
                  <Link
                    href="/gallery?type=paper-prints"
                    className="block text-sm font-serif text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    PAPER PRINTS
                  </Link>
                  <Link
                    href="/gallery?type=canvas-prints"
                    className="block text-sm font-serif text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    CANVAS PRINTS
                  </Link>
                  <Link
                    href="/gallery?type=enquire-only"
                    className="block text-sm font-serif text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    CONTACT FOR PRICE
                  </Link>
                  <Link
                    href="/gallery?type=commissioned"
                    className="block text-sm font-serif text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    COMMISSIONED WORKS
                  </Link>
                </div>
              </div>

              <Link
                href="/about"
                className="block text-sm font-serif font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ABOUT
              </Link>

              <Link
                href="/contact"
                className="block text-sm font-serif font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wide"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                CONTACT
              </Link>

              {isAdmin && (
                <Link
                  href="/admin"
                  className="block text-sm font-serif font-medium text-gray-500 hover:text-gray-700 transition-colors tracking-wide"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  ADMIN
                </Link>
              )}

              {!user && (
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                  <Link
                    href="/auth/login"
                    className="text-sm font-serif text-gray-700 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-red-900 text-white px-4 py-2 text-sm font-serif font-medium hover:bg-red-800 transition-colors text-center rounded"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}