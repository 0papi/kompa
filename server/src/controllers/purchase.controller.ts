import { InitialiseTransactionType } from "@/schemas/purchase.schema";
import { SlackLogLevel, slackService } from "@/services/slack.service";
import { PurchaseService } from "@/services/purchase.service";
import type { Request, Response } from "express";

export class PurchaseController {
  private transactionService: PurchaseService;

  constructor() {
    this.transactionService = new PurchaseService();
  }

  initialise = async (req: Request, res: Response) => {
    try {
      const userId = res.locals.uid as string;
      const payload = req.body as InitialiseTransactionType;
     

      const transaction =
        await this.transactionService.initialisePurchase(
          payload,
          userId
        );
    } catch (error) {}
  };
}
