"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Star } from "lucide-react";
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
import { PaymentIntegrationRecord } from "./payments-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const integrationStatusClasses: Record<
  PaymentIntegrationRecord["integrationStatus"],
  string
> = {
  Active: "bg-emerald-100 text-emerald-700",
  Review: "bg-amber-100 text-amber-700",
  Sandbox: "bg-blue-100 text-blue-700",
  Paused: "bg-slate-100 text-slate-700",
};

const webhookHealthClasses: Record<PaymentIntegrationRecord["webhookHealth"], string> = {
  Healthy: "bg-emerald-100 text-emerald-700",
  Watch: "bg-amber-100 text-amber-700",
  Failing: "bg-rose-100 text-rose-700",
};

const maskAccountNumber = (value: string, category: PaymentIntegrationRecord["category"]) => {
  if (category !== "Credit/Debit Card") return value;

  const digits = value.replace(/\s+/g, "");
  const lastFour = digits.slice(-4);

  return `•••• •••• •••• ${lastFour}`;
};

type PaymentColumnActions = {
  onUpdateStatus: (
    id: string,
    status: PaymentIntegrationRecord["integrationStatus"],
  ) => void;
  onTogglePriority: (id: string) => void;
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

export const getPaymentsColumns = ({
  onUpdateStatus,
  onTogglePriority,
}: PaymentColumnActions): ColumnDef<PaymentIntegrationRecord>[] => [
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
    accessorKey: "providerName",
    header: ({ column }) => sortableHeader("Provider", column),
    cell: ({ row }) => (
      <div className="min-w-44">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.providerName}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">{row.original.category}</p>
      </div>
    ),
  },
  {
    accessorKey: "accountName",
    header: ({ column }) => sortableHeader("Account", column),
    cell: ({ row }) => (
      <div className="min-w-48">
        <p className="font-medium">{row.original.accountName}</p>
        <p className="text-xs text-muted-foreground">
          {maskAccountNumber(row.original.accountNumber, row.original.category)}
          {row.original.category === "Credit/Debit Card" && row.original.expiryDate
            ? ` • exp ${row.original.expiryDate}`
            : ""}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "integrationStatus",
    header: ({ column }) => sortableHeader("Status", column),
    cell: ({ row }) => (
      <Badge
        className={integrationStatusClasses[row.original.integrationStatus]}
        variant="outline"
      >
        {row.original.integrationStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "webhookHealth",
    header: ({ column }) => sortableHeader("Webhook", column),
    cell: ({ row }) => (
      <Badge className={webhookHealthClasses[row.original.webhookHealth]} variant="outline">
        {row.original.webhookHealth}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "transactionVolume",
    header: ({ column }) => sortableHeader("Transactions", column),
    cell: ({ row }) => (
      <div className="min-w-40">
        <p className="font-medium">{currency.format(row.original.transactionVolume)}</p>
        <p className="text-xs text-muted-foreground">{row.original.settlementWindow}</p>
      </div>
    ),
  },
  {
    accessorKey: "supportedTenants",
    header: ({ column }) => sortableHeader("Coverage", column),
    cell: ({ row }) => (
      <div className="min-w-32">
        <p className="font-medium">{row.original.supportedTenants} tenants</p>
        <p className="text-xs text-muted-foreground">{row.original.feeModel}</p>
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
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Payment actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Active")}>
            Mark active
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Review")}>
            Send to review
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Sandbox")}>
            Move to sandbox
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Paused")}>
            Pause integration
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
