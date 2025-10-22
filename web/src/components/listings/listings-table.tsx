"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { listingsApi, type Listing } from "@/lib/api/listings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Eye,
  MoreVertical,
  Trash2,
  X,
  Filter,
  Plus,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PROPERTY_CATEGORIES, PROPERTY_TYPES } from "@/lib/consts";
import ListingFilter from "./listing-filter";
import { useListingsLayoutStore } from "./states/listings-layout.store";
import { ListingActionsDropdown } from "./listing-actions-dropdown";
import { ListingsSkeleton } from "./listings-skeleton";
import NoListings from "./empty-state";

export function ListingsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const { layout } = useListingsLayoutStore();

  // Get all filters from URL search params
  const filters = {
    title: searchParams.get("title") || "",
    city: searchParams.get("city") || "",
    state: searchParams.get("state") || "",
    propertyCategory: searchParams.get("propertyCategory") || "",
    propertyType: searchParams.get("propertyType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minBedrooms: searchParams.get("minBedrooms") || "",
    minBathrooms: searchParams.get("minBathrooms") || "",
    minSquareFeet: searchParams.get("minSquareFeet") || "",
    maxSquareFeet: searchParams.get("maxSquareFeet") || "",
    status: searchParams.get("status") || "",
  };

  // Fetch listings
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      "my-listings",
      filters.title,
      filters.city,
      filters.state,
      filters.propertyCategory,
      filters.propertyType,
      filters.minPrice,
      filters.maxPrice,
      filters.minBedrooms,
      filters.minBathrooms,
      filters.minSquareFeet,
      filters.maxSquareFeet,
      filters.status,
    ],
    queryFn: () => listingsApi.getMyListings(),
  });

  const listings = response?.data || [];

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter((value) => value !== "").length;
  }, [
    filters.title,
    filters.city,
    filters.state,
    filters.propertyCategory,
    filters.propertyType,
    filters.minPrice,
    filters.maxPrice,
    filters.minBedrooms,
    filters.minBathrooms,
    filters.minSquareFeet,
    filters.maxSquareFeet,
    filters.status,
  ]);

  // Advanced client-side filtering
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      // Title filter
      if (
        filters.title &&
        !listing.title.toLowerCase().includes(filters.title.toLowerCase())
      ) {
        return false;
      }

      // City filter
      if (
        filters.city &&
        !listing.city.toLowerCase().includes(filters.city.toLowerCase())
      ) {
        return false;
      }

      // State filter
      if (
        filters.state &&
        !listing.state.toLowerCase().includes(filters.state.toLowerCase())
      ) {
        return false;
      }

      // Property category filter
      if (
        filters.propertyCategory &&
        listing.propertyCategory !== filters.propertyCategory
      ) {
        return false;
      }

      // Property type filter
      if (
        filters.propertyType &&
        listing.propertyType !== filters.propertyType
      ) {
        return false;
      }

      // Price range filter
      const price = parseFloat(listing.price);
      if (filters.minPrice && price < parseFloat(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && price > parseFloat(filters.maxPrice)) {
        return false;
      }

      // Bedrooms filter
      if (
        filters.minBedrooms &&
        listing.bedrooms < parseInt(filters.minBedrooms)
      ) {
        return false;
      }

      // Bathrooms filter
      if (
        filters.minBathrooms &&
        parseFloat(listing.bathrooms) < parseFloat(filters.minBathrooms)
      ) {
        return false;
      }

      // Square feet range filter
      if (
        filters.minSquareFeet &&
        listing.squareFeet < parseInt(filters.minSquareFeet)
      ) {
        return false;
      }
      if (
        filters.maxSquareFeet &&
        listing.squareFeet > parseInt(filters.maxSquareFeet)
      ) {
        return false;
      }

      // Status filter
      if (filters.status && listing.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [
    listings,
    filters.title,
    filters.city,
    filters.state,
    filters.propertyCategory,
    filters.propertyType,
    filters.minPrice,
    filters.maxPrice,
    filters.minBedrooms,
    filters.minBathrooms,
    filters.minSquareFeet,
    filters.maxSquareFeet,
    filters.status,
  ]);

  // Get available property types based on selected category
  // MOVED: This must be called before any early returns
  const availablePropertyTypes = useMemo(() => {
    if (!filters.propertyCategory) return [];
    return PROPERTY_TYPES.get(filters.propertyCategory) || [];
  }, [filters.propertyCategory]);

  // Update URL search params
  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Clear all filters
  const clearAllFilters = () => {
    router.push(window.location.pathname, { scroll: false });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      await listingsApi.delete(id);
      toast.success("Listing deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete listing");
    }
  };

  const handlePublish = async (id: string) => {
    toast.loading("Publishing listing...", { id: "PUBLISHING_LISTING" });
    try {
      await listingsApi.updateStatus(id, "PUBLISHED");

      toast.success("Listing published successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to publish listing");
    } finally {
      toast.dismiss("PUBLISHING_LISTING");
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await listingsApi.updateStatus(id, "DRAFT");
      toast.success("Listing unpublished successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to unpublish listing");
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await listingsApi.updateStatus(id, "ARCHIVED");
      toast.success("Listing archived successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to archive listing");
    }
  };

  const handleUnarchive = async (id: string) => {
    try {
      await listingsApi.updateStatus(id, "PUBLISHED");
      toast.success("Listing unarchived successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to unarchive listing");
    }
  };

  const handleDuplicate = async (id: string) => {
    // Find the listing
    const listing = listings.find((l) => l.id === id);
    if (!listing) return;

    try {
      // Create a copy with DRAFT status
      const {
        id: _id,
        createdAt,
        updatedAt,
        deletedAt,
        ...listingData
      } = listing;
      await listingsApi.create({
        ...listingData,
        title: `${listing.title} (Copy)`,
        status: "DRAFT",
      });
      toast.success("Listing duplicated successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to duplicate listing");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <ListingFilter />
        <ListingsSkeleton count={6} layout={layout} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="text-destructive">Failed to load listings</div>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Toggle & Active Filters */}
      <ListingFilter />
      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <NoListings subText={activeFiltersCount > 0
              ? "Try adjusting your filters or clear them to see all listings"
              : "Create your first listing to get started"}/>
          {/* <p className="text-muted-foreground text-lg">No listings found</p> */}
          {/* <p className="text-sm text-muted-foreground">
            {activeFiltersCount > 0
              ? "Try adjusting your filters or clear them to see all listings"
              : "Create your first listing to get started"}
          </p> */}
          {activeFiltersCount > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="mt-2"
            >
              Clear all filters
            </Button>
          ) : <Button onClick={() => router.push('/dashboard/listings/new')}><Plus /> Create Listing</Button>}
        </div>
      ) : (
        <div
          className={
            layout === "grid"
              ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-4"
          }
        >
          {filteredListings.map((listing, index) =>
            layout === "grid" ? (
              <div key={listing.id}>
                <ListingCard
                  listing={listing}
                  onDelete={handleDelete}
                  onEdit={(id) => router.push(`/dashboard/listings/${id}/edit`)}
                  onView={(id) => router.push(`/dashboard/listings/${id}`)}
                  onPublish={handlePublish}
                  onUnpublish={handleUnpublish}
                  onArchive={handleArchive}
                  onUnarchive={handleUnarchive}
                  onDuplicate={handleDuplicate}
                />
              </div>
            ) : (
              <div key={listing.id}>
                <ListingListItem
                  listing={listing}
                  onDelete={handleDelete}
                  onEdit={(id) => router.push(`/dashboard/listings/${id}/edit`)}
                  onView={(id) => router.push(`/dashboard/listings/${id}`)}
                  onPublish={handlePublish}
                  onUnpublish={handleUnpublish}
                  onArchive={handleArchive}
                  onUnarchive={handleUnarchive}
                  onDuplicate={handleDuplicate}
                />
              </div>
            ),
          )}
        </div>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          {activeFiltersCount > 0 ? (
            <>
              Showing{" "}
              <span className="font-medium">{filteredListings.length}</span> of{" "}
              <span className="font-medium">{listings.length}</span> listing
              {listings.length !== 1 ? "s" : ""} matching your filters
            </>
          ) : (
            <>
              <span className="font-medium">{listings.length}</span> total
              listing
              {listings.length !== 1 ? "s" : ""}
            </>
          )}
        </p>
      </div>
    </div>
  );
}

