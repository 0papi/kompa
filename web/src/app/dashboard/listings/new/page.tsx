"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ListingForm, type ListingFormData } from "@/components/listings";
import { ImageUpload } from "@/components/listings/image-upload";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { listingsApi } from "@/lib/api/listings";
import { listingImagesApi } from "@/lib/api/listing-images";
import { toast } from "sonner";

export default function NewListingPage() {
  const router = useRouter();
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const uploadImagesMutation = useMutation({
    mutationFn: ({ listingId, files }: { listingId: string; files: File[] }) =>
      listingImagesApi.upload(listingId, files),
  });

  const createListingMutation = useMutation({
    mutationFn: (data: ListingFormData) => listingsApi.create(data),
    onSuccess: async (response) => {
      const listingId = response.data.id;

      // Upload images if any were selected
      if (selectedImages.length > 0) {
        try {
          await uploadImagesMutation.mutateAsync({
            listingId,
            files: selectedImages,
          });
          toast.success("Comparable listing and images added successfully!");
        } catch (error) {
          toast.warning(
            "Listing created but some images failed to upload. You can add them later."
          );
        }
      } else {
        toast.success("Comparable listing added successfully!");
      }

      router.push("/dashboard/listings");
    },
    onError: (error: any) => {
      const errorMessage =
        error?.message || "Failed to create listing. Please try again.";
      toast.error(errorMessage);
    },
  });

  const handleSubmit = async (data: ListingFormData) => {
    createListingMutation.mutate(data);
  };

  const handleImagesSelected = (files: File[]) => {
    setSelectedImages(files);
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="md:space-y-6 space-y-4">
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
          <h1 className="md:text-3xl text-lg font-bold tracking-tight">
            Create New Comparable
          </h1>
          <p className="text-muted-foreground mt-1 md:text-base text-sm">
            Add a new comparable to your listings
          </p>
        </div>
      </div>

      <Separator />

      {/* Form */}
      <ListingForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isLoading={createListingMutation.isPending}
        defaultValues={{stories: 1, condition: 'The property is in good condition'}}
      />

      <Separator />

      {/* Image Upload Section */}
      <div className="p-4 md:p-6">
        <h2 className="text-lg font-semibold mb-4 md:mb-6">Property Images</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Upload images of the property. The first image will be set as the primary image.
        </p>
        <ImageUpload
          onImagesSelected={handleImagesSelected}
          maxFiles={10}
          disabled={createListingMutation.isPending || uploadImagesMutation.isPending}
        />
      </div>
    </div>
  );
}
