"use client";
"use no memo";

import * as React from "react";
import {
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { billingColumns } from "./billing-columns";
import type { BillingRecord } from "./billing-data";
import { BillingTablePagination } from "./BillingTablePagination";
import { BillingTableToolbar } from "./BillingTableToolbar";

const globalBillingFilter = (
  row: { original: BillingRecord },
  _columnId: string,
  value: string,
) => {
  const search = value.toLowerCase();
  const item = row.original;

  return [
    item.id,
    item.description,
    item.plan,
    item.billingCycle,
    item.status,
    item.dueDate,
    item.paidAt,
    item.source,
  ]
    .join(" ")
    .toLowerCase()
    .includes(search);
};

export function BillingTable({ data }: { data: BillingRecord[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "dueDate", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: billingColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    globalFilterFn: globalBillingFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Billing history</h2>
          <p className="text-sm text-muted-foreground">
            Track subscription events, upcoming renewals, trial records, and invoice access.
          </p>
        </div>

        <BillingTableToolbar table={table} />

        <div className="overflow-hidden border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={billingColumns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No billing records matched your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <BillingTablePagination table={table} />
      </div>
    </section>
  );
}

