"use client";
"use no memo";

import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { createHousekeepingColumns } from "./housekeeping-columns";
import { type HousekeepingRoom } from "./housekeeping-data";
import { HousekeepingTablePagination } from "./HousekeepingTablePagination";
import { HousekeepingTableToolbar } from "./HousekeepingTableToolbar";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";

const globalHousekeepingFilter = (
  row: { original: HousekeepingRoom },
  _columnId: string,
  value: string,
) => {
  const search = value.toLowerCase();
  const item = row.original;

  return [
    item.roomNo,
    item.roomType,
    item.status,
    item.occupancy,
    item.assignedTo,
    item.lastCleaned,
    item.notes,
  ]
    .join(" ")
    .toLowerCase()
    .includes(search);
};

export function HousekeepingTable() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const roomsQuery = useQuery(trpc.housekeeping.list.queryOptions());
  const markCleanMutation = useMutation(
    trpc.housekeeping.updateRoom.mutationOptions({
      onSuccess: async () => {
        toast.success("Room marked clean.");
        await Promise.all([
          queryClient.invalidateQueries(trpc.housekeeping.list.queryOptions()),
          queryClient.invalidateQueries(trpc.housekeeping.summary.queryOptions()),
        ]);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update room status.");
      },
    }),
  );
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "roomNo", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const rooms = React.useMemo(() => roomsQuery.data ?? [], [roomsQuery.data]);
  const roomTypes = React.useMemo(
    () =>
      Array.from(new Set(rooms.map((room) => room.roomType))).sort((a, b) =>
        a.localeCompare(b),
      ),
    [rooms],
  );
  const columns = React.useMemo(
    () =>
      createHousekeepingColumns({
        onMarkClean: (room) =>
          markCleanMutation.mutate({
            id: room.id,
            status: "Clean",
            occupancy: "Vacant",
            notes: "",
            markCleaned: true,
          }),
      }),
    [markCleanMutation],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rooms,
    columns,
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
    globalFilterFn: globalHousekeepingFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  });

  return (
    <section className="rounded-xl border bg-background p-5 shadow-sm md:p-6">
      <div className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Room status</h2>
            <p className="text-sm text-muted-foreground">
              Real-time status of rooms.
            </p>
          </div>
          <HousekeepingTableToolbar table={table} roomTypes={roomTypes} />
        </div>

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
                  <TableRow key={row.id}>
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
                    {roomsQuery.isLoading
                      ? "Loading housekeeping rooms..."
                      : "No rooms match your filters."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <HousekeepingTablePagination table={table} />
      </div>
    </section>
  );
}
