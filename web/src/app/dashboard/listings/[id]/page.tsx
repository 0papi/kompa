"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { listingsApi } from "@/lib/api/listings";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Bed,
  Bath,
  Maximize,
  Calendar,
  MapPin,
  DollarSign,
  TrendingUp,
  Clock,
  Home,
  MessageSquare,
  Star,
} from "lucide-react";
import { ListingActionsDropdown } from "@/components/listings";
import { motion } from "framer-motion";

export default function ListingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.id as string;

  const { data: response, isLoading, error } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: () => listingsApi.getById(listingId),
  });

  const listing = response?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading listing details...</div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="text-destructive">Failed to load listing</div>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const statusColors = {
    DRAFT:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    PUBLISHED:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    ARCHIVED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

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
            onClick={() => router.back()}
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
          <Badge className={statusColors[listing.status]}>
            {listing.status}
          </Badge>
          <ListingActionsDropdown
            listing={listing}
            onView={() => {}}
            onEdit={(id) => router.push(`/dashboard/listings/${id}/edit`)}
            onDelete={() => router.push("/dashboard/listings")}
            onPublish={() => window.location.reload()}
            onUnpublish={() => window.location.reload()}
            onArchive={() => window.location.reload()}
            onUnarchive={() => window.location.reload()}
            onDuplicate={() => window.location.reload()}
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
          {/* Property Overview */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Property Overview</h2>
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
            <h2 className="text-xl font-semibold mb-4">Description</h2>
            <p className="text-muted-foreground leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Property Details */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailRow label="Property Type" value={listing.propertyType} />
              <DetailRow
                label="Property Category"
                value={listing.propertyCategory}
              />
              <DetailRow
                label="Lot Size"
                value={
                  listing.lotSize
                    ? `${listing.lotSize} acres`
                    : "Not specified"
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

          {/* Property Condition */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Property Condition</h2>
            <p className="text-muted-foreground leading-relaxed">
              {listing.condition}
            </p>
          </div>

          {/* Financial Information */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">
              Financial Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailRow
                label="HOA Fees"
                value={
                  listing.hoaFees
                    ? `$${parseFloat(listing.hoaFees).toLocaleString()}/mo`
                    : "None"
                }
              />
              <DetailRow
                label="Property Taxes"
                value={
                  listing.propertyTaxes
                    ? `$${parseFloat(listing.propertyTaxes).toLocaleString()}/yr`
                    : "Not specified"
                }
              />
              <DetailRow
                label="Annual Insurance"
                value={
                  listing.annualInsurance
                    ? `$${parseFloat(listing.annualInsurance).toLocaleString()}/yr`
                    : "Not specified"
                }
              />
              <DetailRow
                label="Valuation Method"
                value={listing.valuationMethod.replace(/_/g, " ")}
              />
            </div>
          </div>

          {/* Activity Feed (Placeholder) */}
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Activity
            </h2>
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No activity yet</p>
              <p className="text-sm mt-1">
                Comments and reviews will appear here
              </p>
            </div>
          </div>
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

          {/* Quick Stats */}
          <div className="rounded-lg border bg-card p-6">
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
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Days on Market
                  </span>
                  <span className="text-sm font-medium">
                    {listing.daysOnMarket} days
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Created
                </span>
                <span className="text-sm font-medium">
                  {new Date(listing.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Payout Summary (Placeholder) */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Payout Summary
            </h3>
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <div className="text-sm text-muted-foreground mb-1">
                  Total Earnings
                </div>
                <div className="text-2xl font-bold">$0.00</div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-xs text-muted-foreground mb-1">
                    Pending
                  </div>
                  <div className="text-lg font-semibold">$0.00</div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-xs text-muted-foreground mb-1">Paid</div>
                  <div className="text-lg font-semibold">$0.00</div>
                </div>
              </div>
              <Button className="w-full" variant="outline" disabled>
                View Payout History
              </Button>
            </div>
          </div>

          {/* Reviews Summary (Placeholder) */}
          <div className="rounded-lg border bg-card p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Star className="h-5 w-5" />
              Reviews
            </h3>
            <div className="text-center py-6">
              <div className="text-4xl font-bold mb-2">-</div>
              <div className="text-sm text-muted-foreground mb-4">
                No reviews yet
              </div>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="h-4 w-4 text-muted-foreground opacity-30"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Comparable Notes */}
          {listing.comparableNotes && (
            <div className="rounded-lg border bg-card p-6">
              <h3 className="font-semibold mb-4">Comparable Notes</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {listing.comparableNotes}
              </p>
            </div>
          )}
        </motion.div>
      </div>
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
