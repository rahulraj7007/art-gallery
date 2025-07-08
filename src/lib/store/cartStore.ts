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
  
  // Actions
  addItem: (artwork: Artwork, quantity?: number) => void;
  addToCart: (artwork: Artwork, quantity?: number) => void; // Alias for addItem
  removeItem: (artworkId: string) => void;
  updateQuantity: (artworkId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  
  // Computed values
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

      addItem: (artwork: Artwork, quantity = 1) => {
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
          });
        } else {
          // Add new item
          set({
            items: [...items, { artwork, quantity, addedAt: new Date() }],
          });
        }
      },

      // Alias for addItem - for compatibility
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

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.artwork.price * item.quantity,
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
      name: 'art-gallery-cart', // unique name for localStorage key
      // Only persist the items, not the UI state
      partialize: (state) => ({ items: state.items }),
    }
  )
);