import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./user.model";
import { listings } from "./listing.model";

export const statusEnum = pgEnum("status", [
  "PENDING",
  "SUCCESS",
  "FAILED",
  "ABANDONED",
]);

export const transactions = pgTable(
  "purchases",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    amount: integer("amount").notNull(),
    currency: text("currency").notNull(),
    status: statusEnum("status").notNull(),
    buyerEmail: text("buyer_email").notNull(),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id),
    buyerId: uuid("buyer_id")
      .notNull()
      .references(() => users.id),
    sellerId: uuid("seller_id")
      .notNull()
      .references(() => users.id),
    reference: text("reference"),
    metadata: jsonb("metadata"),
    paystack_authorization_code: text("paystack_authorization_code"),
    payment_gateway_response: jsonb("payment_gateway_response"),
    purchasedAt: timestamp("purchased_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
   buyerIdIdx: index("idx_purchase_buyer_id").on(table.buyerId),
    sellerIdIdx: index("idx_purchase_seller_id").on(table.sellerId),
    listingIdIdx: index("idx_purchase_listing_id").on(table.listingId),
    statusIdx: index("idx_purchase_status").on(table.status),
    referenceIdx: uniqueIndex("idx_purchase_unique_reference").on(table.reference),
    
    buyerStatusIdx: index("idx_purchase_buyer_status").on(table.buyerId, table.status),
    listingStatusIdx: index("idx_purchase_listing_status").on(table.listingId, table.status),
    createdAtIdx: index("idx_purchase_created_at").on(table.createdAt),
  }),
);


export type PurchaseSelect = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
