import { type Request, Response } from "express";
import { CreateListingType } from "@/schemas/listing.schema";
import { ListingService } from "@/services/listing.service";
import { logger } from "@/config/logger";
import { failure, success } from "@/utils/api-response";

export class ListingController {
  private listingService: ListingService;

  constructor() {
    this.listingService = new ListingService();
  }

  create = async (req: Request, res: Response) => {
    try {
      const userId = res.locals.uid as string;
      const payload = req.body as CreateListingType;

      const listing = await this.listingService.createListing(userId, payload);

      return res.status(201).json(success(listing));
    } catch (error: any) {
      logger.error("Creating listing failed", error);
      return res.status(400).json(failure(error.message));
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = res.locals.uid as string | undefined;

      const listing = await this.listingService.getListingById(id, userId);

      if (!listing) {
        return res.status(404).json(failure("Listing not found"));
      }

      return res.status(200).json(success(listing));
    } catch (error: any) {
      logger.error("Getting listing failed", error);
      return res.status(400).json(failure(error.message));
    }
  };

  getUserListings = async (req: Request, res: Response) => {
    try {
      const userId = res.locals.uid as string;

      const listings = await this.listingService.getUserListings(userId);

      return res.status(200).json(success(listings));
    } catch (error: any) {
      logger.error("Getting user listings failed", error);
      return res.status(400).json(failure(error.message));
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = res.locals.uid as string;
      const payload = req.body as Partial<CreateListingType>;

      const updatedListing = await this.listingService.updateListing(
        id,
        userId,
        payload,
      );

      if (!updatedListing) {
        return res
          .status(404)
          .json(failure("Listing not found or unauthorized"));
      }

      return res.status(200).json(success(updatedListing));
    } catch (error: any) {
      logger.error("Updating listing failed", error);
      return res.status(400).json(failure(error.message));
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = res.locals.uid as string;

      const deletedListing = await this.listingService.deleteListing(
        id,
        userId,
      );

      if (!deletedListing) {
        return res
          .status(404)
          .json(failure("Listing not found or unauthorized"));
      }

      return res.status(200).json(success(deletedListing));
    } catch (error: any) {
      logger.error("Deleting listing failed", error);
      return res.status(400).json(failure(error.message));
    }
  };

  getPublished = async (req: Request, res: Response) => {
    try {
      const listings = await this.listingService.getPublishedListings();

      return res.status(200).json(success(listings));
    } catch (error: any) {
      logger.error("Getting published listings failed", error);
      return res.status(400).json(failure(error.message));
    }
  };

  restore = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = res.locals.uid as string;

      const restoredListing = await this.listingService.restoreListing(
        id,
        userId,
      );

      if (!restoredListing) {
        return res
          .status(404)
          .json(failure("Listing not found or unauthorized"));
      }

      return res.status(200).json(success(restoredListing));
    } catch (error: any) {
      logger.error("Restoring listing failed", error);
      return res.status(400).json(failure(error.message));
    }
  };
}
