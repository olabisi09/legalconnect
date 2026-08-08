export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: any;
  ipAddress: string;
  timestamp: string;
}

export type AuditLogParams = Partial<
  Pick<AuditLog, "actorId" | "action" | "resourceType" | "resourceId">
> & { startDate?: string; endDate?: string; page?: number; size?: number };
