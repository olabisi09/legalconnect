"use client";

import { AppButton } from "@/components/app-button";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { useMatters } from "@/hooks/features/use-matters";
import { RiAddLine, RiExportLine } from "@remixicon/react";
import { CreateMatter } from "./_components/create-matter";
import { useState } from "react";

export default function MattersPage() {
  const { data, isLoading } = useMatters();
  const [open, setOpen] = useState(false);

  const matters = data?.data ?? [];

  const columns = [
    {
      accessorKey: "matterNumber",
      header: "Matter Number",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "practiceArea",
      header: "Practice Area",
    },
    {
      accessorKey: "priority",
      header: "Priority",
    },
    {
      accessorKey: "openedAt",
      header: "Opened At",
    },
  ];
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
        <section className="flex justify-end gap-2">
          <Input placeholder="Search matters" className="w-xs" />
          <AppButton variant="outline">
            <RiExportLine />
            Export
          </AppButton>
          <AppButton onClick={() => setOpen(true)}>
            <RiAddLine />
            Create Matter
          </AppButton>
        </section>
        <DataTable data={matters} columns={columns} loading={isLoading} />
        <CreateMatter open={open} onOpenChange={setOpen} />
      </div>
    </div>
  );
}
