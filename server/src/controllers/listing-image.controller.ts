import { type Request, Response } from "express";
import { ListingImageService } from "@/services/listing-image.service";
import { logger } from "@/config/logger";
import { failure, success } from "@/utils/api-response";
import multer from "multer";

export class ListingImageController {
  private listingImageService: ListingImageService;

  constructor() {
    this.listingImageService = new ListingImageService();
  }

  /**
   * Upload image(s) for a listing
   */
  uploadImages = async (req: Request, res: Response) => {
    try {
      const { listingId } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        return res.status(400).json(failure("No files uploaded"));
      }

      // Get existing images count for display order
      const existingImages = await this.listingImageService.getListingImages(listingId);
      let displayOrder = existingImages.length;

      // Upload all images
      const uploadPromises = files.map((file, index) => {
        const isPrimary = existingImages.length === 0 && index === 0; // First image of first upload is primary
        return this.listingImageService.uploadImage(
          listingId,
          file,
          displayOrder + index,
          isPrimary
        );
      });

      const uploadedImages = await Promise.all(uploadPromises);

      return res.status(201).json(
        success({
          images: uploadedImages,
          count: uploadedImages.length,
        })
      );
    } catch (error: any) {
      logger.error("Image upload failed", error);
      return res.status(400).json(failure(error.message || "Failed to upload images"));
    }
  };

  /**
   * Get all images for a listing
   */
  getListingImages = async (req: Request, res: Response) => {
    try {
      const { listingId } = req.params;
      const images = await this.listingImageService.getListingImages(listingId);

      return res.status(200).json(success(images));
    } catch (error: any) {
      logger.error("Failed to fetch listing images", error);
      return res.status(400).json(failure(error.message));
    }
  };

  /**
   * Delete an image
   */
  deleteImage = async (req: Request, res: Response) => {
    try {
      const { imageId } = req.params;

      await this.listingImageService.deleteImage(imageId);

      return res.status(200).json(success({ message: "Image deleted successfully" }));
    } catch (error: any) {
      logger.error("Failed to delete image", error);
      return res.status(400).json(failure(error.message));
    }
  };

  /**
   * Set image as primary
   */
  setPrimaryImage = async (req: Request, res: Response) => {
    try {
      const { imageId, listingId } = req.params;

      const updatedImage = await this.listingImageService.setPrimaryImage(imageId, listingId);

      return res.status(200).json(success(updatedImage));
    } catch (error: any) {
      logger.error("Failed to set primary image", error);
      return res.status(400).json(failure(error.message));
    }
  };

  /**
   * Update display orders for images
   */
  updateDisplayOrders = async (req: Request, res: Response) => {
    try {
      const { updates } = req.body as { updates: { id: string; displayOrder: number }[] };

      if (!updates || !Array.isArray(updates)) {
        return res.status(400).json(failure("Invalid updates format"));
      }

      await this.listingImageService.updateDisplayOrders(updates);

      return res.status(200).json(success({ message: "Display orders updated successfully" }));
    } catch (error: any) {
      logger.error("Failed to update display orders", error);
      return res.status(400).json(failure(error.message));
    }
  };
}

// Configure multer for memory storage
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 10, // Max 10 files per request
  },
  fileFilter: (req, file, cb) => {
    // Only allow images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});
