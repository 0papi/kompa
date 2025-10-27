"use client";

import { useRouter } from "next/navigation";
import { ListingForm, type ListingFormData } from "@/components/listings";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import { listingsApi } from "@/lib/api/listings";
import { toast } from "sonner";

export default function NewListingPage() {
  const router = useRouter();

  const createListingMutation = useMutation({
    mutationFn: (data: ListingFormData) => listingsApi.create(data),
    onSuccess: (response) => {
      toast.success("Comparable listing added successfully!");
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
    </div>
  );
}
