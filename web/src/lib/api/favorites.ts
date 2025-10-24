import apiClient from "@/lib/apiClient";
import type { ApiResponse } from "./listings";

export interface Favorite {
  id: string;
  listingId: string;
  userId: string;
}

export interface ToggleBookmarkResponse {
  bookmarked: boolean;
  message: string;
}

export interface CheckBookmarkResponse {
  bookmarked: boolean;
}

export const favoritesApi = {
  /**
   * Toggle bookmark for a listing
   */
  toggleBookmark: async (
    listingId: string
  ): Promise<ApiResponse<ToggleBookmarkResponse>> => {
    const response = await apiClient.post<
      ApiResponse<ToggleBookmarkResponse>
    >(`/favorites/${listingId}/toggle`);
    return response.data;
  },

  /**
   * Check if a listing is bookmarked
   */
  checkBookmark: async (
    listingId: string
  ): Promise<ApiResponse<CheckBookmarkResponse>> => {
    const response = await apiClient.get<
      ApiResponse<CheckBookmarkResponse>
    >(`/favorites/${listingId}/check`);
    return response.data;
  },

  /**
   * Get all bookmarks for the current user
   */
  getUserBookmarks: async (): Promise<ApiResponse<Favorite[]>> => {
    const response = await apiClient.get<ApiResponse<Favorite[]>>(
      "/favorites"
    );
    return response.data;
  },
};
