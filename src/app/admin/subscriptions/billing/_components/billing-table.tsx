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
import { getBillingColumns } from "./billing-columns";
import { BillingRecord, billingRecords } from "./billing-data";
import { BillingTablePagination } from "./billing-table-pagination";
import { BillingTableToolbar } from "./billing-table-toolbar";

const globalBillingFilter = (
  row: { original: BillingRecord },
  _columnId: string,
  value: string,
) => {
  const search = value.toLowerCase();
  const item = row.original;

  return [
    item.tenantName,
    item.resortName,
    item.planName,
    item.assignedTo,
    item.note,
    item.paymentMethod,
  ]
    .join(" ")
    .toLowerCase()
    .includes(search);
};

export const BillingTable = () => {
  const [data, setData] = React.useState<BillingRecord[]>(billingRecords);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "tenantName", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const updateStatus = React.useCallback(
    (ids: string[], invoiceStatus: BillingRecord["invoiceStatus"]) => {
      setData((current) =>
        current.map((item) =>
          ids.includes(item.id) ? { ...item, invoiceStatus } : item,
        ),
      );
    },
    [],
  );

  const togglePriority = React.useCallback((ids: string[]) => {
    setData((current) =>
      current.map((item) =>
        ids.includes(item.id) ? { ...item, priority: !item.priority } : item,
      ),
    );
  }, []);

  const columns = React.useMemo(
    () =>
      getBillingColumns({
        onUpdateStatus: (id, status) => updateStatus([id], status),
        onTogglePriority: (id) => togglePriority([id]),
      }),
    [togglePriority, updateStatus],
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
    globalFilterFn: globalBillingFilter,
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
          <h2 className="text-lg font-semibold">Subscription Billing Board</h2>
          <p className="text-sm text-muted-foreground">
            Platform billing records covering tenant invoices, active plan cycles,
            annual renewals, payment methods, collection pressure, and owner assignment.
          </p>
        </div>

        <BillingTableToolbar
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
                            header.getContext(),
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
                    No billing items matched your filters.
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
};
