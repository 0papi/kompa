import { type Request, Response } from "express";
import { CreateListingType } from "@/schemas/listing.schema";
import { ListingService } from "@/services/listing.service";
import { logger } from "@/config/logger";
import { failure, success } from "@/utils/api-response";
import { slackService } from "@/services/slack.service";

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

      // Log to Slack
      await slackService.logListing(
        "create",
        listing.id,
        userId,
        listing.title,
        {
          Status: listing.status,
          Price: `$${listing.price}`,
          Location: `${listing.city}, ${listing.state}`,
        }
      );

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

      // Log to Slack
      const additionalInfo: Record<string, string> = {};
      if (payload.price) additionalInfo.Price = `$${payload.price}`;
      if (payload.status) additionalInfo.Status = payload.status;
      if (payload.city || payload.state) {
        additionalInfo.Location = `${updatedListing.city}, ${updatedListing.state}`;
      }

      await slackService.logListing(
        "update",
        updatedListing.id,
        userId,
        updatedListing.title,
        additionalInfo
      );

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

      // Log to Slack
      await slackService.logListing(
        "delete",
        deletedListing.id,
        userId,
        deletedListing.title,
        {
          "Deleted At": new Date().toISOString(),
        }
      );

      return res.status(200).json(success(deletedListing));
    } catch (error: any) {
      logger.error("Deleting listing failed", error);
      return res.status(400).json(failure(error.message));
    }
  };

  getPublished = async (req: Request, res: Response) => {
    try {
      const {
        page,
        limit,
        search,
        city,
        state,
        propertyCategory,
        propertyType,
        minPrice,
        maxPrice,
        minBedrooms,
        minBathrooms,
        minSquareFeet,
        maxSquareFeet,
      } = req.query;

      const filters = {
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        search: search as string | undefined,
        city: city as string | undefined,
        state: state as string | undefined,
        propertyCategory: propertyCategory as string | undefined,
        propertyType: propertyType as string | undefined,
        minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
        minBedrooms: minBedrooms ? parseInt(minBedrooms as string, 10) : undefined,
        minBathrooms: minBathrooms
          ? parseInt(minBathrooms as string, 10)
          : undefined,
        minSquareFeet: minSquareFeet
          ? parseInt(minSquareFeet as string, 10)
          : undefined,
        maxSquareFeet: maxSquareFeet
          ? parseInt(maxSquareFeet as string, 10)
          : undefined,
      };

      const result = await this.listingService.getPublishedListings(filters);

      return res.status(200).json(success(result));
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

  updateStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const userId = res.locals.uid as string;
      const { status } = req.body;

      if (!status || !["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
        return res.status(400).json(failure("Invalid status value"));
      }

      const updatedListing = await this.listingService.updateListing(
        id,
        userId,
        { status },
      );

      if (!updatedListing) {
        return res
          .status(404)
          .json(failure("Listing not found or unauthorized"));
      }

      // Log to Slack based on status change
      const actionMap: Record<string, "publish" | "unpublish" | "archive"> = {
        PUBLISHED: "publish",
        DRAFT: "unpublish",
        ARCHIVED: "archive",
      };

      await slackService.logListing(
        actionMap[status],
        updatedListing.id,
        userId,
        updatedListing.title,
        {
          "New Status": status,
        }
      );

      return res
        .status(200)
        .json(success(updatedListing, "Listing status updated successfully"));
    } catch (error: any) {
      logger.error("Updating listing status failed", error);
      return res.status(400).json(failure(error.message));
    }
  };
}
