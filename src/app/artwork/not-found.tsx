// src/app/artwork/[id]/not-found.tsx - 404 page for artwork
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <h1 className="text-4xl font-serif font-light text-gray-900 mb-6">
          Artwork Not Found
        </h1>
        <p className="text-lg text-gray-600 font-serif leading-relaxed mb-8">
          The artwork you're looking for doesn't exist or may have been removed from the gallery.
        </p>
        <div className="space-y-4">
          <Link
            href="/gallery"
            className="block bg-gray-900 text-white px-8 py-3 font-serif font-medium hover:bg-gray-800 transition-colors"
          >
            Browse Gallery
          </Link>
          <Link
            href="/"
            className="block text-gray-600 hover:text-gray-900 font-serif transition-colors border-b border-gray-300 hover:border-gray-700 pb-1"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}