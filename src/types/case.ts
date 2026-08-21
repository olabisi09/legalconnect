import { CASE_STATUSES } from "@/lib/enums";

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

export type CaseParams = Partial<
  Pick<Case, "status" | "practiceArea" | "priority">
> & {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
};
