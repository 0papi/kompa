import {
  InitialiseTransactionType,
  verifyPurchaseType,
} from "@/schemas/purchase.schema";
import { slackService } from "@/services/slack.service";
import { PurchaseService } from "@/services/purchase.service";
import type { Request, Response } from "express";
import { ListingService } from "@/services/listing.service";
import { failure, success } from "@/utils/api-response";
import { logger } from "@/config/logger";

export class PurchaseController {
  private transactionService: PurchaseService;
  private listingService: ListingService;

  constructor() {
    this.transactionService = new PurchaseService();
    this.listingService = new ListingService();
  }

  initialise = async (req: Request, res: Response) => {
    try {
      const buyerId = res.locals.uid as string;
      const buyerEmail = res.locals.email as string;

      const payload = req.body as InitialiseTransactionType;

      // make sure listingId is valid and is associated with a comparable listing
      const listing = await this.listingService.getListingById(
        payload.listingId
      );

      if (!listing) {
        throw new Error(
          "Listing ID is not associated with any listing in the system"
        );
      }

      // check if buyer has already purchased item
      const hasPurchased =
        await this.transactionService.hasUserPurchasedListing(
          buyerId,
          listing.id
        );

      if (hasPurchased) {
        throw new Error("User has purchased this comparable already");
      }

      // make sure buyerId and sellerId are not the same
      if (buyerId === listing.userId) {
        throw new Error("Buyer ID must not be the same as seller ID.");
      }

      const transaction = await this.transactionService.initialisePurchase({
        amount: payload.amount,
        listingId: listing.id,
        sellerId: listing.userId,
        buyerEmail,
        buyerId,
        currency: "GHS",
        status: "PENDING",
      });

      //log to slack
      await slackService.logPurchaseInitiated(transaction, listing.title);

      return res.status(201).json(success(transaction));
    } catch (error: any) {
      await slackService.logPurchaseFailed(
        res.locals.uid,
        req.body.listingId,
        res.locals.email,
        req.body.amount,
        "GHS",
        error.message,
        error
      );
      logger.error("Creating listing failed", error);
      return res.status(400).json(failure(error.message));
    }
  };

  verify = async (req: Request, res: Response) => {
    try {
      const { reference } = req.body as verifyPurchaseType;

      const verifiedPurchase = await this.transactionService.verifyPurchase(
        reference
      );
      
      await slackService.logPurchaseVerified(
        verifiedPurchase.data.transactionId,
        verifiedPurchase.data.buyerId,
        verifiedPurchase.data.sellerId,
        verifiedPurchase.data.listingId,
        "",
        verifiedPurchase.data.reference,
        verifiedPurchase.data.customerEmail,
        verifiedPurchase.data.amount,
        "GHS"
      );

      return res.status(200).json(success(verifiedPurchase));
    } catch (error: any) {
      await slackService.logPurchaseFailed(
        res.locals.uid,
        req.body.listingId,
        res.locals.email,
        req.body.amount,
        "GHS",
        error.message,
        error
      );
      logger.error("Creating listing failed", error);
      return res.status(400).json(failure(error.message));
    }
  };

  getPurchases = async (_req: Request, res: Response) => {
    try {
      const buyerId = res.locals.uid;
      const purchases = await this.transactionService.getUserPurchases(buyerId);

      return res.status(200).json(success(purchases));
    } catch (error: any) {
      return res.status(400).json(failure(error.message));
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const purchase = await this.transactionService.getPurchaseById(id);

      if (!purchase) {
        return res.status(404).json(failure("purchase not found"));
      }

      return res.status(200).json(success(purchase));
    } catch (error: any) {
      logger.error("Getting listing failed", error);
      return res.status(400).json(failure(error.message));
    }
  };
}
