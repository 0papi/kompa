import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./user.model";
import { listings } from "./listing.model";
import { reviews } from "./review.model";

export const reviewComment = pgTable("review_comments", {
  id: uuid("id").defaultRandom().primaryKey(),
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  listingId: uuid("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  reviewId: uuid("review_id")
    .notNull()
    .references(() => reviews.id, { onDelete: "cascade" }),
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type ReviewComment = typeof reviewComment.$inferSelect;
