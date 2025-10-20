import apiClient from "@/lib/apiClient";
import { ListingFormData } from "@/components/listings";

export interface Listing {
  id: string;
  userId: string;
  title: string;
  description: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  county?: string;
  propertyCategory: string;
  propertyType: string;
  price: string;
  pricePerSquareFoot?: string;
  bedrooms: number;
  bathrooms: string;
  squareFeet: number;
  lotSize?: string;
  yearBuilt?: number;
  stories?: number;
  garageSpaces?: number;
  parkingSpaces?: number;
  condition: string;
  hoaFees?: string;
  propertyTaxes?: string;
  annualInsurance?: string;
  valuationMethod: string;
  listDate?: string;
  saleDate?: string;
  daysOnMarket?: number;
  features?: { name: string }[];
  comparableNotes?: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const listingsApi = {
  /**
   * Create a new listing
   */
  create: async (data: ListingFormData): Promise<ApiResponse<Listing>> => {
    const response = await apiClient.post<ApiResponse<Listing>>("/listings", data);
    return response.data;
  },

  /**
   * Get all listings for the authenticated user
   */
  getMyListings: async (): Promise<ApiResponse<Listing[]>> => {
    const response = await apiClient.get<ApiResponse<Listing[]>>("/listings/my-listings");
    return response.data;
  },

  /**
   * Get all published listings (public)
   */
  getPublished: async (): Promise<ApiResponse<Listing[]>> => {
    const response = await apiClient.get<ApiResponse<Listing[]>>("/listings/published");
    return response.data;
  },

  /**
   * Get a single listing by ID
   */
  getById: async (id: string): Promise<ApiResponse<Listing>> => {
    const response = await apiClient.get<ApiResponse<Listing>>(`/listings/${id}`);
    return response.data;
  },

  /**
   * Update a listing
   */
  update: async (id: string, data: Partial<ListingFormData>): Promise<ApiResponse<Listing>> => {
    const response = await apiClient.put<ApiResponse<Listing>>(`/listings/${id}`, data);
    return response.data;
  },

  /**
   * Soft delete a listing
   */
  delete: async (id: string): Promise<ApiResponse<Listing>> => {
    const response = await apiClient.delete<ApiResponse<Listing>>(`/listings/${id}`);
    return response.data;
  },

  /**
   * Restore a soft-deleted listing
   */
  restore: async (id: string): Promise<ApiResponse<Listing>> => {
    const response = await apiClient.patch<ApiResponse<Listing>>(`/listings/${id}/restore`);
    return response.data;
  },
};
