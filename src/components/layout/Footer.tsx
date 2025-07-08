import Link from 'next/link';
import { Mail, MapPin, Instagram, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
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

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-base font-serif font-medium text-gray-900">
              Gallery
            </h4>
            <div className="space-y-2">
              <Link 
                href="/gallery" 
                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200 font-serif text-sm"
              >
                View All Works
              </Link>
              <Link 
                href="/gallery?type=for-sale" 
                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200 font-serif text-sm"
              >
                Original Paintings
              </Link>
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
            </div>
          </div>

          {/* Exhibition & Social */}
          <div className="space-y-4">
            <h4 className="text-base font-serif font-medium text-gray-900">
              Current Exhibition
            </h4>
            <div className="space-y-1">
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
            
            {/* Social Media */}
            <div className="pt-2">
              <a 
                href="https://instagram.com/ajaerikusson" 
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
              href="/shipping" 
              className="text-gray-500 hover:text-gray-700 font-serif text-sm transition-colors duration-200"
            >
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}