import { Skeleton } from "@/components/ui/skeleton";

interface ListingsSkeletonProps {
  count?: number;
  layout?: "grid" | "list";
}

export function ListingsSkeleton({
  count = 6,
  layout = "grid",
}: ListingsSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  if (layout === "list") {
    return (
      <div className="space-y-4">
        {items.map((i) => (
          <div
            key={i}
            className="border rounded-lg p-4 bg-card"
          >
            <div className="flex items-center gap-4">
              <div className="flex-1 space-y-3">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-10" />
                    <Skeleton className="h-5 w-24" />
                  </div>

                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                  </div>

                  <div className="flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-1" />
                  </div>

                  <Skeleton className="h-4 w-20" />
                </div>
              </div>

              <Skeleton className="h-10 w-10 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid layout
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => (
        <div key={i} className="border rounded-lg p-4 bg-card h-full">
          {/* Header with title and dropdown placeholder */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-8 rounded" />
          </div>

          {/* Details section */}
          <div className="space-y-3 mb-4 flex-1">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-20" />
            </div>

            <div className="flex gap-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="space-y-1">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>

          {/* Footer with status and date */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
