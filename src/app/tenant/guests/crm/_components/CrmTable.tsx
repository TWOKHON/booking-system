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
import { createCrmColumns } from "./crm-columns";
import {
  guestLifecycles,
  guestSegments,
  type GuestProfile,
} from "./crm-data";

const globalCrmFilter = (
  row: { original: GuestProfile },
  _columnId: string,
  value: string,
) => {
  const search = value.toLowerCase();
  const guest = row.original;

  return [
    guest.guestName,
    guest.email,
    guest.phone,
    guest.segment,
    guest.lifecycle,
    guest.preference,
    guest.nextAction,
    guest.owner,
  ]
    .join(" ")
    .toLowerCase()
    .includes(search);
};

export function CrmTable() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const profilesQuery = useQuery(trpc.guestCrm.list.queryOptions());
  const profilesQueryKey = trpc.guestCrm.list.queryKey();
  const summaryQueryKey = trpc.guestCrm.summary.queryKey();
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "lifetimeValue", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const updateSegmentMutation = useMutation(
    trpc.guestCrm.updateSegment.mutationOptions({
      onSuccess: async (guest) => {
        toast.success(`${guest.guestName} marked as VIP.`);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: profilesQueryKey }),
          queryClient.invalidateQueries({ queryKey: summaryQueryKey }),
        ]);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to update segment.");
      },
    }),
  );
  const completeNextActionMutation = useMutation(
    trpc.guestCrm.completeNextAction.mutationOptions({
      onSuccess: async (guest) => {
        toast.success(`${guest.guestName} follow-up completed.`);
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: profilesQueryKey }),
          queryClient.invalidateQueries({ queryKey: summaryQueryKey }),
        ]);
      },
      onError: (error) => {
        toast.error(error.message || "Failed to complete follow-up.");
      },
    }),
  );
  const profiles = React.useMemo(
    () => profilesQuery.data ?? [],
    [profilesQuery.data],
  );
  const columns = React.useMemo(
    () =>
      createCrmColumns({
        onAddToCampaign: (guest) =>
          toast.success(`${guest.guestName} added to campaign audience.`),
        onCompleteFollowUp: (guest) =>
          completeNextActionMutation.mutate({ id: guest.id }),
        onCopyEmail: async (guest) => {
          await navigator.clipboard.writeText(guest.email);
          toast.success("Guest email copied.");
        },
        onPromoteVip: (guest) =>
          updateSegmentMutation.mutate({ id: guest.id, segment: "VIP" }),
      }),
    [completeNextActionMutation, updateSegmentMutation],
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: profiles,
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
    globalFilterFn: globalCrmFilter,
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
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h2 className="text-lg font-semibold">Guest profiles</h2>
            <p className="text-sm text-muted-foreground">
              Segment guests, review preferences, and queue relationship follow-up.
            </p>
          </div>
          <CrmToolbar table={table} />
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
                    {profilesQuery.isLoading
                      ? "Loading guest profiles..."
                      : "No guest profiles match your filters."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <CrmPagination table={table} />
      </div>
    </section>
  );
}

function CrmToolbar({
  table,
}: {
  table: ReturnType<typeof useReactTable<GuestProfile>>;
}) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search guest, segment, preference..."
            className="pl-9"
          />
        </div>

        <Select
          value={(table.getColumn("segment")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table.getColumn("segment")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All segments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All segments</SelectItem>
            {guestSegments.map((segment) => (
              <SelectItem key={segment} value={segment}>
                {segment}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={
            (table.getColumn("lifecycle")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("lifecycle")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All lifecycle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All lifecycle</SelectItem>
            {guestLifecycles.map((lifecycle) => (
              <SelectItem key={lifecycle} value={lifecycle}>
                {lifecycle}
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

function CrmPagination({
  table,
}: {
  table: ReturnType<typeof useReactTable<GuestProfile>>;
}) {
  return (
    <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {table.getRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} profiles
      </p>

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
