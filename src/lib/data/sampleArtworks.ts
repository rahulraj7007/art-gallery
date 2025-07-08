// src/lib/data/sampleArtworks.ts

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
  category: string;
  year: number;
}

export const sampleArtworks: Artwork[] = [
  {
    id: "1",
    title: "Ocean Dreams",
    artist: "Marina Waverly",
    price: 1250,
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop",
    description: "A mesmerizing seascape that captures the tranquil beauty of ocean waves at sunset. The interplay of light and water creates a dreamlike atmosphere.",
    medium: "Oil on Canvas",
    dimensions: "24\" x 30\"",
    inStock: true,
    category: "Landscape",
    year: 2023
  },
  {
    id: "2", 
    title: "Urban Symphony",
    artist: "Alex Rivera",
    price: 890,
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop",
    description: "A vibrant abstract representation of city life, where colors and shapes dance together to create the rhythm of urban energy.",
    medium: "Acrylic on Canvas",
    dimensions: "20\" x 24\"",
    inStock: true,
    category: "Abstract",
    year: 2024
  },
  {
    id: "3",
    title: "Forest Whispers",
    artist: "Elena Greenfield", 
    price: 1450,
    imageUrl: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=500&h=600&fit=crop",
    description: "An enchanting forest scene where ancient trees seem to whisper secrets through dappled sunlight and mysterious shadows.",
    medium: "Oil on Canvas",
    dimensions: "30\" x 40\"",
    inStock: true,
    category: "Landscape",
    year: 2023
  },
  {
    id: "4",
    title: "Golden Hour",
    artist: "David Lightman",
    price: 750,
    imageUrl: "https://images.unsplash.com/photo-1578662535004-051ef0d7e18d?w=500&h=600&fit=crop",
    description: "A warm, intimate portrayal of the magic hour when everything is bathed in golden light, creating a sense of peace and contemplation.",
    medium: "Watercolor",
    dimensions: "16\" x 20\"",
    inStock: true,
    category: "Landscape",
    year: 2024
  },
  {
    id: "5",
    title: "Metamorphosis",
    artist: "Sophia Chen",
    price: 1120,
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop",
    description: "A stunning abstract piece exploring themes of transformation and growth through bold strokes and evolving color palettes.",
    medium: "Mixed Media",
    dimensions: "22\" x 28\"",
    inStock: false,
    category: "Abstract",
    year: 2024
  },
  {
    id: "6",
    title: "Midnight Garden",
    artist: "Luna Nightshade",
    price: 980,
    imageUrl: "https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=500&h=600&fit=crop",
    description: "A mysterious and romantic garden scene under moonlight, where flowers bloom in shades of blue and silver.",
    medium: "Oil on Canvas",
    dimensions: "18\" x 24\"",
    inStock: true,
    category: "Floral",
    year: 2023
  },
  {
    id: "7",
    title: "City Lights",
    artist: "Marco Streets",
    price: 1340,
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500&h=600&fit=crop",
    description: "The electric energy of a city at night, captured through vibrant neon colors and dynamic brushstrokes that pulse with urban life.",
    medium: "Acrylic on Canvas", 
    dimensions: "28\" x 34\"",
    inStock: true,
    category: "Urban",
    year: 2024
  },
  {
    id: "8",
    title: "Serene Waters",
    artist: "Isabel Calm",
    price: 670,
    imageUrl: "https://images.unsplash.com/photo-1578662535004-051ef0d7e18d?w=500&h=600&fit=crop",
    description: "A peaceful lake reflection that invites meditation and introspection, painted with delicate attention to light and atmosphere.",
    medium: "Watercolor",
    dimensions: "14\" x 18\"",
    inStock: true,
    category: "Landscape",
    year: 2023
  },
  {
    id: "9",
    title: "Fire Dance",
    artist: "Phoenix Blaze",
    price: 1580,
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop",
    description: "An explosive abstract composition that captures the raw energy and passion of fire through bold reds, oranges, and yellows.",
    medium: "Oil on Canvas",
    dimensions: "32\" x 40\"",
    inStock: true,
    category: "Abstract",
    year: 2024
  }
];

export const categories = [
  "All",
  "Abstract", 
  "Landscape",
  "Urban",
  "Floral"
];

export const priceRanges = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under $500", min: 0, max: 500 },
  { label: "$500 - $1000", min: 500, max: 1000 },
  { label: "$1000 - $1500", min: 1000, max: 1500 },
  { label: "Over $1500", min: 1500, max: Infinity }
];