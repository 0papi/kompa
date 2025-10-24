import { Router } from "express";
import { UserController } from "@/controllers/user.controller";
import { validate } from "@/middleware/validation";
import { createFirebaseUserSchema } from "@/schemas/user.schema";
import { validateRequest } from "zod-express-middleware";

const router: ReturnType<typeof Router> = Router();

const userController = new UserController();

router.post(
  "/register",
  validateRequest({ body: createFirebaseUserSchema }),
  userController.create,
);

export default router;
