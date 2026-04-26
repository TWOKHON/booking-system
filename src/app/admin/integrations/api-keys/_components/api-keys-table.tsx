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
import { CreateApiKeyDrawer } from "./create-api-key-drawer";
import { getApiKeysColumns } from "./api-keys-columns";
import { ApiKeyRecord, apiKeyRecords } from "./api-keys-data";
import { ApiKeysTablePagination } from "./api-keys-table-pagination";
import { ApiKeysTableToolbar } from "./api-keys-table-toolbar";

const globalApiKeysFilter = (
  row: { original: ApiKeyRecord },
  _columnId: string,
  value: string,
) => {
  const search = value.toLowerCase();
  const item = row.original;

  return [
    item.keyName,
    item.provider,
    item.keyType,
    item.assignedTo,
    item.note,
    item.maskedKey,
  ]
    .join(" ")
    .toLowerCase()
    .includes(search);
};

export const ApiKeysTable = () => {
  const [data, setData] = React.useState<ApiKeyRecord[]>(apiKeyRecords);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "keyName", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [createOpen, setCreateOpen] = React.useState(false);

  const updateStatus = React.useCallback(
    (ids: string[], keyStatus: ApiKeyRecord["keyStatus"]) => {
      setData((current) =>
        current.map((item) => (ids.includes(item.id) ? { ...item, keyStatus } : item)),
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

  const createApiKey = React.useCallback((record: Omit<ApiKeyRecord, "id">) => {
    const nextId = `KEY-${Math.floor(9200 + Math.random() * 700)}`;
    setData((current) => [{ id: nextId, ...record }, ...current]);
  }, []);

  const columns = React.useMemo(
    () =>
      getApiKeysColumns({
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
    globalFilterFn: globalApiKeysFilter,
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
            <h2 className="text-lg font-semibold">API Keys Board</h2>
            <p className="text-sm text-muted-foreground">
              Platform API key configurations covering provider access, scope, environment,
              rotation state, and integration ownership.
            </p>
          </div>

          <ApiKeysTableToolbar
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
                      No API keys matched your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <ApiKeysTablePagination table={table} />
        </div>
      </section>

      <CreateApiKeyDrawer
        open={createOpen}
        onOpenChange={setCreateOpen}
        onCreate={createApiKey}
      />
    </>
  );
};
