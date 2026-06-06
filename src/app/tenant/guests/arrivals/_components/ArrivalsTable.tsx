"use client";
"use no memo";

import * as React from "react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Columns3, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTRPC } from "@/trpc/client";
import { createArrivalsColumns } from "./arrivals-columns";
import {
  roomReadinessOptions,
  type ArrivalGuest,
} from "./arrivals-data";

const globalArrivalFilter = (
  row: { original: ArrivalGuest },
  _columnId: string,
  value: string,
) => {
  const search = value.toLowerCase();
  const arrival = row.original;

  return [
    arrival.guestName,
    arrival.reservationCode,
    arrival.room,
    arrival.roomType,
    arrival.arrivalTime,
    arrival.arrivalDate,
    arrival.party,
    arrival.status,
    arrival.roomReadiness,
    arrival.balance,
    arrival.notes,
  ]
    .join(" ")
    .toLowerCase()
    .includes(search);
};

export function ArrivalsTable({ selectedDate }: { selectedDate: Date }) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const arrivalsQuery = useQuery(
    trpc.arrivals.list.queryOptions({ date: selectedDate }),
  );
  const arrivalsListQueryKey = trpc.arrivals.list.queryKey();
  const arrivalsSummaryQueryKey = trpc.arrivals.summary.queryKey();
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "arrivalTime", desc: false },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const markArrivedMutation = useMutation(
    trpc.arrivals.markArrived.mutationOptions({
      onSuccess: async (arrival) => {
        toast.success(`${arrival.guestName} checked in.`);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: arrivalsListQueryKey }),
          queryClient.invalidateQueries({ queryKey: arrivalsSummaryQueryKey }),
        ]);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to start check-in.");
      },
    }),
  );
  const arrivals = React.useMemo(
    () => arrivalsQuery.data ?? [],
    [arrivalsQuery.data],
  );
  const columns = React.useMemo(
    () =>
      createArrivalsColumns({
        onStartCheckIn: (arrival) =>
          markArrivedMutation.mutate({ id: arrival.id }),
        onMessageGuest: (arrival) =>
          toast.info(`Message workflow queued for ${arrival.guestName}.`),
        onCopyReservation: async (arrival) => {
          await navigator.clipboard.writeText(arrival.reservationCode);
          toast.success("Confirmation code copied.");
        },
      }),
    [markArrivedMutation],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: arrivals,
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
    globalFilterFn: globalArrivalFilter,
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
    <section className="rounded-xl h-fit border bg-background p-5 shadow-sm md:p-6">
      <div className="space-y-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Today&apos;s arrivals</h2>
            <p className="text-sm text-muted-foreground">
              Track guest ETA, room readiness, balances, and check-in action.
            </p>
          </div>
          <ArrivalsTableToolbar table={table} />
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
              {table.getRowModel().rows.length ? (
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
                    {arrivalsQuery.isLoading
                      ? "Loading arrivals..."
                      : "No arrivals match your filters."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <ArrivalsTablePagination table={table} />
      </div>
    </section>
  );
}

function ArrivalsTableToolbar({
  table,
}: {
  table: ReturnType<typeof useReactTable<ArrivalGuest>>;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search guest, reservation, room..."
            className="pl-9"
          />
        </div>

        <Select
          value={
            (table.getColumn("roomReadiness")?.getFilterValue() as string) ??
            "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("roomReadiness")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-42.5">
            <SelectValue placeholder="All readiness" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All readiness</SelectItem>
            {roomReadinessOptions.map((readiness) => (
              <SelectItem key={readiness} value={readiness}>
                {readiness}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <Columns3 className="size-4" />
            Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {table
            .getAllColumns()
            .filter((column) => column.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ArrivalsTablePagination({
  table,
}: {
  table: ReturnType<typeof useReactTable<ArrivalGuest>>;
}) {
  return (
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="text-sm text-muted-foreground">
        Showing {table.getRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} arrivals
      </div>

      <div className="flex items-center gap-3">
        <p className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount() || 1}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="size-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
