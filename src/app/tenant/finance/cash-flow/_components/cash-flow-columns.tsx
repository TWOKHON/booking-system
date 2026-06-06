"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
} from "lucide-react";
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
  formatCashFlowMoney,
  cashFlowStatusLabels,
  cashFlowTypeLabels,
  type CashFlowDirection,
  type CashFlowRow,
  type CashFlowStatus,
} from "./cash-flow-data";

const statusClasses: Record<CashFlowStatus, string> = {
  COLLECTED:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  PENDING:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  OVERDUE:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
  RECONCILED:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
};

const directionClasses: Record<CashFlowDirection, string> = {
  INCOME: "border-emerald-200 bg-emerald-50 text-emerald-700",
  EXPENSE: "border-zinc-300 bg-zinc-100 text-zinc-900",
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

export const cashFlowColumns: ColumnDef<CashFlowRow>[] = [
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
    accessorKey: "date",
    header: ({ column }) => sortableHeader("Date", column),
    cell: ({ row }) => (
      <div className="min-w-28 whitespace-nowrap">{row.original.date}</div>
    ),
  },
  {
    accessorKey: "direction",
    header: ({ column }) => sortableHeader("Flow", column),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn("whitespace-nowrap", directionClasses[row.original.direction])}
      >
        {row.original.direction === "INCOME" ? "Income" : "Expense"}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => sortableHeader("Type", column),
    cell: ({ row }) => (
      <div className="flex min-w-30">
        <span className="whitespace-nowrap font-medium">
          {cashFlowTypeLabels[row.original.type]}
        </span>
      </div>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "guestOrVendor",
    header: ({ column }) => sortableHeader("Guest / vendor", column),
    cell: ({ row }) => (
      <div className="min-w-40">
        <div className="font-medium">{row.original.guestOrVendor}</div>
        <div className="text-xs text-muted-foreground">{row.original.owner}</div>
      </div>
    ),
  },
  {
    accessorKey: "reference",
    header: ({ column }) => sortableHeader("Reference", column),
    cell: ({ row }) => (
      <div className="min-w-28 whitespace-nowrap">{row.original.reference}</div>
    ),
  },
  {
    accessorKey: "method",
    header: ({ column }) => sortableHeader("Method", column),
    cell: ({ row }) => (
      <div className="min-w-20 whitespace-nowrap">{row.original.method}</div>
    ),
  },
  {
    accessorKey: "expectedCents",
    header: ({ column }) => sortableHeader("Expected", column),
    cell: ({ row }) => (
      <div className="min-w-20 whitespace-nowrap">
        {formatCashFlowMoney(row.original.expectedCents)}
      </div>
    ),
  },
  {
    accessorKey: "collectedCents",
    header: ({ column }) => sortableHeader("Collected", column),
    cell: ({ row }) => (
      <div className="min-w-20 whitespace-nowrap">
        {formatCashFlowMoney(row.original.collectedCents)}
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
        {cashFlowStatusLabels[row.original.status]}
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
          <DropdownMenuLabel>Cash flow actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.reference)}
          >
            Copy reference
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Mark for review</DropdownMenuItem>
          <DropdownMenuItem>Open reconciliation</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
