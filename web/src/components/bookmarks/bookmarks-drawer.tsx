"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { favoritesApi } from "@/lib/api/favorites";
import { listingsApi } from "@/lib/api/listings";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Loader2,
  MapPin,
  Bed,
  Bath,
  Maximize,
  DollarSign,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import NoBookmarks from "./no-bookmarks";
import { useRouter } from "next/navigation";
import {
  PropertyCategoryBadge,
  PropertySubcategoryBadge,
} from "../dashboard-common/property-category-badges";

interface BookmarksDrawerProps {
  open: boolean;
  onOpenChange: () => void;
}

export function BookmarksDrawer({ open, onOpenChange }: BookmarksDrawerProps) {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Fetch user's bookmarks
  const { data: bookmarksData, isLoading: isLoadingBookmarks } = useQuery({
    queryKey: ["user-bookmarks"],
    queryFn: () => favoritesApi.getUserBookmarks(),
    enabled: open,
  });

  const bookmarks = bookmarksData?.data || [];

  // Fetch listing details for each bookmark
  const { data: listingsData, isLoading: isLoadingListings } = useQuery({
    queryKey: ["bookmarked-listings", bookmarks.map((b) => b.listingId)],
    queryFn: async () => {
      if (bookmarks.length === 0) return [];
      const listings = await Promise.all(
        bookmarks.map((bookmark) => listingsApi.getById(bookmark.listingId))
      );
      return listings.map((res) => res.data);
    },
    enabled: open && bookmarks.length > 0,
  });

  const listings = listingsData || [];

  // Remove bookmark mutation
  const removeBookmarkMutation = useMutation({
    mutationFn: (listingId: string) => favoritesApi.toggleBookmark(listingId),
    onSuccess: () => {
      toast.success("Bookmark removed");
      queryClient.invalidateQueries({ queryKey: ["user-bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarked-listings"] });
    },
    onError: () => {
      toast.error("Failed to remove bookmark");
    },
  });

  const handleViewListing = (listingId: string) => {
    onOpenChange();
    router.push(`/marketplace/listing?listingId=${listingId}`);
  };

  const isLoading = isLoadingBookmarks || isLoadingListings;

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onOpenChange()} direction="right">
      <DrawerContent className="h-full">
        <DrawerHeader className="border-b">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-xl">Bookmarks</DrawerTitle>
              <DrawerDescription className="mt-1">
                {bookmarks.length > 0
                  ? `${bookmarks.length} saved ${bookmarks.length === 1 ? "listing" : "listings"}`
                  : "Your saved listings"}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <NoBookmarks />
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="group rounded-lg border bg-card p-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => handleViewListing(listing.id)}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Title and badges */}
                      <div className="flex items-start gap-2 mb-2">
                        <h3 className="font-semibold text-base line-clamp-1 flex-1">
                          {listing.title}
                        </h3>
                        <div className="flex gap-1 shrink-0">
                          <PropertyCategoryBadge
                            category={listing.propertyCategory}
                          />
                          <PropertySubcategoryBadge
                            subcategory={listing.propertyType}
                            category={listing.propertyCategory}
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="line-clamp-1">
                          {listing.city}, {listing.state}
                        </span>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm mb-3">
                        <div className="flex items-center gap-1.5">
                          <Bed className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{listing.bedrooms}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Bath className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{listing.bathrooms}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Maximize className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">
                            {listing.squareFeet.toLocaleString()} sqft
                          </span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span className="font-bold text-lg text-primary">
                          ${parseFloat(listing.price).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Remove button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBookmarkMutation.mutate(listing.id);
                      }}
                      disabled={removeBookmarkMutation.isPending}
                    >
                      {removeBookmarkMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 text-destructive" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
