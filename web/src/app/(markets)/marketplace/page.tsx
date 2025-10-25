"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { listingsApi } from "@/lib/api/listings";
import {
  MarketplaceListingCard,
} from "@/components/marketplace";
import { MarketplaceSidebarFilters } from "@/components/marketplace/marketplace-sidebar-filters";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useInView } from "react-intersection-observer";
import { Suspense, useEffect } from "react";

function MarketplaceContent() {
  const searchParams = useSearchParams();

  // Get filter params
  const search = searchParams.get("search") || "";
  const propertyCategory = searchParams.get("propertyCategory") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const minBedrooms = searchParams.get("minBedrooms") || "";
  const city = searchParams.get("city") || "";
  const state = searchParams.get("state") || "";

  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: [
      "marketplace-listings",
      search,
      propertyCategory,
      minPrice,
      maxPrice,
      minBedrooms,
      city,
      state,
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const filterParams: any = { page: pageParam, limit: 12 };

      if (search) filterParams.search = search;
      if (city) filterParams.city = city;
      if (state) filterParams.state = state;
      if (propertyCategory) filterParams.propertyCategory = propertyCategory;
      if (minPrice) filterParams.minPrice = parseFloat(minPrice);
      if (maxPrice) filterParams.maxPrice = parseFloat(maxPrice);
      if (minBedrooms) filterParams.minBedrooms = parseInt(minBedrooms, 10);

      return listingsApi.getPublished(filterParams);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.data.pagination.hasMore) {
        return lastPage.data.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });

  // Auto-fetch when scrolling into view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Get all listings from all pages (server-side already filtered)
  const allListings = data?.pages.flatMap((page) => page.data.data) || [];
  const totalResults = data?.pages[0]?.data.pagination.total || 0;

  return (
    <div className="mx-auto px-4 py-6 max-w-7xl">
      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className="hidden lg:block w-64 flex-shrink-0 border-r pr-6">
          <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto custom-scrollbar">
            <MarketplaceSidebarFilters />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Results Header */}
          <div className="mb-6">
            {!isLoading && (
              <h1 className="text-2xl font-semibold mb-2">
                <>
                  {totalResults}{" "}
                  {totalResults === 1 ? "property" : "properties"}
                </>
              </h1>
            )}
            {!isLoading && allListings.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Showing {allListings.length} of {totalResults}
              </p>
            )}
          </div>

          {/* Listings Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-card overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-muted" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                    <div className="h-4 bg-muted rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-destructive mb-4">Failed to load listings</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : allListings.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-medium mb-2">No properties found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {allListings.map((listing, index) => (
                  <MarketplaceListingCard listing={listing} key={listing.id} />
                ))}
              </div>

              {/* Infinite Scroll Trigger */}
              {hasNextPage && (
                <div ref={ref} className="flex justify-center py-8">
                  {isFetchingNextPage && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading more...
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="mx-auto px-4 py-6 max-w-7xl flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}
