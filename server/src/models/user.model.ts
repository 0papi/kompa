import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_roles", ["PROVIDER", "CONSUMER"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name"),
  account_type: userRoleEnum("account_type").default("PROVIDER").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
