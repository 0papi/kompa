import { BaseService } from "./base.service";
import {
  listings,
  NewTransaction,
  PurchaseSelect,
  transactions as TransactionTable,
} from "@/models";
import { env } from "@/config/env";
import axios from "axios";
import { PaystackAPIResponse } from "@/types";
import { and, eq } from "drizzle-orm";
import { ListingService } from "./listing.service";
import { emailQueueService } from "./email-queue.service";
import { PurchaseReceiptData } from "@/types/emails";

export class PurchaseService extends BaseService<typeof TransactionTable> {
  private listingService:ListingService
  
  constructor() {
    super(TransactionTable);
    this.listingService = new ListingService()
  }

  async initialisePurchase(payload: NewTransaction) {
    try {
      const {
        amount,
        buyerEmail,
        buyerId,
        currency,
        listingId,
        sellerId,
        status = "PENDING",
      } = payload;

      const paystackUrl = env.PAYSTACK_API_URL;
      const response = await axios.post<PaystackAPIResponse>(
        `${paystackUrl}/transaction/initialize`,
        {
          email: buyerEmail,
          amount: amount * 100,
          callback_url: `${env.CORS_ORIGIN}/marketplace/purchase/verify`,
          metadata: {
            userId: buyerId,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data.status || !response.data.data?.reference) {
        throw new Error("Invalid Paystack response");
      }

      console.log("paystack initialisation complete", response);

      const transactionRecord = await this.create<
        NewTransaction,
        PurchaseSelect
      >({
        buyerId,
        buyerEmail,
        amount: amount * 100,
        currency,
        reference: response.data.data.reference,
        paystack_authorization_code: response.data.data.access_code,
        status,
        payment_gateway_response: response.data.data,
        listingId,
        sellerId,
      });

      if (!transactionRecord) {
        throw new Error("Could not complete paystack initialisation");
      }

      return {
        authorizationUrl: response.data.data.authorization_url,
        ...transactionRecord,
      };
    } catch (error) {
      console.error("Transaction initialization failed:", error);

      throw {
        success: false,
        message: error instanceof Error ? error.message : "Transaction failed",
        error,
      };
    }
  }

  async verifyPurchase(reference: string) {
    try {
      const conditions = eq(TransactionTable.reference, reference);

      // Find transaction record
      const result = await this.findOneWithRelation(
      conditions,
      listings,
      eq(TransactionTable.listingId, listings.id)
    );


     const transaction = result.transactions;
    const listing = result.listings;

      if (!transaction) {
        throw new Error("Purchase record not found");
      }

      console.log("did we find transaction?", transaction);

      const paystackUrl = env.PAYSTACK_API_URL;

      // Verify with Paystack
      const response = await axios.get<any>(
        `${paystackUrl}/transaction/verify/${reference}`,
        {
          headers: {
            Authorization: `Bearer ${env.PAYSTACK_SECRET_KEY}`,
          },
        }
      );

      if (!response.data.status) {
        throw new Error("Payment verification failed");
      }

      const { status: paymentStatus, data: paymentData } = response.data;

      const updatedStatus =
        paymentData.status === "success" ? "SUCCESS" : "FAILED";

      const updatedTransaction = await this.update(transaction.id, {
        status: updatedStatus,
        payment_gateway_response: paymentData,
        purchasedAt: paymentData.paid_at ? new Date(paymentData.paid_at) : null,
        metadata: paymentData,
      });

  

      if (!updatedTransaction) {
        throw new Error("Failed to update transaction");
      }


      await emailQueueService.enqueueEmail<PurchaseReceiptData>('PURCHASE_RECEIPT', {
        amount: paymentData.amount,
        buyerEmail: paymentData.customer?.email,
        currency: 'GHS',
        listingTitle: listing.title,
        purchasedAt:  paymentData.paid_at,
        reference: paymentData?.reference,
        transactionId: updatedTransaction.id,
      })

      return {
        success: paymentData.status === "success",
        data: {
          transactionId: updatedTransaction.id,
          buyerId: updatedTransaction.buyer_id,
          sellerId: updatedTransaction.seller_id,
          listingId: updatedTransaction.listing_id,
          status: updatedStatus,
          amount: paymentData.amount,
          reference: paymentData.reference,
          paidAt: paymentData.paid_at,
          customerEmail: paymentData.customer?.email,
        },
      };
    } catch (error) {
      console.error("Purchase verification failed:", error);

      throw {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Payment verification failed",
        error,
      };
    }
  }

  async handlePaymentWebhook(event: any) {
    try {
      if (event.event !== "charge.success") {
        console.log("Ignoring non-success webhook:", event.event);
        return { success: false, message: "Not a success event" };
      }

      const { reference, customer, amount, paid_at } = event.data;

      const conditions = eq(TransactionTable.reference, reference);

      // Find transaction
      const transaction = await this.findOne(conditions);

      if (!transaction) {
        throw new Error("Transaction not found for webhook");
      }

      // Update transaction
      const updated = await this.update(transaction.id, {
        status: "COMPLETED",
        payment_gateway_response: event.data,
      });

      if (!updated) {
        throw new Error("Failed to update transaction via webhook");
      }

      console.log(`Payment verified via webhook: ${reference}`);

      return {
        success: true,
        data: {
          transactionId: updated.id,
          reference,
          status: "COMPLETED",
        },
      };
    } catch (error) {
      console.error("Webhook processing failed:", error);

      throw {
        success: false,
        message:
          error instanceof Error ? error.message : "Webhook processing failed",
        error,
      };
    }
  }

  /**
   * Check if user has already purchased a listing
   * @param buyerId - The buyer's user ID
   * @param listingId - The listing ID
   * @returns true if user has already purchased this listing, false otherwise
   */
  async hasUserPurchasedListing(
    buyerId: string,
    listingId: string
  ): Promise<boolean> {
    try {
      const conditions = and(
        eq(TransactionTable.buyerId, buyerId),
        eq(TransactionTable.listingId, listingId),
        eq(TransactionTable.status, "SUCCESS")
      );

      // @ts-ignore
      const existingPurchase = await this.findOne(conditions);

      return !!existingPurchase;
    } catch (error) {
      console.error("Error checking existing purchase:", error);
      throw {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to check purchase history",
        error,
      };
    }
  }

  /**
   * Get user's purchase count for a listing
   * @param buyerId - The buyer's user ID
   * @param listingId - The listing ID
   * @returns Purchase count
   */
  async getUserListingPurchaseCount(
    buyerId: string,
    listingId: string
  ): Promise<number> {
    try {
      const conditions = and(
        eq(TransactionTable.buyerId, buyerId),
        eq(TransactionTable.listingId, listingId),
        eq(TransactionTable.status, "SUCCESS")
      );

      const purchases = await this.findMany(conditions);

      return purchases?.length || 0;
    } catch (error) {
      console.error("Error getting purchase count:", error);
      throw {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to get purchase count",
        error,
      };
    }
  }

  /**
   * Get all successful purchases by a buyer
   * @param buyerId - The buyer's user ID
   * @returns Array of purchases
   */
  async getUserPurchases(buyerId: string): Promise<PurchaseSelect[]> {
    try {
      const conditions = and(
        eq(TransactionTable.buyerId, buyerId),
        eq(TransactionTable.status, "SUCCESS")
      );

      const purchases = await this.findMany(conditions);

      return purchases || [];
    } catch (error) {
      console.error("Error getting user purchases:", error);
      throw {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to get user purchases",
        error,
      };
    }
  }

  /**
   * Get all sales for a seller
   * @param sellerId - The seller's user ID
   * @returns Array of sales
   */
  async getSellerSales(sellerId: string): Promise<PurchaseSelect[]> {
    try {
      const conditions = and(
        eq(TransactionTable.sellerId, sellerId),
        eq(TransactionTable.status, "SUCCESS")
      );

      const sales = await this.findMany(conditions);

      return sales || [];
    } catch (error) {
      console.error("Error getting seller sales:", error);
      throw {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to get seller sales",
        error,
      };
    }
  }
  /**
   * Get purchase by the purchase id
   * @param purchaseId - The purchase ID
   * @returns Array of sales
   */
  async getPurchaseById(purchaseId: string): Promise<any> {
    try {
      const purchase = await this.findById(purchaseId);

      if (!purchase) {
        throw new Error("Purchase not found");
      }

   

      const listing = await this.listingService.getListingById(purchase.listingId)
    
      return {
        ...purchase,
        listing: listing || null
      } ;
    } catch (error) {
      console.error("Error getting purchase:", error);
      throw {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to get purchase details",
        error,
      };
    }
  }
}
