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
import { TrialClient, trialClients } from "./trial-clients-data";
import { getTrialClientColumns } from "./trial-clients-columns";
import { TrialClientsTableToolbar } from "./trial-clients-table-toolbar";
import { TrialClientsTablePagination } from "./trial-clients-table-pagination";

const globalTrialFilter = (
  row: { original: TrialClient },
  _columnId: string,
  value: string
) => {
  const search = value.toLowerCase();
  const client = row.original;

  return [
    client.tenantName,
    client.ownerName,
    client.ownerEmail,
    client.trialEnds,
    client.id,
  ]
    .join(" ")
    .toLowerCase()
    .includes(search);
};

export const TrialClientsTable = () => {
  const [data, setData] = React.useState<TrialClient[]>(trialClients);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "daysRemaining", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    {}
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const updateStep = React.useCallback(
    (ids: string[], onboardingStep: TrialClient["onboardingStep"]) => {
      setData((current) =>
        current.map((item) =>
          ids.includes(item.id) ? { ...item, onboardingStep } : item
        )
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
      getTrialClientColumns({
        onUpdateStep: (id, step) => updateStep([id], step),
        onTogglePriority: (id) => togglePriority([id]),
      }),
    [togglePriority, updateStep]
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
    globalFilterFn: globalTrialFilter,
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
          <h2 className="text-lg font-semibold">Trial Subscription Directory</h2>
          <p className="text-sm text-muted-foreground">
            Free-trial tenant accounts grouped around trial expiry, onboarding progress, and upgrade readiness.
          </p>
        </div>

        <TrialClientsTableToolbar
          table={table}
          onBatchStepUpdate={(step) => updateStep(selectedIds, step)}
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
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
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
                    No trial tenants matched your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <TrialClientsTablePagination table={table} />
      </div>
    </section>
  );
};
