import axios, { AxiosError, type AxiosInstance } from "axios";
import { auth } from "@/lib/firebase";

// Create a single axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the Firebase token
apiClient.interceptors.request.use(
  async (config) => {
    if (typeof window !== "undefined") {
      const user = auth.currentUser;

      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Optional: Normalize response errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.log("API error:", error.response.data);
    } else if (error.request) {
      console.error("No response from server:", error.message);
    } else {
      console.error("Request setup error:", error.message);
    }

    // Re-throw normalized error so TanStack Query can handle it
    return Promise.reject(
      error.response?.data || {
        message: error.message || "Unexpected error occurred",
      },
    );
  },
);

export default apiClient;
