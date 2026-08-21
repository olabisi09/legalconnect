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
import {
  Case,
  CaseDetail,
  CaseParams,
  CasePayload,
  CaseStatus,
} from "@/types/case";
import {
  Organization,
  OrganizationDetail,
  OrganizationParams,
} from "@/types/organization";
import { Notification } from "@/types/notification";
import { Event } from "@/types/event";

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

export const caseAPI = {
  getCases: async (params?: CaseParams) =>
    await apiClient
      .get<ApiResponse<PagedResponse<Case>>>("/cases", { params })
      .then(unwrap),

  getCaseDetails: async (caseId: string) =>
    await apiClient
      .get<ApiResponse<CaseDetail>>(`/cases/${caseId}`)
      .then(unwrap),

  createCase: async (payload: CasePayload) =>
    await apiClient.post<ApiResponse<Case>>("/cases", payload).then(unwrap),

  updateCase: async (caseId: string, payload: Partial<CasePayload>) =>
    await apiClient
      .put<ApiResponse<Case>>(`/cases/${caseId}`, payload)
      .then(unwrap),

  deleteCase: async (caseId: string) =>
    await apiClient
      .delete<ApiResponse<{ message: string }>>(`/cases/${caseId}`)
      .then(unwrap),

  changeStatus: async ({
    caseId,
    ...rest
  }: {
    caseId: string;
    status: CaseStatus;
    reason: string;
  }) =>
    await apiClient
      .patch<ApiResponse<any>>(`/cases/${caseId}/status`, rest)
      .then(unwrap),

  applyLegalHold: async ({
    caseId,
    ...rest
  }: {
    caseId: string;
    reason: string;
    holdInstruction: string;
  }) =>
    await apiClient
      .put<ApiResponse<Case>>(`/cases/${caseId}/legal-hold`, rest)
      .then(unwrap),

  removeLegalHold: async (caseId: string) =>
    await apiClient
      .delete<ApiResponse<Case>>(`/cases/${caseId}/legal-hold`)
      .then(unwrap),

  createDeadline: async ({
    caseId,
    ...rest
  }: {
    caseId: string;
    title: string;
    description?: string;
    dueDate: string;
  }) =>
    await apiClient
      .post<
        ApiResponse<{ message: string }>
      >(`/cases/${caseId}/deadlines`, rest)
      .then(unwrap),
};

export const orgAPI = {
  getOrgs: async (params?: OrganizationParams) =>
    await apiClient
      .get<ApiResponse<PagedResponse<Organization>>>("/organizations", {
        params,
      })
      .then(unwrap),
  getOrgDetails: async (orgId: string) =>
    await apiClient
      .get<ApiResponse<OrganizationDetail>>(`/organizations/${orgId}`)
      .then(unwrap),
};

export const eventsAPI = {
  getEvents: async (params?: { from?: string; to?: string }) =>
    await apiClient
      .get<ApiResponse<Event[]>>("/calendar/events", {
        params,
      })
      .then(unwrap),
};

export const notificationAPI = {
  getNotifications: async (params?: { page?: number; size?: number }) =>
    await apiClient
      .get<ApiResponse<PagedResponse<Notification>>>("/notifications", {
        params,
      })
      .then(unwrap),
  getUnreadCount: async () =>
    await apiClient
      .get<ApiResponse<number>>("/notifications/unread-count")
      .then(unwrap),
  markAsRead: async (notificationId: string) =>
    await apiClient
      .post<
        ApiResponse<{ message: string }>
      >(`/notifications/${notificationId}/read`)
      .then(unwrap),
  markAllAsRead: async () =>
    await apiClient
      .post<ApiResponse<{ message: string }>>("/notifications/read-all")
      .then(unwrap),
};
