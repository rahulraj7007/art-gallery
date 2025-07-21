// Add this component to your admin panel

import { useState } from 'react';
import { ref, deleteObject } from 'firebase/storage';
import { updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { storage, db } from '@/lib/firebase/config';
import { Trash2, AlertTriangle, CheckSquare, Square, Image as ImageIcon } from 'lucide-react';

// Add the Artwork interface
interface Artwork {
  id: string;
  title: string;
  artist: string;
  price?: number;
  imageUrls: string[];
  description?: string;
  medium?: string;
  dimensions?: string;
  inStock?: boolean;
  category?: string;
  collection?: string;
  tags?: string[];
  year?: number;
  availabilityType?: 'for-sale' | 'enquire-only' | 'exhibition' | 'commissioned' | 'sold';
  availableAsPaperPrint?: boolean;
  availableAsCanvasPrint?: boolean;
  createdAt: any;
  updatedAt?: any;
}

interface BulkImageDeleteProps {
  artworks: Artwork[];
  onComplete: () => void;
}

export function BulkImageDelete({ artworks, onComplete }: BulkImageDeleteProps) {
  const [selectedArtworks, setSelectedArtworks] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteProgress, setDeleteProgress] = useState({ current: 0, total: 0 });
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const toggleArtworkSelection = (artworkId: string) => {
    const newSelection = new Set(selectedArtworks);
    if (newSelection.has(artworkId)) {
      newSelection.delete(artworkId);
    } else {
      newSelection.add(artworkId);
    }
    setSelectedArtworks(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedArtworks.size === artworks.length) {
      setSelectedArtworks(new Set());
    } else {
      setSelectedArtworks(new Set(artworks.map(a => a.id)));
    }
  };

  const getSelectedArtworksData = () => {
    return artworks.filter(artwork => selectedArtworks.has(artwork.id));
  };

  const getTotalImagesCount = () => {
    return getSelectedArtworksData().reduce((total, artwork) => {
      return total + (artwork.imageUrls?.length || 0);
    }, 0);
  };

  const extractStoragePathFromUrl = (url: string): string | null => {
    try {
      // Firebase Storage URLs contain the path after '/o/'
      const match = url.match(/\/o\/(.+?)\?/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
      return null;
    } catch (error) {
      console.error('Error extracting storage path:', error);
      return null;
    }
  };

  const deleteImagesFromStorage = async (imageUrls: string[]) => {
    const errors: string[] = [];
    
    for (const url of imageUrls) {
      try {
        const storagePath = extractStoragePathFromUrl(url);
        if (storagePath) {
          const imageRef = ref(storage, storagePath);
          await deleteObject(imageRef);
          console.log(`Deleted: ${storagePath}`);
        } else {
          console.warn(`Could not extract storage path from URL: ${url}`);
        }
      } catch (error: any) {
        if (error.code === 'storage/object-not-found') {
          console.log(`Image already deleted or not found: ${url}`);
        } else {
          console.error(`Error deleting image: ${url}`, error);
          errors.push(url);
        }
      }
    }
    
    return errors;
  };

  const handleBulkDelete = async () => {
    setShowConfirmModal(false);
    setIsDeleting(true);
    
    const selectedArtworksData = getSelectedArtworksData();
    const totalImages = getTotalImagesCount();
    
    setDeleteProgress({ current: 0, total: totalImages });
    
    let processedImages = 0;
    const errors: string[] = [];

    try {
      for (const artwork of selectedArtworksData) {
        // Delete images from storage first
        if (artwork.imageUrls && artwork.imageUrls.length > 0) {
          const deleteErrors = await deleteImagesFromStorage(artwork.imageUrls);
          errors.push(...deleteErrors);
          processedImages += artwork.imageUrls.length;
          setDeleteProgress({ current: processedImages, total: totalImages });
        }
        
        // Delete the entire artwork document from Firestore
        await deleteDoc(doc(db, 'artworks', artwork.id));
      }
      
      if (errors.length > 0) {
        alert(`Completed with ${errors.length} storage errors. ${selectedArtworksData.length} artworks were deleted from the database.`);
      } else {
        alert(`Successfully deleted ${selectedArtworksData.length} artworks and ${totalImages} images completely!`);
      }
      
      // Reset selection
      setSelectedArtworks(new Set());
      
      // Refresh the artworks list
      onComplete();
      
    } catch (error) {
      console.error('Error during bulk delete:', error);
      alert('An error occurred during bulk delete. Please check the console for details.');
    } finally {
      setIsDeleting(false);
      setDeleteProgress({ current: 0, total: 0 });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Bulk Delete Artworks</h3>
          <p className="text-sm text-gray-600 mt-1">
            Select artworks to delete completely (including all images and data)
          </p>
        </div>
        
        {selectedArtworks.size > 0 && (
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={isDeleting}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center space-x-2 disabled:opacity-50"
          >
            <Trash2 className="h-5 w-5" />
            <span>Delete {selectedArtworks.size} Artwork{selectedArtworks.size !== 1 ? 's' : ''}</span>
          </button>
        )}
      </div>

      {/* Select All */}
      <div className="flex items-center space-x-2 pb-2 border-b">
        <button
          onClick={toggleSelectAll}
          className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
        >
          {selectedArtworks.size === artworks.length ? (
            <CheckSquare className="h-4 w-4" />
          ) : (
            <Square className="h-4 w-4" />
          )}
          <span>Select All ({artworks.length} artworks)</span>
        </button>
        
        {selectedArtworks.size > 0 && (
          <span className="text-sm text-gray-600 ml-4">
            {selectedArtworks.size} selected • {getTotalImagesCount()} total images
          </span>
        )}
      </div>

      {/* Progress Bar */}
      {isDeleting && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-blue-900">Deleting artworks and images...</span>
            <span className="text-sm text-blue-700">
              {deleteProgress.current} / {deleteProgress.total} images deleted
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(deleteProgress.current / deleteProgress.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Artworks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {artworks.map((artwork) => {
          const isSelected = selectedArtworks.has(artwork.id);
          const imageCount = artwork.imageUrls?.length || 0;
          
          return (
            <div
              key={artwork.id}
              onClick={() => toggleArtworkSelection(artwork.id)}
              className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                isSelected 
                  ? 'border-red-500 shadow-lg' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Selection Indicator */}
              <div className={`absolute top-2 right-2 z-10 ${
                isSelected ? 'bg-red-500' : 'bg-white'
              } rounded-full p-1 shadow-md`}>
                {isSelected ? (
                  <CheckSquare className="h-5 w-5 text-white" />
                ) : (
                  <Square className="h-5 w-5 text-gray-600" />
                )}
              </div>

              {/* Image Preview */}
              {artwork.imageUrls && artwork.imageUrls.length > 0 ? (
                <img
                  src={artwork.imageUrls[0]}
                  alt={artwork.title}
                  className="w-full h-32 object-cover"
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
              )}

              {/* Artwork Info */}
              <div className="p-3 bg-white">
                <h4 className="font-medium text-sm text-gray-900 truncate">{artwork.title}</h4>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-600">
                    {imageCount} image{imageCount !== 1 ? 's' : ''}
                  </span>
                  {isSelected && (
                    <span className="text-xs text-red-600 font-medium">
                      Will be deleted completely
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <h3 className="text-lg font-bold text-gray-900">Confirm Bulk Delete</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <p className="text-gray-700">
                You are about to permanently delete:
              </p>
              <div className="bg-red-50 p-3 rounded">
                <p className="text-red-900 font-medium">
                  • {selectedArtworks.size} complete artwork{selectedArtworks.size !== 1 ? 's' : ''}
                </p>
                <p className="text-red-900 font-medium">
                  • {getTotalImagesCount()} image{getTotalImagesCount() !== 1 ? 's' : ''} from storage
                </p>
                <p className="text-red-900 font-medium">
                  • All associated data and metadata
                </p>
              </div>
              <p className="text-sm text-gray-600">
                This will completely remove the selected artworks from your gallery, including all images, titles, descriptions, and other information.
              </p>
              <p className="text-sm text-red-600 font-medium">
                ⚠️ This action cannot be undone! The artworks will be gone forever.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleBulkDelete}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700"
              >
                Delete Artworks Permanently
              </button>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}