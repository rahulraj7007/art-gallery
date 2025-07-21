// src/app/about/page.tsx - Aja Eriksson von Weissenberg About Page
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Palette, Film, BookOpen, Hammer, Paintbrush } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Clean Header */}
      <section className="pt-16 pb-12 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-gray-900 mb-4">
            Aja Eriksson von Weissenberg
          </h1>
          <p className="text-xl text-gray-600 font-serif leading-relaxed">
            Contemporary Artist & Distinguished Voice in Gothenburg's Cultural Landscape
          </p>
        </div>
      </section>

      {/* Artist Statement */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-serif font-medium text-gray-900 mb-8">Artist Statement</h2>
            <blockquote className="text-xl font-serif italic text-gray-700 leading-relaxed border-l-4 border-gray-200 pl-8 mx-auto max-w-3xl text-left">
              "My works move between light and dark, longing and farewell. The motifs return, 
              like old friends. You might need to rest for a bit, as age makes itself heard. 
              You lie down on the sofa. Then unexpected sneaks back into the image again. 
              Situations arise, with new stories."
            </blockquote>
            <p className="text-gray-600 font-serif mt-6">— Aja Eriksson von Weissenberg</p>
          </div>
        </div>
      </section>

      {/* Artist Image Section - NEW */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-lg shadow-xl">
            <Image
              src="/images/aja-exhibition.jpg" // Update this path when you upload your image
              alt="Aja Eriksson von Weissenberg at Christinehof Castle for the Rebel Girls exhibition"
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
              <p className="text-white font-serif text-lg">
                Aja Eriksson von Weissenberg at Christinehof Castle for the "Rebel Girls" exhibition
              </p>
              <p className="text-white/80 font-serif text-sm mt-2">
                Featured painting: "Afternoon Tea in Stockholm 1793"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Biography */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <h2 className="text-3xl font-serif font-light text-gray-900 mb-8">Artistic Journey</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-serif font-medium text-gray-900 mb-4">Education & Foundation</h3>
                  <p className="text-gray-700 font-serif leading-relaxed">
                    After graduating from HDK (Högskolan för design och konsthantverk) in 1972, 
                    Aja embarked on a remarkable artistic journey that would span decades and 
                    encompass an extraordinary range of creative disciplines.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-medium text-gray-900 mb-4">Diverse Training</h3>
                  <p className="text-gray-700 font-serif leading-relaxed">
                    Her broad artistic training reflects a deep commitment to mastering various 
                    forms of expression — from the industrial craft of welding to the delicate 
                    art of bookbinding, from scriptwriting to the ancient technique of 
                    fresco painting at the Royal Institute of Art.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-medium text-gray-900 mb-4">Cultural Impact</h3>
                  <p className="text-gray-700 font-serif leading-relaxed">
                    With a long list of exhibitions, short films, illustrations, and scenographic 
                    works, Aja has contributed significantly to Gothenburg's cultural life. Her 
                    public commissions throughout the city stand as testaments to her enduring 
                    artistic vision.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Skills Grid */}
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <h3 className="text-xl font-serif font-medium text-gray-900 mb-6">Artistic Disciplines</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-3 py-2">
                    <Paintbrush className="h-5 w-5 text-gray-600" />
                    <span className="font-serif text-gray-700">Oil Painting & Fresco</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 py-2">
                    <Film className="h-5 w-5 text-gray-600" />
                    <span className="font-serif text-gray-700">Short Films & Scriptwriting</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 py-2">
                    <BookOpen className="h-5 w-5 text-gray-600" />
                    <span className="font-serif text-gray-700">Bookbinding & Illustration</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 py-2">
                    <Hammer className="h-5 w-5 text-gray-600" />
                    <span className="font-serif text-gray-700">Welding & Metalwork</span>
                  </div>
                  
                  <div className="flex items-center space-x-3 py-2">
                    <Palette className="h-5 w-5 text-gray-600" />
                    <span className="font-serif text-gray-700">Scenography & Public Art</span>
                  </div>
                </div>
              </div>

              {/* Current Exhibition */}
              <div className="bg-white border border-gray-200 rounded-lg p-8">
                <h3 className="text-lg font-serif font-medium text-gray-900 mb-4">Current Exhibition</h3>
                <div className="space-y-2 mb-4">
                  <p className="text-gray-900 font-serif">"Echoes of the North"</p>
                  <p className="text-gray-600 font-serif">Galleri Anna H, Göteborg</p>
                  <p className="text-gray-500 font-serif text-sm">Through August 2025</p>
                </div>
                <Link
                  href="/gallery"
                  className="inline-flex items-center text-gray-900 font-serif font-medium hover:text-gray-700 transition-colors border-b border-gray-300 hover:border-gray-700 pb-1"
                >
                  View available works
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legacy Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-light text-gray-900 mb-8">
              Gothenburg's Cultural Heritage
            </h2>
          </div>
          
          <div className="space-y-8 mb-12">
            <p className="text-lg text-gray-700 font-serif leading-relaxed">
              For decades, Aja has been an integral part of Gothenburg's artistic community. 
              Her public commissions can be seen throughout the city, marking moments and 
              places with her distinctive vision. From galleries to public spaces, her work 
              continues to enrich the cultural landscape of the city.
            </p>
            <p className="text-gray-600 font-serif leading-relaxed">
              Each piece reflects a lifetime of dedication to the arts, where technical mastery 
              meets profound emotional expression. Her works invite viewers into intimate 
              conversations about light and shadow, presence and absence, the familiar and 
              the unexpected.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/gallery"
              className="bg-gray-900 text-white px-8 py-3 rounded hover:bg-gray-800 transition-colors font-serif font-medium text-center"
            >
              Explore Available Works
            </Link>
            <Link
              href="/contact"
              className="border border-gray-300 text-gray-900 px-8 py-3 rounded hover:bg-gray-100 transition-colors font-serif font-medium text-center"
            >
              Inquire About Commissions
            </Link>
          </div>
        </div>
      </section>

      {/* Recognition Section */}
      <section className="py-16 border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center">
            <h3 className="text-2xl font-serif font-light text-gray-900 mb-8">Recognition & Experience</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-serif font-light text-gray-900">50+</div>
                <div className="text-gray-600 font-serif text-sm">Years of Excellence</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-serif font-light text-gray-900">HDK</div>
                <div className="text-gray-600 font-serif text-sm">Graduate 1972</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-serif font-light text-gray-900">Multiple</div>
                <div className="text-gray-600 font-serif text-sm">Public Commissions</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}