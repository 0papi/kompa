import apiClient from "@/lib/apiClient";

export interface ListingImage {
  id: string;
  listingId: string;
  imageUrl: string;
  storageKey: string;
  displayOrder: number;
  isPrimary: boolean;
  fileSize?: number;
  mimeType?: string;
  width?: number;
  height?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const listingImagesApi = {
  /**
   * Upload images for a listing
   */
  upload: async (
    listingId: string,
    files: File[]
  ): Promise<ApiResponse<{ images: ListingImage[]; count: number }>> => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await apiClient.post<ApiResponse<{ images: ListingImage[]; count: number }>>(
      `/listings/${listingId}/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  /**
   * Get all images for a listing
   */
  getListingImages: async (listingId: string): Promise<ApiResponse<ListingImage[]>> => {
    const response = await apiClient.get<ApiResponse<ListingImage[]>>(
      `/listings/${listingId}/images`
    );
    return response.data;
  },

  /**
   * Delete an image
   */
  delete: async (imageId: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(
      `/images/${imageId}`
    );
    return response.data;
  },

  /**
   * Set image as primary
   */
  setPrimary: async (
    listingId: string,
    imageId: string
  ): Promise<ApiResponse<ListingImage>> => {
    const response = await apiClient.patch<ApiResponse<ListingImage>>(
      `/listings/${listingId}/images/${imageId}/primary`
    );
    return response.data;
  },

  /**
   * Update display orders
   */
  updateDisplayOrders: async (
    updates: { id: string; displayOrder: number }[]
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.patch<ApiResponse<{ message: string }>>(
      `/images/reorder`,
      { updates }
    );
    return response.data;
  },
};
