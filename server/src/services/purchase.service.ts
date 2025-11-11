import { InitialiseTransactionType } from "@/schemas/purchase.schema";
import { BaseService } from "./base.service";
import {
  NewTransaction,
  TransactionSelect,
  transactions as TransactionTable,
} from "@/models";
import { env } from "@/config/env";
import axios from "axios";
import { PaystackAPIResponse } from "@/types";


export class PurchaseService extends BaseService<typeof TransactionTable> {
  constructor() {
    super(TransactionTable);
  }

 async initialisePurchase(payload: InitialiseTransactionType, userId:string) {
  try {
    const { amount, email } = payload;

    const paystackUrl = env.PAYSTACK_API_URL;
    const response = await axios.post<PaystackAPIResponse>(
      `${paystackUrl}`,
      {
        email: email,
        amount: amount * 100,
        metadata: {
          userId: userId,
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
      TransactionSelect
    >({
      userId,
      email,
      amount: amount * 100,
      currency: "GHS",
      reference: response.data.data.reference,
      paystack_authorization_code: response.data.data.access_code,
      status: "PENDING",
      payment_gateway_response: response.data.data,
      metadata: {},
    });

    if (!transactionRecord) {
      throw new Error("Could not complete paystack initialisation");
    }

    return {
      authorizationUrl: response.data.data.authorization_url,
      reference: response.data.data.reference,
      paystack_authorization_code: response.data.data.access_code,
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
}
