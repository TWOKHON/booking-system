"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, ExternalLinkIcon, MoreHorizontalIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { BillingRecord, BillingRecordStatus } from "./billing-data";

const statusClasses: Record<BillingRecordStatus, string> = {
  TRIALING:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
  PENDING:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  PAID:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  UPCOMING:
    "border-zinc-200 bg-zinc-50 text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300",
  PAST_DUE:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
  CANCELED:
    "border-zinc-200 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400",
};

function formatStatus(status: BillingRecordStatus) {
  if (status === "PAST_DUE") return "Past due";
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  }).format(value);
}

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

export const billingColumns: ColumnDef<BillingRecord>[] = [
  {
    accessorKey: "description",
    header: ({ column }) => sortableHeader("Billing item", column),
    cell: ({ row }) => (
      <div className="min-w-60">
        <div className="font-medium">{row.original.description}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.source} subscription billing
        </div>
      </div>
    ),
  },
  {
    accessorKey: "plan",
    header: ({ column }) => sortableHeader("Plan", column),
    cell: ({ row }) => (
      <div className="min-w-32">
        <div>{row.original.plan}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.billingCycle}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => sortableHeader("Amount", column),
    cell: ({ row }) => (
      <div className="min-w-28 whitespace-nowrap font-medium">
        {formatCurrency(row.original.amount)}
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
        {formatStatus(row.original.status)}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => sortableHeader("Due date", column),
    cell: ({ row }) => (
      <div className="min-w-32 whitespace-nowrap">{row.original.dueDate}</div>
    ),
  },
  {
    accessorKey: "paidAt",
    header: "Paid",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="min-w-32 whitespace-nowrap text-sm text-muted-foreground">
        {row.original.paidAt ?? "--"}
      </div>
    ),
  },
  {
    id: "actions",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm" className="ml-auto">
            <MoreHorizontalIcon className="size-4" />
            <span className="sr-only">Open billing actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>Billing actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <a href={row.original.invoiceUrl ?? "/api/polar/portal"}>
              Download invoice
              <ExternalLinkIcon className="ml-auto size-3.5" />
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.id)}
          >
            Copy record ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <a href="/api/polar/portal">
              Open Polar portal
              <ExternalLinkIcon className="ml-auto size-3.5" />
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
