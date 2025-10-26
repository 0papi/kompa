import apiClient from "@/lib/apiClient";

export interface User {
  id: string;
  firebaseUid: string;
  email: string;
  name: string | null;
  phoneNumber: string | null;
  account_type: "PROVIDER" | "CONSUMER" | "CONSUMER_PROVIDER";
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  name?: string;
  phoneNumber?: string;
  account_type?: "PROVIDER" | "CONSUMER" | "CONSUMER_PROVIDER";
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const userApi = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>("/users/profile");
    return response.data;
  },

  updateProfile: async (data: UpdateUserData): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch<ApiResponse<User>>("/users/profile", data);
    return response.data;
  },
};
