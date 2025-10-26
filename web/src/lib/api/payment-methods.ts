import apiClient from "@/lib/apiClient";

export type PaymentMethodType = "BANK_ACCOUNT" | "PAYPAL" | "STRIPE" | "VENMO" | "CASHAPP" | "ZELLE";

export interface AccountDetails {
  accountHolderName?: string;
  accountNumber?: string; // Last 4 digits only
  routingNumber?: string;
  email?: string; // For PayPal, Venmo, etc.
  phone?: string; // For Zelle, CashApp
  [key: string]: any;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  methodType: PaymentMethodType;
  isPreferred: boolean;
  accountDetails: AccountDetails;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentMethodData {
  methodType: PaymentMethodType;
  accountDetails: AccountDetails;
  isPreferred?: boolean;
}

export interface UpdatePaymentMethodData {
  accountDetails?: AccountDetails;
  isPreferred?: boolean;
  isVerified?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const paymentMethodsApi = {
  getAllPaymentMethods: async (): Promise<ApiResponse<PaymentMethod[]>> => {
    const response = await apiClient.get<ApiResponse<PaymentMethod[]>>("/users/payment-methods");
    return response.data;
  },

  getPaymentMethod: async (id: string): Promise<ApiResponse<PaymentMethod>> => {
    const response = await apiClient.get<ApiResponse<PaymentMethod>>(`/users/payment-methods/${id}`);
    return response.data;
  },

  getPreferredPaymentMethod: async (): Promise<ApiResponse<PaymentMethod>> => {
    const response = await apiClient.get<ApiResponse<PaymentMethod>>("/users/payment-methods/preferred");
    return response.data;
  },

  createPaymentMethod: async (data: CreatePaymentMethodData): Promise<ApiResponse<PaymentMethod>> => {
    const response = await apiClient.post<ApiResponse<PaymentMethod>>("/users/payment-methods", data);
    return response.data;
  },

  updatePaymentMethod: async (id: string, data: UpdatePaymentMethodData): Promise<ApiResponse<PaymentMethod>> => {
    const response = await apiClient.patch<ApiResponse<PaymentMethod>>(`/users/payment-methods/${id}`, data);
    return response.data;
  },

  deletePaymentMethod: async (id: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete<ApiResponse<{ message: string }>>(`/users/payment-methods/${id}`);
    return response.data;
  },
};
