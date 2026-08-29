import { DataTableFeatures } from "@/components/data-table-features";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  formatBytes,
  formatDateString,
  formatDateTimeString,
} from "@/lib/formatter";
import { cn } from "@/lib/utils";
import { Party, Team, Deadline, Transition } from "@/types/case";
import { CaseDocument } from "@/types/document";
import {
  RiArrowUpDownLine,
  RiBuildingLine,
  RiCalendarLine,
  RiMailLine,
  RiPhoneLine,
  RiShieldLine,
  RiStarFill,
  RiUserLine,
} from "@remixicon/react";
import { ColumnDef } from "@tanstack/react-table";
import { ConfidentialityBadge } from "./_components/confidentiality-badge";

export const partyColumns: ColumnDef<DataTableFeatures, Party>[] = [
  {
    accessorKey: "name",
    header: "Name / Entity",
    cell: ({ row }) => {
      const party = row.original;
      return (
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
            {party.entityType === "INDIVIDUAL" ? (
              <RiUserLine className="size-4" />
            ) : (
              <RiBuildingLine className="size-4" />
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{partyDisplayName(party)}</span>
            {party.primaryClient && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                <RiStarFill className="size-3" />
                Primary
              </span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "partyType",
    header: "Type",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.partyType.replace(/_/g, " ")}
      </span>
    ),
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => {
      const party = row.original;
      return (
        <div className="flex flex-col gap-0.5 text-muted-foreground">
          {party.email && (
            <span className="flex items-center gap-1.5">
              <RiMailLine className="size-3.5" />
              {party.email}
            </span>
          )}
          {party.phone && (
            <span className="flex items-center gap-1.5">
              <RiPhoneLine className="size-3.5" />
              {party.phone}
            </span>
          )}
          {!party.email && !party.phone && "—"}
        </div>
      );
    },
  },
];

export const teamColumns: ColumnDef<DataTableFeatures, Team>[] = [
  {
    accessorKey: "userId",
    header: "Member",
    cell: ({ row }) => (
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <RiUserLine className="size-4" />
        </div>
        <span className="font-medium text-muted-foreground">
          {row.original.userId}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "teamRole",
    header: "Role",
    cell: ({ row }) => (
      <span className="text-muted-foreground">{row.original.teamRole}</span>
    ),
  },
  {
    accessorKey: "accessLevel",
    header: "Access",
    cell: ({ row }) => {
      const member = row.original;
      return (
        <div className="flex flex-col items-start gap-1">
          <Badge variant="secondary" className="text-xs font-normal">
            {member.accessLevel}
          </Badge>
          {member.ethicalWall && (
            <span className="flex items-center gap-1 text-xs text-red-700">
              <RiShieldLine className="size-3.5" />
              Ethical wall
            </span>
          )}
        </div>
      );
    },
  },
];

export const deadlineColumns: ColumnDef<DataTableFeatures, Deadline>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const deadline = row.original;
      const isOverdue =
        !deadline.completed &&
        new Date(deadline.dueDate).getTime() < Date.now();
      return (
        <div className="flex items-start gap-3">
          <Checkbox
            className="mt-0.5"
            checked={deadline.completed}
            disabled
            aria-label={`${deadline.title} completion status`}
          />
          <div className="min-w-0 space-y-0.5">
            <p className="font-medium">{deadline.title}</p>
            {deadline.description && (
              <p className="text-xs text-muted-foreground">
                {deadline.description}
              </p>
            )}
            <div
              className={cn(
                "inline-flex items-center gap-1.5 text-xs",
                isOverdue
                  ? "font-medium text-red-600"
                  : "text-muted-foreground",
              )}
            >
              <RiCalendarLine className="size-3.5" />
              <span>
                {deadline.completed
                  ? `Completed ${formatDateString(deadline.completedAt)}`
                  : `Due ${formatDateString(deadline.dueDate)}${isOverdue ? " · Overdue" : ""}`}
              </span>
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "completed",
    header: "Status",
    cell: ({ row }) => {
      const deadline = row.original;
      const isOverdue =
        !deadline.completed &&
        new Date(deadline.dueDate).getTime() < Date.now();
      if (deadline.completed) {
        return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
      }
      if (isOverdue) {
        return <Badge className="bg-red-100 text-red-700">Overdue</Badge>;
      }
      return <Badge className="bg-blue-100 text-blue-700">Pending</Badge>;
    },
  },
];

export const transitionColumns: ColumnDef<DataTableFeatures, Transition>[] = [
  {
    accessorKey: "fromStage",
    header: "From",
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <p className="font-medium">{row.original.fromStage || "—"}</p>
        <p className="text-xs text-muted-foreground">
          {row.original.fromStatus || "—"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "toStage",
    header: "To",
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <p className="font-medium">{row.original.toStage || "—"}</p>
        <p className="text-xs text-muted-foreground">
          {row.original.toStatus || "—"}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.reason || "—"}
      </span>
    ),
  },
  {
    accessorKey: "timestamp",
    header: "Date",
    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {formatDateTimeString(row.original.timestamp)}
      </span>
    ),
  },
  {
    accessorKey: "override",
    header: "Override",
    cell: ({ row }) =>
      row.original.override ? (
        <Badge className="bg-amber-100 text-amber-700">Yes</Badge>
      ) : null,
  },
];

function SortableHeader({
  label,
  column,
}: {
  label: string;
  column: {
    toggleSorting: (desc?: boolean) => void;
    getIsSorted: () => false | "asc" | "desc";
  };
}) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 font-plexmono text-[11px] uppercase tracking-wide text-muted-foreground hover:text-foreground"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <RiArrowUpDownLine className="ml-1.5 h-3.5 w-3.5" />
    </Button>
  );
}

export const documentColumns: ColumnDef<DataTableFeatures, CaseDocument>[] = [
  {
    accessorKey: "fileName",
    header: ({ column }) => <SortableHeader label="File" column={column} />,
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">
          {row.original.fileName}
        </span>
        <span className="font-plexmono text-[10.5px] text-muted-foreground">
          {row.original.fileType || "—"} · {formatBytes(row.original.fileSize)}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge value={row.getValue("status")} />,
    filterFn: (row, id, value: string[]) => value.includes(row.getValue(id)),
  },
  {
    accessorKey: "confidentiality",
    header: "Confidentiality",
    cell: ({ row }) => (
      <ConfidentialityBadge value={row.getValue("confidentiality")} />
    ),
  },
  {
    accessorKey: "uploadedBy",
    header: "Uploaded by",
    cell: ({ row }) => (
      <span className="text-sm text-foreground">
        {row.getValue("uploadedBy")}
      </span>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <SortableHeader label="Updated" column={column} />,
    cell: ({ row }) => (
      <span className="font-plexmono text-[12px] text-muted-foreground">
        {formatDateString(row.getValue("updatedAt"))}
      </span>
    ),
  },
];

export function partyDisplayName(party: Party) {
  if (party.entityType === "INDIVIDUAL") {
    return [party.firstName, party.lastName].filter(Boolean).join(" ") || "—";
  }
  return party.entityName || "—";
}
