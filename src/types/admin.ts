export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: AuditLogDetail | string;
  ipAddress: string;
  timestamp: string;
}

export interface AuditLogDetail {
  eventId: string;
  eventType: string;
  occurredAt: string;
  producer: string;
}

export type AuditLogParams = Partial<
  Pick<AuditLog, "actorId" | "action" | "resourceType" | "resourceId">
> & { startDate?: string; endDate?: string; page?: number; size?: number };
