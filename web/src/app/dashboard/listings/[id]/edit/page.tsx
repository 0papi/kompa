"use client";

import { useRouter, useParams } from "next/navigation";
import { ListingForm, type ListingFormData } from "@/components/listings";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listingsApi, type Listing } from "@/lib/api/listings";
import { toast } from "sonner";
import { useEffect } from "react";

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const listingId = params.id as string;

  // Fetch the listing data
  const {
    data: listingResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["listing", listingId],
    queryFn: () => listingsApi.getById(listingId),
    enabled: !!listingId,
    retry: 1,
  });

  const listing = listingResponse?.data;

  // Update mutation
  const updateListingMutation = useMutation({
    mutationFn: (data: ListingFormData) =>
      listingsApi.update(listingId, data),
    onSuccess: (response) => {
      toast.success("Listing updated successfully!");
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      router.push("/dashboard/listings");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || "Failed to update listing. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = async (data: ListingFormData) => {
    updateListingMutation.mutate(data);
  };

  const handleCancel = () => {
    router.back();
  };

  // Handle error state
  useEffect(() => {
    if (error) {
      toast.error("Failed to load listing. Redirecting...");
      setTimeout(() => {
        router.push("/dashboard/listings");
      }, 2000);
    }
  }, [error, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Loading listing...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !listing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-destructive">
            Failed to load listing. Redirecting...
          </p>
        </div>
      </div>
    );
  }

  // Transform listing data to form data format
  const defaultValues: Partial<ListingFormData> = {
    title: listing.title,
    description: listing.description,
    status: listing.status,
    street: listing.street,
    city: listing.city,
    state: listing.state,
    zipCode: listing.zipCode,
    county: listing.county || undefined,
    propertyCategory: listing.propertyCategory,
    propertyType: listing.propertyType,
    price: Number(listing.price),
    pricePerSquareFoot: listing.pricePerSquareFoot ? Number(listing.pricePerSquareFoot) : undefined,
    bedrooms: listing.bedrooms,
    bathrooms: Number(listing.bathrooms),
    squareFeet: listing.squareFeet,
    lotSize: listing.lotSize ? Number(listing.lotSize) : undefined,
    yearBuilt: listing.yearBuilt || undefined,
    stories: listing.stories || undefined,
    garageSpaces: listing.garageSpaces || undefined,
    parkingSpaces: listing.parkingSpaces || undefined,
    condition: listing.condition,
    hoaFees: listing.hoaFees ? Number(listing.hoaFees) : undefined,
    propertyTaxes: listing.propertyTaxes ? Number(listing.propertyTaxes) : undefined,
    annualInsurance: listing.annualInsurance ? Number(listing.annualInsurance) : undefined,
    valuationMethod: listing.valuationMethod as "SALES_COMPARISON" | "COST_APPROACH" | "INCOME_APPROACH" | "MIXED",
    listDate: listing.listDate
      ? new Date(listing.listDate).toISOString().split("T")[0]
      : undefined,
    saleDate: listing.saleDate
      ? new Date(listing.saleDate).toISOString().split("T")[0]
      : undefined,
    daysOnMarket: listing.daysOnMarket || undefined,
    features: listing.features || [],
    comparableNotes: listing.comparableNotes || undefined,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-8 w-8"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Listing</h1>
          <p className="text-muted-foreground mt-1">
            Update your property listing details
          </p>
        </div>
      </div>

      <Separator />

      {/* Form */}
      <ListingForm
        key={listingId} // Force remount when listing ID changes
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        defaultValues={defaultValues}
        isLoading={updateListingMutation.isPending}
      />
    </div>
  );
}
