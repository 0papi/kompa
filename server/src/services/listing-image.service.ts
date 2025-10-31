import { listingImages as listingImageTable, ListingImage, NewListingImage } from "@/models/listing-image.model";
import { eq, and, desc } from "drizzle-orm";
import { BaseService } from "./base.service";
import { cloudinary } from "@/config/cloudinary";
import { UploadApiResponse } from "cloudinary";

export class ListingImageService extends BaseService<typeof listingImageTable> {
  constructor() {
    super(listingImageTable);
  }

  /**
   * Upload image to Cloudinary and save metadata to database
   */
  async uploadImage(
    listingId: string,
    file: Express.Multer.File,
    displayOrder: number = 0,
    isPrimary: boolean = false
  ): Promise<ListingImage> {
    try {
      // Upload to Cloudinary
      const result: UploadApiResponse = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: `listings/${listingId}`,
            resource_type: "image",
            transformation: [
              { quality: "auto", fetch_format: "auto" }, // Auto optimize
              { width: 2000, height: 2000, crop: "limit" }, // Max dimensions
            ],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result!);
          }
        );

        uploadStream.end(file.buffer);
      });

      // Save metadata to database
      const imageData: NewListingImage = {
        listingId,
        imageUrl: result.secure_url,
        storageKey: result.public_id,
        displayOrder,
        isPrimary,
        fileSize: result.bytes,
        mimeType: file.mimetype,
        width: result.width,
        height: result.height,
      };

      return await this.create<NewListingImage, ListingImage>(imageData);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  }

  /**
   * Get all images for a listing
   */
  async getListingImages(listingId: string): Promise<ListingImage[]> {
    return this.findMany<ListingImage>(
      eq(listingImageTable.listingId, listingId),
      desc(listingImageTable.displayOrder)
    );
  }

  /**
   * Delete image from Cloudinary and database
   */
  async deleteImage(imageId: string): Promise<void> {
    // Get image data
    const image = await this.findById<ListingImage>(imageId);
    if (!image) {
      throw new Error("Image not found");
    }

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(image.storageKey);
    } catch (error) {
      console.error("Error deleting from Cloudinary:", error);
      // Continue to delete from database even if Cloudinary fails
    }

    // Delete from database
    await this.delete(imageId);
  }

  /**
   * Set an image as primary (and unset others)
   */
  async setPrimaryImage(imageId: string, listingId: string): Promise<ListingImage> {
    const db = this.db;

    // Unset all other primary images for this listing
    await db
      .update(listingImageTable)
      .set({ isPrimary: false })
      .where(eq(listingImageTable.listingId, listingId));

    // Set this image as primary
    return this.update<Partial<NewListingImage>, ListingImage>(imageId, {
      isPrimary: true,
    });
  }

  /**
   * Update display order for multiple images
   */
  async updateDisplayOrders(
    updates: { id: string; displayOrder: number }[]
  ): Promise<void> {
    const db = this.db;

    // Update each image's display order
    await Promise.all(
      updates.map((update) =>
        db
          .update(listingImageTable)
          .set({ displayOrder: update.displayOrder })
          .where(eq(listingImageTable.id, update.id))
      )
    );
  }

  /**
   * Get primary image for a listing
   */
  async getPrimaryImage(listingId: string): Promise<ListingImage | null> {
    const images = await this.findMany<ListingImage>(
      and(
        eq(listingImageTable.listingId, listingId),
        eq(listingImageTable.isPrimary, true)
      )
    );

    return images[0] || null;
  }
}
