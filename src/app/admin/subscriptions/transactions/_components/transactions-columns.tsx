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
import { TransactionRecord } from "./transactions-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const transactionStatusClasses: Record<TransactionRecord["transactionStatus"], string> = {
  Processing: "bg-blue-100 text-blue-700",
  Successful: "bg-emerald-100 text-emerald-700",
  Failed: "bg-rose-100 text-rose-700",
  Refunded: "bg-amber-100 text-amber-700",
  Reversed: "bg-violet-100 text-violet-700",
};

type TransactionColumnActions = {
  onUpdateStatus: (id: string, status: TransactionRecord["transactionStatus"]) => void;
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

export const getTransactionsColumns = ({
  onUpdateStatus,
  onTogglePriority,
}: TransactionColumnActions): ColumnDef<TransactionRecord>[] => [
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
    accessorKey: "referenceCode",
    header: ({ column }) => sortableHeader("Reference", column),
    cell: ({ row }) => (
      <div className="min-w-48">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.referenceCode}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">{row.original.transactionType}</p>
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
    accessorKey: "transactionStatus",
    header: ({ column }) => sortableHeader("Status", column),
    cell: ({ row }) => (
      <Badge
        className={transactionStatusClasses[row.original.transactionStatus]}
        variant="outline"
      >
        {row.original.transactionStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "paymentChannel",
    header: ({ column }) => sortableHeader("Channel", column),
    cell: ({ row }) => (
      <div className="min-w-32">
        <p className="font-medium">{row.original.paymentChannel}</p>
        <p className="text-xs text-muted-foreground">{row.original.settlementWindow}</p>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => sortableHeader("Amount", column),
    cell: ({ row }) => (
      <div className="min-w-32">
        <p className="font-medium">{currency.format(row.original.amount)}</p>
        <p className="text-xs text-muted-foreground">{row.original.transactionDate}</p>
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
          <DropdownMenuLabel>Transaction actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Processing")}>
            Mark processing
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Successful")}>
            Mark successful
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Failed")}>
            Mark failed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Refunded")}>
            Mark refunded
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Reversed")}>
            Mark reversed
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
