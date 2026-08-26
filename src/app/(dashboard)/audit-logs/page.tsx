"use client";

import { AppButton } from "@/components/app-button";
import { DataTable } from "@/components/data-table";
import { useAuditLogs } from "@/hooks/features/use-audit-logs";
import { exportToCSV } from "@/lib/download";
import { RiExportLine } from "@remixicon/react";

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

  const handleExportCsv = () => {
    const header = "Timestamp,Action,Resource Type,Resource ID\n";
    const body = logs
      .map(
        (log) =>
          `${log.timestamp},${log.action},${log.resourceType},${log.resourceId}`,
      )
      .join("\n");
    const fileName = "audit_logs.csv";
    exportToCSV(header, body, fileName);
  };
  return (
    <div>
      <p className="font-plexmono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
        09 — Compliance
      </p>
      <h1 className="mt-2 font-newsreader text-[28px] font-medium text-foreground">
        Audit Logs
      </h1>
      <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
        View a log of all actions performed within the application, including
        user activities and system events.
      </p>

      <div className="mt-8">
        <AppButton
          variant="outline"
          className="ml-auto"
          onClick={handleExportCsv}
        >
          <RiExportLine />
          Export
        </AppButton>
        <DataTable data={logs} columns={columns} loading={isLoading} />
      </div>
    </div>
  );
}
