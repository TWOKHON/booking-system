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
import { CreatePaymentDrawer } from "./create-payment-drawer";
import { getPaymentsColumns } from "./payments-columns";
import { PaymentIntegrationRecord, paymentIntegrationRecords } from "./payments-data";
import { PaymentsTablePagination } from "./payments-table-pagination";
import { PaymentsTableToolbar } from "./payments-table-toolbar";

const globalPaymentsFilter = (
  row: { original: PaymentIntegrationRecord },
  _columnId: string,
  value: string,
) => {
  const search = value.toLowerCase();
  const item = row.original;

  return [
    item.providerName,
    item.category,
    item.assignedTo,
    item.note,
    item.feeModel,
    item.settlementWindow,
  ]
    .join(" ")
    .toLowerCase()
    .includes(search);
};

export const PaymentsTable = () => {
  const [data, setData] = React.useState<PaymentIntegrationRecord[]>(
    paymentIntegrationRecords,
  );
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "providerName", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [createOpen, setCreateOpen] = React.useState(false);

  const updateStatus = React.useCallback(
    (
      ids: string[],
      integrationStatus: PaymentIntegrationRecord["integrationStatus"],
    ) => {
      setData((current) =>
        current.map((item) =>
          ids.includes(item.id) ? { ...item, integrationStatus } : item,
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

  const createPaymentConfig = React.useCallback(
    (record: Omit<PaymentIntegrationRecord, "id">) => {
      const nextId = `PM-${Math.floor(8000 + Math.random() * 1000)}`;
      setData((current) => [{ id: nextId, ...record }, ...current]);
    },
    [],
  );

  const columns = React.useMemo(
    () =>
      getPaymentsColumns({
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
    globalFilterFn: globalPaymentsFilter,
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
            <h2 className="text-lg font-semibold">Payments Configuration Board</h2>
            <p className="text-sm text-muted-foreground">
              Platform payment configurations covering provider category, webhook
              health, settlement setup, transaction throughput, and tenant coverage.
            </p>
          </div>

          <PaymentsTableToolbar
            table={table}
            onBatchStatusUpdate={(status) => updateStatus(selectedIds, status)}
            onBatchPriority={() => togglePriority(selectedIds)}
            onOpenCreate={() => setCreateOpen(true)}
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
                      No payment integrations matched your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <PaymentsTablePagination table={table} />
        </div>
      </section>

      <CreatePaymentDrawer
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={createPaymentConfig}
      />
    </>
  );
};
