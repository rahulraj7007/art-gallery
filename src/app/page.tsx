// src/app/page.tsx - Äja Eriksson Art Homepage
import Link from 'next/link';
import { ArrowRight, Palette, Brush, Heart } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* Hero Section with Oil Paint Texture Background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Abstract Oil Paint Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-yellow-50 to-blue-50">
          {/* Oil paint texture layers */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-yellow-200/40 to-orange-300/20 rounded-full blur-3xl transform rotate-12"></div>
            <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-bl from-blue-200/30 to-cyan-300/20 rounded-full blur-3xl transform -rotate-12"></div>
            <div className="absolute bottom-32 left-1/4 w-72 h-72 bg-gradient-to-tr from-emerald-700/20 to-green-600/15 rounded-full blur-3xl transform rotate-45"></div>
            <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-gradient-to-tl from-red-400/25 to-orange-500/20 rounded-full blur-3xl transform -rotate-45"></div>
          </div>
          
          {/* Brushstroke overlays */}
          <div className="absolute inset-0 opacity-20">
            <svg className="absolute top-1/4 left-1/4 w-64 h-32" viewBox="0 0 256 128">
              <path d="M0,64 Q64,20 128,60 T256,50" stroke="rgba(255,183,77,0.6)" strokeWidth="8" fill="none" strokeLinecap="round"/>
            </svg>
            <svg className="absolute bottom-1/3 right-1/4 w-72 h-24" viewBox="0 0 288 96">
              <path d="M0,48 Q72,10 144,40 T288,30" stroke="rgba(56,178,172,0.5)" strokeWidth="6" fill="none" strokeLinecap="round"/>
            </svg>
            <svg className="absolute top-1/2 left-1/2 w-48 h-48 transform -translate-x-1/2 -translate-y-1/2" viewBox="0 0 192 192">
              <path d="M20,96 Q96,40 170,100 Q120,160 20,96" stroke="rgba(34,197,94,0.4)" strokeWidth="4" fill="rgba(34,197,94,0.1)" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-serif font-light text-gray-800 mb-6 leading-tight">
              Discover Original
              <span className="block text-6xl md:text-8xl font-serif font-normal text-gray-900 relative">
                Paintings
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 rounded-full opacity-70"></div>
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 font-serif font-light max-w-2xl mx-auto leading-relaxed mb-8">
              Explore and purchase unique artworks by 
              <span className="font-medium text-gray-900"> Aja Eriksson von Weissenberg</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/gallery"
              className="group bg-gray-900 text-white px-8 py-4 rounded-full font-serif font-medium text-lg hover:bg-gray-800 transition-all duration-300 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-full font-serif font-medium text-lg hover:bg-gray-900 hover:text-white transition-all duration-300"
            >
              About the Artist
            </Link>
          </div>
        </div>

        {/* Floating paint drops */}
        <div className="absolute bottom-10 left-10 w-3 h-3 bg-yellow-400 rounded-full opacity-60 animate-bounce" style={{animationDelay: '0s'}}></div>
        <div className="absolute top-1/3 right-20 w-2 h-2 bg-blue-400 rounded-full opacity-50 animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-4 h-4 bg-green-600 rounded-full opacity-40 animate-bounce" style={{animationDelay: '2s'}}></div>
      </section>

      {/* Artist Introduction Section */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-serif font-light text-gray-900 mb-6">
                About Aja Eriksson von Weissenberg
              </h2>
              <p className="text-lg text-gray-700 font-serif leading-relaxed mb-6">
                &ldquo;My works move between light and dark, longing and farewell. The motifs return, 
                like old friends. You might need to rest for a bit, as age makes itself heard. 
                You lie down on the sofa. Then unexpected sneaks back into the image again. 
                Situations arise, with new stories.&rdquo;
              </p>
              <p className="text-lg text-gray-700 font-serif leading-relaxed mb-6">
                After graduating from HDK in 1972, Aja&apos;s broad artistic training encompasses 
                everything from welding and bookbinding to scriptwriting at DI and fresco painting 
                at the Royal Institute of Art. Her impressive portfolio includes exhibitions, 
                short films, illustrations, and scenographic works.
              </p>
              <p className="text-lg text-gray-700 font-serif leading-relaxed mb-8">
                With public commissions throughout Gothenburg and a distinctive artistic voice 
                that has shaped the city&apos;s cultural landscape, Aja continues to create works 
                that speak to the eternal themes of human experience.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center text-gray-900 font-serif font-medium hover:text-gray-700 transition-colors"
              >
                Discover her complete artistic journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-100 via-blue-50 to-green-50 p-8 rounded-2xl">
                <div className="aspect-square bg-gradient-to-br from-yellow-200/50 via-blue-200/30 to-green-200/40 rounded-xl flex items-center justify-center">
                  <Palette className="h-24 w-24 text-gray-600" />
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-70"></div>
              <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-blue-400 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Characteristics */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-light text-gray-900 mb-4">
              Why Choose Original Art?
            </h2>
            <p className="text-lg text-gray-600 font-serif max-w-2xl mx-auto">
              Each piece is a unique creation that brings authenticity and soul to your space
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brush className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 mb-3">Handcrafted Originals</h3>
              <p className="text-gray-600 font-serif leading-relaxed">
                Every brushstroke is intentional, creating one-of-a-kind pieces that cannot be replicated.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-10 w-10 text-cyan-600" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 mb-3">Emotional Connection</h3>
              <p className="text-gray-600 font-serif leading-relaxed">
                Works that move between light and dark, where motifs return like old friends, each carrying new stories.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Palette className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-serif font-medium text-gray-900 mb-3">Artistic Legacy</h3>
              <p className="text-gray-600 font-serif leading-relaxed">
                Decades of artistic mastery spanning exhibitions, films, and public commissions throughout Gothenburg.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-bl from-blue-400 to-cyan-400 rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-gradient-to-tr from-green-500 to-emerald-500 rounded-full blur-2xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-serif font-light text-white mb-6">
            Start Your Art Collection Today
          </h2>
          <p className="text-xl text-gray-300 font-serif mb-8 max-w-2xl mx-auto leading-relaxed">
            Browse available paintings and find the perfect piece that speaks to you. 
            Each artwork comes with a certificate of authenticity.
          </p>
          <Link
            href="/gallery"
            className="inline-flex items-center bg-white text-gray-900 px-8 py-4 rounded-full font-serif font-medium text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            View Gallery
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}