"use client";
"use no memo";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
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
import { leaveApplicationsColumns } from "./leave-applications-columns";
import type { LeaveApplication } from "./leave-applications-data";
import { LeaveApplicationsTableToolbar } from "./LeaveApplicationsTableToolbar";
import { LeaveApplicationsTablePagination } from "./LeaveApplicationsTablePagination";

const globalLeaveFilter = (
  row: { original: LeaveApplication },
  _columnId: string,
  value: string
) => {
  const search = value.toLowerCase();
  const item = row.original;

  return [
    item.employee.fullName,
    item.employee.department,
    item.leaveType,
    item.startDate,
    item.endDate,
    item.status,
    item.reason,
    item.id,
  ]
    .join(" ")
    .toLowerCase()
    .includes(search);
};

export function LeaveApplicationsTable({
  data,
  onBulkApprove,
  onBulkReject,
}: {
  data: LeaveApplication[];
  onBulkApprove: (ids: string[]) => void;
  onBulkReject: (ids: string[]) => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "startDate", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: leaveApplicationsColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    globalFilterFn: globalLeaveFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const selectedIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original.id);

  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900">
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Leave applications</h2>
          <p className="text-sm text-muted-foreground">
            Review pending leave requests and track approvals and staffing impact.
          </p>
        </div>

        <LeaveApplicationsTableToolbar
          table={table}
          onBatchApprove={() => onBulkApprove(selectedIds)}
          onBatchReject={() => onBulkReject(selectedIds)}
        />

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
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
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
                    colSpan={leaveApplicationsColumns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No leave applications matched your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <LeaveApplicationsTablePagination table={table} />
      </div>
    </section>
  );
}
