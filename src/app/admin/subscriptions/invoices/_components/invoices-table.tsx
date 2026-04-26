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
import { getInvoicesColumns } from "./invoices-columns";
import { invoiceRecords, InvoiceRecord } from "./invoices-data";
import { InvoicesTablePagination } from "./invoices-table-pagination";
import { InvoicesTableToolbar } from "./invoices-table-toolbar";
import { ManualInvoiceSheet } from "./manual-invoice-sheet";

const globalInvoiceFilter = (
  row: { original: InvoiceRecord },
  _columnId: string,
  value: string,
) => {
  const search = value.toLowerCase();
  const item = row.original;

  return [
    item.invoiceTitle,
    item.tenantName,
    item.resortName,
    item.invoiceCategory,
    item.assignedTo,
    item.note,
  ]
    .join(" ")
    .toLowerCase()
    .includes(search);
};

export const InvoicesTable = () => {
  const [data, setData] = React.useState<InvoiceRecord[]>(invoiceRecords);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "invoiceTitle", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [manualSheetOpen, setManualSheetOpen] = React.useState(false);

  const updateStatus = React.useCallback(
    (ids: string[], invoiceStatus: InvoiceRecord["invoiceStatus"]) => {
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

  const createManualInvoice = React.useCallback((invoice: Omit<InvoiceRecord, "id">) => {
    const nextId = `INV-${Math.floor(4000 + Math.random() * 5000)}`;
    setData((current) => [{ id: nextId, ...invoice }, ...current]);
  }, []);

  const columns = React.useMemo(
    () =>
      getInvoicesColumns({
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
    globalFilterFn: globalInvoiceFilter,
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
    <>
      <section className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-neutral-900">
        <div className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold">Invoices Registry</h2>
            <p className="text-sm text-muted-foreground">
              Unified invoice board covering automatic plan invoices and manually
              created add-on charges across tenant resorts.
            </p>
          </div>

          <InvoicesTableToolbar
            table={table}
            onBatchStatusUpdate={(status) => updateStatus(selectedIds, status)}
            onBatchPriority={() => togglePriority(selectedIds)}
            onOpenManualInvoice={() => setManualSheetOpen(true)}
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
                      No invoices matched your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <InvoicesTablePagination table={table} />
        </div>
      </section>

      <ManualInvoiceSheet
        open={manualSheetOpen}
        onOpenChange={setManualSheetOpen}
        onCreateInvoice={createManualInvoice}
      />
    </>
  );
};
