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
import { FinanceRecord, financeRecords } from "./finance-data";
import { getFinanceColumns } from "./finance-columns";
import { FinanceTableToolbar } from "./finance-table-toolbar";
import { FinanceTablePagination } from "./finance-table-pagination";

const globalFinanceFilter = (
  row: { original: FinanceRecord },
  _columnId: string,
  value: string
) => {
  const search = value.toLowerCase();
  const item = row.original;

  return [
    item.accountName,
    item.ledgerType,
    item.resortName,
    item.tenantName,
    item.assignedTo,
    item.exceptionNote,
    item.id,
  ]
    .join(" ")
    .toLowerCase()
    .includes(search);
};

export const FinanceTable = () => {
  const [data, setData] = React.useState<FinanceRecord[]>(financeRecords);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "accountName", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const updateStatus = React.useCallback(
    (ids: string[], financeStatus: FinanceRecord["financeStatus"]) => {
      setData((current) =>
        current.map((item) => (ids.includes(item.id) ? { ...item, financeStatus } : item))
      );
    },
    []
  );

  const togglePriority = React.useCallback((ids: string[]) => {
    setData((current) =>
      current.map((item) =>
        ids.includes(item.id) ? { ...item, priority: !item.priority } : item
      )
    );
  }, []);

  const columns = React.useMemo(
    () =>
      getFinanceColumns({
        onUpdateStatus: (id, status) => updateStatus([id], status),
        onTogglePriority: (id) => togglePriority([id]),
      }),
    [togglePriority, updateStatus]
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
    globalFilterFn: globalFinanceFilter,
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
          <h2 className="text-lg font-semibold">Finance Operations Board</h2>
          <p className="text-sm text-muted-foreground">
            Cross-tenant finance records covering guest balances, settlements, payouts,
            reconciliations, and billing exceptions across resort operations.
          </p>
        </div>

        <FinanceTableToolbar
          table={table}
          onBatchStatusUpdate={(status) => updateStatus(selectedIds, status)}
          onBatchPriority={() => togglePriority(selectedIds)}
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
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
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
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No finance items matched your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <FinanceTablePagination table={table} />
      </div>
    </section>
  );
};
