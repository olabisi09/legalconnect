"use client";

import { AppButton } from "@/components/app-button";
import { DataTable } from "@/components/data-table";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useAuditLogs } from "@/hooks/features/use-audit-logs";
import { exportToCSV } from "@/lib/download";
import { RiArrowRightSLine, RiFileDownloadLine } from "@remixicon/react";
import { useState } from "react";
import { formatISO } from "date-fns";
import { type DateRange } from "react-day-picker";
import { TableColumnDef } from "@/components/data-table-features";
import { AuditLog } from "@/types/admin";
import { formatDateTimeString } from "@/lib/formatter";
import { cn } from "@/lib/utils";

export default function AuditLogsPage() {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const logParams = {
    page: pageNumber,
    size: pageSize,
    startDate: dateRange?.from ? formatISO(dateRange.from) : undefined,
    endDate: dateRange?.to ? formatISO(dateRange.to) : undefined,
  };

  const { data, isLoading } = useAuditLogs(logParams);
  const logs = data?.data ?? [];

  const columns: TableColumnDef<AuditLog>[] = [
    {
      accessorKey: "timestamp",
      header: "Timestamp",
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-2">
            {row.getCanExpand() ? (
              <button
                onClick={row.getToggleExpandedHandler()}
                className="text-muted-foreground"
              >
                <RiArrowRightSLine
                  className={cn(
                    "size-4",
                    row.getIsExpanded() ? "rotate-90" : "",
                  )}
                />
              </button>
            ) : null}
            {formatDateTimeString(row.original.timestamp)}
          </div>
        );
      },
    },
    {
      accessorKey: "action",
      header: "Action",
    },
    {
      accessorKey: "actorEmail",
      header: "Actor",
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
        Reporting
      </p>
      <h1 className="mt-2 font-newsreader text-[28px] font-medium text-foreground">
        Audit Logs
      </h1>
      <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
        View a log of all actions performed within the application, including
        user activities and system events.
      </p>

      <div className="mt-8 grid gap-4">
        <section className="flex justify-end items-center gap-2">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <AppButton onClick={handleExportCsv}>
            <RiFileDownloadLine />
            Export
          </AppButton>
        </section>
        <DataTable
          data={logs}
          columns={columns}
          loading={isLoading}
          pagination={{
            pageNumber,
            pageSize,
            onPageChange: setPageNumber,
            onPageSizeChange: setPageSize,
            totalItems: data?.pagination?.total ?? 0,
          }}
          details={(row) => {
            const detail = row.details;
            if (!detail) return null;

            if (typeof detail === "string") {
              return (
                <div className="py-2">
                  <p className="text-xs text-foreground">{detail}</p>
                </div>
              );
            }

            return (
              <dl className="grid grid-cols-2 gap-x-8 gap-y-3 py-2 sm:grid-cols-4">
                <div>
                  <dt className="font-plexmono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Event ID
                  </dt>
                  <dd className="mt-1 text-xs text-foreground truncate">
                    {detail.eventId}
                  </dd>
                </div>
                <div>
                  <dt className="font-plexmono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Event Type
                  </dt>
                  <dd className="mt-1 text-xs text-foreground">
                    {detail.eventType}
                  </dd>
                </div>
                <div>
                  <dt className="font-plexmono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Occurred At
                  </dt>
                  <dd className="mt-1 text-xs text-foreground">
                    {formatDateTimeString(detail.occurredAt)}
                  </dd>
                </div>
                <div>
                  <dt className="font-plexmono text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Producer
                  </dt>
                  <dd className="mt-1 text-xs text-foreground">
                    {detail.producer}
                  </dd>
                </div>
              </dl>
            );
          }}
        />
      </div>
    </div>
  );
}
