"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  formatPettyCashMoney,
  pettyCashStatusLabels,
  type PettyCashRow,
  type PettyCashStatus,
} from "./petty-cash-data";

const statusClasses: Record<PettyCashStatus, string> = {
  REQUESTED:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  APPROVED:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
  RELEASED:
    "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300",
  LIQUIDATED:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  REJECTED:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
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

type PettyCashColumnActions = {
  onUpdateStatus: (row: PettyCashRow, status: PettyCashStatus) => void;
};

export const getPettyCashColumns = ({
  onUpdateStatus,
}: PettyCashColumnActions): ColumnDef<PettyCashRow>[] => [
  {
    id: "select",
    enableSorting: false,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "neededBy",
    header: ({ column }) => sortableHeader("Needed by", column),
    cell: ({ row }) => (
      <div className="min-w-28 whitespace-nowrap">{row.original.neededBy}</div>
    ),
  },
  {
    accessorKey: "requester",
    header: ({ column }) => sortableHeader("Requester", column),
    cell: ({ row }) => (
      <div className="min-w-44">
        <div className="font-medium">{row.original.requester}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.department}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => sortableHeader("Category", column),
    cell: ({ row }) => (
      <div className="min-w-32 whitespace-nowrap">{row.original.category}</div>
    ),
  },
  {
    accessorKey: "purpose",
    header: ({ column }) => sortableHeader("Purpose", column),
    cell: ({ row }) => <div className="min-w-56">{row.original.purpose}</div>,
  },
  {
    accessorKey: "reference",
    header: ({ column }) => sortableHeader("Reference", column),
    cell: ({ row }) => (
      <div className="min-w-28 whitespace-nowrap">{row.original.reference}</div>
    ),
  },
  {
    accessorKey: "amountCents",
    header: ({ column }) => sortableHeader("Amount", column),
    cell: ({ row }) => (
      <div className="min-w-28 whitespace-nowrap">
        {formatPettyCashMoney(row.original.amountCents)}
      </div>
    ),
  },
  {
    accessorKey: "releasedCents",
    header: ({ column }) => sortableHeader("Released", column),
    cell: ({ row }) => (
      <div className="min-w-28 whitespace-nowrap">
        {formatPettyCashMoney(row.original.releasedCents)}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => sortableHeader("Status", column),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn("whitespace-nowrap", statusClasses[row.original.status])}
      >
        {pettyCashStatusLabels[row.original.status]}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="ml-auto">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>Petty cash actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.reference)}
          >
            Copy reference
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original, "APPROVED")}>
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original, "RELEASED")}>
            Mark released
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original, "LIQUIDATED")}>
            Mark liquidated
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original, "REJECTED")}>
            Reject
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
