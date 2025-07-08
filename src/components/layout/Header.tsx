'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Palette, Menu, X, ShoppingBag, User, LogOut, Settings, Package } from 'lucide-react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useCartStore } from '@/lib/store/cartStore';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  const { user, userProfile, logout, isAdmin } = useAuth();
  const router = useRouter();
  const { items, toggleCart } = useCartStore();
  
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
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

  const navigationItems = [
    { name: 'Gallery', href: '/gallery' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-200 via-blue-200 to-green-200 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Palette className="h-7 w-7 text-gray-700" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-70"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-serif font-light text-gray-900 leading-tight">
                Aja Eriksson
                <span className="block text-sm font-serif text-gray-600 -mt-1">von Weissenberg</span>
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-gray-900 transition-colors font-serif font-medium text-lg relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-orange-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="text-gray-600 hover:text-gray-900 transition-colors font-serif font-medium text-lg flex items-center space-x-2 relative group"
              >
                <Settings className="h-4 w-4" />
                <span>Admin</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            )}
          </nav>

          {/* Right side - Cart, User Menu */}
          <div className="flex items-center space-x-6">
            {/* Shopping Cart */}
            <button
              onClick={toggleCart}
              className="relative p-3 text-gray-700 hover:text-gray-900 transition-colors group"
            >
              <ShoppingBag className="h-6 w-6 group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-medium shadow-lg">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Authentication */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-200 via-blue-200 to-green-200 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
                    <span className="text-gray-700 text-sm font-serif font-medium">
                      {userProfile?.displayName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden lg:block text-sm font-serif font-medium text-gray-700 group-hover:text-gray-900">
                    {userProfile?.displayName || 'User'}
                  </span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-blue-50">
                      <p className="text-sm font-serif font-medium text-gray-900">{userProfile?.displayName}</p>
                      <p className="text-sm text-gray-600 font-serif">{userProfile?.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-2 px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 text-xs rounded-full font-serif">
                          Administrator
                        </span>
                      )}
                    </div>
                    
                    <Link
                      href="/profile"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-serif transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                    
                    <Link
                      href="/orders"
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-serif transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package className="h-4 w-4" />
                      <span>My Orders</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-700 font-serif transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-serif transition-colors"
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
                  className="text-gray-700 hover:text-gray-900 transition-colors font-serif font-medium"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-2 rounded-full hover:from-gray-800 hover:to-gray-700 transition-all duration-300 font-serif font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-t border-gray-100 shadow-lg rounded-b-xl mx-4">
            <div className="px-6 py-6 space-y-6">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block text-gray-700 hover:text-gray-900 transition-colors font-serif font-medium text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors font-serif font-medium text-lg"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Link>
              )}

              {!user && (
                <div className="flex flex-col space-y-4 pt-4 border-t border-gray-100">
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-gray-900 transition-colors font-serif font-medium text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-6 py-3 rounded-full hover:from-gray-800 hover:to-gray-700 transition-all duration-300 font-serif font-medium text-center shadow-lg"
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