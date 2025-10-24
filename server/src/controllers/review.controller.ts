import { logger } from "@/config/logger";
import { ReviewService } from "@/services/review.service";
import { failure, success } from "@/utils/api-response";
import type { Request, Response } from "express";
import type { CreateReviewType } from "@/schemas/review.schema";

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  /**
   * Get all reviews for a particular listing
   * GET /reviews
   */
  getListingReviews = async (req: Request, res: Response) => {
    try {
      const listingId = req.query.listingId as string;

      if (!listingId) {
        throw new Error("Missing parameters: Listing ID is required");
      }

      const [reviews, stats] = await Promise.all([
        this.reviewService.getReviewsByListingId(listingId),
        this.reviewService.getAverageRating(listingId),
      ]);

      return res.status(200).json(
        success({
          reviews,
          stats: {
            averageRating: Math.round(stats.average * 10) / 10, // Round to 1 decimal
            totalReviews: stats.count,
          },
        })
      );
    } catch (error: any) {
      logger.error("Getting listing reviews failed", error);
      return res.status(400).json(failure(error.message));
    }
  };

  /**
   * Create a new review
   * POST /reviews
   */
  createReview = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.uid;

      if (!userId) {
        return res.status(401).json(failure("Unauthorized"));
      }

      const data: CreateReviewType = req.body;

      // Check if user has purchased (for now, always true for testing)
      const hasPurchased = await this.reviewService.hasUserPurchased(
        userId,
        data.listingId
      );

      if (!hasPurchased) {
        return res
          .status(403)
          .json(failure("You must purchase this listing before leaving a review"));
      }

      const newReview = await this.reviewService.createReview({
        ...data,
        authorId: userId,
      });

      return res
        .status(201)
        .json(success(newReview, "Review created successfully"));
    } catch (error: any) {
      logger.error("Creating review failed", error);

      if (error.message === "You have already reviewed this listing") {
        return res.status(400).json(failure(error.message));
      }

      return res.status(400).json(failure(error.message));
    }
  };
}
