export interface Hearing {
  id: string;
  orgId: string;
  caseId: string;
  title: string;
  description: string;
  hearingType: HearingType;
  status: HearingStatus;
  scheduledDate: string;
  durationMinutes: number;
  location: string;
  judgeName: string;
  hearingNotes: string;
  outcomeType: HearingOutcomeType;
  outcomeDescription: string;
  previousScheduledDate: string;
  rescheduleReason: string;
  cancelReason: string;
  heldAt: string;
  cancelledAt: string;
  outcomeRecordedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface HearingPayload {
  caseId: string;
  title: string;
  description?: string;
  hearingType?: HearingType;
  scheduledDate: string;
  durationMinutes?: number;
  location?: string;
  judgeName?: string;
  hearingNotes?: string;
}

export type HearingType =
  | "HEARING"
  | "CONFERENCE"
  | "MEDIATION"
  | "ARBITRATION"
  | "STATUS_CONFERENCE"
  | "PRETRIAL_CONFERENCE"
  | "CASE_MANAGEMENT"
  | "ORAL_ARGUMENT"
  | "OTHER";

export const HEARING_TYPES: HearingType[] = [
  "HEARING",
  "CONFERENCE",
  "MEDIATION",
  "ARBITRATION",
  "STATUS_CONFERENCE",
  "PRETRIAL_CONFERENCE",
  "CASE_MANAGEMENT",
  "ORAL_ARGUMENT",
  "OTHER",
];

export type HearingStatus =
  | "SCHEDULED"
  | "RESCHEDULED"
  | "HELD"
  | "CANCELLED"
  | "OUTCOME_RECORDED";

export const HEARING_STATUSES: HearingStatus[] = [
  "SCHEDULED",
  "RESCHEDULED",
  "HELD",
  "CANCELLED",
  "OUTCOME_RECORDED",
];

export type HearingOutcomeType =
  | "GRANTED"
  | "DENIED"
  | "PARTIALLY_GRANTED"
  | "SETTLED"
  | "DISMISSED"
  | "CONTINUED"
  | "WITHDRAWN"
  | "ORDER_ISSUED"
  | "SCHEDULING_ORDERED"
  | "OTHER";

export const HEARING_OUTCOME_TYPES: HearingOutcomeType[] = [
  "GRANTED",
  "DENIED",
  "PARTIALLY_GRANTED",
  "SETTLED",
  "DISMISSED",
  "CONTINUED",
  "WITHDRAWN",
  "ORDER_ISSUED",
  "SCHEDULING_ORDERED",
  "OTHER",
];

export type HearingParams = {
  caseId?: string;
  page?: number;
  size?: number;
};
