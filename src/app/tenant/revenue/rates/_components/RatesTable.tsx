"use client";
"use no memo";

import * as React from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpDown, Columns3, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

type RateSignal = "Lift" | "Hold" | "Watch";
type RatePosition = "Premium" | "Core" | "Value";

export type RateRow = {
  id: string;
  roomName: string;
  category: string;
  rate: number;
  sellableUnits: number;
  capacity: number;
  zone: string;
  position: RatePosition;
  signal: RateSignal;
  demandBias: number;
  recommendedBand: string;
  suggestedMove: string;
  actionLabel: string;
  actionHref: string;
  updatedAt: Date;
};

const signalClasses: Record<RateSignal, string> = {
  Lift: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Hold: "border-zinc-200 bg-zinc-100 text-zinc-700",
  Watch: "border-amber-200 bg-amber-50 text-amber-700",
};

const positionClasses: Record<RatePosition, string> = {
  Premium: "border-violet-200 bg-violet-50 text-violet-700",
  Core: "border-blue-200 bg-blue-50 text-blue-700",
  Value: "border-orange-200 bg-orange-50 text-orange-700",
};

const sortableHeader = (
  label: string,
  column: {
    getIsSorted: () => false | "asc" | "desc";
    toggleSorting: (desc?: boolean) => void;
  },
) => (
  <Button
    variant="ghost"
    size="sm"
    className="-ml-2 h-8 px-2 text-left font-medium"
    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  >
    {label}
    <ArrowUpDown className="ml-1 size-3.5" />
  </Button>
);

const columns: ColumnDef<RateRow>[] = [
  {
    accessorKey: "roomName",
    header: ({ column }) => sortableHeader("Room", column),
    cell: ({ row }) => (
      <div className="min-w-40 whitespace-normal">
        <p className="font-medium text-foreground">{row.original.roomName}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {row.original.category} · {row.original.zone} · {row.original.capacity} pax
        </p>
      </div>
    ),
  },
  {
    accessorKey: "rate",
    header: ({ column }) => sortableHeader("Current rate", column),
    cell: ({ row }) => (
      <div className="text-sm font-medium">
        {new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
          maximumFractionDigits: 0,
        }).format(row.original.rate)}
      </div>
    ),
  },
  {
    accessorKey: "recommendedBand",
    header: ({ column }) => sortableHeader("Recommended band", column),
    cell: ({ row }) => (
      <div className="min-w-40 text-sm text-foreground/85">
        {row.original.recommendedBand}
      </div>
    ),
  },
  {
    accessorKey: "position",
    header: ({ column }) => sortableHeader("Position", column),
    cell: ({ row }) => (
      <Badge variant="outline" className={positionClasses[row.original.position]}>
        {row.original.position}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "signal",
    header: ({ column }) => sortableHeader("Signal", column),
    cell: ({ row }) => (
      <Badge variant="outline" className={signalClasses[row.original.signal]}>
        {row.original.signal}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "suggestedMove",
    header: ({ column }) => sortableHeader("Suggested move", column),
    cell: ({ row }) => (
      <div className="min-w-72 whitespace-normal text-sm text-foreground/85">
        {row.original.suggestedMove}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => sortableHeader("Updated", column),
    cell: ({ row }) => (
      <div className="min-w-28 text-sm text-muted-foreground">
        {formatDistanceToNow(row.original.updatedAt, { addSuffix: true })}
      </div>
    ),
    sortingFn: "datetime",
  },
];

export function RatesTable({
  rows,
  isLoading,
  isFetching,
}: {
  rows: RateRow[];
  isLoading: boolean;
  isFetching: boolean;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "rate", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: rows,
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
    globalFilterFn: (row, _columnId, value) =>
      [
        row.original.roomName,
        row.original.category,
        row.original.position,
        row.original.signal,
        row.original.suggestedMove,
      ]
        .join(" ")
        .toLowerCase()
        .includes(String(value).toLowerCase()),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
  });

  return (
    <section className="rounded-2xl border bg-background p-5 shadow-sm md:p-6">
      <div className="space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Rate review table</h2>
          <p className="text-sm text-muted-foreground">
            Compare each room type’s current rate, see its commercial posture,
            and review the next suggested move before changing the price deck.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={(table.getState().globalFilter as string) ?? ""}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
                placeholder="Search rooms, posture, or moves..."
                className="pl-9"
              />
            </div>

            <Select
              value={(table.getColumn("position")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) =>
                table.getColumn("position")?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All positions</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Core">Core</SelectItem>
                <SelectItem value="Value">Value</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={(table.getColumn("signal")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) =>
                table.getColumn("signal")?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter signal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All signals</SelectItem>
                <SelectItem value="Lift">Lift</SelectItem>
                <SelectItem value="Hold">Hold</SelectItem>
                <SelectItem value="Watch">Watch</SelectItem>
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

        <div className="overflow-hidden rounded-xl border">
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
                    Loading rates...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length > 0 ? (
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
                    No rate rows matched your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {isFetching && !isLoading
              ? "Refreshing room-rate posture..."
              : `Showing ${table.getFilteredRowModel().rows.length} rate surfaces derived from the current room inventory.`}
          </p>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <span className="px-2 text-xs">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
