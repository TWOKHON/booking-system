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
import { InvoiceRecord } from "./invoices-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const invoiceStatusClasses: Record<InvoiceRecord["invoiceStatus"], string> = {
  Draft: "bg-slate-100 text-slate-700",
  Issued: "bg-blue-100 text-blue-700",
  "Due Soon": "bg-amber-100 text-amber-700",
  Overdue: "bg-rose-100 text-rose-700",
  Paid: "bg-emerald-100 text-emerald-700",
};

const paymentStatusClasses: Record<InvoiceRecord["paymentStatus"], string> = {
  Clear: "bg-emerald-100 text-emerald-700",
  Watch: "bg-amber-100 text-amber-700",
  "At Risk": "bg-rose-100 text-rose-700",
};

const sourceClasses: Record<InvoiceRecord["invoiceSource"], string> = {
  Automatic: "bg-blue-100 text-blue-700",
  Manual: "bg-violet-100 text-violet-700",
};

type InvoiceColumnActions = {
  onUpdateStatus: (id: string, status: InvoiceRecord["invoiceStatus"]) => void;
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

export const getInvoicesColumns = ({
  onUpdateStatus,
  onTogglePriority,
}: InvoiceColumnActions): ColumnDef<InvoiceRecord>[] => [
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
    accessorKey: "invoiceTitle",
    header: ({ column }) => sortableHeader("Invoice", column),
    cell: ({ row }) => (
      <div className="min-w-52">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.invoiceTitle}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">{row.original.invoiceCategory}</p>
      </div>
    ),
  },
  {
    accessorKey: "tenantName",
    header: ({ column }) => sortableHeader("Tenant", column),
    cell: ({ row }) => (
      <div className="min-w-44">
        <p className="font-medium">{row.original.tenantName}</p>
        <p className="text-xs text-muted-foreground">{row.original.resortName}</p>
      </div>
    ),
  },
  {
    accessorKey: "invoiceSource",
    header: ({ column }) => sortableHeader("Source", column),
    cell: ({ row }) => (
      <Badge className={sourceClasses[row.original.invoiceSource]} variant="outline">
        {row.original.invoiceSource}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "invoiceStatus",
    header: ({ column }) => sortableHeader("Status", column),
    cell: ({ row }) => (
      <Badge className={invoiceStatusClasses[row.original.invoiceStatus]} variant="outline">
        {row.original.invoiceStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => sortableHeader("Amount", column),
    cell: ({ row }) => (
      <div className="min-w-36">
        <p className="font-medium">{currency.format(row.original.amount)}</p>
        <p className="text-xs text-muted-foreground">{row.original.billingPeriod}</p>
      </div>
    ),
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => sortableHeader("Payment", column),
    cell: ({ row }) => (
      <Badge className={paymentStatusClasses[row.original.paymentStatus]} variant="outline">
        {row.original.paymentStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
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
          <DropdownMenuLabel>Invoice actions</DropdownMenuLabel>
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
