import { ApiResponse } from "@/types";

export function success<T>(data: T): ApiResponse<T> {
  return { success: true, data };
}

export function failure(message: string, code?: string): ApiResponse {
  return {
    success: false,
    error: { message, code },
  };
}
