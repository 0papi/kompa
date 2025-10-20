"use client";

import { useState } from "react";
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
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  MoreVertical,
  Trash2,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ListingsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get filters from URL search params
  const currentPage = parseInt(searchParams.get("page") || "1");
  const statusFilter = searchParams.get("status") || "all";
  const searchQuery = searchParams.get("search") || "";

  // Fetch listings
  const {
    data: response,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["my-listings", currentPage, statusFilter, searchQuery],
    queryFn: () => listingsApi.getMyListings(),
  });

  const listings = response?.data || [];

  // Client-side filtering (since the API doesn't support it yet)
  const filteredListings = listings.filter((listing) => {
    const matchesStatus =
      statusFilter === "all" || listing.status === statusFilter;
    const matchesSearch =
      !searchQuery ||
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.city.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  // Update URL search params
  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Reset to page 1 when filters change
    if (key !== "page") {
      params.set("page", "1");
    }
    router.push(`?${params.toString()}`, { scroll: false });
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Loading listings...</div>
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
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <Input
            id="search"
            placeholder="Search listings by title, description, or city..."
            value={searchQuery}
            onChange={(e) => updateSearchParams("search", e.target.value)}
            className="w-full"
          />
        </div>
        <div className="w-full sm:w-48">
          <Label htmlFor="status" className="sr-only">
            Status
          </Label>
          <Select
            value={statusFilter}
            onValueChange={(value) => updateSearchParams("status", value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <p className="text-muted-foreground text-lg">No listings found</p>
          <p className="text-sm text-muted-foreground">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Create your first listing to get started"}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onDelete={handleDelete}
              onEdit={(id) => router.push(`/dashboard/listings/${id}/edit`)}
              onView={(id) => router.push(`/dashboard/listings/${id}`)}
            />
          ))}
        </div>
      )}

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <p>
          Showing {filteredListings.length} of {listings.length} listing
          {listings.length !== 1 ? "s" : ""}
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
}

function ListingCard({ listing, onDelete, onEdit, onView }: ListingCardProps) {
  const statusColors = {
    DRAFT: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    PUBLISHED:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    ARCHIVED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-card">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg truncate">{listing.title}</h3>
          <p className="text-sm text-muted-foreground truncate">
            {listing.city}, {listing.state}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-2 -mr-2">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onView(listing.id)}>
              <Eye className="h-4 w-4 mr-2" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(listing.id)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(listing.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2 mb-4">
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
        <p className="text-sm text-muted-foreground line-clamp-2">
          {listing.description}
        </p>
      </div>

      <div className="flex items-center justify-between">
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
