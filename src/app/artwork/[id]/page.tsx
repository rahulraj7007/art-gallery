import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { notFound } from 'next/navigation';
import ArtworkClient from './ArtworkClient';

// ✅ UPDATED: Support both old and new image structures
export interface Artwork {
  id: string;
  title: string;
  artist: string;
  price?: number; // Optional for enquire-only pieces
  imageUrl?: string; // OLD: Single image (backward compatibility)
  imageUrls?: string[]; // NEW: Multiple images array
  description?: string; // Optional
  medium?: string; // Optional
  dimensions?: string; // Optional
  category?: string; // Optional
  year?: number; // Optional
  availabilityType?: 'for-sale' | 'enquire-only' | 'exhibition' | 'commissioned' | 'sold';
  inStock?: boolean; // Optional
  collection?: string; // Optional
  tags?: string[]; // Optional
  availableAsPaperPrint?: boolean; // Optional
  availableAsCanvasPrint?: boolean; // Optional
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
    
    // ✅ UPDATED: Check for images in both old and new formats
    const hasOldImage = rawData?.imageUrl;
    const hasNewImages = rawData?.imageUrls && Array.isArray(rawData.imageUrls) && rawData.imageUrls.length > 0;
    const hasAnyImage = hasOldImage || hasNewImages;
    
    // Check if we have essential data
    if (!rawData || !rawData.title || !rawData.artist) {
      console.error('Missing essential artwork data (title/artist):', rawData);
      notFound();
    }

    // ✅ UPDATED: Handle both image structures, but don't require images
    console.log('Image check - Old image:', hasOldImage, 'New images:', hasNewImages, 'Has any:', hasAnyImage);
    
    // ✅ UPDATED: Manually map Firebase data with support for multiple images
    const artwork: Artwork = {
      id: artworkDoc.id,
      title: rawData.title,
      artist: rawData.artist,
      price: rawData.price || undefined,
      description: rawData.description || undefined,
      medium: rawData.medium || undefined,
      dimensions: rawData.dimensions || undefined,
      category: rawData.category || undefined,
      year: rawData.year || undefined,
      availabilityType: rawData.availabilityType || 'enquire-only',
      inStock: rawData.inStock !== false,
      collection: rawData.collection || undefined,
      tags: rawData.tags || [],
      availableAsPaperPrint: rawData.availableAsPaperPrint !== false,
      availableAsCanvasPrint: rawData.availableAsCanvasPrint !== false,
      
      // ✅ UPDATED: Handle both old and new image structures
      imageUrls: rawData.imageUrls || (rawData.imageUrl ? [rawData.imageUrl] : []),
      imageUrl: rawData.imageUrl || (rawData.imageUrls && rawData.imageUrls[0]) || undefined
    };

    console.log('Processed artwork object:', artwork);

    // ✅ UPDATED: Only validate essential fields (title, artist)
    if (!artwork.title || !artwork.artist) {
      console.error('Artwork missing required fields after processing:', artwork);
      notFound();
    }

    // ✅ UPDATED: Log image information for debugging
    console.log('Image info - imageUrl:', artwork.imageUrl, 'imageUrls:', artwork.imageUrls);

    console.log('Rendering ArtworkClient with artwork:', artwork);
    return <ArtworkClient artwork={artwork} />;
  } catch (error) {
    console.error('Error in ArtworkPage:', error);
    notFound();
  }
}

// ✅ UPDATED: Generate metadata for SEO with multiple images support
export async function generateMetadata({ params }: PageProps) {
  try {
    const artworkDoc = await getDoc(doc(db, 'artworks', params.id));

    if (!artworkDoc.exists()) {
      return {
        title: 'Artwork Not Found | Aja Eriksson von Weissenberg',
      };
    }

    const data = artworkDoc.data();
    
    // ✅ UPDATED: Get primary image from either old or new structure
    const getPrimaryImage = () => {
      if (data.imageUrls && Array.isArray(data.imageUrls) && data.imageUrls.length > 0) {
        return data.imageUrls[0];
      }
      if (data.imageUrl) {
        return data.imageUrl;
      }
      return null;
    };

    const primaryImage = getPrimaryImage();
    
    return {
      title: `${data.title} by ${data.artist} | Aja Eriksson von Weissenberg`,
      description: data.description || `Original artwork "${data.title}" by ${data.artist}. ${data.medium || 'Artwork'} available through Aja Eriksson von Weissenberg gallery.`,
      openGraph: {
        title: `${data.title} by ${data.artist}`,
        description: data.description || `Original artwork by ${data.artist}`,
        images: primaryImage ? [
          {
            url: primaryImage,
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