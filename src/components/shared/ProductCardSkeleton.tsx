export function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gallery skeleton */}
        <div className="flex gap-4">
          <div className="hidden sm:flex flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="w-16 h-16 rounded-xl bg-gray-200 flex-shrink-0" />
            ))}
          </div>
          <div className="flex-1">
            <div className="w-full aspect-square rounded-2xl bg-gray-200" />
            <div className="flex gap-2 mt-3 sm:hidden">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-14 h-14 rounded-lg bg-gray-200 flex-shrink-0" />
              ))}
            </div>
          </div>
        </div>

        {/* Info skeleton */}
        <div className="space-y-5">
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-200 rounded-full" />
              <div className="h-6 w-16 bg-gray-200 rounded-full" />
            </div>
            <div className="h-8 w-3/4 bg-gray-200 rounded-lg" />
            <div className="h-4 w-24 bg-gray-200 rounded-full" />
          </div>
          <div className="flex gap-2 items-center">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="w-4 h-4 bg-gray-200 rounded-sm" />
            ))}
            <div className="h-4 w-8 bg-gray-200 rounded-full ml-1" />
            <div className="h-4 w-16 bg-gray-200 rounded-full" />
          </div>
          <div className="bg-gray-100 rounded-2xl p-4">
            <div className="h-9 w-48 bg-gray-200 rounded-lg" />
            <div className="h-4 w-40 bg-gray-200 rounded-full mt-2" />
          </div>
          <div className="flex gap-3">
            <div className="w-28 h-11 bg-gray-200 rounded-xl" />
            <div className="flex-1 h-11 bg-gray-200 rounded-xl" />
            <div className="w-11 h-11 bg-gray-200 rounded-xl" />
          </div>
          <div className="h-11 w-full bg-gray-200 rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-16 bg-gray-200 rounded-xl" />
            <div className="h-16 bg-gray-200 rounded-xl" />
          </div>
          <div className="space-y-2">
            <div className="h-12 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-200" />
      <div className="p-3 sm:p-4 space-y-2">
        <div className="h-3 w-1/3 bg-gray-200 rounded-full" />
        <div className="h-4 w-3/4 bg-gray-200 rounded-full" />
        <div className="h-4 w-1/2 bg-gray-200 rounded-full" />
        <div className="h-9 w-full bg-gray-200 rounded-xl mt-3" />
      </div>
    </div>
  );
}

export function ProductListRowSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-3 sm:p-4 flex gap-3 sm:gap-4 animate-pulse">
      <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 rounded-xl bg-gray-200" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-3 w-1/4 bg-gray-200 rounded-full" />
        <div className="h-4 w-2/3 bg-gray-200 rounded-full" />
        <div className="h-3 w-1/3 bg-gray-200 rounded-full" />
        <div className="h-8 w-28 bg-gray-200 rounded-xl mt-4" />
      </div>
    </div>
  );
}
