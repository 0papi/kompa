import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  numeric,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./user.model";

// Enums
export const listingStatusEnum = pgEnum("listing_status", [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
]);

export const valuationMethodEnum = pgEnum("valuation_method", [
  "SALES_COMPARISON",
  "COST_APPROACH",
  "INCOME_APPROACH",
  "MIXED",
]);

export const listings = pgTable("listings", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.firebaseUid, { onDelete: "cascade" }),

  // Property Details
  title: text("title").notNull(),
  description: text("description").notNull(),

  // Address
  street: text("street").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  zipCode: text("zip_code").notNull(),
  county: text("county"),

  // Property Type
  propertyCategory: text("property_category").notNull(),
  propertyType: text("property_type").notNull(),

  // Pricing
  price: numeric("price", { precision: 15, scale: 2 }).notNull(),
  pricePerSquareFoot: numeric("price_per_square_foot", {
    precision: 10,
    scale: 2,
  }),

  // Property Specs
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: numeric("bathrooms", { precision: 4, scale: 1 }).notNull(),
  squareFeet: integer("square_feet").notNull(),
  lotSize: numeric("lot_size", { precision: 10, scale: 2 }),
  yearBuilt: integer("year_built"),

  // Property Features
  stories: integer("stories"),
  garageSpaces: integer("garage_spaces"),
  parkingSpaces: integer("parking_spaces"),

  // Property Condition
  condition: text("condition").notNull(),

  // Financial Details
  hoaFees: numeric("hoa_fees", { precision: 10, scale: 2 }),
  propertyTaxes: numeric("property_taxes", { precision: 10, scale: 2 }),
  annualInsurance: numeric("annual_insurance", { precision: 10, scale: 2 }),

  // Valuation & Sale Details
  valuationMethod: valuationMethodEnum("valuation_method").notNull(),
  listDate: text("list_date"),
  saleDate: text("sale_date"),
  daysOnMarket: integer("days_on_market"),

  // Additional Features (stored as JSON array)
  features: jsonb("features").$type<{ name: string }[]>().default([]),

  // Additional Notes
  comparableNotes: text("comparable_notes"),

  // Status
  status: listingStatusEnum("status").notNull().default("DRAFT"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export type Listing = typeof listings.$inferSelect;
export type NewListing = typeof listings.$inferInsert;
