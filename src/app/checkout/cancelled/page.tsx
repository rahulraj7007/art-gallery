import { Suspense } from 'react';
import CheckoutCancelledContent from './CheckoutCancelledContent';
import MainLayout from '@/components/layout/MainLayout';

function LoadingFallback() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait...</p>
        </div>
      </div>
    </MainLayout>
  );
}

export default function CheckoutCancelledPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CheckoutCancelledContent />
    </Suspense>
  );
}