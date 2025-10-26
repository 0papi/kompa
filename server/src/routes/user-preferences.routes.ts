import { Router } from "express";
import { UserPreferencesController } from "@/controllers/user-preferences.controller";
import { validateRequest } from "zod-express-middleware";
import { updateUserPreferencesSchema } from "@/schemas/user-preferences.schema";
import { authenticateUser } from "@/middleware/auth";

const router: ReturnType<typeof Router> = Router();
const userPreferencesController = new UserPreferencesController();

// All routes require authentication
router.use(authenticateUser);

// GET /users/preferences - Get current user's preferences
router.get(
  "/",
  userPreferencesController.getPreferences,
);

// PATCH /users/preferences - Update current user's preferences
router.patch(
  "/",
  validateRequest({ body: updateUserPreferencesSchema }),
  userPreferencesController.updatePreferences,
);

// DELETE /users/preferences - Delete current user's preferences
router.delete(
  "/",
  userPreferencesController.deletePreferences,
);

export default router;
