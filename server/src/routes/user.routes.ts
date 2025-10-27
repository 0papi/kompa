import { Router } from "express";
import { UserController } from "@/controllers/user.controller";
import { validate } from "@/middleware/validation";
import { createFirebaseUserSchema, updateUserSchema, completeOAuthRegistrationSchema } from "@/schemas/user.schema";
import { validateRequest } from "zod-express-middleware";
import { authenticateUser } from "@/middleware/auth";

const router: ReturnType<typeof Router> = Router();

const userController = new UserController();

router.post(
  "/register",
  validateRequest({ body: createFirebaseUserSchema }),
  userController.create,
);

// Complete OAuth registration (Google sign-in)
router.post(
  "/complete-oauth",
  authenticateUser,
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
