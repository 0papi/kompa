import { PurchaseController } from "@/controllers/purchase.controller";
import { authenticateUser } from "@/middleware/auth";
import { initialiseTransactionSchema, verifyPurchaseSchema } from "@/schemas/purchase.schema";
import { Router } from "express";
import { validateRequestBody } from "zod-express-middleware";

const router: ReturnType<typeof Router> = Router();
const purchaseController = new PurchaseController();

router.post(
  "/initialise",
  authenticateUser,
  validateRequestBody(initialiseTransactionSchema),
  purchaseController.initialise
);
router.post(
  "/verify",
  authenticateUser,
  validateRequestBody(verifyPurchaseSchema),
  purchaseController.verify
);
router.get(
  "/",
  authenticateUser,
  purchaseController.getPurchases
);
router.get(
  "/:id",
  authenticateUser,
  purchaseController.getById
);


export default router
