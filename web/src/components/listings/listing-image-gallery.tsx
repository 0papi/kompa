"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listingImagesApi, type ListingImage } from "@/lib/api/listing-images";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, X, Maximize2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ListingImageGalleryProps {
  listingId: string;
  images?: ListingImage[];
  className?: string;
}

export function ListingImageGallery({
  listingId,
  className,
  images: initialImages,
}: ListingImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["listing-images", listingId],
    queryFn: () => listingImagesApi.getListingImages(listingId),
    enabled: !!listingId && initialImages?.length === 0,
  });

  console.log("passed in images", initialImages);

  const images = response?.data || initialImages || [];
  const sortedImages = [...images].sort((a, b) => {
    // Primary image first, then by display order
    if (a.isPrimary) return -1;
    if (b.isPrimary) return 1;
    return a.displayOrder - b.displayOrder;
  });

  const handlePrevious = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? sortedImages.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setSelectedImageIndex((prev) =>
      prev === sortedImages.length - 1 ? 0 : prev + 1,
    );
  };

  if (isLoading) {
    return (
      <div
        className={cn(
          "rounded-lg border bg-muted h-96 flex items-center justify-center",
          className,
        )}
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "rounded-lg border bg-muted h-96 flex items-center justify-center",
          className,
        )}
      >
        <div className="text-center text-muted-foreground">
          <p>Failed to load images</p>
        </div>
      </div>
    );
  }

  // Fallback for no images
  if (sortedImages.length === 0) {
    return (
      <div
        className={cn(
          "rounded-lg border bg-gradient-to-br from-primary/20 to-primary/5 h-96 flex items-center justify-center",
          className,
        )}
      >
        <div className="text-center">
          <div className="text-9xl opacity-20">🏠</div>
          <p className="text-sm text-muted-foreground mt-4">
            No images available
          </p>
        </div>
      </div>
    );
  }

  const selectedImage = sortedImages[selectedImageIndex];

  return (
    <>
      <div className={cn("space-y-4", className)}>
        {/* Main Image */}
        <div className="relative rounded-lg overflow-hidden border bg-muted group">
          <div className="aspect-video relative">
            <img
              src={selectedImage.imageUrl}
              alt={`Property image ${selectedImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            {selectedImage.isPrimary && (
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground text-xs px-3 py-1.5 rounded-md font-medium">
                Primary Image
              </div>
            )}
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsLightboxOpen(true)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation Arrows */}
          {sortedImages.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handlePrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}

          {/* Image Counter */}
          {sortedImages.length > 1 && (
            <div className="absolute bottom-4 right-4 bg-black/70 text-white text-xs px-3 py-1.5 rounded-md">
              {selectedImageIndex + 1} / {sortedImages.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {sortedImages.length > 1 && (
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {sortedImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImageIndex(index)}
                className={cn(
                  "relative aspect-square rounded-lg overflow-hidden border-2 transition-all hover:opacity-100",
                  selectedImageIndex === index
                    ? "border-primary opacity-100 ring-2 ring-primary ring-offset-2"
                    : "border-transparent opacity-60",
                )}
              >
                <img
                  src={image.imageUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {image.isPrimary && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary text-primary-foreground text-[8px] px-1.5 py-0.5 rounded">
                      Primary
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setIsLightboxOpen(false)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            <div
              className="relative max-w-7xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                src={selectedImage.imageUrl}
                alt={`Property image ${selectedImageIndex + 1}`}
                className="max-w-full max-h-[90vh] object-contain"
              />

              {/* Lightbox Navigation */}
              {sortedImages.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrevious();
                    }}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>

                  {/* Lightbox Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-sm px-4 py-2 rounded-md">
                    {selectedImageIndex + 1} / {sortedImages.length}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
