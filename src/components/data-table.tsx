"use client";

import { useTable, type ColumnDef, type RowData } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { features, type DataTableFeatures } from "./data-table-features";
import { Skeleton } from "./ui/skeleton";
import { AppPagination } from "./app-pagination";

interface DataTableProps<TData extends RowData> {
  columns: ColumnDef<DataTableFeatures, TData>[];
  data: TData[];
  emptyText?: string;
  loading?: boolean;
}

export function DataTable<TData extends RowData>({
  columns,
  data,
  emptyText = "No results.",
  loading = false,
}: DataTableProps<TData>) {
  const table = useTable({
    features,
    data,
    columns,
  });

  const { pageIndex, pageSize } = table.state.pagination;

  return (
    <div>
      <div className="overflow-hidden border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : (
                        <table.FlexRender header={header} />
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: columns.length }).map((_, colIndex) => (
                    <TableCell key={colIndex}>
                      <Skeleton className="h-4 w-full rounded-none" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      <table.FlexRender cell={cell} />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="py-4">
        <AppPagination
          pageIndex={pageIndex}
          pageCount={table.getPageCount()}
          canPreviousPage={table.getCanPreviousPage()}
          canNextPage={table.getCanNextPage()}
          pageSize={pageSize}
          onPageChange={(index) => table.setPageIndex(index)}
          onPageSizeChange={(size) => table.setPageSize(size)}
        />
      </div>
    </div>
  );
}
