import { ApiResponse, PagedResponse } from "@/types/shared";
import type { AuditLogParams } from "@/types/admin";
import { apiClient, unwrap } from "./api-client";
import { AuthResponse, RegisterPayload, RegisterResponse } from "@/types/auth";
import {
  LawyerProfileResponse,
  UpdateLawyerProfileRequest,
  UpdateUserProfileRequest,
  UserProfileResponse,
} from "../types/profile";
import { AuditLog } from "@/types/admin";
import { Matter, MatterParams, MatterPayload } from "@/types/matter";

export const authAPI = {
  login: async (payload: {
    email: string;
    password: string;
    mfaCode?: string;
  }) =>
    await apiClient
      .post<ApiResponse<AuthResponse>>("/auth/login", payload)
      .then(unwrap),

  register: async (payload: RegisterPayload) =>
    await apiClient
      .post<ApiResponse<RegisterResponse>>("/onboarding/setup", payload)
      .then(unwrap),

  forgotPassword: async (payload: { email: string }) =>
    await apiClient
      .post<
        ApiResponse<{ message: string; expiresIn: number }>
      >("/auth/password/reset-request", payload)
      .then(unwrap),

  resetPassword: async (payload: { password: string; token: string }) =>
    await apiClient.post("/auth/password/reset", payload).then(unwrap),

  logout: async (payload?: { refreshToken?: string }) =>
    await apiClient.post("/auth/logout", payload).then(unwrap),

  enableMFA: async () =>
    await apiClient
      .post<
        ApiResponse<{ secret: string; qrCodeUrl: string; verified: boolean }>
      >("/auth/mfa/enroll", { type: "totp" })
      .then(unwrap),

  verifyMFA: async (payload: { code: string }) =>
    await apiClient.post("/auth/mfa/verify", payload).then(unwrap),
};

export const profileAPI = {
  getUserProfile: async (userId: string) =>
    await apiClient
      .get<ApiResponse<UserProfileResponse>>(`/users/${userId}/profile`)
      .then(unwrap),

  updateUserProfile: async (
    userId: string,
    payload: UpdateUserProfileRequest,
  ) =>
    await apiClient
      .put<
        ApiResponse<UserProfileResponse>
      >(`/users/${userId}/profile`, payload)
      .then(unwrap),

  getLawyerProfile: async (userId: string) =>
    await apiClient
      .get<
        ApiResponse<LawyerProfileResponse>
      >(`/users/${userId}/lawyer-profile`)
      .then(unwrap),

  upsertLawyerProfile: async (
    userId: string,
    payload: UpdateLawyerProfileRequest,
  ) =>
    await apiClient
      .put<
        ApiResponse<LawyerProfileResponse>
      >(`/users/${userId}/lawyer-profile`, payload)
      .then(unwrap),
};

export const auditAPI = {
  getAuditLogs: async (params?: AuditLogParams) =>
    await apiClient
      .get<ApiResponse<PagedResponse<AuditLog>>>("/audit-logs", { params })
      .then(unwrap),
  exportAuditLogs: async (params?: AuditLogParams) =>
    await apiClient
      .get<ApiResponse<string>>("/audit-logs/export", { params })
      .then(unwrap),
};

export const mattersAPI = {
  getMatters: async (params?: MatterParams) =>
    await apiClient
      .get<ApiResponse<PagedResponse<Matter>>>("/matters", { params })
      .then(unwrap),

  createMatter: async (payload: MatterPayload) =>
    await apiClient.post<ApiResponse<Matter>>("/matters", payload).then(unwrap),
};
