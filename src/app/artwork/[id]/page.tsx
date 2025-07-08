import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import ArtworkClient from './ArtworkClient';

interface Artwork {
  id: string;
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
  description: string;
  medium: string;
  dimensions: string;
  category: string;
  year: number;
  inStock: boolean;
}

// Generate static params for all artworks at build time
export async function generateStaticParams() {
  try {
    const artworksRef = collection(db, 'artworks');
    const snapshot = await getDocs(artworksRef);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Return empty array as fallback
    return [];
  }
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ArtworkPage({ params }: PageProps) {
  let artwork: Artwork | null = null;

  try {
    const artworkDoc = await getDoc(doc(db, 'artworks', params.id));
    if (artworkDoc.exists()) {
      artwork = { id: artworkDoc.id, ...artworkDoc.data() } as Artwork;
    }
  } catch (error) {
    console.error('Error fetching artwork:', error);
  }

  if (!artwork) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Artwork Not Found</h1>
          <p className="text-gray-600">The artwork you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  return <ArtworkClient artwork={artwork} />;
}