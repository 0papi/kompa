import { z } from "zod";

export const listingFormSchema = z.object({
  // Property Details
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title must be less than 100 characters"),

  // Address
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
  county: z.string().min(2, "County is required").optional(),

  // Property Type
  propertyCategory: z.string().min(1, "Property category is required"),
  propertyType: z.string().min(1, "Property type is required"),

  // Pricing
  price: z.coerce.number().min(0, "Price must be positive"),
  pricePerSquareFoot: z.coerce.number().min(0, "Price per sq ft must be positive").optional(),

  // Property Specs
  bedrooms: z.coerce.number().min(0, "Bedrooms must be 0 or more").max(20, "Invalid number of bedrooms"),
  bathrooms: z.coerce.number().min(0, "Bathrooms must be 0 or more").max(20, "Invalid number of bathrooms"),
  squareFeet: z.coerce.number().min(1, "Square feet must be greater than 0"),
  lotSize: z.coerce.number().min(0, "Lot size must be 0 or more").optional(),
  yearBuilt: z.preprocess(
  (val) => (val === "" || val === undefined ? undefined : Number(val)),
  z.number()
    .min(1800, "Year built must be after 1800")
    .max(new Date().getFullYear() + 1, "Year built cannot be in the future")
    .optional()
),


  // Property Features
  stories: z.coerce.number().min(1, "Stories must be at least 1").max(10).optional().default(1),
  garageSpaces: z.coerce.number().min(0, "Garage spaces must be 0 or more").max(10).optional(),
  parkingSpaces: z.coerce.number().min(0, "Parking spaces must be 0 or more").max(20).optional(),

  // Property Condition
  condition: z.string().min(1, "Condition description must be at least 10 characters").max(1000, "Condition description must be less than 1000 characters"),

  // Financial Details
  hoaFees: z.coerce.number().min(0, "HOA fees must be 0 or more").optional(),
  propertyTaxes: z.coerce.number().min(0, "Property taxes must be 0 or more").optional(),
  annualInsurance: z.coerce.number().min(0, "Annual insurance must be 0 or more").optional(),

  // Valuation & Sale Details
  valuationMethod: z.enum(["SALES_COMPARISON", "COST_APPROACH", "INCOME_APPROACH", "MIXED"], {
    required_error: "Valuation method is required",
  }),
  saleDate: z.string().optional(),
  daysOnMarket: z.coerce.number().min(0, "Days on market must be 0 or more").optional(),
  listDate: z.string().optional(),

  // Additional Features (dynamic array)
  features: z.array(z.object({
    name: z.string().min(1, "Feature name is required"),
  })).optional().default([]),

  // Description
  description: z.string().min(20, "Description must be at least 20 characters").max(2000, "Description must be less than 2000 characters"),

  // Additional Notes
  comparableNotes: z.string().max(1000, "Notes must be less than 1000 characters").optional(),

  // Status
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"], {
    required_error: "Status is required",
  }).default("DRAFT"),
});

export type ListingFormData = z.infer<typeof listingFormSchema>;
