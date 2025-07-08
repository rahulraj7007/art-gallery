import Link from 'next/link';
import { Palette, Mail, Phone, MapPin, Instagram, Facebook, Calendar, ExternalLink } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-yellow-50 via-blue-50 to-white overflow-hidden">
      {/* Artistic Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-4 left-8 w-32 h-32 bg-yellow-200 rounded-full opacity-30 blur-xl"></div>
          <div className="absolute bottom-8 right-12 w-40 h-40 bg-blue-200 rounded-full opacity-25 blur-2xl"></div>
          <div className="absolute top-12 right-20 w-24 h-24 bg-yellow-100 rounded-full opacity-40 blur-lg"></div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Artist Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Palette className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-serif font-bold text-gray-800">
                  Aja Eriksson von Weissenberg
                </h3>
                <p className="text-gray-600 font-serif text-sm">
                  Contemporary Oil Painter
                </p>
              </div>
            </div>
            
            <p className="text-gray-700 font-serif text-sm leading-relaxed italic">
              &quot;My works move between light and dark, longing and farewell, exploring the Nordic spirit through color and texture.&quot;
            </p>

            {/* Social Media */}
            <div className="flex space-x-3">
              <a 
                href="https://instagram.com/ajaerikusson" 
                className="p-2 bg-white border border-yellow-200 rounded-lg text-gray-600 hover:text-yellow-600 hover:border-yellow-400 transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://facebook.com/ajaerikussonart" 
                className="p-2 bg-white border border-blue-200 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-400 transition-all duration-200"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-base font-serif font-semibold text-gray-800 border-b border-yellow-200 pb-2">
              Explore Gallery
            </h4>
            <div className="grid grid-cols-1 gap-2">
              <Link 
                href="/gallery" 
                className="text-gray-600 hover:text-yellow-600 transition-colors duration-200 font-serif text-sm flex items-center group"
              >
                <span>View All Artworks</span>
                <ExternalLink className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link 
                href="/about" 
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-serif text-sm"
              >
                Artist Biography
              </Link>
              <Link 
                href="/contact" 
                className="text-gray-600 hover:text-yellow-600 transition-colors duration-200 font-serif text-sm"
              >
                Studio Visits
              </Link>
            </div>

            {/* Current Exhibition - Compact */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              <div className="flex items-center space-x-2 mb-1">
                <Calendar className="h-3 w-3 text-yellow-600" />
                <span className="text-yellow-700 font-serif font-medium text-xs">Now Showing</span>
              </div>
              <p className="text-gray-700 text-xs font-serif">
                &quot;Echoes of the North&quot; at Galleri Anna H, Göteborg
              </p>
              <p className="text-gray-500 text-xs font-serif">
                Through August 2025
              </p>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-base font-serif font-semibold text-gray-800 border-b border-blue-200 pb-2">
              Studio Contact
            </h4>
            
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <a 
                    href="mailto:aja@erikssonart.se" 
                    className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-serif text-sm break-all"
                  >
                    aja@erikssonart.se
                  </a>
                  <p className="text-gray-500 text-xs font-serif">Inquiries & commissions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-gray-700 font-serif text-sm">+46 70 123 4567</span>
                  <p className="text-gray-500 text-xs font-serif">Studio appointments</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-gray-700 font-serif text-sm">
                    Carl Grimbergsgatan<br />
                    Göteborg, Sweden
                  </span>
                  <p className="text-gray-500 text-xs font-serif">Private studio</p>
                </div>
              </div>
            </div>

            {/* Studio Hours - Ultra Compact */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h5 className="text-blue-700 font-serif font-medium text-xs mb-1">Studio Hours</h5>
              <p className="text-gray-600 text-xs font-serif leading-tight">
                By appointment only<br />
                Tue-Sat, 10:00-17:00
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Compact */}
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <p className="text-gray-600 text-xs font-serif">
              © {currentYear} Aja Eriksson von Weissenberg. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs font-serif">
              HDK Graduate • 50+ Years Excellence • Göteborg Cultural Heritage
            </p>
          </div>
          
          <div className="flex space-x-4 text-xs">
            <Link 
              href="/terms" 
              className="text-gray-500 hover:text-yellow-600 font-serif transition-colors duration-200"
            >
              Terms
            </Link>
            <Link 
              href="/privacy" 
              className="text-gray-500 hover:text-blue-600 font-serif transition-colors duration-200"
            >
              Privacy
            </Link>
            <Link 
              href="/shipping" 
              className="text-gray-500 hover:text-yellow-600 font-serif transition-colors duration-200"
            >
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}