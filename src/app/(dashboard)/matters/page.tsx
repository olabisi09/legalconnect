"use client";

import { AppButton } from "@/components/app-button";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { useMatters } from "@/hooks/features/use-matters";
import { RiAddLine, RiCloseLine, RiExportLine } from "@remixicon/react";
import { CreateMatter } from "./_components/create-matter";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { Matter } from "@/types/matter";
import { formatDateString, formatTimeString } from "@/lib/formatter";
import { TableColumnDef } from "@/components/data-table-features";
import { Badge } from "@/components/ui/badge";
import { capitalize } from "@/lib/utils";
import { MatterDetailDrawer } from "./_components/matter-details";
import { MATTER_STATUSES, PRIORITY_LEVELS } from "@/lib/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const badgeMap: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  INTAKE: "bg-blue-100 text-blue-700",
  ACTIVE: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  CLOSED: "bg-red-100 text-red-700",
  ARCHIVED: "bg-purple-100 text-purple-700",
};

type ActiveFilter = {
  key: "status" | "priority" | "practiceArea";
  label: string;
  clear: () => void;
};

export default function MattersPage() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [search, setSearch] = useState("");
  const [practiceArea, setPracticeArea] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");

  const debouncedSearch = useDebounce(search);
  const debouncedPracticeArea = useDebounce(practiceArea);

  const matterParams = {
    search: debouncedSearch,
    practiceArea: debouncedPracticeArea,
    status,
    priority,
    page: pageNumber,
    size: pageSize,
  };

  const { data, isLoading } = useMatters(matterParams);
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedMatterId, setSelectedMatterId] = useState<string>("");

  const matters = data?.data ?? [];

  const columns: Array<TableColumnDef<Matter>> = [
    { accessorKey: "matterNumber", header: "Matter Number" },
    { accessorKey: "title", header: "Title" },
    {
      accessorKey: "status",
      header: "Status",
      cell: (row) => {
        const status = row.getValue<string>();
        const className = badgeMap[status] ?? "";
        return <Badge className={className}>{capitalize(status)}</Badge>;
      },
    },
    { accessorKey: "practiceArea", header: "Practice Area" },
    { accessorKey: "priority", header: "Priority" },
    {
      accessorKey: "openedAt",
      header: "Opened At",
      cell: (row) => (
        <p className="grid gap-1">
          <span>{formatDateString(row.getValue<string>())}</span>
          <span className="font-plexmono text-muted-foreground text-xs">
            {formatTimeString(row.getValue<string>())}
          </span>
        </p>
      ),
    },
  ];

  const activeFilters: ActiveFilter[] = [
    status && {
      key: "status",
      label: `Status: ${capitalize(status)}`,
      clear: () => setStatus(""),
    },
    priority && {
      key: "priority",
      label: `Priority: ${capitalize(priority)}`,
      clear: () => setPriority(""),
    },
    practiceArea && {
      key: "practiceArea",
      label: `Practice Area: ${practiceArea}`,
      clear: () => setPracticeArea(""),
    },
  ].filter(Boolean) as ActiveFilter[];

  const clearAll = () => {
    setStatus("");
    setPriority("");
    setPracticeArea("");
  };

  return (
    <div>
      <p className="font-plexmono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
        Matter Management
      </p>
      <h1 className="mt-2 font-newsreader text-[28px] font-medium text-foreground">
        Matters
      </h1>
      <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
        View and manage all matters within the application, including their
        status, practice area, and priority.
      </p>
      <div className="mt-8 grid gap-4">
        <section className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search matters"
            className="w-40"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            value={status || undefined}
            onValueChange={(value) => setStatus(value ?? "")}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {[...MATTER_STATUSES].map((s) => (
                <SelectItem key={s} value={s}>
                  {capitalize(s)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={priority || undefined}
            onValueChange={(value) => setPriority(value ?? "")}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              {[...PRIORITY_LEVELS].map((p) => (
                <SelectItem key={p} value={p}>
                  {capitalize(p)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Practice area"
            className="w-48"
            value={practiceArea}
            onChange={(e) => setPracticeArea(e.target.value)}
          />

          <div className="ml-auto flex gap-2">
            <AppButton variant="outline">
              <RiExportLine />
              Export
            </AppButton>
            <AppButton onClick={() => setOpen(true)}>
              <RiAddLine />
              Create Matter
            </AppButton>
          </div>
        </section>

        {activeFilters.length > 0 && (
          <section className="flex flex-wrap items-center gap-2">
            {activeFilters.map((filter) => (
              <Badge
                key={filter.key}
                variant="secondary"
                className="gap-1 pr-1 font-normal"
              >
                {filter.label}
                <button
                  type="button"
                  onClick={filter.clear}
                  aria-label={`Remove ${filter.key} filter`}
                  className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                >
                  <RiCloseLine className="size-3" />
                </button>
              </Badge>
            ))}
            <button
              type="button"
              onClick={clearAll}
              className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              Clear all
            </button>
          </section>
        )}

        <DataTable
          data={matters}
          columns={columns}
          loading={isLoading}
          onRowClick={(row) => {
            setSelectedMatterId(row.id);
            setOpenDetail(true);
          }}
          pagination={{
            pageNumber,
            pageSize,
            onPageChange: setPageNumber,
            onPageSizeChange: setPageSize,
            totalItems: data?.pagination?.total ?? 0,
          }}
        />
        <CreateMatter open={open} onOpenChange={setOpen} />
        <MatterDetailDrawer
          open={openDetail}
          onOpenChange={setOpenDetail}
          matterId={selectedMatterId}
        />
      </div>
    </div>
  );
}
