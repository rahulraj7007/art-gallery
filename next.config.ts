import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Remove these lines for Vercel deployment:
  // output: 'export',
  // trailingSlash: true,
  
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'firebasestorage.googleapis.com',
      'images.unsplash.com',  // Add this line for Unsplash images
    ],
  },
};

export default nextConfig;