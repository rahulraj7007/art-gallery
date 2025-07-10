'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, ShoppingBag, User, LogOut, Settings, Package, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useCartStore } from '@/lib/store/cartStore';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const [shopHoverTimeout, setShopHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const shopMenuRef = useRef<HTMLDivElement>(null);
  
  const { user, userProfile, logout, isAdmin } = useAuth();
  const router = useRouter();
  const { items, toggleCart } = useCartStore();
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Handle shop menu hover with delay
  const handleShopMenuEnter = () => {
    if (shopHoverTimeout) {
      clearTimeout(shopHoverTimeout);
      setShopHoverTimeout(null);
    }
    setIsShopMenuOpen(true);
  };

  const handleShopMenuLeave = () => {
    const timeout = setTimeout(() => {
      setIsShopMenuOpen(false);
    }, 150); // 150ms delay before closing
    setShopHoverTimeout(timeout);
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (shopHoverTimeout) {
        clearTimeout(shopHoverTimeout);
      }
    };
  }, [shopHoverTimeout]);

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
    <header className="bg-white border-b border-gray-100 relative z-50">
      {/* Top Section - Artist Name and User Actions */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">{/* Increased from h-16 to h-20 */}
            {/* Artist Name - Centered */}
            <div className="flex-1"></div>
            <Link href="/" className="flex items-center group">
              {/* Using your elegant logo image */}
              <div className="text-center group-hover:opacity-80 transition-opacity">
                <img 
                  src="/aja-logo.jpg" 
                  alt="Aja Eriksson von Weissenberg konstnär"
                  className="h-14 w-auto mb-4"
                />
              </div>
            </Link>

            {/* Right side - Cart and User */}
            <div className="flex-1 flex items-center justify-end space-x-4">
              {/* Shopping Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                    {itemCount}
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
                    className="bg-gray-900 text-white px-4 py-2 text-sm font-serif font-medium hover:bg-gray-800 transition-colors rounded"
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
        <div className="flex justify-center items-center h-16 py-4">{/* Increased from h-12 to h-16 and added py-4 */}
          {/* Desktop Navigation - Centered */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/gallery?type=for-sale"
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

            {/* Shop Art Dropdown */}
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
                    href="/gallery?type=for-sale"
                    className="relative block px-4 py-2 text-sm font-serif text-gray-700 hover:bg-gray-50 transition-colors group"
                    onClick={() => setIsShopMenuOpen(false)}
                  >
                    ORIGINALS
                    <span className="absolute bottom-0 left-4 w-0 h-px bg-gradient-to-r from-yellow-300 to-blue-300 group-hover:w-[calc(100%-2rem)] transition-all duration-200"></span>
                  </Link>
                  <Link
                    href="/gallery"
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

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 py-6">{/* Increased from py-4 to py-6 */}
          <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-6">{/* Increased from space-y-4 to space-y-6 */}
              <Link
                href="/gallery?type=for-sale"
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

              {/* Mobile Shop Art Section */}
              <div className="space-y-2">
                <div className="text-sm font-serif font-medium text-gray-900 tracking-wide">SHOP ART</div>
                <div className="pl-4 space-y-2">
                  <Link
                    href="/gallery?type=for-sale"
                    className="block text-sm font-serif text-gray-600 hover:text-gray-900 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ORIGINALS
                  </Link>
                  <Link
                    href="/gallery"
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
                    className="bg-gray-900 text-white px-4 py-2 text-sm font-serif font-medium hover:bg-gray-800 transition-colors text-center rounded"
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