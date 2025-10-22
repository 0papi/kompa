import { Router } from "express";
import { favoriteController } from "@/controllers/favorite.controller";
import { authenticateUser } from "@/middleware/auth";

const router: ReturnType<typeof Router> = Router();

// All routes require authentication
router.post(
  "/:listingId/toggle",
  authenticateUser,
  favoriteController.toggleBookmark
);

router.get(
  "/:listingId/check",
  authenticateUser,
  favoriteController.checkBookmark
);

router.get("/", authenticateUser, favoriteController.getUserBookmarks);

export default router;
