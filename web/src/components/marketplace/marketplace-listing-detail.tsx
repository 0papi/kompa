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
import { useState } from "react";

interface MarketplaceListingDetailProps {
  listingId: string;
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


  const {
    data: bookmarkResponse,
    isLoading: isCheckingBookmark,
  } = useQuery({
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
      await queryClient.cancelQueries({ queryKey: ["bookmark-check", listingId] });
      const previousBookmark = queryClient.getQueryData(["bookmark-check", listingId]);

      queryClient.setQueryData(["bookmark-check", listingId], (old: any) => ({
        ...old,
        data: { bookmarked: !isBookmarked },
      }));

      return { previousBookmark };
    },
    onError: (_error, _variables, context) => {
      // Revert on error
      if (context?.previousBookmark) {
        queryClient.setQueryData(["bookmark-check", listingId], context.previousBookmark);
      }
      toast.error("Failed to update bookmark");
    },
    onSuccess: (data) => {
      toast.success(data.data.message);
      // Invalidate bookmarks count in header
      queryClient.invalidateQueries({ queryKey: ["user-bookmarks"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmark-check", listingId] });
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
                {listing.street}, {listing.city}, {listing.state}{" "}
                {listing.zipCode}
              </span>
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
          {/* Image Placeholder */}
          <div className="rounded-lg border bg-gradient-to-br from-primary/20 to-primary/5 h-96 flex items-center justify-center">
            <div className="text-9xl opacity-20">🏠</div>
          </div>

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

          {/* Description */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-base font-semibold mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {listing.description}
            </p>
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
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Comparable Notes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {listing.comparableNotes}
              </p>
            </div>
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
              <div className="text-sm text-muted-foreground">
                ${parseFloat(listing.pricePerSquareFoot).toLocaleString()} per
                sq ft
              </div>
            )}
          </div>

          {/* Contact CTA */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">
              Interested in this comparable ?
            </h3>
            <Button className="w-full mb-3 gap-x-3">
              <Wallet />
              Purchase
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
                <Bookmark
                  className={isBookmarked ? "fill-current" : ""}
                />
              )}
              {isBookmarked ? "Saved" : "Save For Later"}
            </Button>
          </div>

          {/* Quick Stats */}
          {/* <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Listed
                </span>
                <span className="text-sm font-medium">
                  {listing.listDate
                    ? new Date(listing.listDate).toLocaleDateString()
                    : "Not set"}
                </span>
              </div>
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
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Property Type
                </span>
                <span className="text-sm font-medium">
                  {listing.propertyType}
                </span>
              </div>
            </div>
          </div> */}

          {/* Financial Information */}
          {(listing.hoaFees ||
            listing.propertyTaxes ||
            listing.annualInsurance) && (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Financial Information</h3>
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
            </div>
          )}

          <CommentsSection listingId={listingId} listingOwnerId={listing.userId} />
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