interface ListingCardProps {
  listing: Listing;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDuplicate: (id: string) => void;
}

function ListingCard({
  listing,
  onDelete,
  onEdit,
  onView,
  onPublish,
  onUnpublish,
  onArchive,
  onUnarchive,
  onDuplicate,
}: ListingCardProps) {
  const statusColors = {
    DRAFT:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    PUBLISHED:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    ARCHIVED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card flex flex-col h-full">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{listing.title}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {listing.city}, {listing.state}
          </p>
        </div>
        <div className="-mt-2 -mr-2">
          <ListingActionsDropdown
            listing={listing}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            onPublish={onPublish}
            onUnpublish={onUnpublish}
            onArchive={onArchive}
            onUnarchive={onUnarchive}
            onDuplicate={onDuplicate}
          />
        </div>
      </div>

      <div className="space-y-2 mb-4 flex-1">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Price</span>
          <span className="font-semibold">
            ${parseFloat(listing.price).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{listing.bedrooms} beds</span>
          <span>{listing.bathrooms} baths</span>
          <span>{listing.squareFeet.toLocaleString()} sq ft</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
          {listing.description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[listing.status]}`}
        >
          {listing.status}
        </span>
        <span className="text-xs text-muted-foreground">
          {new Date(listing.createdAt).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

interface ListingListItemProps {
  listing: Listing;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onView: (id: string) => void;
  onPublish: (id: string) => void;
  onUnpublish: (id: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  onDuplicate: (id: string) => void;
}

function ListingListItem({
  listing,
  onDelete,
  onEdit,
  onView,
  onPublish,
  onUnpublish,
  onArchive,
  onUnarchive,
  onDuplicate,
}: ListingListItemProps) {
  const statusColors = {
    DRAFT:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    PUBLISHED:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    ARCHIVED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
      <div className="flex items-center gap-4">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{listing.title}</h3>
              <p className="text-sm text-muted-foreground">
                {listing.city}, {listing.state}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[listing.status]}`}
              >
                {listing.status}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-3">
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Price</span>
              <span className="font-semibold text-lg">
                ${parseFloat(listing.price).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-muted-foreground">
                {listing.bedrooms} beds
              </span>
              <span className="text-muted-foreground">
                {listing.bathrooms} baths
              </span>
              <span className="text-muted-foreground">
                {listing.squareFeet.toLocaleString()} sq ft
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {listing.description}
              </p>
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(listing.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Actions */}
        <ListingActionsDropdown
          listing={listing}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onPublish={onPublish}
          onUnpublish={onUnpublish}
          onArchive={onArchive}
          onUnarchive={onUnarchive}
          onDuplicate={onDuplicate}
        />
      </div>
    </div>
  );
}
