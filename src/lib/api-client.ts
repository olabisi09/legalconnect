import axios from "axios";
import humps from "humps";
import type { ApiResponse, ApiError, PagedResponse } from "@/types/shared";
import { useAuthStore } from "@/store/auth-store";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 30000,
});

// ─── Naming Convention Interceptor ─────────────────────────────────────────
// Backend uses SNAKE_CASE globally (application.yml: jackson.property-naming-strategy)
// Frontend uses camelCase throughout. This interceptor bridges the gap.

// Skip snake_case conversion for specific response types
function isFormData(data: unknown): data is FormData {
  return typeof FormData !== "undefined" && data instanceof FormData;
}

function isBlobResponse(response: {
  config: { responseType?: string };
}): boolean {
  return response.config.responseType === "blob";
}

// Request interceptor: camelCase → snake_case
apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers = {
      ...(config.headers ?? {}),
      Authorization: `Bearer ${accessToken}`,
    } as typeof config.headers;
  }

  if (
    config.data &&
    !isFormData(config.data) &&
    typeof config.headers["Content-Type"] === "string" &&
    !config.headers["Content-Type"].includes("multipart")
  ) {
    config.data = humps.decamelizeKeys(config.data);
  }
  // Convert params (query params) from camelCase to snake_case
  if (config.params) {
    config.params = humps.decamelizeKeys(config.params);
  }
  // Remove Content-Type for FormData (browser sets it with boundary)
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  return config;
});

// ─── Token Refresh Queue ──────────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown) {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
}

// ─── Response Interceptor ─────────────────────────────────────────────────

apiClient.interceptors.response.use(
  (response) => {
    // Document delete returns bare 204 — return as-is
    if (response.status === 204 && !response.data) {
      return {
        ...response,
        data: {
          success: true,
          data: null,
          message: null,
          timestamp: new Date().toISOString(),
        },
      };
    }
    // Convert response data from snake_case to camelCase
    if (response.data && !isBlobResponse(response)) {
      response.data = humps.camelizeKeys(response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Convert error response data from snake_case to camelCase
    if (error.response?.data) {
      error.response.data = humps.camelizeKeys(error.response.data);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "include",
        });

        if (!refreshResponse.ok) {
          throw new Error("Unable to refresh session");
        }

        processQueue(null);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        useAuthStore.getState().clearAuthState();
        if (typeof window !== "undefined") {
          window.location.assign(
            new URL("/login", window.location.origin).toString(),
          );
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// ─── Helpers ──────────────────────────────────────────────────────────────

export function unwrap<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

export function unwrapPage<T>(response: {
  data: ApiResponse<PagedResponse<T>>;
}): PagedResponse<T> {
  return response.data.data;
}

export function getApiData<T>(response: { data: ApiResponse<T> }): T {
  return response.data.data;
}

// ─── Error Handling Helpers ────────────────────────────────────────────────

export function getFieldErrors(error: unknown): Record<string, string> {
  if (!isApiError(error)) return {};
  const errors: Record<string, string> = {};
  error.details?.forEach((detail) => {
    errors[detail.field] = detail.reason;
  });
  return errors;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "status" in error
  );
}

export function getErrorMessage(error: unknown): string {
  if (isApiError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}
