import apiClient from "@/lib/apiClient";
import type { InitialiseTransactionType, verifyPurchaseType } from "@/schema/purchase.schema";

export const purchasesApi = {
  initiatePurchase: async (data: InitialiseTransactionType) => {
    const response = await apiClient.post("/purchases/initialise", data);

    return response.data;
  },
  verifyPurchase: async (data: verifyPurchaseType) => {
    const response = await apiClient.post("/purchases/verify", data);

    return response.data;
  },
  getPurchases: async () => {
    const response = await apiClient.get("/purchases")

    return response.data;
  },
  getPurchaseById: async (id:string) => {
    const response = await apiClient.get(`/purchases/${id}`)

    return response.data;
  },
};
