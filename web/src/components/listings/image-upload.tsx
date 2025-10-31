"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImagesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in bytes
  disabled?: boolean;
}

interface PreviewImage {
  file: File;
  preview: string;
}

export function ImageUpload({
  onImagesSelected,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  disabled = false,
}: ImageUploadProps) {
  const [selectedImages, setSelectedImages] = useState<PreviewImage[]>([]);
  const [error, setError] = useState<string>("");

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError("");

      // Handle rejected files
      if (rejectedFiles.length > 0) {
        const errors = rejectedFiles.map((file) => {
          if (file.errors[0]?.code === "file-too-large") {
            return `${file.file.name} is too large (max ${maxSize / 1024 / 1024}MB)`;
          }
          if (file.errors[0]?.code === "file-invalid-type") {
            return `${file.file.name} is not a valid image`;
          }
          return file.errors[0]?.message;
        });
        setError(errors.join(", "));
        return;
      }

      // Check if we exceed max files
      if (selectedImages.length + acceptedFiles.length > maxFiles) {
        setError(`Maximum ${maxFiles} images allowed`);
        return;
      }

      // Create preview URLs
      const newImages: PreviewImage[] = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

      const updatedImages = [...selectedImages, ...newImages];
      setSelectedImages(updatedImages);
      onImagesSelected(updatedImages.map((img) => img.file));
    },
    [selectedImages, maxFiles, maxSize, onImagesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxSize,
    maxFiles: maxFiles - selectedImages.length,
    disabled,
  });

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(selectedImages[index].preview);
    setSelectedImages(newImages);
    onImagesSelected(newImages.map((img) => img.file));
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-destructive"
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-medium">
              {isDragActive ? "Drop images here" : "Drag & drop images here"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              or click to browse (max {maxFiles} images, {maxSize / 1024 / 1024}
              MB each)
            </p>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Image previews */}
      {selectedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {selectedImages.map((image, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-lg overflow-hidden border bg-muted"
            >
              <img
                src={image.preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeImage(index)}
                  disabled={disabled}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                  Primary
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload info */}
      {selectedImages.length > 0 && (
        <p className="text-sm text-muted-foreground">
          {selectedImages.length} image{selectedImages.length !== 1 ? "s" : ""}{" "}
          selected ({maxFiles - selectedImages.length} remaining)
        </p>
      )}
    </div>
  );
}
