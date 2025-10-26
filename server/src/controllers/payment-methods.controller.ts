import { Response } from "express";
import { PaymentMethodsService } from "@/services/payment-methods.service";
import { UserService } from "@/services/user.service";
import { CreatePaymentMethodType, UpdatePaymentMethodType } from "@/schemas/payment-methods.schema";
import { logger } from "@/config/logger";
import { failure, success } from "@/utils/api-response";
import type { AuthenticatedRequest } from "@/types/index";

export class PaymentMethodsController {
  private paymentMethodsService: PaymentMethodsService;
  private userService: UserService;

  constructor() {
    this.paymentMethodsService = new PaymentMethodsService();
    this.userService = new UserService();
  }

  /**
   * GET /users/payment-methods - Get all payment methods for current user
   */
  getAllPaymentMethods = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = res.locals.uid;

      if (!userId) {
        return res.status(401).json(failure("User not authenticated"));
      }

      // Check if user is a provider
      const isProvider = await this._isProviderOrConsumerProvider(userId);
      if (!isProvider) {
        return res.status(403).json(failure("Only providers can manage payment methods"));
      }

      const paymentMethods = await this.paymentMethodsService.getAllByUserId(userId);

      return res.status(200).json(success(paymentMethods));
    } catch (error: any) {
      logger.error("Getting payment methods failed", error);
      return res.status(500).json(failure(error.message));
    }
  };

  /**
   * GET /users/payment-methods/:id - Get a specific payment method
   */
  getPaymentMethod = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = res.locals.uid;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json(failure("User not authenticated"));
      }

      const paymentMethod = await this.paymentMethodsService.getByIdAndUserId(id, userId);

      if (!paymentMethod) {
        return res.status(404).json(failure("Payment method not found"));
      }

      return res.status(200).json(success(paymentMethod));
    } catch (error: any) {
      logger.error("Getting payment method failed", error);
      return res.status(500).json(failure(error.message));
    }
  };

  /**
   * POST /users/payment-methods - Create a new payment method
   */
  createPaymentMethod = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = res.locals.uid;
      const payload = req.body as CreatePaymentMethodType;

      if (!userId) {
        return res.status(401).json(failure("User not authenticated"));
      }

      // Check if user is a provider
      const isProvider = await this._isProviderOrConsumerProvider(userId);
      if (!isProvider) {
        return res.status(403).json(failure("Only providers can add payment methods"));
      }

      const paymentMethod = await this.paymentMethodsService.createForUser(userId, payload);

      return res.status(201).json(success(paymentMethod));
    } catch (error: any) {
      logger.error("Creating payment method failed", error);
      return res.status(500).json(failure(error.message));
    }
  };

  /**
   * PATCH /users/payment-methods/:id - Update a payment method
   */
  updatePaymentMethod = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = res.locals.uid;
      const { id } = req.params;
      const payload = req.body as UpdatePaymentMethodType;

      if (!userId) {
        return res.status(401).json(failure("User not authenticated"));
      }

      const updatedMethod = await this.paymentMethodsService.updateForUser(
        id,
        userId,
        payload,
      );

      if (!updatedMethod) {
        return res.status(404).json(failure("Payment method not found"));
      }

      return res.status(200).json(success(updatedMethod));
    } catch (error: any) {
      logger.error("Updating payment method failed", error);
      return res.status(500).json(failure(error.message));
    }
  };

  /**
   * DELETE /users/payment-methods/:id - Delete a payment method
   */
  deletePaymentMethod = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = res.locals.uid;
      const { id } = req.params;

      if (!userId) {
        return res.status(401).json(failure("User not authenticated"));
      }

      const deleted = await this.paymentMethodsService.deleteForUser(id, userId);

      if (!deleted) {
        return res.status(404).json(failure("Payment method not found"));
      }

      return res.status(200).json(success({ message: "Payment method deleted successfully" }));
    } catch (error: any) {
      logger.error("Deleting payment method failed", error);
      return res.status(500).json(failure(error.message));
    }
  };

  /**
   * GET /users/payment-methods/preferred - Get preferred payment method
   */
  getPreferredPaymentMethod = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = res.locals.uid;

      if (!userId) {
        return res.status(401).json(failure("User not authenticated"));
      }

      const preferredMethod = await this.paymentMethodsService.getPreferredByUserId(userId);

      if (!preferredMethod) {
        return res.status(404).json(failure("No preferred payment method set"));
      }

      return res.status(200).json(success(preferredMethod));
    } catch (error: any) {
      logger.error("Getting preferred payment method failed", error);
      return res.status(500).json(failure(error.message));
    }
  };

  /**
   * Helper method to check if user is a provider or consumer_provider
   */
  private async _isProviderOrConsumerProvider(userId: string): Promise<boolean> {
    const user = await this.userService.getUserById(userId);
    return user?.account_type === "PROVIDER" || user?.account_type === "CONSUMER_PROVIDER";
  }
}
