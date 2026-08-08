"use client";

import { DashboardCard } from "@/components/dashboard-card";
import { DataTable } from "@/components/data-table";
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useAuditLogs } from "@/hooks/features/use-audit-logs";

export default function AuditLogsPage() {
  const { data, isLoading } = useAuditLogs();

  const logs = data?.data ?? [];

  const columns = [
    {
      accessorKey: "timestamp",
      header: "Timestamp",
    },
    {
      accessorKey: "action",
      header: "Action",
    },
    {
      accessorKey: "resourceType",
      header: "Resource Type",
    },
    {
      accessorKey: "resourceId",
      header: "Resource ID",
    },
  ];
  return (
    <DashboardCard>
      <CardHeader className="border-b">
        <CardTitle className="text-sm">Audit Logs</CardTitle>
        <CardDescription>
          View a log of all actions performed within the application, including
          user activities and system events.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <DataTable data={logs} columns={columns} />
      </CardContent>
    </DashboardCard>
  );
}
