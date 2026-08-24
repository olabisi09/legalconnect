import { SharedParams } from "./shared";

export interface Organization {
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

export type OrganizationParams = Partial<Pick<Organization, "status">> &
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
