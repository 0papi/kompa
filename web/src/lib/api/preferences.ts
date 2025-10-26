import apiClient from "@/lib/apiClient";

export interface NotificationPreferences {
  email?: boolean;
  push?: boolean;
  sms?: boolean;
  marketing?: boolean;
}

export interface UserPreferences {
  id: string;
  userId: string;
  preferredCurrency: string;
  preferredLanguage: string | null;
  notificationPreferences: NotificationPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePreferencesData {
  preferredCurrency?: string;
  preferredLanguage?: string;
  notificationPreferences?: NotificationPreferences;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const preferencesApi = {
  getPreferences: async (): Promise<ApiResponse<UserPreferences>> => {
    const response = await apiClient.get<ApiResponse<UserPreferences>>("/users/preferences");
    return response.data;
  },

  updatePreferences: async (data: UpdatePreferencesData): Promise<ApiResponse<UserPreferences>> => {
    const response = await apiClient.patch<ApiResponse<UserPreferences>>("/users/preferences", data);
    return response.data;
  },

  deletePreferences: async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>("/users/preferences");
    return response.data;
  },
};
