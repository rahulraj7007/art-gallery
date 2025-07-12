// src/lib/store/wishlistStore.ts - Updated to support originals and prints

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Updated interface to support both originals and prints
export interface WishlistItem {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  price?: number;
  availabilityType?: 'for-sale' | 'enquire-only' | 'exhibition' | 'commissioned' | 'sold';
  type: 'original' | 'print';        // NEW: Item type
  printSize?: string;                // NEW: For prints only (e.g., 'a3', 'a4')
  printType?: string;                // NEW: For prints only (e.g., 'paper', 'canvas')
  printSizeName?: string;            // NEW: Display name (e.g., 'A3', 'A4')
  printTypeName?: string;            // NEW: Display name (e.g., 'Paper Print', 'Canvas Print')
}

interface WishlistState {
  items: WishlistItem[];
  isOpen: boolean;
  lastAddedItem: string | null;
  
  // Actions
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  clearWishlist: () => void;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  loadWishlist: () => void;
  
  // New: Get items by type
  getOriginals: () => WishlistItem[];
  getPrints: () => WishlistItem[];
  getItemsByArtwork: (artworkId: string) => WishlistItem[];
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      lastAddedItem: null,

      addItem: (item: WishlistItem) => {
        const { items } = get();
        
        // Check if item already exists
        const existingItem = items.find(existingItem => existingItem.id === item.id);
        
        if (!existingItem) {
          set(state => ({
            items: [...state.items, item],
            lastAddedItem: item.id
          }));
          
          // Clear lastAddedItem after 3 seconds
          setTimeout(() => {
            set({ lastAddedItem: null });
          }, 3000);
        }
      },

      removeItem: (id: string) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id)
        }));
      },

      clearWishlist: () => {
        set({ items: [], lastAddedItem: null });
      },

      isInWishlist: (id: string) => {
        const { items } = get();
        return items.some(item => item.id === id);
      },

      toggleWishlist: () => {
        set(state => ({ isOpen: !state.isOpen }));
      },

      openWishlist: () => {
        set({ isOpen: true });
      },

      closeWishlist: () => {
        set({ isOpen: false });
      },

      loadWishlist: () => {
        // This function ensures the store is loaded from localStorage
        // The persist middleware handles this automatically, but we keep this
        // for compatibility with existing code
      },

      // NEW: Get only original artworks
      getOriginals: () => {
        const { items } = get();
        return items.filter(item => item.type === 'original');
      },

      // NEW: Get only prints
      getPrints: () => {
        const { items } = get();
        return items.filter(item => item.type === 'print');
      },

      // NEW: Get all items for a specific artwork (both original and prints)
      getItemsByArtwork: (artworkId: string) => {
        const { items } = get();
        return items.filter(item => 
          item.id === artworkId || // Original artwork
          item.id.startsWith(`${artworkId}-print-`) // Prints of this artwork
        );
      }
    }),
    {
      name: 'artwork-wishlist-storage',
      version: 1,
      
      // Migration function to handle old wishlist data
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migrate old wishlist items to new format
          const oldItems = persistedState.items || [];
          const migratedItems = oldItems.map((item: any) => ({
            ...item,
            type: 'original', // Assume old items were originals
            printSize: undefined,
            printType: undefined,
            printSizeName: undefined,
            printTypeName: undefined
          }));
          
          return {
            ...persistedState,
            items: migratedItems
          };
        }
        
        return persistedState;
      }
    }
  )
);

// Helper functions for creating wishlist items

// Create original artwork wishlist item
export const createOriginalWishlistItem = (artwork: {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  price?: number;
  availabilityType?: string;
}): WishlistItem => ({
  id: artwork.id,
  title: artwork.title,
  artist: artwork.artist,
  imageUrl: artwork.imageUrl,
  price: artwork.price,
  availabilityType: artwork.availabilityType as any,
  type: 'original'
});

// Create print wishlist item
export const createPrintWishlistItem = (artwork: {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
}, printDetails: {
  size: string;
  sizeName: string;
  type: string;
  typeName: string;
  price: number;
}): WishlistItem => ({
  id: `${artwork.id}-print-${printDetails.size}-${printDetails.type}`,
  title: `${artwork.title} - ${printDetails.typeName} (${printDetails.sizeName})`,
  artist: artwork.artist,
  imageUrl: artwork.imageUrl,
  price: printDetails.price,
  availabilityType: 'for-sale',
  type: 'print',
  printSize: printDetails.size,
  printType: printDetails.type,
  printSizeName: printDetails.sizeName,
  printTypeName: printDetails.typeName
});