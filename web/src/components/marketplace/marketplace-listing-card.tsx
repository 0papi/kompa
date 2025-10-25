"use client";

import { useRouter } from "next/navigation";
import { type Listing } from "@/lib/api/listings";
// Import 'Home' for the new placeholder icon
import { Bed, Bath, Maximize, Home } from "lucide-react";

interface MarketplaceListingCardProps {
  listing: Listing;
}

/**
 * A small helper component to render a status badge.
 * This adds crucial visual context and color.
 */
function StatusBadge({ status }: { status: any }) {
  const statusConfig : Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800 border-green-200",
    DRAFT: "bg-yellow-100 text-yellow-800 border-yellow-200",
    ARCHIVED: "bg-gray-100 text-gray-700 border-gray-200",
  };

  const style = statusConfig[status] || statusConfig.ARCHIVED;

  return (
    <div
      className={`absolute top-3 right-3 z-10 rounded-md border px-2.5 py-0.5 text-xs font-semibold capitalize ${style}`}
    >
      {status.toLowerCase()}
    </div>
  );
}

/**
 * A redesigned, modern marketplace listing card.
 * Focuses on visual hierarchy, scan-ability for "comparable data",
 * and a clean, interactive "world-class" feel.
 */
export function MarketplaceListingCard({
  listing,
}: MarketplaceListingCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/marketplace/listing?listingId=${listing.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="group cursor-pointer rounded-xl border bg-card shadow-sm overflow-hidden
                 transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 min-w-[280px]"
    >
      {/* Image & Status Badge */}
      <div className="relative">
        <div
          className={`absolute top-3 right-3 z-10 rounded-md border px-2.5 py-0.5 text-xs font-semibold capitalize bg-green-100 text-green-800 border-green-200`}
        >
          Active
        </div>
        {/*<StatusBadge status={listing.status} />*/}

        {/* Professional Placeholder */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted/60">
          <div className="absolute inset-0 flex items-center justify-center">
            <Home
              className="h-20 w-20 text-muted-foreground/30
                         transition-all duration-300
                         group-hover:scale-110 group-hover:text-muted-foreground/40"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Price */}
        <div>
          <p className="flex items-baseline gap-1">
            <span className="text-2xl font-bold">
              ${parseFloat(listing.price).toLocaleString()}
            </span>
            {listing.pricePerSquareFoot && (
              <span className="text-sm font-medium text-muted-foreground">
                (${parseFloat(listing.pricePerSquareFoot).toLocaleString()}
                /sqft)
              </span>
            )}
          </p>
        </div>

        {/* Address & Title */}
        <div className="space-y-0.5">
          <p className="font-semibold text-foreground truncate">
            {listing.street}
          </p>
          <p className="text-sm text-muted-foreground">
            {listing.city}, {listing.state} {listing.zipCode}
          </p>
          <p className="text-sm text-muted-foreground line-clamp-1 pt-1">
            {listing.title}
          </p>
        </div>

        {/* Details / Comps */}
        <div className="flex items-center justify-between text-sm pt-3 border-t">
          <span className="flex items-center gap-1.5">
            <Bed className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{listing.bedrooms}</span>
            <span className="text-muted-foreground">beds</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{listing.bathrooms}</span>
            <span className="text-muted-foreground">baths</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {listing.squareFeet.toLocaleString()}
            </span>
            <span className="text-muted-foreground">sqft</span>
          </span>
        </div>
      </div>
    </div>
  );
}
