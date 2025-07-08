import Link from 'next/link';
import { Palette, Mail, Phone, MapPin, Instagram, Facebook, Calendar } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-oak-red via-algae-green to-light-blue overflow-hidden">
      {/* Oil Paint Texture Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/20 to-transparent transform rotate-12 scale-150"></div>
        <div className="absolute bottom-0 right-0 w-2/3 h-2/3 bg-gradient-to-tl from-cream/30 via-transparent to-pastel-yellow/20 transform -rotate-6"></div>
        <div className="absolute top-1/4 left-1/3 w-1/2 h-1/3 bg-radial-gradient from-light-blue/20 to-transparent rounded-full transform rotate-45"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Artist Brand */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Palette className="h-10 w-10 text-white drop-shadow-lg" />
                <div>
                  <h3 className="text-2xl font-serif font-bold text-white drop-shadow-lg">
                    Aja Eriksson von Weissenberg
                  </h3>
                  <p className="text-cream/90 font-serif text-sm">
                    Contemporary Oil Painter
                  </p>
                </div>
              </div>
            </div>
            
            <p className="text-white/90 font-serif leading-relaxed text-sm max-w-md">
              &quot;My works move between light and dark, longing and farewell. Each painting 
              is an exploration of the Nordic spirit, where color and texture tell stories 
              of Scandinavian landscapes and inner emotions.&quot;
            </p>

            {/* Current Exhibition */}
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
              <div className="flex items-center space-x-2 mb-2">
                <Calendar className="h-4 w-4 text-cream" />
                <span className="text-cream font-serif font-semibold text-sm">Current Exhibition</span>
              </div>
              <p className="text-white text-sm font-serif">
                &quot;Echoes of the North&quot; at Galleri Anna H, Göteborg
              </p>
              <p className="text-cream/80 text-xs font-serif">
                Through August 2025
              </p>
            </div>
            
            {/* Social Media */}
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/ajaerikusson" 
                className="bg-white/20 backdrop-blur-sm p-3 rounded-full border border-white/30 text-white hover:bg-white/30 transition-all duration-300 hover:scale-105"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://facebook.com/ajaerikussonart" 
                className="bg-white/20 backdrop-blur-sm p-3 rounded-full border border-white/30 text-white hover:bg-white/30 transition-all duration-300 hover:scale-105"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Gallery Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-white drop-shadow-lg border-b border-white/30 pb-2">
              Explore
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/gallery" 
                  className="text-cream/90 hover:text-white transition-colors duration-200 font-serif text-sm hover:underline decoration-cream"
                >
                  View All Artworks
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-cream/90 hover:text-white transition-colors duration-200 font-serif text-sm hover:underline decoration-cream"
                >
                  Artist Biography
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-cream/90 hover:text-white transition-colors duration-200 font-serif text-sm hover:underline decoration-cream"
                >
                  Studio Visits
                </Link>
              </li>
              <li>
                <Link 
                  href="/gallery?category=landscape" 
                  className="text-cream/90 hover:text-white transition-colors duration-200 font-serif text-sm hover:underline decoration-cream"
                >
                  Nordic Landscapes
                </Link>
              </li>
              <li>
                <Link 
                  href="/gallery?category=abstract" 
                  className="text-cream/90 hover:text-white transition-colors duration-200 font-serif text-sm hover:underline decoration-cream"
                >
                  Abstract Works
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-semibold text-white drop-shadow-lg border-b border-white/30 pb-2">
              Studio Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-cream mt-0.5 drop-shadow" />
                <div>
                  <a 
                    href="mailto:aja@erikssonart.se" 
                    className="text-cream/90 hover:text-white transition-colors duration-200 font-serif text-sm hover:underline"
                  >
                    aja@erikssonart.se
                  </a>
                  <p className="text-white/70 text-xs font-serif">For inquiries & commissions</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-cream mt-0.5 drop-shadow" />
                <div>
                  <span className="text-cream/90 font-serif text-sm">+46 70 123 4567</span>
                  <p className="text-white/70 text-xs font-serif">Studio appointments</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-cream mt-0.5 drop-shadow" />
                <div>
                  <span className="text-cream/90 font-serif text-sm">
                    Carl Grimbergsgatan<br />
                    Göteborg, Sweden
                  </span>
                  <p className="text-white/70 text-xs font-serif">Private studio</p>
                </div>
              </div>
            </div>

            {/* Studio Hours */}
            <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <h4 className="text-cream font-serif font-semibold text-sm mb-2">Studio Hours</h4>
              <p className="text-white/80 text-xs font-serif">
                By appointment only<br />
                Tuesday - Saturday<br />
                10:00 - 17:00
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/30 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left">
            <p className="text-white/80 text-sm font-serif">
              © {currentYear} Aja Eriksson von Weissenberg. All artwork rights reserved.
            </p>
            <p className="text-cream/70 text-xs font-serif mt-1">
              HDK Graduate • 50+ Years of Artistic Excellence • Göteborg Cultural Heritage
            </p>
          </div>
          
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link 
              href="/terms" 
              className="text-cream/80 hover:text-white text-xs font-serif transition-colors duration-200 hover:underline"
            >
              Terms & Conditions
            </Link>
            <Link 
              href="/privacy" 
              className="text-cream/80 hover:text-white text-xs font-serif transition-colors duration-200 hover:underline"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/shipping" 
              className="text-cream/80 hover:text-white text-xs font-serif transition-colors duration-200 hover:underline"
            >
              Shipping & Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}