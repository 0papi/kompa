import { reviews as ReviewsTable } from "@/models";
import { BaseService } from "./base.service";
import { desc, eq, and, sql } from "drizzle-orm";
import type { CreateReviewType } from "@/schemas/review.schema";
import { db } from "@/db";

export class ReviewService extends BaseService<typeof ReviewsTable> {
  constructor() {
    super(ReviewsTable);
  }

  async getReviewsByListingId(listingId: string) {
    return this.findMany(
      eq(ReviewsTable.listingId, listingId),
      desc(ReviewsTable.createdAt)
    );
  }

  async getAverageRating(listingId: string): Promise<{ average: number; count: number }> {
    const result = await db
      .select({
        average: sql<number>`COALESCE(AVG(${ReviewsTable.rating}), 0)`,
        count: sql<number>`COUNT(*)::int`,
      })
      .from(ReviewsTable)
      .where(eq(ReviewsTable.listingId, listingId));

    return {
      average: Number(result[0]?.average || 0),
      count: Number(result[0]?.count || 0),
    };
  }

  async createReview(data: CreateReviewType & { authorId: string }) {
    // Check if user already reviewed this listing
    const existingReview = await this.findOne(
      and(
        eq(ReviewsTable.listingId, data.listingId),
        eq(ReviewsTable.authorId, data.authorId)
      )
    );

    if (existingReview) {
      throw new Error("You have already reviewed this listing");
    }

    return this.create({
      authorId: data.authorId,
      listingId: data.listingId,
      rating: data.rating,
      comment: data.comment,
    });
  }

  async hasUserPurchased(userId: string, listingId: string): Promise<boolean> {
    // TODO: Implement purchase check when purchase table is created
    // For now, return true to allow testing
    return true;
  }
}
