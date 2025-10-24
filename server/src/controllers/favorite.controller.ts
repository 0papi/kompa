import { type Request, Response } from "express";
import { favoriteService } from "@/services/favorite.service";
import { logger } from "@/config/logger";
import { failure, success } from "@/utils/api-response";

export class FavoriteController {
  /**
   * Toggle bookmark for a listing
   * POST /favorites/:listingId/toggle
   */
  toggleBookmark = async (req: Request, res: Response) => {
    try {
      const userId = res.locals.uid as string;
      const { listingId } = req.params;

      if (!listingId) {
        return res.status(400).json(failure("Listing ID is required"));
      }

      const result = await favoriteService.toggleBookmark(userId, listingId);

      return res.status(200).json(success(result));
    } catch (error: any) {
      logger.error("Toggle bookmark failed", error);
      return res.status(500).json(failure(error.message));
    }
  };

  /**
   * Check if a listing is bookmarked by the current user
   * GET /favorites/:listingId/check
   */
  checkBookmark = async (req: Request, res: Response) => {
    try {
      const userId = res.locals.uid as string;
      const { listingId } = req.params;

      if (!listingId) {
        return res.status(400).json(failure("Listing ID is required"));
      }

      const isBookmarked = await favoriteService.isBookmarked(
        userId,
        listingId
      );

      return res.status(200).json(success({ bookmarked: isBookmarked }));
    } catch (error: any) {
      logger.error("Check bookmark failed", error);
      return res.status(500).json(failure(error.message));
    }
  };

  /**
   * Get all bookmarks for the current user
   * GET /favorites
   */
  getUserBookmarks = async (req: Request, res: Response) => {
    try {
      const userId = res.locals.uid as string;

      const bookmarks = await favoriteService.getUserBookmarks(userId);

      return res.status(200).json(success(bookmarks));
    } catch (error: any) {
      logger.error("Get user bookmarks failed", error);
      return res.status(500).json(failure(error.message));
    }
  };
}

export const favoriteController = new FavoriteController();
