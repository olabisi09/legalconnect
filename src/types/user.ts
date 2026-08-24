export interface TeamMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  orgId: string;
  orgName: string;
  mfaEnabled: boolean;
  lastLoginAt: string;
  createdAt: string;
}

export type TeamMemberParams = {
  page?: number;
  size?: number;
  search?: string;
};

export interface InvitePayload {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AcceptInvitationPayload {
  token: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
