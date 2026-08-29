import { CASE_STATUSES } from "@/lib/enums";
import { SharedParams } from "./shared";

export interface Case {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  caseType: string;
  stage: string;
  status: string;
  priority: string;
  practiceArea: string;
  jurisdictionCode: string;
  workflowDefinitionId: string;
  workflowInstanceId: string;
  legalHold: boolean;
  openedAt: string;
  closedAt: string;
  partyCount: number;
  teamCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CaseDetail {
  id: string;
  caseNumber: string;
  title: string;
  description: string;
  caseType: string;
  stage: string;
  status: string;
  priority: string;
  practiceArea: string;
  jurisdictionCode: string;
  openedAt: string;
  closedAt: string;
  resolvedAt: string;
  engagementId: string;
  workflowDefinitionId: string;
  workflowInstanceId: string;
  legalHold: boolean;
  legalHoldReason: string;
  legalHoldAt: string;
  partyCount: number;
  teamCount: number;
  parties: Party[];
  team: Team[];
  notes: Note[];
  deadlines: Deadline[];
  milestones: Milestone[];
  transitions: Transition[];
  createdAt: string;
  updatedAt: string;
}

export interface Transition {
  id: string;
  fromStage: string;
  toStage: string;
  fromStatus: string;
  toStatus: string;
  reason: string;
  actorId: string;
  timestamp: string;
  override: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  reachedAt: string;
}

export interface Deadline {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completedAt: string;
}

export interface Note {
  id: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  private: boolean;
}

export interface Team {
  id: string;
  userId: string;
  teamRole: string;
  accessLevel: string;
  ethicalWall: boolean;
}

export interface Party {
  id: string;
  partyType: string;
  firstName: string;
  lastName: string;
  entityName: string;
  entityType: string;
  email: string;
  phone: string;
  primaryClient: boolean;
}

export interface CasePayload {
  title: string;
  description?: string;
  practiceArea: string;
  jurisdictionCode?: string;
  priority: string;
  parties: Partial<Omit<Party, "id">>[];
}

export type CaseStatus = (typeof CASE_STATUSES)[number];

export type CaseStage =
  | "INTAKE"
  | "PLEADING"
  | "DISCOVERY"
  | "MOTIONS"
  | "PRE_TRIAL"
  | "TRIAL"
  | "POST_TRIAL"
  | "DILIGENCE"
  | "DRAFTING"
  | "NEGOTIATION"
  | "EXECUTION"
  | "POST_CLOSING"
  | "RESEARCH"
  | "REVIEW"
  | "DELIVERY"
  | "INVESTIGATION"
  | "ANALYSIS"
  | "REPORTING"
  | "REMEDIATION"
  | "MONITORING"
  | "INITIATION"
  | "PANEL_SELECTION"
  | "PRELIMINARY"
  | "HEARING"
  | "AWARD"
  | "ACTION"
  | "RECORD"
  | "RESOLVED"
  | "CLOSED"
  | "REOPENED";

export type CaseType =
  | "LITIGATION"
  | "TRANSACTION"
  | "CORPORATE"
  | "FAMILY"
  | "PROBATE"
  | "INTERNAL";

export type CaseParams = Partial<
  Pick<
    Case,
    | "status"
    | "practiceArea"
    | "priority"
    | "stage"
    | "caseType"
    | "jurisdictionCode"
    | "legalHold"
  >
> & { search?: string } & SharedParams;

export interface CaseLink {
  id: string;
  orgId: string;
  sourceCaseId: string;
  targetCaseId: string;
  linkType: string;
  status: string;
  notes: string;
  removedAt: string;
  removedReason: string;
  createdAt: string;
  updatedAt: string;
}

export interface CaseLinkPayload {
  sourceCaseId: string;
  targetCaseId: string;
  linkType: string;
  notes?: string;
}

// RELATED, CONSOLIDATED, DEPENDENT, APPEAL, CROSS_REFERENCE, PRECEDENT, PARENT, DUPLICATE
export type CaseLinkType =
  | "RELATED"
  | "CONSOLIDATED"
  | "DEPENDENT"
  | "APPEAL"
  | "CROSS_REFERENCE"
  | "PRECEDENT"
  | "PARENT"
  | "DUPLICATE";

export type CaseLinkParams = { caseId?: string; page?: number; size?: number };
