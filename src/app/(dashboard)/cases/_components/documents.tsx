"use client";

import { ColumnDef } from "@tanstack/react-table";
import { RiArrowUpDownLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";
import { formatBytes, formatDate } from "@/lib/formatter";
import { CaseDocument } from "@/types/document";
import { DataTableFeatures } from "@/components/data-table-features";
import { ConfidentialityBadge } from "./confidentiality-badge";

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
        {formatDate(row.getValue("updatedAt"))}
      </span>
    ),
  },
];
