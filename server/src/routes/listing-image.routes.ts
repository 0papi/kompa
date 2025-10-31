import { Router } from "express";
import { ListingImageController, upload } from "@/controllers/listing-image.controller";
import { authenticateUser } from "@/middleware/auth";

const router: ReturnType<typeof Router> = Router();

const listingImageController = new ListingImageController();

// All routes require authentication
router.post(
  "/listings/:listingId/images",
  authenticateUser,
  upload.array("images", 10), // Max 10 images
  listingImageController.uploadImages
);

router.get(
  "/listings/:listingId/images",
  listingImageController.getListingImages
);

router.delete(
  "/images/:imageId",
  authenticateUser,
  listingImageController.deleteImage
);

router.patch(
  "/listings/:listingId/images/:imageId/primary",
  authenticateUser,
  listingImageController.setPrimaryImage
);

router.patch(
  "/images/reorder",
  authenticateUser,
  listingImageController.updateDisplayOrders
);

export default router;
