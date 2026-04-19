"use client";

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
import { TenantClient, tenantClients } from "./tenant-clients-data";
import { getTenantClientColumns } from "./tenant-clients-columns";
import { TenantClientsTableToolbar } from "./tenant-clients-table-toolbar";
import { TenantClientsTablePagination } from "./tenant-clients-table-pagination";

const globalTenantFilter = (
  row: { original: TenantClient },
  _columnId: string,
  value: string
) => {
  const search = value.toLowerCase();
  const tenant = row.original;

  return [
    tenant.tenantName,
    tenant.ownerName,
    tenant.ownerEmail,
    tenant.location,
    tenant.id,
  ]
    .join(" ")
    .toLowerCase()
    .includes(search);
};

export const TenantClientsTable = () => {
  const [data, setData] = React.useState<TenantClient[]>(tenantClients);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "tenantName", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>(
    {}
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const updateStatus = React.useCallback(
    (ids: string[], status: TenantClient["status"]) => {
      setData((current) =>
        current.map((item) =>
          ids.includes(item.id) ? { ...item, status } : item
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
      getTenantClientColumns({
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
    globalFilterFn: globalTenantFilter,
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
          <h2 className="text-lg font-semibold">Tenant Directory</h2>
          <p className="text-sm text-muted-foreground">
            Tenant account records covering ownership, subscription health, usage, and workspace status.
          </p>
        </div>

        <TenantClientsTableToolbar
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
                    No tenant clients matched your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <TenantClientsTablePagination table={table} />
      </div>
    </section>
  );
};
