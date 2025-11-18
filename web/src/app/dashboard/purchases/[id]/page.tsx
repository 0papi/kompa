"use client";

import { purchasesApi } from "@/lib/api/purchases";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  MapPin,
  Building2,
  Home,
  Square,
  Users,
  Zap,
  CheckCircle2,
  Download,
  ArrowLeft,
  FileText,
  Mail,
  Clock,
  DownloadCloud,
} from "lucide-react";
import type { Listing } from "@/lib/api/listings";

interface Purchase {
  id: string;
  amount: number;
  currency: string;
  status: string;
  buyerEmail: string;
  buyerId: string;
  listingId: string;
  sellerId: string;
  reference: string;
  purchasedAt: string;
  createdAt: string;
  paystack_authorization_code: string;
  payment_gateway_response?: any;
  metadata?: any;
  listing?: Listing;
}

export default function PurchaseDetails() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const {
    isLoading,
    data: response,
    error,
  } = useQuery({
    queryKey: ["purchase-details", id],
    queryFn: () => purchasesApi.getPurchaseById(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return <LoadingState />;
  }

  const purchase: Purchase = response?.data;

  if (error || !purchase) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4">
        <div className="text-destructive font-semibold">
          Failed to load purchase details
        </div>
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    );
  }

  const listing = purchase.listing;
  const paymentDate = new Date(purchase.purchasedAt || purchase.createdAt);

  return (
    <div className="min-h-screen px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Purchases
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Purchase Confirmed</h1>
              <div className="flex items-center gap-x-2">
                <p className="text-muted-foreground">
                  Transaction ID:{" "}
                  <span className="font-mono">{purchase.reference}</span>
                </p>
                <Badge className="w-fit bg-green-600/20 text-green-700 border-green-200">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {purchase.status}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-x-2">
              <Button variant="outline" className="flex items-center gap-x-2">
                <DownloadCloud />
                Download Comparable
              </Button>
              <Button
                className="flex items-center gap-x-2"
                onClick={() =>
                  router.push(
                    `/dashboard/purchases/${purchase.id}/listing/${listing?.id}`,
                  )
                }
              >
                <FileText />
                View Comparable
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Listing Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Listing Header Card */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-48 relative flex items-end p-6">
                <div className="space-y-2 w-full">
                  <h2 className="text-3xl font-bold text-white">
                    {listing?.title}
                  </h2>
                  <div className="flex items-center gap-2 text-blue-50">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {listing?.street}, {listing?.city}, {listing?.state}
                    </span>
                  </div>
                </div>
              </div>

              <CardContent className="pt-6 space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Market Price
                    </p>
                    <p className="text-lg font-bold truncate">
                      GHS {parseFloat(listing?.price || "0").toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Comparable Price
                    </p>
                    <p className="text-lg font-bold text-blue-600">
                      GHS{" "}
                      {parseFloat(
                        listing?.comparablePrice || "0",
                      ).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Price/Sq Ft
                    </p>
                    <p className="text-lg font-bold">
                      {listing?.pricePerSquareFoot}
                    </p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">
                      Days on Market
                    </p>
                    <p className="text-lg font-bold">{listing?.daysOnMarket}</p>
                  </div>
                </div>

                <Separator />

                {/* Property Details */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Property Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {listing?.bedrooms && (
                      <DetailItem
                        icon={<Home className="h-5 w-5" />}
                        label="Bedrooms"
                        value={listing.bedrooms}
                      />
                    )}
                    {listing?.bathrooms && (
                      <DetailItem
                        icon={<Zap className="h-5 w-5" />}
                        label="Bathrooms"
                        value={listing.bathrooms}
                      />
                    )}
                    {listing?.squareFeet && (
                      <DetailItem
                        icon={<Square className="h-5 w-5" />}
                        label="Square Feet"
                        value={listing.squareFeet.toLocaleString()}
                      />
                    )}
                    {listing?.parkingSpaces && (
                      <DetailItem
                        icon={<Users className="h-5 w-5" />}
                        label="Parking Spaces"
                        value={listing.parkingSpaces}
                      />
                    )}
                    {listing?.yearBuilt && (
                      <DetailItem
                        icon={<Calendar className="h-5 w-5" />}
                        label="Year Built"
                        value={listing.yearBuilt}
                      />
                    )}
                    {listing?.stories && (
                      <DetailItem
                        icon={<Building2 className="h-5 w-5" />}
                        label="Stories"
                        value={listing.stories}
                      />
                    )}
                  </div>
                </div>

                <Separator />

                {/* Classification */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Property Category
                    </p>
                    <Badge variant="secondary">
                      {listing?.propertyCategory}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Property Type
                    </p>
                    <Badge variant="secondary">{listing?.propertyType}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Condition
                    </p>
                    <Badge variant="secondary">{listing?.condition}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Valuation Method
                    </p>
                    <Badge variant="secondary">
                      {listing?.valuationMethod}
                    </Badge>
                  </div>
                </div>

                {listing?.description && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Description</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {listing.description}
                      </p>
                    </div>
                  </>
                )}

                {listing?.comparableNotes && (
                  <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-900 dark:text-blue-200">
                      <span className="font-semibold">Notes: </span>
                      {listing.comparableNotes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Purchase Details & Transaction Info */}
          <div className="space-y-6">
            {/* Transaction Summary */}
            <Card className="border-0 shadow-lg sticky top-8">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-400 p-2 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Transaction Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Amount Paid
                    </p>
                    <p className="text-3xl font-bold">
                      {purchase.currency} {(purchase.amount / 100).toFixed(2)}
                    </p>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Reference
                    </span>
                    <span className="font-mono font-semibold text-sm">
                      {purchase.reference}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Status
                    </span>
                    <Badge className="bg-green-600">{purchase.status}</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <span className="text-sm font-medium">
                      {paymentDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Time</span>
                    <span className="text-sm font-medium">
                      {paymentDate.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>

                <Separator />

                {/* Payment Method */}
                {purchase.payment_gateway_response?.channel && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Payment Method
                    </p>
                    <Badge variant="outline" className="capitalize">
                      {purchase.payment_gateway_response.channel.replace(
                        "_",
                        " ",
                      )}
                    </Badge>
                  </div>
                )}

                {/* Receipt Download */}
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => downloadReceipt(purchase)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
              </CardContent>
            </Card>

            {/* Buyer Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-base">Buyer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium truncate">
                      {purchase.buyerEmail}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Purchase Date
                    </p>
                    <p className="text-sm font-medium">
                      {paymentDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-semibold">{value}</p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <Skeleton className="h-12 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-96 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-80 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

function downloadReceipt(purchase: Purchase) {
  const receipt = `
╔════════════════════════════════════════════════════════════════╗
║                     PURCHASE RECEIPT                           ║
╚════════════════════════════════════════════════════════════════╝

TRANSACTION DETAILS
─────────────────────────────────────────────────────────────────
Reference:        ${purchase.reference}
Transaction ID:   ${purchase.id}
Status:           ${purchase.status}
Date:             ${new Date(
    purchase.purchasedAt || purchase.createdAt,
  ).toLocaleString()}

AMOUNT DETAILS
─────────────────────────────────────────────────────────────────
Currency:         ${purchase.currency}
Amount Paid:      ${purchase.currency} ${(purchase.amount / 100).toFixed(2)}

BUYER INFORMATION
─────────────────────────────────────────────────────────────────
Email:            ${purchase.buyerEmail}

LISTING INFORMATION
─────────────────────────────────────────────────────────────────
Listing ID:       ${purchase.listingId}

AUTHORIZATION
─────────────────────────────────────────────────────────────────
Authorization:    ${purchase.paystack_authorization_code}

Generated on ${new Date().toLocaleString()}
  `.trim();

  const blob = new Blob([receipt], { type: "text/plain" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `receipt-${purchase.reference}.txt`;
  a.click();
  window.URL.revokeObjectURL(url);
}
