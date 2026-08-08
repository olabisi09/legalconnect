// Backend: com.legalconnect.common.ApiResponse<T>
export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  timestamp: string;
}

// Backend: com.legalconnect.common.ApiError
export interface ApiError {
  errorCode: string | null;
  code: string;
  message: string;
  status: number;
  path: string;
  traceId: string;
  timestamp: string;
  details?: ApiFieldError[];
}

export interface ApiFieldError {
  field: string;
  reason: string;
  code: string;
}

// Backend: com.legalconnect.common.PagedResponse<T>
// Frozen contract — do not modify
export interface PagedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}
