import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { listings } from "./listing.model";

export const listingImages = pgTable("listing_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  listingId: uuid("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),

  // Provider-agnostic storage
  imageUrl: text("image_url").notNull(), // Full public URL (works with any provider)
  storageKey: text("storage_key").notNull(), // Provider-specific ID (Cloudinary public_id or GCS path)

  // Image metadata
  displayOrder: integer("display_order").notNull().default(0),
  isPrimary: boolean("is_primary").notNull().default(false),
  fileSize: integer("file_size"), // Size in bytes
  mimeType: text("mime_type"), // e.g., 'image/jpeg', 'image/png'
  width: integer("width"), // Image width in pixels
  height: integer("height"), // Image height in pixels

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ListingImage = typeof listingImages.$inferSelect;
export type NewListingImage = typeof listingImages.$inferInsert;
