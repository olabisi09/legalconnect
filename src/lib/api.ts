import {
  AdvancedPageResponse,
  ApiResponse,
  PagedResponse,
} from "@/types/shared";
import type { AuditLogParams } from "@/types/admin";
import { apiClient, unwrap } from "./api-client";
import {
  AuthResponse,
  OrgRole,
  RegisterPayload,
  RegisterResponse,
} from "@/types/auth";
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
  CaseLink,
  CaseLinkParams,
  CaseLinkPayload,
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
import { Event, EventPayload } from "@/types/event";
import {
  AcceptInvitationPayload,
  InvitePayload,
  TeamMember,
  TeamMemberParams,
  UserStatus,
} from "@/types/user";
import {
  CaseDocument,
  DocumentDetail,
  DocumentStatus,
  RegisterDocumentPayload,
  ShareDocumentPayload,
  TransitionPayload,
  UploadFilePayload,
} from "@/types/document";
import {
  downloadDocumentFile,
  getFileNameFromContentDispositionHeader,
} from "./download";

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
  getCaseLinks: async (params?: CaseLinkParams) =>
    await apiClient
      .get<ApiResponse<PagedResponse<CaseLink>>>("/case-links", { params })
      .then(unwrap),
  createCaseLink: async (payload: CaseLinkPayload) =>
    await apiClient
      .post<ApiResponse<CaseLink>>("/case-links", payload)
      .then(unwrap),
  removeCaseLink: async ({
    linkId,
    ...payload
  }: {
    linkId: string;
    reason: string;
  }) =>
    await apiClient
      .post<ApiResponse<any>>(`/case-links/${linkId}/remove`, payload)
      .then(unwrap),
};

export const documentAPI = {
  getDocuments: async (caseId: string) =>
    await apiClient
      .get<
        ApiResponse<AdvancedPageResponse<CaseDocument>>
      >(`/cases/${caseId}/documents`)
      .then(unwrap),

  getDocumentDetails: async (docId: string) =>
    await apiClient
      .get<ApiResponse<DocumentDetail>>(`/documents/${docId}/detail`)
      .then(unwrap),
  downloadDocument: async (documentId: string) =>
    await apiClient
      .get<Blob>(`/documents/${documentId}/download`, {
        responseType: "blob",
      })
      .then(async (res) => {
        const contentDispositionHeader = res.headers["content-disposition"];
        const fileName = getFileNameFromContentDispositionHeader(
          contentDispositionHeader,
        );
        await downloadDocumentFile(res.data, fileName);
      }),
  registerDocument: async ({
    caseId,
    ...rest
  }: { caseId: string } & RegisterDocumentPayload) =>
    await apiClient
      .post<ApiResponse<CaseDocument>>(`/cases/${caseId}/documents`, rest)
      .then(unwrap),
  uploadDocument: async ({ id, ...rest }: UploadFilePayload) =>
    await apiClient
      .post<ApiResponse<CaseDocument>>(`/documents/${id}/upload-file`, rest, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(unwrap),
  createTransition: async ({
    docId,
    ...rest
  }: {
    docId: string;
    newStatus: DocumentStatus;
    reason?: string;
  }) =>
    await apiClient
      .post<ApiResponse<any>>(`/documents/${docId}/transitions`, rest)
      .then(unwrap),
  checkInDocument: async (docId: string) =>
    await apiClient
      .post<ApiResponse<any>>(`/documents/${docId}/check-in`)
      .then(unwrap),
  checkOutDocument: async (docId: string) =>
    await apiClient
      .post<ApiResponse<any>>(`/documents/${docId}/check-out`)
      .then(unwrap),
  share: async ({ id, ...payload }: ShareDocumentPayload) =>
    await apiClient
      .post<ApiResponse<any>>(`/documents/${id}/shares`, payload)
      .then(unwrap),
  transition: async ({ id, ...payload }: TransitionPayload) =>
    await apiClient
      .post<ApiResponse<any>>(`/documents/${id}/transitions`, payload)
      .then(unwrap),
  delete: async (docId: string) =>
    await apiClient
      .delete<ApiResponse<any>>(`/documents/${docId}`)
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

export const teamAPI = {
  getMembers: async (params?: TeamMemberParams) =>
    await apiClient
      .get<ApiResponse<TeamMember[]>>("/admin/users", {
        params,
      })
      .then(unwrap),
  inviteUser: async (payload: InvitePayload) =>
    await apiClient
      .post<ApiResponse<any>>("/admin/users/invite", payload)
      .then(unwrap),
  updateUserRole: async ({ id, ...rest }: { id: string; role: OrgRole }) =>
    await apiClient
      .put<ApiResponse<any>>(`/admin/users/${id}/role`, rest)
      .then(unwrap),
  activateUser: async (id: string) =>
    await apiClient
      .post<ApiResponse<any>>(`/admin/users/${id}/activate`)
      .then(unwrap),
  deactivateUser: async (id: string) =>
    await apiClient
      .post<ApiResponse<any>>(`/admin/users/${id}/deactivate`)
      .then(unwrap),
  changeUserStatus: async ({
    id,
    status,
  }: {
    id: string;
    status: UserStatus;
  }) =>
    await apiClient
      .patch<ApiResponse<any>>(`/admin/users/${id}/status`, { status })
      .then(unwrap),
  forceLogoutUser: async (id: string) =>
    await apiClient
      .post<ApiResponse<any>>(`/admin/users/${id}/force-logout`)
      .then(unwrap),
  acceptInvite: async (payload: AcceptInvitationPayload) =>
    await apiClient
      .post<ApiResponse<AuthResponse>>("/auth/invitation/accept", payload)
      .then(unwrap),
};

export const eventsAPI = {
  getEvents: async (params?: { from?: string; to?: string }) =>
    await apiClient
      .get<ApiResponse<Event[]>>("/calendar/events", {
        params,
      })
      .then(unwrap),
  createEvent: async (payload: EventPayload) =>
    await apiClient
      .post<ApiResponse<Event>>("/calendar/events", payload)
      .then(unwrap),
  updateEvent: async ({
    eventId,
    ...payload
  }: { eventId: string } & Partial<EventPayload>) =>
    await apiClient
      .put<ApiResponse<Event>>(`/calendar/events/${eventId}`, payload)
      .then(unwrap),
  deleteEvent: async (eventId: string) =>
    await apiClient
      .delete<ApiResponse<{ message: string }>>(`/calendar/events/${eventId}`)
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
