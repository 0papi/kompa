import { Router } from "express";
import { PaymentMethodsController } from "@/controllers/payment-methods.controller";
import { validateRequest } from "zod-express-middleware";
import { createPayoutMethodSchema, updatePayoutMethodSchema } from "@/schemas/payment-methods.schema";
import { authenticateUser } from "@/middleware/auth";

const router: ReturnType<typeof Router> = Router();
const paymentMethodsController = new PaymentMethodsController();

// All routes require authentication
router.use(authenticateUser);

// GET /users/payment-methods/preferred - Get preferred payment method (must come before /:id)
router.get(
  "/preferred",
  paymentMethodsController.getPreferredPaymentMethod,
);

// GET /users/payment-methods - Get all payment methods
router.get(
  "/",
  paymentMethodsController.getAllPaymentMethods,
);

// POST /users/payment-methods - Create a new payment method
router.post(
  "/",
  validateRequest({ body: createPayoutMethodSchema }),
  paymentMethodsController.createPaymentMethod,
);

// GET /users/payment-methods/:id - Get a specific payment method
router.get(
  "/:id",
  paymentMethodsController.getPaymentMethod,
);

// PATCH /users/payment-methods/:id - Update a payment method
router.patch(
  "/:id",
  validateRequest({ body: updatePayoutMethodSchema }),
  paymentMethodsController.updatePaymentMethod,
);

// DELETE /users/payment-methods/:id - Delete a payment method
router.delete(
  "/:id",
  paymentMethodsController.deletePaymentMethod,
);

export default router;
