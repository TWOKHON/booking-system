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
import { SuspendedClient } from "./suspended-clients-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const reviewClasses: Record<SuspendedClient["reviewStatus"], string> = {
  "Pending Review": "bg-amber-100 text-amber-700",
  Resolved: "bg-emerald-100 text-emerald-700",
  Escalated: "bg-rose-100 text-rose-700",
};

const reasonClasses: Record<SuspendedClient["suspensionReason"], string> = {
  "Failed Billing": "bg-rose-100 text-rose-700",
  "Policy Review": "bg-amber-100 text-amber-700",
  "Owner Request": "bg-blue-100 text-blue-700",
  "Inactive Account": "bg-slate-100 text-slate-700",
};

type SuspendedColumnActions = {
  onUpdateReview: (id: string, status: SuspendedClient["reviewStatus"]) => void;
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

export const getSuspendedClientColumns = ({
  onUpdateReview,
  onTogglePriority,
}: SuspendedColumnActions): ColumnDef<SuspendedClient>[] => [
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
      <div className="min-w-52.5">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.tenantName}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">{row.original.id}</p>
      </div>
    ),
  },
  {
    accessorKey: "ownerName",
    header: ({ column }) => sortableHeader("Owner", column),
    cell: ({ row }) => (
      <div className="min-w-50">
        <p className="font-medium">{row.original.ownerName}</p>
        <p className="text-xs text-muted-foreground">{row.original.ownerEmail}</p>
      </div>
    ),
  },
  {
    accessorKey: "suspensionReason",
    header: ({ column }) => sortableHeader("Reason", column),
    cell: ({ row }) => (
      <Badge className={reasonClasses[row.original.suspensionReason]} variant="outline">
        {row.original.suspensionReason}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "suspendedSince",
    header: ({ column }) => sortableHeader("Suspended Since", column),
  },
  {
    accessorKey: "balanceDue",
    header: ({ column }) => sortableHeader("Balance Due", column),
    cell: ({ row }) => currency.format(row.original.balanceDue),
  },
  {
    accessorKey: "reviewStatus",
    header: ({ column }) => sortableHeader("Review Status", column),
    cell: ({ row }) => (
      <Badge className={reviewClasses[row.original.reviewStatus]} variant="outline">
        {row.original.reviewStatus}
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
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Suspension actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.ownerEmail)}
          >
            Copy contact email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onUpdateReview(row.original.id, "Pending Review")}
          >
            Set pending review
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateReview(row.original.id, "Resolved")}
          >
            Mark resolved
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateReview(row.original.id, "Escalated")}
          >
            Escalate case
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
