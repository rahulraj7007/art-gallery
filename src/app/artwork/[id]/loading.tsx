// src/app/artwork/[id]/loading.tsx - Loading component for artwork pages
export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Back Navigation Skeleton */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Skeleton */}
          <div className="space-y-6">
            <div className="aspect-[4/5] bg-gray-200 animate-pulse"></div>
            <div className="space-y-3">
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Details Skeleton */}
          <div className="space-y-8 lg:pl-8">
            <div className="space-y-4">
              <div className="h-12 w-3/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse"></div>

            <div className="space-y-3">
              <div className="h-6 w-1/4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-4/5 bg-gray-200 rounded animate-pulse"></div>
            </div>

            <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}