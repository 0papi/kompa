import { Router } from "express";
import { UserController } from "@/controllers/user.controller";
import { validate } from "@/middleware/validation";
import { createFirebaseUserSchema, updateUserSchema } from "@/schemas/user.schema";
import { validateRequest } from "zod-express-middleware";
import { authenticateUser } from "@/middleware/auth";

const router: ReturnType<typeof Router> = Router();

const userController = new UserController();

router.post(
  "/register",
  validateRequest({ body: createFirebaseUserSchema }),
  userController.create,
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
