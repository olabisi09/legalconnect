"use client";

import { useState } from "react";
import { AppButton } from "@/components/app-button";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { RiAddLine } from "@remixicon/react";
import { useHearings } from "@/hooks/features/use-hearings";
import { useDebounce } from "@/hooks/use-debounce";
import { HEARING_TYPES, HEARING_STATUSES } from "@/types/hearing";
import type { Hearing } from "@/types/hearing";
import { capitalize } from "@/lib/utils";
import { Filters, type FilterField } from "@/components/filters";
import { CasePicker } from "./_components/case-picker";
import { hearingColumns } from "./_components/hearing-columns";
import { HearingFormDialog } from "./_components/hearing-form-dialog";
import { HearingDrawer } from "./_components/hearing-drawer";

export default function Hearings() {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const [search, setSearch] = useState("");
  const [hearingType, setHearingType] = useState("");
  const [status, setStatus] = useState("");
  const [caseId, setCaseId] = useState("");

  const debouncedSearch = useDebounce(search);

  const { data, isLoading } = useHearings({
    // search: debouncedSearch,
    // hearingType: (hearingType || undefined) as Hearing["hearingType"] | undefined,
    // status: (status || undefined) as Hearing["status"] | undefined,
    caseId: caseId || undefined,
    page: pageNumber,
    size: pageSize,
  });

  const hearings = data?.data ?? [];

  const [formOpen, setFormOpen] = useState(false);
  const [selectedHearingId, setSelectedHearingId] = useState<string | null>(
    null,
  );

  const filterFields: FilterField[] = [
    {
      key: "hearingType",
      label: "Type",
      type: "select",
      value: hearingType,
      onChange: setHearingType,
      options: HEARING_TYPES.map((t) => ({
        value: t,
        label: capitalize(t.replaceAll("_", " ")),
      })),
    },
    {
      key: "status",
      label: "Status",
      type: "select",
      value: status,
      onChange: setStatus,
      options: HEARING_STATUSES.map((s) => ({
        value: s,
        label: capitalize(s.replaceAll("_", " ")),
      })),
    },
  ];

  return (
    <div>
      <p className="font-plexmono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
        Case Management
      </p>
      <h1 className="mt-2 font-newsreader text-[28px] font-medium text-foreground">
        Hearings
      </h1>
      <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
        Every hearing, conference, and argument scheduled across the firm — each
        tied back to its case.
      </p>

      <div className="mt-8 grid gap-4">
        <section className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search hearings"
            className="w-56"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Filters fields={filterFields} />

          <div className="w-64">
            <CasePicker
              value={caseId}
              onChange={setCaseId}
              placeholder="Filter by case"
              clearable
            />
          </div>

          <div className="ml-auto flex gap-2">
            <AppButton onClick={() => setFormOpen(true)}>
              <RiAddLine />
              New hearing
            </AppButton>
          </div>
        </section>

        <DataTable
          data={hearings}
          columns={hearingColumns}
          loading={isLoading}
          isRowClickable
          onRowClick={(row) => setSelectedHearingId(row.id)}
          pagination={{
            pageNumber,
            pageSize,
            onPageChange: setPageNumber,
            onPageSizeChange: setPageSize,
            totalItems: data?.pagination?.total ?? 0,
          }}
        />

        <HearingFormDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          defaultCaseId={caseId || undefined}
        />
        <HearingDrawer
          hearingId={selectedHearingId}
          onOpenChange={(open) => {
            if (!open) setSelectedHearingId(null);
          }}
        />
      </div>
    </div>
  );
}
