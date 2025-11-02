export function ProductSkeleton() {
  return (
    <div className="bg-background border border-border rounded-lg overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-muted" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        <div className="h-3 w-20 bg-muted rounded" />

        {/* Title */}
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-3/4" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-5/6" />
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="h-6 w-24 bg-muted rounded" />
          <div className="h-10 w-10 bg-muted rounded-full" />
        </div>
      </div>
    </div>
  );
}
