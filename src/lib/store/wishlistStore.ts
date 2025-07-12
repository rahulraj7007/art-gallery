// lib/store/wishlistStore.ts
import { create } from 'zustand';

interface WishlistItem {
  id: string;
  title: string;
  artist: string;
  imageUrl: string;
  price?: number;
  availabilityType?: 'for-sale' | 'enquire-only' | 'exhibition' | 'commissioned' | 'sold';
  addedAt: Date;
}

interface WishlistStore {
  items: WishlistItem[];
  isOpen: boolean;
  lastAddedItem: string | null;
  
  // Actions
  loadWishlist: () => void;
  addItem: (artwork: Omit<WishlistItem, 'addedAt'>) => void;
  removeItem: (artworkId: string) => void;
  toggleWishlist: () => void;
  closeWishlist: () => void;
  openWishlist: () => void;
  isInWishlist: (artworkId: string) => boolean;
  clearLastAdded: () => void;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  items: [],
  isOpen: false,
  lastAddedItem: null,

  loadWishlist: () => {
    if (typeof window !== 'undefined') {
      const wishlistIds = JSON.parse(localStorage.getItem('artworkWishlist') || '[]');
      const wishlistData = JSON.parse(localStorage.getItem('wishlistData') || '{}');
      
      const items = wishlistIds.map((id: string) => wishlistData[id]).filter(Boolean);
      set({ items });
    }
  },

  addItem: (artwork) => {
    const { items } = get();
    
    // Check if item already exists
    if (items.find(item => item.id === artwork.id)) {
      return;
    }

    const newItem: WishlistItem = {
      ...artwork,
      addedAt: new Date()
    };

    const updatedItems = [...items, newItem];
    
    // Update localStorage
    if (typeof window !== 'undefined') {
      const wishlistIds = updatedItems.map(item => item.id);
      const wishlistData = updatedItems.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<string, WishlistItem>);
      
      localStorage.setItem('artworkWishlist', JSON.stringify(wishlistIds));
      localStorage.setItem('wishlistData', JSON.stringify(wishlistData));
    }

    set({ 
      items: updatedItems,
      lastAddedItem: artwork.id
    });
  },

  removeItem: (artworkId) => {
    const { items } = get();
    const updatedItems = items.filter(item => item.id !== artworkId);
    
    // Update localStorage
    if (typeof window !== 'undefined') {
      const wishlistIds = updatedItems.map(item => item.id);
      const wishlistData = updatedItems.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<string, WishlistItem>);
      
      localStorage.setItem('artworkWishlist', JSON.stringify(wishlistIds));
      localStorage.setItem('wishlistData', JSON.stringify(wishlistData));
    }

    set({ items: updatedItems });
  },

  toggleWishlist: () => {
    set(state => ({ isOpen: !state.isOpen }));
  },

  closeWishlist: () => {
    set({ isOpen: false });
  },

  openWishlist: () => {
    set({ isOpen: true });
  },

  isInWishlist: (artworkId) => {
    const { items } = get();
    return items.some(item => item.id === artworkId);
  },

  clearLastAdded: () => {
    set({ lastAddedItem: null });
  }
}));