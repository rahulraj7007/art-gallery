// src/app/about/page.tsx - Aja Eriksson von Weissenberg About Page
import Link from 'next/link';
import { ArrowRight, Palette, Film, BookOpen, Hammer, Paintbrush } from 'lucide-react';

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-yellow-50 to-blue-50">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-yellow-200/40 to-orange-300/20 rounded-full blur-3xl transform rotate-12"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-bl from-blue-200/30 to-cyan-300/20 rounded-full blur-3xl transform -rotate-12"></div>
            <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-tr from-emerald-700/20 to-green-600/15 rounded-full blur-3xl transform rotate-45"></div>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-light text-gray-900 mb-6 leading-tight">
            Aja Eriksson
            <span className="block text-4xl md:text-5xl font-serif font-normal text-gray-800">
              von Weissenberg
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-serif font-light leading-relaxed">
            A distinguished voice in Gothenburg's cultural landscape
          </p>
        </div>
      </section>

      {/* Artist Statement */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-light text-gray-900 mb-8">Artist Statement</h2>
            <blockquote className="text-2xl font-serif italic text-gray-800 leading-relaxed relative">
              <div className="absolute -top-4 -left-4 text-6xl text-yellow-400 font-serif">&ldquo;</div>
              My works move between light and dark, longing and farewell. The motifs return, 
              like old friends. You might need to rest for a bit, as age makes itself heard. 
              You lie down on the sofa. Then unexpected sneaks back into the image again. 
              Situations arise, with new stories.
              <div className="absolute -bottom-8 -right-4 text-6xl text-yellow-400 font-serif">&rdquo;</div>
            </blockquote>
            <p className="text-lg font-serif text-gray-600 mt-8">— Aja Eriksson von Weissenberg</p>
          </div>
        </div>
      </section>

      {/* Biography */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-4xl font-serif font-light text-gray-900 mb-8">Artistic Journey</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-medium text-gray-900 mb-3">Education & Foundation</h3>
                  <p className="text-lg text-gray-700 font-serif leading-relaxed">
                    After graduating from HDK (Högskolan för design och konsthantverk) in 1972, 
                    Aja embarked on a remarkable artistic journey that would span decades and 
                    encompass an extraordinary range of creative disciplines.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-serif font-medium text-gray-900 mb-3">Diverse Training</h3>
                  <p className="text-lg text-gray-700 font-serif leading-relaxed">
                    Her broad artistic training reflects a deep commitment to mastering various 
                    forms of expression &mdash; from the industrial craft of welding to the delicate 
                    art of bookbinding, from scriptwriting at DI to the ancient technique of 
                    fresco painting at the Royal Institute of Art.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-serif font-medium text-gray-900 mb-3">Cultural Impact</h3>
                  <p className="text-lg text-gray-700 font-serif leading-relaxed">
                    With a long list of exhibitions, short films, illustrations, and scenographic 
                    works, Aja has contributed significantly to Gothenburg&apos;s cultural life. Her 
                    public commissions throughout the city stand as testaments to her enduring 
                    artistic vision.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Skills Grid */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h3 className="text-2xl font-serif font-light text-gray-900 mb-6">Artistic Disciplines</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg flex items-center justify-center">
                      <Paintbrush className="h-5 w-5 text-orange-600" />
                    </div>
                    <span className="font-serif text-gray-700">Fresco Painting</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                      <Film className="h-5 w-5 text-cyan-600" />
                    </div>
                    <span className="font-serif text-gray-700">Short Films</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-emerald-600" />
                    </div>
                    <span className="font-serif text-gray-700">Bookbinding</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <Hammer className="h-5 w-5 text-gray-600" />
                    </div>
                    <span className="font-serif text-gray-700">Welding</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                      <Palette className="h-5 w-5 text-purple-600" />
                    </div>
                    <span className="font-serif text-gray-700">Scenography</span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-indigo-600" />
                    </div>
                    <span className="font-serif text-gray-700">Scriptwriting</span>
                  </div>
                </div>
              </div>

              {/* Current Exhibition */}
              <div className="bg-gradient-to-br from-yellow-50 to-blue-50 rounded-2xl p-8 border border-gray-100">
                <h3 className="text-xl font-serif font-medium text-gray-900 mb-4">Current Exhibition</h3>
                <p className="text-lg font-serif text-gray-700 leading-relaxed mb-4">
                  Aja Eriksson is currently exhibiting paintings and other works at 
                  <span className="font-medium"> Galleri Anna H</span>. The public is invited 
                  to experience her distinctive artistic voice.
                </p>
                <Link
                  href="/gallery"
                  className="inline-flex items-center text-gray-900 font-serif font-medium hover:text-gray-700 transition-colors"
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
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-light text-gray-900 mb-8">
            Gothenburg's Cultural Heritage
          </h2>
          <p className="text-xl text-gray-700 font-serif leading-relaxed mb-8">
            For decades, Aja has been an integral part of Gothenburg&apos;s artistic community. 
            Her public commissions can be seen throughout the city, marking moments and 
            places with her distinctive vision. From galleries to public spaces, her work 
            continues to enrich the cultural landscape of the city.
          </p>
          <p className="text-lg text-gray-600 font-serif leading-relaxed mb-12">
            Each piece reflects a lifetime of dedication to the arts, where technical mastery 
            meets profound emotional expression. Her works invite viewers into intimate 
            conversations about light and shadow, presence and absence, the familiar and 
            the unexpected.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/gallery"
              className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-4 rounded-full hover:from-gray-800 hover:to-gray-700 transition-all duration-300 font-serif font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Explore Available Works
            </Link>
            <Link
              href="/contact"
              className="border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-full hover:bg-gray-900 hover:text-white transition-all duration-300 font-serif font-medium"
            >
              Inquire About Commissions
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}