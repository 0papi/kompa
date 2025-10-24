import { ReviewController } from "@/controllers/review.controller";
import { authenticateUser, optionalAuth } from "@/middleware/auth";
import { CreateReviewSchema, GetReviewsSchema } from "@/schemas/review.schema";
import { Router } from "express";
import { validateRequest } from "zod-express-middleware";

const router: ReturnType<typeof Router> = Router();

const reviewController = new ReviewController();

// GET reviews - public (anyone can view reviews)
router.get(
  "/reviews",
  optionalAuth,
  validateRequest({ query: GetReviewsSchema }),
  reviewController.getListingReviews
);

// POST review - requires authentication
router.post(
  "/reviews",
  authenticateUser,
  validateRequest({ body: CreateReviewSchema }),
  reviewController.createReview
);

export default router;
