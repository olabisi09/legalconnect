import { TableColumnDef } from "@/components/data-table-features";
import { CaseCell } from "./case-cell";
import { HearingStatusBadge, HearingTypeLabel } from "./hearing-badges";
import {
  formatDateString,
  formatTimeString,
  formatDuration,
} from "@/lib/formatter";
import type { Hearing } from "@/types/hearing";

export const hearingColumns: Array<TableColumnDef<Hearing>> = [
  { accessorKey: "title", header: "Title" },
  {
    accessorKey: "caseId",
    header: "Case",
    cell: (row) => <CaseCell caseId={row.getValue<string>()} />,
  },
  {
    accessorKey: "hearingType",
    header: "Type",
    cell: (row) => (
      <HearingTypeLabel value={row.getValue<Hearing["hearingType"]>()} />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row) => (
      <HearingStatusBadge value={row.getValue<Hearing["status"]>()} />
    ),
  },
  {
    accessorKey: "scheduledDate",
    header: "Scheduled",
    cell: (row) => (
      <p className="grid gap-1">
        <span>{formatDateString(row.getValue<string>())}</span>
        <span className="font-plexmono text-muted-foreground text-xs">
          {formatTimeString(row.getValue<string>())}
        </span>
      </p>
    ),
  },
  {
    accessorKey: "durationMinutes",
    header: "Duration",
    cell: (row) => (
      <span className="font-plexmono text-[12.5px] text-muted-foreground">
        {formatDuration(row.getValue<number>())}
      </span>
    ),
  },
  { accessorKey: "location", header: "Location" },
  { accessorKey: "judgeName", header: "Judge" },
];
