'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Palette, Menu, X, ShoppingBag, User, LogOut, Settings, Package, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useCartStore } from '@/lib/store/cartStore';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isShopMenuOpen, setIsShopMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const shopMenuRef = useRef<HTMLDivElement>(null);
  
  const { user, userProfile, logout, isAdmin } = useAuth();
  const router = useRouter();
  const { items, toggleCart } = useCartStore();
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (shopMenuRef.current && !shopMenuRef.current.contains(event.target as Node)) {
        setIsShopMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Centered and Clean */}
          <Link href="/" className="flex items-center group">
            <div className="text-center">
              <h1 className="text-xl font-serif font-light text-gray-900 leading-tight group-hover:text-gray-700 transition-colors">
                Aja Eriksson von Weissenberg
              </h1>
              <p className="text-xs font-serif text-gray-500 -mt-1">Swedish Artist</p>
            </div>
          </Link>

          {/* Desktop Navigation - Clean & Minimal */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/gallery?type=for-sale"
              className="text-sm font-serif font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wide"
            >
              ORIGINAL PAINTINGS
            </Link>

            <Link
              href="/gallery?sort=newest"
              className="text-sm font-serif font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wide"
            >
              NEW RELEASE
            </Link>

            <Link
              href="/gallery?sort=popular"
              className="text-sm font-serif font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wide"
            >
              MOST POPULAR
            </Link>

            {/* Shop Art Dropdown */}
            <div className="relative" ref={shopMenuRef}>
              <button
                onClick={() => setIsShopMenuOpen(!isShopMenuOpen)}
                className="flex items-center space-x-1 text-sm font-serif font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wide"
              >
                <span>SHOP ART</span>
                <ChevronDown className="h-3 w-3" />
              </button>

              {isShopMenuOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white border border-gray-100 shadow-lg py-2">
                  <Link
                    href="/gallery?type=for-sale"
                    className="block px-4 py-2 text-sm font-serif text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsShopMenuOpen(false)}
                  >
                    ORIGINALS
                  </Link>
                  <Link
                    href="/gallery"
                    className="block px-4 py-2 text-sm font-serif text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsShopMenuOpen(false)}
                  >
                    SHOP ALL PRINTS
                  </Link>
                  <Link
                    href="/gallery?type=paper-prints"
                    className="block px-4 py-2 text-sm font-serif text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsShopMenuOpen(false)}
                  >
                    PAPER PRINTS
                  </Link>
                  <Link
                    href="/gallery?type=canvas-prints"
                    className="block px-4 py-2 text-sm font-serif text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsShopMenuOpen(false)}
                  >
                    CANVAS PRINTS
                  </Link>
                  <Link
                    href="/gallery?type=enquire-only"
                    className="block px-4 py-2 text-sm font-serif text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsShopMenuOpen(false)}
                  >
                    CONTACT FOR PRICE
                  </Link>
                  <Link
                    href="/gallery?type=commissioned"
                    className="block px-4 py-2 text-sm font-serif text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsShopMenuOpen(false)}
                  >
                    COMMISSIONED WORKS
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="text-sm font-serif font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wide"
            >
              ABOUT
            </Link>

            <Link
              href="/contact"
              className="text-sm font-serif font-medium text-gray-700 hover:text-gray-900 transition-colors tracking-wide"
            >
              CONTACT
            </Link>

            {isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-serif font-medium text-gray-500 hover:text-gray-700 transition-colors tracking-wide"
              >
                ADMIN
              </Link>
            )}
          </nav>

          {/* Right side - Cart, User Menu */}
          <div className="flex items-center space-x-4">
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
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 shadow-lg py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-serif font-medium text-gray-900">{userProfile?.displayName}</p>
                      <p className="text-xs text-gray-600 font-serif">{userProfile?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-2 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-serif">
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
                  className="bg-gray-900 text-white px-4 py-2 text-sm font-serif font-medium hover:bg-gray-800 transition-colors"
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

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4">
            <div className="space-y-4">
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
                    className="bg-gray-900 text-white px-4 py-2 text-sm font-serif font-medium hover:bg-gray-800 transition-colors text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}