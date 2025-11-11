"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { listingsApi } from "@/lib/api/listings";
import { favoritesApi } from "@/lib/api/favorites";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Bed,
  Bath,
  Maximize,
  MapPin,
  DollarSign,
  Calendar,
  Home,
  Loader2,
  Bookmark,
  Wallet,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  PropertyCategoryBadge,
  PropertySubcategoryBadge,
} from "../dashboard-common/property-category-badges";
import { CommentsSection } from "./comments-section";
import { ReviewsSection } from "./reviews-section";
import { useSession } from "@/lib/hooks/useSession";
import { toast } from "sonner";
import { SignInModal } from "@/components/auth/sign-in-modal";
import { ListingImageGallery } from "@/components/listings/listing-image-gallery";
import { useState } from "react";

interface MarketplaceListingDetailProps {
  listingId: string;
}

/**
 * Reusable component for locked sections that require purchase
 */
function LockedSection({
  title,
  children,
  isLocked = true,
}: {
  title: string;
  children: React.ReactNode;
  isLocked?: boolean;
}) {
  if (!isLocked) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-base font-semibold mb-4">{title}</h2>
        {children}
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-card p-6 relative overflow-hidden">
      <h2 className="text-base font-semibold mb-4">{title}</h2>

      {/* Blurred Content */}
      <div className="blur-md select-none pointer-events-none">{children}</div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
        <div className="text-center space-y-3 p-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div>
            <p className="font-semibold text-lg">Purchase to Unlock</p>
            <p className="text-sm text-muted-foreground mt-1">
              Get full access to detailed property data
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function MarketplaceListingDetail({
  listingId,
}: MarketplaceListingDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useSession();
  const [showSignInModal, setShowSignInModal] = useState(false);

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["marketplace-listing", listingId],
    queryFn: () => listingsApi.getById(listingId),
  });

  const { data: bookmarkResponse, isLoading: isCheckingBookmark } = useQuery({
    queryKey: ["bookmark-check", listingId],
    queryFn: () => favoritesApi.checkBookmark(listingId),
    enabled: !!user && !!listingId,
  });

  const isBookmarked = bookmarkResponse?.data?.bookmarked ?? false;

  // Toggle bookmark mutation
  const toggleBookmarkMutation = useMutation({
    mutationFn: () => favoritesApi.toggleBookmark(listingId),
    onMutate: async () => {
      // Optimistic update
      await queryClient.cancelQueries({
        queryKey: ["bookmark-check", listingId],
      });
      const previousBookmark = queryClient.getQueryData([
        "bookmark-check",
        listingId,
      ]);

      queryClient.setQueryData(["bookmark-check", listingId], (old: any) => ({
        ...old,
        data: { bookmarked: !isBookmarked },
      }));

      return { previousBookmark };
    },
    onError: (_error, _variables, context) => {
      // Revert on error
      if (context?.previousBookmark) {
        queryClient.setQueryData(
          ["bookmark-check", listingId],
          context.previousBookmark,
        );
      }
      toast.error("Failed to update bookmark");
    },
    onSuccess: (data) => {
      toast.success(data.data.message);
      // Invalidate bookmarks count in header
      queryClient.invalidateQueries({ queryKey: ["user-bookmarks"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookmark-check", listingId],
      });
    },
  });

  const handleBookmarkClick = () => {
    if (!isAuthenticated) {
      setShowSignInModal(true);
      return;
    }

    toggleBookmarkMutation.mutate();
  };

  const handleSignInSuccess = () => {
    // After successful sign in, automatically bookmark the listing
    toggleBookmarkMutation.mutate();
  };

  const listing = response?.data;

  const handleBack = () => {
    router.push("/marketplace");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-destructive">Failed to load listing</div>
        <Button onClick={handleBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {listing.title}
            </h1>
            <div className="flex items-center gap-2 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>
                {listing.city}, {listing.state}
              </span>
              <Badge variant="secondary" className="ml-2 gap-1">
                <Lock className="h-3 w-3" />
                <span className="text-xs">Full address locked</span>
              </Badge>
            </div>
          </div>
          <PropertyCategoryBadge category={listing.propertyCategory} />
          <PropertySubcategoryBadge
            subcategory={listing.propertyType}
            category={listing.propertyCategory}
          />
        </div>
      </motion.div>

      <Separator />

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {/* Image Gallery */}
          <ListingImageGallery listingId={listingId} />

          {/* Property Overview */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-base font-semibold mb-4">Property Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
                <Bed className="h-6 w-6 text-primary mb-2" />
                <span className="text-2xl font-bold">{listing.bedrooms}</span>
                <span className="text-sm text-muted-foreground">Bedrooms</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
                <Bath className="h-6 w-6 text-primary mb-2" />
                <span className="text-2xl font-bold">{listing.bathrooms}</span>
                <span className="text-sm text-muted-foreground">Bathrooms</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
                <Maximize className="h-6 w-6 text-primary mb-2" />
                <span className="text-2xl font-bold">
                  {listing.squareFeet.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">Sq Ft</span>
              </div>
              <div className="flex flex-col items-center p-4 rounded-lg bg-muted">
                <Home className="h-6 w-6 text-primary mb-2" />
                <span className="text-2xl font-bold">
                  {listing.yearBuilt || "N/A"}
                </span>
                <span className="text-sm text-muted-foreground">
                  Year Built
                </span>
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-base font-semibold mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailRow label="Property Type" value={listing.propertyType} />
              <DetailRow
                label="Property Category"
                value={listing.propertyCategory}
              />
              <DetailRow
                label="Lot Size"
                value={
                  listing.lotSize ? `${listing.lotSize} acres` : "Not specified"
                }
              />
              <DetailRow
                label="Stories"
                value={listing.stories?.toString() || "Not specified"}
              />
              <DetailRow
                label="Garage Spaces"
                value={listing.garageSpaces?.toString() || "Not specified"}
              />
              <DetailRow
                label="Parking Spaces"
                value={listing.parkingSpaces?.toString() || "Not specified"}
              />
            </div>
          </div>

          {/* Description */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-base font-semibold mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Features */}
          {listing.features && listing.features.length > 0 && (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <div className="flex flex-wrap gap-2">
                {listing.features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {feature.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Comparable Notes */}
          {listing.comparableNotes && (
            <LockedSection title="Comparable Notes" isLocked={true}>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {listing.comparableNotes}
              </p>
            </LockedSection>
          )}

          {/* Property Condition */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-base font-semibold mb-4">Property Condition</h2>
            <p className="text-muted-foreground leading-relaxed">
              {listing.condition}
            </p>
          </div>

          {/* Reviews Section */}
          <ReviewsSection listingId={listingId} />
        </motion.div>

        {/* Right Column - Sidebar */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {/* Price Card */}
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Listing Price</span>
            </div>
            <div className="text-3xl font-bold mb-1">
              ${parseFloat(listing.price).toLocaleString()}
            </div>
            {listing.pricePerSquareFoot && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                <div className="text-sm text-muted-foreground">
                  Price per sq ft locked
                </div>
              </div>
            )}
          </div>

          {/* Unlock Data CTA */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">Unlock Full Data</h3>
              <p className="text-sm text-muted-foreground">
                Get access to complete property information including:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li className="flex items-center gap-2">
                  <Lock className="h-3 w-3" />
                  Exact address & location
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-3 w-3" />
                  Financial details & costs
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-3 w-3" />
                  Sale history & market data
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-3 w-3" />
                  Comparable analysis notes
                </li>
              </ul>
            </div>

            <div className="pt-2 border-t">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">Price</span>
                <span className="text-2xl font-bold">
                  GH₵ {listing?.comparablePrice}
                </span>
              </div>
              <Button className="w-full mb-3 gap-x-2" size="lg">
                <Wallet className="h-4 w-4" />
                Purchase Full Data
              </Button>
              <Button
                variant="outline"
                className="w-full gap-x-2"
                onClick={handleBookmarkClick}
                disabled={toggleBookmarkMutation.isPending}
              >
                {toggleBookmarkMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Bookmark className={isBookmarked ? "fill-current" : ""} />
                )}
                {isBookmarked ? "Saved" : "Save For Later"}
              </Button>
            </div>
          </div>

          {/* Sale History Stats - Locked */}
          <LockedSection title="Sale History" isLocked={true}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  List Date
                </span>
                <span className="text-sm font-medium">
                  {listing.listDate
                    ? new Date(listing.listDate).toLocaleDateString()
                    : "Not set"}
                </span>
              </div>
              {listing.saleDate && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Sale Date
                  </span>
                  <span className="text-sm font-medium">
                    {new Date(listing.saleDate).toLocaleDateString()}
                  </span>
                </div>
              )}
              {listing.daysOnMarket && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Days on Market
                  </span>
                  <span className="text-sm font-medium">
                    {listing.daysOnMarket} days
                  </span>
                </div>
              )}
            </div>
          </LockedSection>

          {/* Financial Information */}
          {(listing.hoaFees ||
            listing.propertyTaxes ||
            listing.annualInsurance) && (
            <LockedSection title="Financial Information" isLocked={true}>
              <div className="space-y-3">
                {listing.hoaFees && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      HOA Fees
                    </span>
                    <span className="text-sm font-medium">
                      ${parseFloat(listing.hoaFees).toLocaleString()}/mo
                    </span>
                  </div>
                )}
                {listing.propertyTaxes && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Property Taxes
                    </span>
                    <span className="text-sm font-medium">
                      ${parseFloat(listing.propertyTaxes).toLocaleString()}/yr
                    </span>
                  </div>
                )}
                {listing.annualInsurance && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Annual Insurance
                    </span>
                    <span className="text-sm font-medium">
                      ${parseFloat(listing.annualInsurance).toLocaleString()}/yr
                    </span>
                  </div>
                )}
              </div>
            </LockedSection>
          )}

          <CommentsSection
            listingId={listingId}
            listingOwnerId={listing.userId}
          />
        </motion.div>
      </div>

      {/* Sign In Modal */}
      <SignInModal
        open={showSignInModal}
        onOpenChange={setShowSignInModal}
        onSuccess={handleSignInSuccess}
      />
    </div>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
