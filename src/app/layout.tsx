// src/app/layout.tsx - Updated with correct artist name and info
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth/AuthContext';
import MainLayout from '@/components/layout/MainLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Aja Eriksson von Weissenberg - Original Paintings & Artworks',
  description: 'Discover original paintings by Aja Eriksson von Weissenberg, a distinguished artist from Gothenburg. Works that move between light and dark, longing and farewell. Available for purchase.',
  keywords: 'Aja Eriksson, von Weissenberg, original paintings, Gothenburg artist, contemporary art, HDK graduate, fresco painting, art for sale, Swedish artist, fine art',
  authors: [{ name: 'Aja Eriksson von Weissenberg' }],
  openGraph: {
    title: 'Aja Eriksson von Weissenberg - Original Paintings',
    description: 'Works that move between light and dark, longing and farewell. Original paintings by distinguished Gothenburg artist.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Aja Eriksson von Weissenberg Art',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aja Eriksson von Weissenberg - Original Paintings',
    description: 'Works that move between light and dark, longing and farewell. Original paintings by distinguished Gothenburg artist.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}