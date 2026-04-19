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
import { ActiveClient } from "./active-clients-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const statusClasses: Record<ActiveClient["subscriptionStatus"], string> = {
  Healthy: "bg-emerald-100 text-emerald-700",
  "At Risk": "bg-amber-100 text-amber-700",
};

const planClasses: Record<ActiveClient["plan"], string> = {
  Starter: "bg-slate-100 text-slate-700",
  Growth: "bg-violet-100 text-violet-700",
  Enterprise: "bg-emerald-100 text-emerald-700",
};

const supportClasses: Record<ActiveClient["supportTier"], string> = {
  Standard: "bg-slate-100 text-slate-700",
  Priority: "bg-blue-100 text-blue-700",
  Dedicated: "bg-violet-100 text-violet-700",
};

type ActiveClientColumnActions = {
  onUpdateStatus: (id: string, status: ActiveClient["subscriptionStatus"]) => void;
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

export const getActiveClientColumns = ({
  onUpdateStatus,
  onTogglePriority,
}: ActiveClientColumnActions): ColumnDef<ActiveClient>[] => [
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
    accessorKey: "plan",
    header: ({ column }) => sortableHeader("Plan", column),
    cell: ({ row }) => (
      <Badge className={planClasses[row.original.plan]} variant="outline">
        {row.original.plan}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "subscriptionStatus",
    header: ({ column }) => sortableHeader("Subscription", column),
    cell: ({ row }) => (
      <Badge className={statusClasses[row.original.subscriptionStatus]} variant="outline">
        {row.original.subscriptionStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "billingCycle",
    header: ({ column }) => sortableHeader("Billing", column),
  },
  {
    accessorKey: "monthlyRevenue",
    header: ({ column }) => sortableHeader("MRR", column),
    cell: ({ row }) => currency.format(row.original.monthlyRevenue),
  },
  {
    accessorKey: "renewalDate",
    header: ({ column }) => sortableHeader("Renewal", column),
  },
  {
    accessorKey: "supportTier",
    header: ({ column }) => sortableHeader("Support", column),
    cell: ({ row }) => (
      <Badge className={supportClasses[row.original.supportTier]} variant="outline">
        {row.original.supportTier}
      </Badge>
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
          <DropdownMenuLabel>Subscription actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.ownerEmail)}
          >
            Copy billing contact
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onUpdateStatus(row.original.id, "Healthy")}
          >
            Mark healthy
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateStatus(row.original.id, "At Risk")}
          >
            Flag for review
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
