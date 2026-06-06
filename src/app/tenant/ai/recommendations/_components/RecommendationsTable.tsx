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

type RecommendationCategory =
  | "Pricing"
  | "Packaging"
  | "Promotion"
  | "Operations"
  | "Guest Experience";

type RecommendationPriority = "High" | "Medium" | "Low";
type RecommendationStatus = "Ready" | "Watch" | "Needs setup";

export type RecommendationRow = {
  id: string;
  title: string;
  category: RecommendationCategory;
  priority: RecommendationPriority;
  status: RecommendationStatus;
  recommendation: string;
  rationale: string;
  actionLabel: string;
  actionHref: string;
  updatedAt: Date;
};

const categoryClasses: Record<RecommendationCategory, string> = {
  Pricing: "border-blue-200 bg-blue-50 text-blue-700",
  Packaging: "border-orange-200 bg-orange-50 text-orange-700",
  Promotion: "border-violet-200 bg-violet-50 text-violet-700",
  Operations: "border-zinc-200 bg-zinc-100 text-zinc-700",
  "Guest Experience": "border-emerald-200 bg-emerald-50 text-emerald-700",
};

const statusClasses: Record<RecommendationStatus, string> = {
  Ready: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Watch: "border-amber-200 bg-amber-50 text-amber-700",
  "Needs setup": "border-red-200 bg-red-50 text-red-700",
};

const priorityClasses: Record<RecommendationPriority, string> = {
  High: "border-red-200 bg-red-50 text-red-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  Low: "border-zinc-200 bg-zinc-100 text-zinc-700",
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

const columns: ColumnDef<RecommendationRow>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => sortableHeader("Recommendation area", column),
    cell: ({ row }) => (
      <div className="min-w-88 whitespace-normal">
        <p className="font-medium text-foreground">{row.original.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {row.original.rationale}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "recommendation",
    header: ({ column }) => sortableHeader("Recommended next move", column),
    cell: ({ row }) => (
      <div className="min-w-52 whitespace-normal text-sm text-foreground/85">
        {row.original.recommendation}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => sortableHeader("Category", column),
    cell: ({ row }) => (
      <Badge variant="outline" className={categoryClasses[row.original.category]}>
        {row.original.category}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
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
    accessorKey: "status",
    header: ({ column }) => sortableHeader("Status", column),
    cell: ({ row }) => (
      <Badge variant="outline" className={statusClasses[row.original.status]}>
        {row.original.status}
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

export function RecommendationsTable({
  rows,
  isLoading,
  isFetching,
}: {
  rows: RecommendationRow[];
  isLoading: boolean;
  isFetching: boolean;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "priority", desc: false },
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
        row.original.title,
        row.original.recommendation,
        row.original.category,
        row.original.priority,
        row.original.status,
        row.original.rationale,
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
          <h2 className="text-lg font-semibold">Recommendations table</h2>
          <p className="text-sm text-muted-foreground">
            Review AI-ready decision areas, see the reasoning behind each
            suggestion, and jump straight to the module where owners can act.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={(table.getState().globalFilter as string) ?? ""}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
                placeholder="Search recommendations, rationale, or status..."
                className="pl-9"
              />
            </div>

            <Select
              value={(table.getColumn("category")?.getFilterValue() as string) ?? "all"}
              onValueChange={(value) =>
                table.getColumn("category")?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-full sm:w-44">
                <SelectValue placeholder="Filter category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                <SelectItem value="Pricing">Pricing</SelectItem>
                <SelectItem value="Packaging">Packaging</SelectItem>
                <SelectItem value="Promotion">Promotion</SelectItem>
                <SelectItem value="Operations">Operations</SelectItem>
                <SelectItem value="Guest Experience">Guest Experience</SelectItem>
              </SelectContent>
            </Select>

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
                    Loading recommendations...
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
                    No recommendation rows matched your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 border-t pt-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            {isFetching && !isLoading
              ? "Refreshing smart recommendation readiness..."
              : `Showing ${table.getFilteredRowModel().rows.length} recommendation surfaces derived from the tenant workspace.`}
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
