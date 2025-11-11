import { decimal, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { users } from "./user.model";

export const payoutStatusEnum = pgEnum("payout_status", [
  "PENDING",
  "PROCESSING",
  "SUCCESS",
  "FAILED",
  "CANCELLED",
]);

export const payoutMethodEnum = pgEnum("payout_method", [
  "BANK_TRANSFER",
  "MOBILE_MONEY",
  "WALLET",
  "CHEQUE",
]);

export const payouts = pgTable(
  "payouts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    
    sellerId: uuid("seller_id")
      .notNull()
      .references(() => users.id),
    
    
    amount: integer("amount").notNull(),
    currency: text("currency").notNull(),
    status: payoutStatusEnum("status").notNull(),
    
  
    payoutMethod: payoutMethodEnum("payout_method").notNull(),
    bankAccountDetails: jsonb("bank_account_details"), 
    mobileMoneyDetails: jsonb("mobile_money_details"),
    
    
    reference: text("reference").notNull().unique(),
    processedByAdminId: uuid("processed_by_admin_id"), 
    
 
    platformFeePercentage: decimal("platform_fee_percentage", { precision: 5, scale: 2 }),
    platformFeeAmount: integer("platform_fee_amount"), 
    netPayoutAmount: integer("net_payout_amount"),
    
  
    linkedPurchaseIds: jsonb("linked_purchase_ids"), 
    
    // Notes
    notes: text("notes"),
    failureReason: text("failure_reason"),
    
    metadata: jsonb("metadata"),
    
    createdAt: timestamp("created_at").defaultNow().notNull(),
    processedAt: timestamp("processed_at"),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    sellerIdIdx: index("idx_payout_seller_id").on(table.sellerId),
    statusIdx: index("idx_payout_status").on(table.status),
    referenceIdx: uniqueIndex("idx_payout_unique_reference").on(table.reference),
    
    sellerStatusIdx: index("idx_payout_seller_status").on(table.sellerId, table.status),
    createdAtIdx: index("idx_payout_created_at").on(table.createdAt),
    processedAtIdx: index("idx_payout_processed_at").on(table.processedAt),
  })
);
