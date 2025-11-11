import {
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  jsonb,
  boolean,
  index,
} from "drizzle-orm/pg-core";
import { users } from "./user.model";

export const paymentMethodTypeEnum = pgEnum("payment_method_types", [
  "BANK_TRANSFER",
  "MOBILE_MONEY",
]);

export const paymentMethods = pgTable(
  "payment_methods",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    methodType: paymentMethodTypeEnum("method_type").notNull(),
    isPreferred: boolean("is_preferred").default(false).notNull(),
    isVerified: boolean("is_verified").default(false).notNull(),
    accountDetails: jsonb("account_details")
      .$type<
        | {
            methodType: "BANK_TRANSFER";
            details: {
              accountHolderName: string;
              accountNumber: string;
              bankCode: string;
              bankName: string;
            };
          }
        | {
            methodType: "MOBILE_MONEY";
            details: {
              phoneNumber: string;
              provider: "MTN" | "VODAFONE" | "AIRTEL" | "OTHER";
              accountHolderName: string;
            };
          }
      >()
      .notNull(),
    lastUsedAt: timestamp("last_used_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("idx_payment_methods_user_id").on(table.userId),
    methodTypeIdx: index("idx_payment_methods_method_type").on(
      table.methodType
    ),
    isPreferredIdx: index("idx_payment_methods_is_preferred").on(
      table.isPreferred
    ),
    userPreferredIdx: index("idx_payment_methods_user_preferred").on(
      table.userId,
      table.isPreferred
    ),
    userMethodIdx: index("idx_payment_methods_user_method").on(
      table.userId,
      table.methodType
    ),
    createdAtIdx: index("idx_payment_methods_created_at").on(table.createdAt),
  })
);

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type NewPaymentMethod = typeof paymentMethods.$inferInsert;
