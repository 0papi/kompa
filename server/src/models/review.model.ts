import { pgTable, uuid, timestamp, text, integer } from "drizzle-orm/pg-core";

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: uuid("user_id").notNull(),
  listingId: uuid("listing_id").notNull(),
  rating: integer("rating").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Review = typeof reviews.$inferSelect;
