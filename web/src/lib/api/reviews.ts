import apiClient from "@/lib/apiClient";

export interface Review {
  id: string;
  authorId: string;
  listingId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
}

export interface ReviewsResponse {
  reviews: Review[];
  stats: ReviewStats;
}

export interface CreateReviewInput {
  listingId: string;
  rating: number;
  comment: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const reviewsApi = {
  /**
   * Get all reviews for a listing (with stats)
   */
  getByListingId: async (
    listingId: string
  ): Promise<ApiResponse<ReviewsResponse>> => {
    const response = await apiClient.get<ApiResponse<ReviewsResponse>>(
      `/reviews?listingId=${listingId}`
    );
    return response.data;
  },

  /**
   * Create a new review
   */
  create: async (data: CreateReviewInput): Promise<ApiResponse<Review>> => {
    const response = await apiClient.post<ApiResponse<Review>>(
      "/reviews",
      data
    );
    return response.data;
  },
};
