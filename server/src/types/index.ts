import { Listing } from "@/models";
import { PUBLIC_LISTING_FIELDS } from "@/utils/field-access";
import type { Request } from "express";

export interface AuthenticatedUser {
  uid: string;
  email?: string;
  name?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export type PaystackAPIResponse = {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

export type PublicListing = Pick<
  Listing,
  (typeof PUBLIC_LISTING_FIELDS)[number]
>;
export type FullListing = Listing;
