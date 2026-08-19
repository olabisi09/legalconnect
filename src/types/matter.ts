import { MATTER_STATUSES } from "@/lib/enums";

export interface Matter {
  id: string;
  matterNumber: string;
  title: string;
  description: string;
  practiceArea: string;
  jurisdictionCode: string;
  status: string;
  priority: string;
  openedAt: string;
  closedAt: string;
  legalHold: boolean;
  partyCount: number;
  teamCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MatterDetail {
  id: string;
  matterNumber: string;
  title: string;
  description: string;
  practiceArea: string;
  jurisdictionCode: string;
  status: string;
  priority: string;
  openedAt: string;
  closedAt: string;
  legalHold: boolean;
  partyCount: number;
  teamCount: number;
  createdAt: string;
  updatedAt: string;
  parties: Party[];
  team: Team[];
  deadlines: Deadline[];
  timeline: Timeline[];
  accessLevel: string;
  message: string;
}

export type MatterParams = Partial<
  Pick<Matter, "status" | "practiceArea" | "priority">
> & {
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  size?: number;
};

export type MatterStatus = (typeof MATTER_STATUSES)[number];

export interface Timeline {
  id: string;
  eventType: string;
  title: string;
  description: string;
  actorId: string;
  actorName: string;
  timestamp: string;
}

export interface Deadline {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  completedAt: string;
}

export interface Team {
  id: string;
  userId: string;
  userName: string;
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

export interface MatterPayload {
  title: string;
  description?: string;
  practiceArea: string;
  jurisdictionCode?: string;
  priority: string;
  parties: Partial<Omit<Party, "id">>[];
}
