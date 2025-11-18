import { Router } from "express";
import { ListingController } from "@/controllers/listing.controllers";
import { validateRequest } from "zod-express-middleware";
import { listingFormSchema } from "@/schemas/listing.schema";
import { authenticateUser, optionalAuth } from "@/middleware/auth";

const router: ReturnType<typeof Router> = Router();

const listingController = new ListingController();

router.get("/published", listingController.getPublished);

// Protected routes
router.post(
  "/",
  authenticateUser,
  validateRequest({ body: listingFormSchema }),
  listingController.create,
);

router.get("/my-listings", authenticateUser, listingController.getUserListings);

router.get("/:id", optionalAuth, listingController.getById);
router.get("/public/:id", listingController.getPublicListingById);

router.put(
  "/:id",
  authenticateUser,
  validateRequest({ body: listingFormSchema.partial() }),
  listingController.update,
);

router.delete("/:id", authenticateUser, listingController.delete);

router.patch("/:id/restore", authenticateUser, listingController.restore);

router.patch("/:id/status", authenticateUser, listingController.updateStatus);

export default router;
