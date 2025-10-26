import { pgEnum, pgTable, text, timestamp, uuid, jsonb, boolean } from "drizzle-orm/pg-core";
import { users } from "./user.model";

export const paymentMethodTypeEnum = pgEnum("payment_method_types", [
  "BANK_ACCOUNT",
  "PAYPAL",
  "STRIPE",
  "VENMO",
  "CASHAPP",
  "ZELLE",
]);

export const paymentMethods = pgTable("payment_methods", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  methodType: paymentMethodTypeEnum("method_type").notNull(),
  isPreferred: boolean("is_preferred").default(false).notNull(),
  accountDetails: jsonb("account_details").$type<{
    accountHolderName?: string;
    accountNumber?: string; // Last 4 digits only for display
    routingNumber?: string;
    email?: string; // For PayPal, Venmo, etc.
    phone?: string; // For Zelle, CashApp
    [key: string]: any;
  }>().notNull(),
  isVerified: boolean("is_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type NewPaymentMethod = typeof paymentMethods.$inferInsert;
