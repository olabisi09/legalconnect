import { SharedParams } from "./shared";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  organizationType: string;
  status: string;
  primaryEmail: string;
  primaryPhone: string;
  createdAt: string;
  archivedAt: string;
  archivedReason: string;
  activeUserCount: number;
  subscriptionPlan: string;
  subscriptionStatus: string;
}

export type OrganizationParams = Partial<
  Pick<Organization, "status" | "organizationType">
> &
  SharedParams;

export interface OrganizationDetail {
  id: string;
  name: string;
  slug: string;
  type: string;
  status: string;
  primaryEmail: string;
  primaryPhone: string;
  billingEmail: string;
  subscriptionTier: string;
  subscriptionStatus: string;
  maxUsers: number;
  jurisdiction: string;
  ownerId: string;
  activeUserCount: number;
  createdAt: string;
  archivedAt: string;
  archivedReason: string;
  settings: any;
}
