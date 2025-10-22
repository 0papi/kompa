import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user.model";
import { listings } from "./listing.model";

export const comment = pgTable("comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  listingId: uuid("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  relatedToId: uuid("related_to_id").notNull(),
  relatedToType: text("related_to_type").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type Comment = typeof comment.$inferSelect;
