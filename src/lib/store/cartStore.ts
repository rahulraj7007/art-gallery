// Enhanced src/lib/store/cartStore.ts (Updated to work with your existing structure)

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Artwork } from '@/lib/data/sampleArtworks';

export interface CartItem {
  artwork: Artwork;
  quantity: number;
  addedAt: Date;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  
  // NEW: Enhanced feedback states
  isAdding: boolean;
  lastAddedItem: string | null;
  
  // Existing Actions (keeping your exact function names)
  addItem: (artwork: Artwork, quantity?: number) => void;
  addToCart: (artwork: Artwork, quantity?: number) => void; // Alias for addItem
  removeItem: (artworkId: string) => void;
  updateQuantity: (artworkId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // NEW: Enhanced feedback actions
  setIsAdding: (adding: boolean) => void;
  clearLastAdded: () => void;
  
  // Existing Computed values
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getItemQuantity: (artworkId: string) => number;
  isInCart: (artworkId: string) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      // NEW: Enhanced feedback states
      isAdding: false,
      lastAddedItem: null,

      // Enhanced addItem with feedback
      addItem: (artwork: Artwork, quantity = 1) => {
        set({ isAdding: true });
        
        // Simulate loading time for better UX
        setTimeout(() => {
          const items = get().items;
          const existingItem = items.find(item => item.artwork.id === artwork.id);

          if (existingItem) {
            // Update quantity if item already exists
            set({
              items: items.map(item =>
                item.artwork.id === artwork.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
              isAdding: false,
              lastAddedItem: artwork.id, // NEW: Track last added
            });
          } else {
            // Add new item
            set({
              items: [...items, { artwork, quantity, addedAt: new Date() }],
              isAdding: false,
              lastAddedItem: artwork.id, // NEW: Track last added
            });
          }
        }, 500); // 500ms loading simulation
      },

      // Alias for addItem - for compatibility (enhanced)
      addToCart: (artwork: Artwork, quantity = 1) => {
        get().addItem(artwork, quantity);
      },

      removeItem: (artworkId: string) => {
        set({
          items: get().items.filter(item => item.artwork.id !== artworkId),
        });
      },

      updateQuantity: (artworkId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(artworkId);
          return;
        }

        set({
          items: get().items.map(item =>
            item.artwork.id === artworkId
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      toggleCart: () => {
        set({ isOpen: !get().isOpen });
      },

      // NEW: Enhanced feedback actions
      setIsAdding: (adding: boolean) => {
        set({ isAdding: adding });
      },

      clearLastAdded: () => {
        set({ lastAddedItem: null });
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.artwork.price || 0) * item.quantity,
          0
        );
      },

      getItemQuantity: (artworkId: string) => {
        const item = get().items.find(item => item.artwork.id === artworkId);
        return item ? item.quantity : 0;
      },

      isInCart: (artworkId: string) => {
        return get().items.some(item => item.artwork.id === artworkId);
      },
    }),
    {
      name: 'art-gallery-cart', // keeping your exact localStorage key
      // Only persist the items, not the UI state (enhanced to exclude new states)
      partialize: (state) => ({ items: state.items }),
    }
  )
);