import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { listings } from "./listing.model";
import { users } from "./user.model";

export const favorite = pgTable("bookmarks", {
  id: uuid("id").defaultRandom().primaryKey(),
  listingId: uuid("listing_id")
    .notNull()
    .references(() => listings.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
