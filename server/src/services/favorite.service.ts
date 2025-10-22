import { BaseService } from "./base.service";
import { favorite } from "@/models/favorite.model";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";

class FavoriteService extends BaseService<typeof favorite> {
  constructor() {
    super(favorite);
  }

  /**
   * Toggle bookmark for a listing
   * If exists, remove it. If not, add it.
   */
  async toggleBookmark(userId: string, listingId: string) {
    // Check if bookmark already exists
    const existing = await this.findOne(
      and(
        eq(favorite.userId, userId),
        eq(favorite.listingId, listingId)
      )
    );

    if (existing) {
      // Remove bookmark
      await db
        .delete(favorite)
        .where(
          and(
            eq(favorite.userId, userId),
            eq(favorite.listingId, listingId)
          )
        );
      return { bookmarked: false, message: "Bookmark removed" };
    } else {
      // Add bookmark
      await this.create({ userId, listingId });
      return { bookmarked: true, message: "Bookmark added" };
    }
  }

  /**
   * Check if a listing is bookmarked by a user
   */
  async isBookmarked(userId: string, listingId: string): Promise<boolean> {
    const bookmark = await this.findOne(
      and(
        eq(favorite.userId, userId),
        eq(favorite.listingId, listingId)
      )
    );
    return !!bookmark;
  }

  /**
   * Get all bookmarks for a user
   */
  async getUserBookmarks(userId: string) {
    return this.findMany(eq(favorite.userId, userId));
  }

  /**
   * Get all bookmarks for a listing
   */
  async getListingBookmarks(listingId: string) {
    return this.findMany(eq(favorite.listingId, listingId));
  }
}

export const favoriteService = new FavoriteService();
