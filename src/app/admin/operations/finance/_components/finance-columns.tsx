"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FinanceRecord } from "./finance-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const financeStatusClasses: Record<FinanceRecord["financeStatus"], string> = {
  Open: "bg-slate-100 text-slate-700",
  "Pending Collection": "bg-amber-100 text-amber-700",
  "For Reconciliation": "bg-blue-100 text-blue-700",
  "Payout Hold": "bg-violet-100 text-violet-700",
  Closed: "bg-emerald-100 text-emerald-700",
};

const paymentHealthClasses: Record<FinanceRecord["paymentHealth"], string> = {
  Clear: "bg-emerald-100 text-emerald-700",
  Watch: "bg-amber-100 text-amber-700",
  "At Risk": "bg-rose-100 text-rose-700",
};

type FinanceColumnActions = {
  onUpdateStatus: (id: string, status: FinanceRecord["financeStatus"]) => void;
  onTogglePriority: (id: string) => void;
};

const sortableHeader = (
  label: string,
  column: {
    getIsSorted: () => false | "asc" | "desc";
    toggleSorting: (desc?: boolean) => void;
  }
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

export const getFinanceColumns = ({
  onUpdateStatus,
  onTogglePriority,
}: FinanceColumnActions): ColumnDef<FinanceRecord>[] => [
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
    accessorKey: "accountName",
    header: ({ column }) => sortableHeader("Account", column),
    cell: ({ row }) => (
      <div className="min-w-44">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.accountName}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">{row.original.ledgerType}</p>
      </div>
    ),
  },
  {
    accessorKey: "resortName",
    header: ({ column }) => sortableHeader("Resort", column),
    cell: ({ row }) => (
      <div className="min-w-44">
        <p className="font-medium">{row.original.resortName}</p>
        <p className="text-xs text-muted-foreground">{row.original.tenantName}</p>
      </div>
    ),
  },
  {
    accessorKey: "financeStatus",
    header: ({ column }) => sortableHeader("Finance Status", column),
    cell: ({ row }) => (
      <Badge className={financeStatusClasses[row.original.financeStatus]} variant="outline">
        {row.original.financeStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "paymentHealth",
    header: ({ column }) => sortableHeader("Payment", column),
    cell: ({ row }) => (
      <Badge className={paymentHealthClasses[row.original.paymentHealth]} variant="outline">
        {row.original.paymentHealth}
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
      <div className="min-w-32">
        <p className="font-medium">{currency.format(row.original.amount)}</p>
        <p className="text-xs text-muted-foreground">{row.original.dueWindow}</p>
      </div>
    ),
  },
  {
    accessorKey: "assignedTo",
    header: ({ column }) => sortableHeader("Assigned To", column),
    cell: ({ row }) => (
      <div className="max-w-53">
        <p className="font-medium">{row.original.assignedTo}</p>
        <p className="text-xs text-muted-foreground truncate">{row.original.exceptionNote}</p>
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
          <DropdownMenuLabel>Finance actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Open")}>
            Reopen item
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateStatus(row.original.id, "Pending Collection")}
          >
            Send to collection
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateStatus(row.original.id, "For Reconciliation")}
          >
            Send to reconciliation
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Payout Hold")}>
            Place payout hold
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Closed")}>
            Mark closed
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
