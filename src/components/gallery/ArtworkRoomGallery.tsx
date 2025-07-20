// Dynamic Artwork Positioning Based on Actual Artwork Dimensions
// Automatically adjusts size and position based on artwork aspect ratio

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';

interface RoomMockup {
  id: string;
  title: string;
  description: string;
  roomType: string;
  imageUrl: string;
  // Base positioning - will be adjusted per artwork
  basePosition: {
    top: string;
    left: string;
    maxWidth: string;
    maxHeight: string;
  };
}

interface ArtworkRoomGalleryProps {
  artworkImageUrl: string;
  artworkTitle: string;
}

export default function ArtworkRoomGallery({ artworkImageUrl, artworkTitle }: ArtworkRoomGalleryProps) {
  const [selectedMockup, setSelectedMockup] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [artworkDimensions, setArtworkDimensions] = useState<{width: number; height: number} | null>(null);

  // Load artwork dimensions
  useEffect(() => {
    const img = document.createElement('img');
    img.onload = () => {
      setArtworkDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    img.src = artworkImageUrl;
  }, [artworkImageUrl]);

  // Calculate dynamic positioning based on artwork aspect ratio
  const getArtworkPosition = (roomMockup: RoomMockup) => {
    if (!artworkDimensions) {
      // Fallback to your exact positioning while loading
      return {
        top: roomMockup.basePosition.top + '%',
        left: roomMockup.basePosition.left + '%',
        width: roomMockup.basePosition.maxWidth + '%',
        height: roomMockup.basePosition.maxHeight + '%'
      };
    }

    const aspectRatio = artworkDimensions.width / artworkDimensions.height;
    const baseTop = parseInt(roomMockup.basePosition.top);
    const baseLeft = parseInt(roomMockup.basePosition.left);
    const baseWidth = parseInt(roomMockup.basePosition.maxWidth);
    const baseHeight = parseInt(roomMockup.basePosition.maxHeight);

    let width: number, height: number;
    let leftAdjustment = 0;
    let topAdjustment = 0;

    if (aspectRatio > 1.6) {
      // VERY WIDE landscape artwork
      width = Math.min(baseWidth + 5, 45); // Slightly wider
      height = baseHeight - 3; // Slightly shorter
      leftAdjustment = -2; // Shift slightly left to balance
      topAdjustment = 1; // Slightly lower
    } else if (aspectRatio > 1.2) {
      // LANDSCAPE artwork (moderately wide)
      width = baseWidth + 2; // Slightly wider
      height = baseHeight - 1; // Slightly shorter
      leftAdjustment = -1; // Minor left adjustment
      topAdjustment = 0; // Keep your tested height
    } else if (aspectRatio < 0.7) {
      // PORTRAIT artwork (tall)
      width = baseWidth - 5; // Narrower
      height = Math.min(baseHeight + 5, 40); // Taller
      leftAdjustment = 2; // Center better
      topAdjustment = -1; // Slightly higher
    } else if (aspectRatio < 0.9) {
      // TALL-ish artwork
      width = baseWidth - 2; // Slightly narrower
      height = baseHeight + 2; // Slightly taller
      leftAdjustment = 1; // Minor centering
      topAdjustment = 0; // Keep your tested height
    } else {
      // SQUARE or near-square artwork - use your exact positioning
      width = baseWidth;
      height = baseHeight;
      leftAdjustment = 0;
      topAdjustment = 0;
    }

    // Apply adjustments to your tested positions
    const finalLeft = Math.max(2, Math.min(85, baseLeft + leftAdjustment));
    const finalTop = Math.max(1, Math.min(75, baseTop + topAdjustment));

    return {
      top: `${finalTop}%`,
      left: `${finalLeft}%`,
      width: `${Math.min(50, width)}%`,
      height: `${Math.min(45, height)}%`
    };
  };

  // Room configurations with YOUR tested positioning as base
  const roomMockups: RoomMockup[] = [
    {
      id: 'living-room-2',
      title: 'Cozy Living Room',
      description: 'Perfect placement in your ideal living space',
      roomType: 'Living Room',
      imageUrl: '/images/rooms/living-room-2.jpg',
      basePosition: {
        top: '13',      // Your tested position
        left: '15',     // Your tested position  
        maxWidth: '30', // Your tested width
        maxHeight: '25' // Your tested height
      }
    },
    {
      id: 'bedroom-1',
      title: 'Cozy Bedroom',
      description: 'Perfect above the headboard for a serene atmosphere',
      roomType: 'Bedroom',
      imageUrl: '/images/rooms/bed-room-1.jpg',
      basePosition: {
        top: '3',       // Your tested position
        left: '33',     // Your tested position
        maxWidth: '34', // Your tested width
        maxHeight: '35' // Your tested height
      }
    },
    {
      id: 'minimal-1',
      title: 'Minimalist Living',
      description: 'Clean lines and artistic focus',
      roomType: 'Minimalist',
      imageUrl: '/images/rooms/minimal-1.jpg',
      basePosition: {
        top: '10',      // Your tested position
        left: '37',     // Your tested position
        maxWidth: '35', // Your tested width
        maxHeight: '32' // Your tested height
      }
    },
    {
      id: 'minimal-2',
      title: 'Modern Minimalist',
      description: 'Sophisticated simplicity with artistic impact',
      roomType: 'Minimalist',
      imageUrl: '/images/rooms/minimal-2.jpg',
      basePosition: {
        top: '6',       // Your tested position
        left: '30',     // Your tested position
        maxWidth: '32', // Your tested width
        maxHeight: '28' // Your tested height
      }
    }
  ];

  const currentMockup = roomMockups[selectedMockup];
  const currentArtworkPosition = getArtworkPosition(currentMockup);

  const nextMockup = () => {
    setSelectedMockup((prev) => (prev + 1) % roomMockups.length);
  };

  const prevMockup = () => {
    setSelectedMockup((prev) => (prev - 1 + roomMockups.length) % roomMockups.length);
  };

  return (
    <>
      <div className="bg-gray-50 rounded-lg p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-3xl font-serif font-light text-gray-900 mb-4">
              See It In Your Space
            </h3>
            <p className="text-lg font-serif text-gray-700 leading-relaxed">
              Visualize how "{artworkTitle}" would look in different room settings and interior styles.
            </p>
            {artworkDimensions && (
              <p className="text-sm font-serif text-gray-500 mt-2">
                Optimized for {artworkDimensions.width > artworkDimensions.height * 1.2 ? 'landscape' : 
                              artworkDimensions.height > artworkDimensions.width * 1.2 ? 'portrait' : 'square'} artwork 
                ({Math.round(artworkDimensions.width/artworkDimensions.height * 100)/100} ratio)
              </p>
            )}
          </div>

          {/* Main Room Display */}
          <div className="relative mb-8">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-2xl group">
              {/* Room Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={currentMockup.imageUrl}
                  alt={`${currentMockup.roomType} interior`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 80vw"
                  priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-5"></div>
              </div>

              {/* Dynamic Artwork Overlay - NO WHITE MAT */}
              <div 
                className="absolute border-2 border-gray-800 shadow-2xl transform hover:scale-105 transition-all duration-300 z-10 overflow-hidden"
                style={{
                  top: currentArtworkPosition.top,
                  left: currentArtworkPosition.left,
                  width: currentArtworkPosition.width,
                  height: currentArtworkPosition.height,
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15), 0 4px 10px rgba(0,0,0,0.1)'
                }}
              >
                <Image
                  src={artworkImageUrl}
                  alt={artworkTitle}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 30vw"
                />
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevMockup}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
              >
                <ChevronLeft className="h-6 w-6 text-gray-900" />
              </button>

              <button
                onClick={nextMockup}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
              >
                <ChevronRight className="h-6 w-6 text-gray-900" />
              </button>

              {/* Fullscreen Button */}
              <button
                onClick={() => setIsFullscreen(true)}
                className="absolute top-4 right-4 bg-white bg-opacity-90 hover:bg-opacity-100 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-20"
              >
                <Maximize2 className="h-5 w-5 text-gray-900" />
              </button>

              {/* Room Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 z-10">
                <div className="text-white">
                  <h4 className="text-xl font-serif font-medium mb-1">
                    {currentMockup.title}
                  </h4>
                  <p className="text-gray-300 font-serif text-sm">
                    {currentMockup.description}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Room Selection Thumbnails */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {roomMockups.map((mockup, index) => {
              const thumbnailPosition = getArtworkPosition(mockup);
              return (
                <button
                  key={mockup.id}
                  onClick={() => setSelectedMockup(index)}
                  className={`relative aspect-[4/3] rounded-lg overflow-hidden transition-all duration-300 ${
                    selectedMockup === index
                      ? 'ring-2 ring-red-900 ring-offset-2 shadow-lg'
                      : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
                  }`}
                >
                  {/* Thumbnail Room Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={mockup.imageUrl}
                      alt={`${mockup.roomType} thumbnail`}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-10"></div>
                  </div>

                  {/* Small Artwork with Dynamic Positioning - NO WHITE MAT */}
                  <div 
                    className="absolute border border-gray-800 shadow-md z-10 overflow-hidden"
                    style={{
                      top: thumbnailPosition.top,
                      left: thumbnailPosition.left,
                      width: thumbnailPosition.width,
                      height: thumbnailPosition.height,
                    }}
                  >
                    <Image
                      src={artworkImageUrl}
                      alt={artworkTitle}
                      fill
                      className="object-cover"
                      sizes="50px"
                    />
                  </div>

                  {/* Room Type Label */}
                  <div className="absolute bottom-1 left-1 right-1 bg-black bg-opacity-70 rounded px-2 py-1">
                    <div className="text-xs text-white font-serif text-center truncate">
                      {mockup.roomType}
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedMockup === index && (
                    <div className="absolute inset-0 bg-red-900 bg-opacity-10 border-2 border-red-900 rounded-lg z-20" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Room Details */}
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-sm">
              <span className="text-sm font-serif text-gray-600">Currently viewing:</span>
              <span className="text-sm font-serif font-medium text-gray-900">
                {currentMockup.title}
              </span>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-serif font-medium text-gray-900 mb-2">Optimized Placement</h4>
              <p className="text-sm font-serif text-gray-600">
                Based on manually tested positions, then fine-tuned for each artwork's specific aspect ratio.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-serif font-medium text-gray-900 mb-2">Complete Artwork</h4>
              <p className="text-sm font-serif text-gray-600">
                The entire artwork is always visible, preserving the original aspect ratio and artistic composition.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h4 className="font-serif font-medium text-gray-900 mb-2">Realistic Display</h4>
              <p className="text-sm font-serif text-gray-600">
                Shows exactly how this specific artwork would look in each space.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal with Dynamic Positioning */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="h-8 w-8" />
          </button>

          <div className="relative max-w-6xl max-h-full">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              {/* Room Background */}
              <div className="absolute inset-0">
                <Image
                  src={currentMockup.imageUrl}
                  alt={`${currentMockup.roomType} interior`}
                  fill
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-5"></div>
              </div>

              {/* Artwork Overlay with Dynamic Positioning - NO WHITE MAT */}
              <div 
                className="absolute border-4 border-gray-900 shadow-2xl z-10 overflow-hidden"
                style={{
                  top: currentArtworkPosition.top,
                  left: currentArtworkPosition.left,
                  width: currentArtworkPosition.width,
                  height: currentArtworkPosition.height,
                  boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
                }}
              >
                <Image
                  src={artworkImageUrl}
                  alt={artworkTitle}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-8 z-10">
              <div className="text-white text-center">
                <h4 className="text-2xl font-serif font-medium mb-2">
                  {currentMockup.title}
                </h4>
                <p className="text-gray-300 font-serif">
                  {currentMockup.description}
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <p className="text-white text-sm font-serif opacity-75">
              Press ESC or click X to close
            </p>
          </div>
        </div>
      )}
    </>
  );
}