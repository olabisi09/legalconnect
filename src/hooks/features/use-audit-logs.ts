import { auditAPI } from "@/lib/api";
import { AuditLogParams } from "@/types/admin";
import { useQuery } from "@tanstack/react-query";

export const auditLogsQueryKey = (params?: AuditLogParams) => [
  "audit-logs",
  params,
];

export function useAuditLogs(params?: AuditLogParams) {
  return useQuery({
    queryKey: auditLogsQueryKey(params),
    queryFn: () => auditAPI.getAuditLogs(params),
  });
}
