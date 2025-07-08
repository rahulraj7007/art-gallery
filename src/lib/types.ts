import { Timestamp } from 'firebase/firestore';

export interface Artwork {
  id: string;
  title: string;
  artist: string;
  price: number;
  imageUrl: string;
  description: string;
  medium: string;
  dimensions: string;
  inStock: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CartItem {
  artwork: Artwork;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Timestamp;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  stripeSessionId?: string;
  createdAt: Timestamp;
}