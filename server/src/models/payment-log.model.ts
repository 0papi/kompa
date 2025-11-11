import {
  serial,
  varchar,
  text,
  timestamp,
  pgTable,
  uuid,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";


export const paymentLogType = pgEnum("payment_log_type", ["PURCHASE", "PAYOUT"]);

export const paymentLogs = pgTable(
  "payment_logs",
  {
    id: serial("id").primaryKey(),
    referenceId: uuid("transaction_id").notNull(), 
    logType: paymentLogType("log_type").notNull(), 
    action: varchar("action", { length: 100 }).notNull(),
    status: varchar("status", { length: 50 }).notNull(),
    message: text("message"),
    responseCode: varchar("response_code", { length: 50 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    // Indexes
    referenceIdIdx: index("idx_logs_transaction_id").on(table.referenceId),
    logTypeIdx: index("idx_logs_log_type").on(table.logType),
    actionIdx: index("idx_logs_action").on(table.action),
    statusIdx: index("idx_logs_status").on(table.status),
    createdAtIdx: index("idx_logs_created_at").on(table.createdAt),

    // Composite indexes
    transactionActionIdx: index("idx_logs_transaction_action").on(
      table.referenceId,
      table.action,
    ),
    transactionCreatedIdx: index("idx_logs_transaction_created_at").on(
      table.referenceId,
      table.createdAt,
    ),
    statusCreatedIdx: index("idx_logs_status_created_at").on(
      table.status,
      table.createdAt,
    ),
  }),
);




export type PaymentLog = typeof paymentLogs.$inferSelect;
export type NewPaymentLog = typeof paymentLogs.$inferInsert;
