import { Router } from "express";
import { UserController } from "@/controllers/user.controller";
import { createFirebaseUserSchema, updateUserSchema, completeOAuthRegistrationSchema } from "@/schemas/user.schema";
import { validateRequest } from "zod-express-middleware";
import { authenticateUser, authenticateOauth } from "@/middleware/auth";

const router: ReturnType<typeof Router> = Router();

const userController = new UserController();

router.post(
  "/register",
  validateRequest({ body: createFirebaseUserSchema }),
  userController.create,
);

// Complete OAuth registration (Google sign-in)
// Uses authenticateOauth which only verifies Firebase token without checking database
router.post(
  "/complete-oauth",
  authenticateOauth,
  validateRequest({ body: completeOAuthRegistrationSchema }),
  userController.completeOAuthRegistration,
);

// Get current user profile
router.get(
  "/profile",
  authenticateUser,
  userController.getProfile,
);

// Update current user profile
router.patch(
  "/profile",
  authenticateUser,
  validateRequest({ body: updateUserSchema }),
  userController.updateProfile,
);

export default router;
