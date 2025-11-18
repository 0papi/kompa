import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string | null, email: string | null) => {
  if (name) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return "U";
};

export const PUBLIC_LISTING_FIELDS = [
  "id",
  "title",
  "description",
  "city",
  "state",
  "price",
  "bedrooms",
  "bathrooms",
  "squareFeet",
  "propertyType",
  "propertyCategory",
  "yearBuilt",
  "condition",
  "features",
  "images",
  "userId",
  "createdAt",
] as const;

export const LOCKED_LISTING_FIELDS = [
  "fullAddress",
  "street",
  "zipCode",
  "latitude",
  "longitude",
  "pricePerSquareFoot",
  "comparablePrice",
  "comparableNotes",
  "hoaFees",
  "propertyTaxes",
  "annualInsurance",
  "saleDate",
  "salePrice",
  "daysOnMarket",
  "lotSize",
  "stories",
  "garageSpaces",
  "parkingSpaces",
  "listDate",
] as const;
