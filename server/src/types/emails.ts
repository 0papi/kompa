export interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
}

export interface PurchaseReceiptData {
  buyerEmail: string;
  buyerName?: string;
  amount: number;
  currency: string;
  reference: string;
  listingTitle: string;
  purchasedAt: string;
  transactionId: string;
}

export interface PayoutNotificationData {
  sellerEmail: string;
  sellerName?: string;
  amount: number;
  netAmount: number;
  currency: string;
  payoutMethod: string;
  reference: string;
  platformFee: number;
  payoutCharges: number;
  estimatedArrival?: string;
}
