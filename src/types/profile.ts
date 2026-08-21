import { OrgRole } from "./auth";

export interface UserProfileResponse {
  userId?: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: OrgRole;
}

export interface UpdateUserProfileRequest {
  firstName: string;
  lastName: string;
}

export interface LawyerProfileResponse {
  barNumber?: string | null;
  practiceAreas?: string[];
  biography?: string | null;
}

export interface UpdateLawyerProfileRequest {
  barNumber: string;
  practiceAreas: string[];
  biography: string;
}
