import apiClient from "@/lib/apiClient";

export interface Comment {
  id: string;
  authorId: string;
  listingId: string;
  relatedToId: string;
  relatedToType: string;
  comment: string;
  createdAt: string;
  updatedAt: string;
  replies: Comment[];
}

export interface CreateCommentInput {
  listingId: string;
  comment: string;
  relatedToId: string;
  relatedToType: "listing" | "comment";
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const commentsApi = {
  /**
   * Get all comments for a listing (with nested replies)
   */
  getByListingId: async (
    listingId: string
  ): Promise<ApiResponse<Comment[]>> => {
    const response = await apiClient.get<ApiResponse<Comment[]>>(
      `/comments?listingId=${listingId}`
    );
    return response.data;
  },

  /**
   * Create a new comment or reply
   */
  create: async (
    data: CreateCommentInput
  ): Promise<ApiResponse<Comment>> => {
    const response = await apiClient.post<ApiResponse<Comment>>(
      "/comments",
      data
    );
    return response.data;
  },
};
