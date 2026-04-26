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
import { BillingRecord } from "./billing-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const invoiceStatusClasses: Record<BillingRecord["invoiceStatus"], string> = {
  Draft: "bg-slate-100 text-slate-700",
  Issued: "bg-blue-100 text-blue-700",
  "Due Soon": "bg-amber-100 text-amber-700",
  Overdue: "bg-rose-100 text-rose-700",
  Paid: "bg-emerald-100 text-emerald-700",
};

const collectionStatusClasses: Record<BillingRecord["collectionStatus"], string> = {
  Clear: "bg-emerald-100 text-emerald-700",
  Watch: "bg-amber-100 text-amber-700",
  Escalated: "bg-rose-100 text-rose-700",
};

type BillingColumnActions = {
  onUpdateStatus: (id: string, status: BillingRecord["invoiceStatus"]) => void;
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

export const getBillingColumns = ({
  onUpdateStatus,
  onTogglePriority,
}: BillingColumnActions): ColumnDef<BillingRecord>[] => [
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
    accessorKey: "tenantName",
    header: ({ column }) => sortableHeader("Tenant", column),
    cell: ({ row }) => (
      <div className="min-w-48">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.tenantName}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">{row.original.resortName}</p>
      </div>
    ),
  },
  {
    accessorKey: "planName",
    header: ({ column }) => sortableHeader("Plan", column),
    cell: ({ row }) => (
      <div className="min-w-28">
        <p className="font-medium">{row.original.planName}</p>
        <p className="text-xs text-muted-foreground">{row.original.billingCycle}</p>
      </div>
    ),
  },
  {
    accessorKey: "invoiceStatus",
    header: ({ column }) => sortableHeader("Invoice", column),
    cell: ({ row }) => (
      <Badge
        className={invoiceStatusClasses[row.original.invoiceStatus]}
        variant="outline"
      >
        {row.original.invoiceStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "collectionStatus",
    header: ({ column }) => sortableHeader("Collection", column),
    cell: ({ row }) => (
      <Badge
        className={collectionStatusClasses[row.original.collectionStatus]}
        variant="outline"
      >
        {row.original.collectionStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "amountDue",
    header: ({ column }) => sortableHeader("Billing Amount", column),
    cell: ({ row }) => (
      <div className="min-w-36">
        <p className="font-medium">{currency.format(row.original.amountDue)}</p>
        <p className="text-xs text-muted-foreground">{row.original.nextBillDate}</p>
      </div>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }) => sortableHeader("Payment", column),
    cell: ({ row }) => (
      <div className="min-w-36">
        <p className="font-medium">{row.original.paymentMethod}</p>
        <p className="text-xs text-muted-foreground">
          Last paid: {row.original.lastPaymentDate}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "assignedTo",
    header: ({ column }) => sortableHeader("Assigned To", column),
    cell: ({ row }) => (
      <div className="max-w-56">
        <p className="font-medium">{row.original.assignedTo}</p>
        <p className="truncate text-xs text-muted-foreground">{row.original.note}</p>
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
          <DropdownMenuLabel>Billing actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Draft")}>
            Move to draft
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Issued")}>
            Mark as issued
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Due Soon")}>
            Flag due soon
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Overdue")}>
            Mark overdue
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Paid")}>
            Mark paid
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
