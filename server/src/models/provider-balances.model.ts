import { integer, pgTable, text, timestamp, uuid, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./user.model";

export const providerBalances = pgTable(
  "provider_balances",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    
    // Gross amounts (before any deductions)
    availableBalance: integer("available_balance").notNull().default(0), // Can withdraw now
    pendingBalance: integer("pending_balance").notNull().default(0), // Pending clearance (3 days)
    heldBalance: integer("held_balance").notNull().default(0), // On hold (disputes, chargebacks)
    
    baseCurrency: text("base_currency").notNull().default("GHS"),
    
    // Historical totals (gross - before fees/charges)
    totalGrossEarned: integer("total_gross_earned").notNull().default(0),
    
    // Fees and charges deducted
    totalPlatformFeeDeducted: integer("total_platform_fee_deducted").notNull().default(0),
    totalPayoutChargesDeducted: integer("total_payout_charges_deducted").notNull().default(0),
    
    // Net amounts
    totalNetEarned: integer("total_net_earned").notNull().default(0), // Gross - all deductions
    totalWithdrawn: integer("total_withdrawn").notNull().default(0), // Actually paid out to them
    
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    providerIdUniqueIdx: uniqueIndex("idx_provider_balances_provider_id_unique").on(table.providerId),
  })
);

export type ProviderBalance = typeof providerBalances.$inferSelect;
export type NewProviderBalance = typeof providerBalances.$inferInsert;
