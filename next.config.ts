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
    domains: ['firebasestorage.googleapis.com'],
  },
};

export default nextConfig;