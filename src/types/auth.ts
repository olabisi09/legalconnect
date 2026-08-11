export interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  organizationType: OrgType;
  subscriptionTier?: SubscriptionTier;
  firmSize?: string;
  jurisdiction?: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserInfo;
}

export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: OrgRole;
  orgId: string | null;
  orgName: string | null;
  mfaRequired: boolean;
  permissions: string[];
}

export interface RegisterResponse {
  userId: string;
  orgId: string;
  workspaceUrl: string;
  organization: Organization;
  auth: Auth;
}

interface Auth {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserInfo;
}

interface Organization {
  id: string;
  name: string;
  slug: null;
  type: string;
  status: string;
  primaryEmail: null;
  primaryPhone: null;
  billingEmail: null;
  subscriptionTier: string;
  subscriptionStatus: string;
  maxUsers: number;
  jurisdiction: string;
  ownerId: string;
  activeUserCount: number;
  createdAt: string;
  archivedAt: null;
  archivedReason: null;
  settings: any;
}

type OrgRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "LAWYER"
  | "PARALEGAL"
  | "FINANCE"
  | "CLIENT";

export type SubscriptionTier = "STARTER" | "PROFESSIONAL" | "ENTERPRISE";
export type OrgType =
  | "SOLO"
  | "SMALL_FIRM"
  | "MID_SIZE"
  | "LARGE_FIRM"
  | "CORPORATE_LEGAL"
  | "NON_PROFIT"
  | "GOVERNMENT";
