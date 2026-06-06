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

type PackagePriority = "High" | "Medium" | "Low";
type PackageReadiness = "Ready" | "Watch" | "Needs setup";

export type PackageRow = {
  id: string;
  category: string;
  candidateLabel: string;
  serviceCount: number;
  packageValue: number;
  bundleStrength: number;
  readiness: PackageReadiness;
  priority: PackagePriority;
  triggerWindow: string;
  packageAngle: string;
  actionLabel: string;
  actionHref: string;
  updatedAt: Date;
};

const priorityClasses: Record<PackagePriority, string> = {
  High: "border-red-200 bg-red-50 text-red-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  Low: "border-zinc-200 bg-zinc-100 text-zinc-700",
};

const readinessClasses: Record<PackageReadiness, string> = {
  Ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Watch: "border-amber-200 bg-amber-50 text-amber-700",
  "Needs setup": "border-zinc-200 bg-zinc-100 text-zinc-700",
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

const columns: ColumnDef<PackageRow>[] = [
  {
    accessorKey: "candidateLabel",
    header: ({ column }) => sortableHeader("Package angle", column),
    cell: ({ row }) => (
      <div className="min-w-60 whitespace-normal">
        <p className="font-medium text-foreground">{row.original.candidateLabel}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {row.original.packageAngle}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => sortableHeader("Category", column),
    cell: ({ row }) => (
      <div className="text-sm font-medium">{row.original.category}</div>
    ),
  },
  {
    accessorKey: "packageValue",
    header: ({ column }) => sortableHeader("Estimated value", column),
    cell: ({ row }) => (
      <div className="text-sm">
        {new Intl.NumberFormat("en-PH", {
          style: "currency",
          currency: "PHP",
          maximumFractionDigits: 0,
        }).format(row.original.packageValue)}
      </div>
    ),
  },
  {
    accessorKey: "triggerWindow",
    header: ({ column }) => sortableHeader("Trigger window", column),
    cell: ({ row }) => (
      <div className="min-w-30 whitespace-normal text-sm text-foreground/85">
        {row.original.triggerWindow}
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: ({ column }) => sortableHeader("Priority", column),
    cell: ({ row }) => (
      <Badge variant="outline" className={priorityClasses[row.original.priority]}>
        {row.original.priority}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "readiness",
    header: ({ column }) => sortableHeader("Readiness", column),
    cell: ({ row }) => (
      <Badge variant="outline" className={readinessClasses[row.original.readiness]}>
        {row.original.readiness}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
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

export function PackagesTable({
  rows,
  isLoading,
  isFetching,
}: {
  rows: PackageRow[];
  isLoading: boolean;
  isFetching: boolean;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "packageValue", desc: true },
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
        row.original.candidateLabel,
        row.original.category,
        row.original.triggerWindow,
        row.original.priority,
        row.original.readiness,
        row.original.packageAngle,
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
          <h2 className="text-lg font-semibold">Package opportunity table</h2>
          <p className="text-sm text-muted-foreground">
            Review which offer angles are most viable, where they should be
            triggered, and which service categories already support stronger bundling.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={(table.getState().globalFilter as string) ?? ""}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
                placeholder="Search packages, categories, or timing..."
                className="pl-9"
              />
            </div>

            <Select
              value={(table.getColumn("priority")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) =>
                table.getColumn("priority")?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priority</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={(table.getColumn("readiness")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) =>
                table.getColumn("readiness")?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Filter readiness" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All readiness</SelectItem>
                <SelectItem value="Ready">Ready</SelectItem>
                <SelectItem value="Watch">Watch</SelectItem>
                <SelectItem value="Needs setup">Needs setup</SelectItem>
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
                    Loading package opportunities...
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
                    No package rows matched your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {isFetching && !isLoading
              ? "Refreshing package opportunities..."
              : `Showing ${table.getFilteredRowModel().rows.length} package surfaces derived from the current service catalog.`}
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
