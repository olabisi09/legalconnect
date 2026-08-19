"use client";

import { AppButton } from "@/components/app-button";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { RiExportLine } from "@remixicon/react";
import { useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { TableColumnDef } from "@/components/data-table-features";
import { Badge } from "@/components/ui/badge";
import { capitalize } from "@/lib/utils";
import { useOrgs } from "@/hooks/features/use-orgs";
import { Organization } from "@/types/organization";

const badgeMap: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  INTAKE: "bg-blue-100 text-blue-700",
  ACTIVE: "bg-green-100 text-green-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  CLOSED: "bg-red-100 text-red-700",
  ARCHIVED: "bg-purple-100 text-purple-700",
};

export default function OrganizationsPage() {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);
  const orgParams = {
    query: debouncedSearch,
    page: pageNumber,
    size: pageSize,
  };

  const { data, isLoading } = useOrgs(orgParams);

  const organizations = data?.data ?? [];

  const columns: Array<TableColumnDef<Organization>> = [
    { accessorKey: "name", header: "Organization Name" },
    { accessorKey: "organizationType", header: "Organization Type" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const badgeClass = badgeMap[status] || "bg-gray-100 text-gray-700";
        return <Badge className={badgeClass}>{capitalize(status)}</Badge>;
      },
    },
  ];

  return (
    <div>
      <p className="font-plexmono text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
        ADMIN
      </p>
      <h1 className="mt-2 font-newsreader text-[28px] font-medium text-foreground">
        Organizations
      </h1>
      <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
        Manage your organizations
      </p>
      <div className="mt-8 grid gap-4">
        <section className="flex flex-wrap justify-end items-center gap-2">
          <Input
            placeholder="Search organizations"
            className="w-40"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <AppButton variant="outline">
            <RiExportLine />
            Export
          </AppButton>
        </section>

        <DataTable
          data={organizations}
          columns={columns}
          loading={isLoading}
          pagination={{
            pageNumber,
            pageSize,
            onPageChange: setPageNumber,
            onPageSizeChange: setPageSize,
            totalItems: data?.pagination?.total ?? 0,
          }}
        />
        {/* <CreateMatter open={open} onOpenChange={setOpen} />
        <MatterDetailDrawer
          open={openDetail}
          onOpenChange={setOpenDetail}
          matterId={selectedMatterId}
        /> */}
      </div>
    </div>
  );
}
