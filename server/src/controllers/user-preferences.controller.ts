import { Response } from "express";
import { UserPreferencesService } from "@/services/user-preferences.service";
import { UpdateUserPreferencesType } from "@/schemas/user-preferences.schema";
import { logger } from "@/config/logger";
import { failure, success } from "@/utils/api-response";
import type { AuthenticatedRequest } from "@/types/index";
import { slackService } from "@/services/slack.service";

export class UserPreferencesController {
  private userPreferencesService: UserPreferencesService;

  constructor() {
    this.userPreferencesService = new UserPreferencesService();
  }

  /**
   * GET /users/preferences - Get current user's preferences
   */
  getPreferences = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = res.locals.uid;

      if (!userId) {
        return res.status(401).json(failure("User not authenticated"));
      }

      const preferences = await this.userPreferencesService.getByUserId(userId);

      if (!preferences) {
        // Return default preferences if none exist
        return res.status(200).json(success({
          userId,
          preferredCurrency: "USD",
          preferredLanguage: "en",
          notificationPreferences: {
            email: true,
            push: true,
            sms: false,
            marketing: false,
          },
        }));
      }

      return res.status(200).json(success(preferences));
    } catch (error: any) {
      logger.error("Getting user preferences failed", error);
      return res.status(500).json(failure(error.message));
    }
  };

  /**
   * PATCH /users/preferences - Update current user's preferences
   */
  updatePreferences = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = res.locals.uid;
      const payload = req.body as UpdateUserPreferencesType;

      if (!userId) {
        return res.status(401).json(failure("User not authenticated"));
      }

      const updatedPreferences = await this.userPreferencesService.upsert(
        userId,
        payload,
      );

      // Log to Slack
      await slackService.logPreferences(userId, payload);

      return res.status(200).json(success(updatedPreferences));
    } catch (error: any) {
      logger.error("Updating user preferences failed", error);
      return res.status(500).json(failure(error.message));
    }
  };

  /**
   * DELETE /users/preferences - Delete current user's preferences
   */
  deletePreferences = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = res.locals.uid;

      if (!userId) {
        return res.status(401).json(failure("User not authenticated"));
      }

      const deleted = await this.userPreferencesService.deleteByUserId(userId);

      if (!deleted) {
        return res.status(404).json(failure("Preferences not found"));
      }

      return res.status(200).json(success({ message: "Preferences deleted successfully" }));
    } catch (error: any) {
      logger.error("Deleting user preferences failed", error);
      return res.status(500).json(failure(error.message));
    }
  };
}
