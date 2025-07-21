import Link from 'next/link';
import { Mail, MapPin, Instagram, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Artist Info */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif text-gray-900">
              Aja Eriksson von Weissenberg
            </h3>
            <p className="text-gray-600 font-serif text-sm leading-relaxed">
              Contemporary oil painter exploring Nordic themes through color and texture.
            </p>
            
            {/* Contact */}
            <div className="space-y-2">
              <a 
                href="mailto:ajaeriksson@gmail.com" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 font-serif text-sm"
              >
                <Mail className="h-4 w-4" />
                <span>ajaeriksson@gmail.com</span>
              </a>
              
              <div className="flex items-center space-x-2 text-gray-600 font-serif text-sm">
                <MapPin className="h-4 w-4" />
                <span>Göteborg, Sweden</span>
              </div>
            </div>
          </div>

          {/* Gallery Navigation */}
          <div className="space-y-4">
            <h4 className="text-base font-serif font-medium text-gray-900">
              Gallery
            </h4>
            <div className="space-y-2">
              <Link 
                href="/gallery" 
                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200 font-serif text-sm"
              >
                All Original Paintings
              </Link>
              <Link 
                href="/gallery?type=originals" 
                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200 font-serif text-sm"
              >
                Available Artwork
              </Link>
              <Link 
                href="/collections" 
                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200 font-serif text-sm"
              >
                View Collections
              </Link>
              <Link 
                href="/gallery?sort=newest" 
                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200 font-serif text-sm"
              >
                New Release
              </Link>
            </div>
          </div>

          {/* Shop Prints */}
          <div className="space-y-4">
            <h4 className="text-base font-serif font-medium text-gray-900">
              Shop Prints
            </h4>
            <div className="space-y-2">
              <Link 
                href="/prints" 
                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200 font-serif text-sm"
              >
                All Prints
              </Link>
              <Link 
                href="/prints/paper" 
                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200 font-serif text-sm"
              >
                Paper Prints
              </Link>
              <Link 
                href="/prints/canvas" 
                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200 font-serif text-sm"
              >
                Canvas Prints
              </Link>
            </div>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h4 className="text-base font-serif font-medium text-gray-900">
              Information
            </h4>
            <div className="space-y-2">
              <Link 
                href="/about" 
                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200 font-serif text-sm"
              >
                About the Artist
              </Link>
              <Link 
                href="/contact" 
                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200 font-serif text-sm"
              >
                Contact & Commissions
              </Link>
              <Link 
                href="/shipping" 
                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200 font-serif text-sm"
              >
                Shipping Information
              </Link>
            </div>
            
            {/* Social Media */}
            <div className="pt-4">
              <a 
                href="https://instagram.com/ajaeriksson" 
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 font-serif text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-4 w-4" />
                <span>Follow on Instagram</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Current Exhibition */}
        <div className="border-t border-gray-100 pt-6 pb-6">
          <div className="text-center">
            <h4 className="text-base font-serif font-medium text-gray-900 mb-2">
              Current Exhibition
            </h4>
            <p className="text-gray-900 font-serif text-sm">
              "Echoes of the North"
            </p>
            <p className="text-gray-600 font-serif text-sm">
              Galleri Anna H, Göteborg
            </p>
            <p className="text-gray-500 font-serif text-xs">
              Through August 2025
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <div>
            <p className="text-gray-600 text-sm font-serif">
              © {currentYear} Aja Eriksson von Weissenberg
            </p>
            <p className="text-gray-500 text-xs font-serif">
              HDK Graduate • 50+ Years Excellence
            </p>
          </div>
          
          <div className="flex space-x-6">
            <Link 
              href="/terms" 
              className="text-gray-500 hover:text-gray-700 font-serif text-sm transition-colors duration-200"
            >
              Terms
            </Link>
            <Link 
              href="/privacy" 
              className="text-gray-500 hover:text-gray-700 font-serif text-sm transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link 
              href="/orders" 
              className="text-gray-500 hover:text-gray-700 font-serif text-sm transition-colors duration-200"
            >
              Order History
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}