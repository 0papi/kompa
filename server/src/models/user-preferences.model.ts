import { pgTable, text, timestamp, uuid, jsonb } from "drizzle-orm/pg-core";
import { users } from "./user.model";

export const userPreferences = pgTable("user_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" })
    .unique(),
  preferredCurrency: text("preferred_currency").default("USD").notNull(),
  preferredLanguage: text("preferred_language").default("en"),
  notificationPreferences: jsonb("notification_preferences").$type<{
    email?: boolean;
    push?: boolean;
    sms?: boolean;
    marketing?: boolean;
  }>().default({
    email: true,
    push: true,
    sms: false,
    marketing: false,
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type UserPreferences = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;
