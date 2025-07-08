import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { notFound } from 'next/navigation';
import ArtworkClient from './ArtworkClient';

// Updated interface to match your flexible artwork system
interface Artwork {
  id: string;
  title: string;
  artist: string;
  price?: number; // Optional for enquire-only pieces
  imageUrl: string;
  description?: string; // Optional
  medium?: string; // Optional
  dimensions?: string; // Optional
  category?: string; // Optional
  year?: number; // Optional
  availabilityType?: 'for-sale' | 'enquire-only' | 'exhibition' | 'commissioned' | 'sold';
  inStock?: boolean; // Optional
}

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ArtworkPage({ params }: PageProps) {
  console.log('ArtworkPage called with params:', params);
  
  try {
    console.log('Attempting to fetch artwork with ID:', params.id);
    const artworkDoc = await getDoc(doc(db, 'artworks', params.id));
    
    console.log('Document exists:', artworkDoc.exists());
    
    if (!artworkDoc.exists()) {
      console.log('Document does not exist, calling notFound()');
      notFound();
    }

    const rawData = artworkDoc.data();
    console.log('Raw data from Firestore:', rawData);
    
    // Check if we have essential data
    if (!rawData || !rawData.title || !rawData.artist || !rawData.imageUrl) {
      console.error('Missing essential artwork data:', rawData);
      notFound();
    }
    
    // Manually map Firebase data to avoid serialization issues
    const artwork: Artwork = {
      id: artworkDoc.id,
      title: rawData.title,
      artist: rawData.artist,
      price: rawData.price || undefined,
      imageUrl: rawData.imageUrl,
      description: rawData.description || undefined,
      medium: rawData.medium || undefined,
      dimensions: rawData.dimensions || undefined,
      category: rawData.category || undefined,
      year: rawData.year || undefined,
      availabilityType: rawData.availabilityType || 'for-sale',
      inStock: rawData.inStock !== false,
    };

    console.log('Processed artwork object:', artwork);

    // Additional validation
    if (!artwork.title || !artwork.artist || !artwork.imageUrl) {
      console.error('Artwork missing required fields after processing:', artwork);
      notFound();
    }

    console.log('Rendering ArtworkClient with artwork:', artwork);
    return <ArtworkClient artwork={artwork} />;
  } catch (error) {
    console.error('Error in ArtworkPage:', error);
    notFound();
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  try {
    const artworkDoc = await getDoc(doc(db, 'artworks', params.id));

    if (!artworkDoc.exists()) {
      return {
        title: 'Artwork Not Found | Aja Eriksson von Weissenberg',
      };
    }

    const data = artworkDoc.data();
    
    return {
      title: `${data.title} by ${data.artist} | Aja Eriksson von Weissenberg`,
      description: data.description || `Original artwork "${data.title}" by ${data.artist}. ${data.medium || 'Artwork'} available through Aja Eriksson von Weissenberg gallery.`,
      openGraph: {
        title: `${data.title} by ${data.artist}`,
        description: data.description || `Original artwork by ${data.artist}`,
        images: data.imageUrl ? [
          {
            url: data.imageUrl,
            width: 800,
            height: 600,
            alt: data.title,
          },
        ] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Artwork | Aja Eriksson von Weissenberg',
    };
  }
}