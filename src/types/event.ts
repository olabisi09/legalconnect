export interface Event {
  id: string;
  title: string;
  description: string;
  eventType: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  location: string;
  matterId: string;
  createdBy: string;
  reminders: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventPayload {
  title: string;
  description?: string;
  eventType: string;
  startTime: string;
  endTime?: string;
  allDay?: boolean;
  location?: string;
  caseId?: string;
  reminders?: number[];
}

export const EVENT_TYPES = [
  "HEARING",
  "MEETING",
  "DEADLINE",
  "REMINDER",
  "COURT_DATE",
  "DEPOSITION",
  "MEDIATION",
  "TRIAL",
  "OTHER",
];

export type EventType = (typeof EVENT_TYPES)[number];

export interface EventParams {
  from: string;
  to: string;
}
