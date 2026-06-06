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
import { getPettyCashColumns } from "./petty-cash-columns";
import type { PettyCashRow, PettyCashStatus } from "./petty-cash-data";
import { PettyCashTablePagination } from "./PettyCashTablePagination";
import { PettyCashTableToolbar } from "./PettyCashTableToolbar";

const globalPettyCashFilter = (
  row: { original: PettyCashRow },
  _columnId: string,
  value: string,
) => {
  const search = value.toLowerCase();
  const item = row.original;
  return [
    item.requester,
    item.department,
    item.category,
    item.purpose,
    item.reference,
    item.status,
    item.custodian,
  ]
    .join(" ")
    .toLowerCase()
    .includes(search);
};

export function PettyCashTable({
  data,
  isLoading,
  emptyLabel,
  onUpdateStatus,
}: {
  data: PettyCashRow[];
  isLoading?: boolean;
  emptyLabel: string;
  onUpdateStatus: (row: PettyCashRow, status: PettyCashStatus) => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "neededBy", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const columns = React.useMemo(
    () => getPettyCashColumns({ onUpdateStatus }),
    [onUpdateStatus],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
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
    globalFilterFn: globalPettyCashFilter,
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

  return (
    <section className="rounded-xl border bg-background p-5 shadow-sm md:p-6">
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Petty cash requests</h2>
          <p className="text-sm text-muted-foreground">
            Review approvals, releases, and liquidation status for operational cash.
          </p>
        </div>

        <PettyCashTableToolbar table={table} />

        <div className="overflow-hidden border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading petty cash...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    {emptyLabel}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <PettyCashTablePagination table={table} />
      </div>
    </section>
  );
}
