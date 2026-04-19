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
import { ResortRecord } from "./resorts-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const operationsClasses: Record<ResortRecord["operationsStatus"], string> = {
  Stable: "bg-emerald-100 text-emerald-700",
  Busy: "bg-blue-100 text-blue-700",
  Attention: "bg-amber-100 text-amber-700",
};

const setupClasses: Record<ResortRecord["setupStatus"], string> = {
  Live: "bg-emerald-100 text-emerald-700",
  Launching: "bg-blue-100 text-blue-700",
  "Needs Review": "bg-amber-100 text-amber-700",
};

type ResortColumnActions = {
  onUpdateOperations: (id: string, status: ResortRecord["operationsStatus"]) => void;
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

export const getResortColumns = ({
  onUpdateOperations,
  onTogglePriority,
}: ResortColumnActions): ColumnDef<ResortRecord>[] => [
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
    accessorKey: "resortName",
    header: ({ column }) => sortableHeader("Resort", column),
    cell: ({ row }) => (
      <div className="min-w-56">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.resortName}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">{row.original.id}</p>
      </div>
    ),
  },
  {
    accessorKey: "tenantName",
    header: ({ column }) => sortableHeader("Tenant", column),
    cell: ({ row }) => (
      <div className="min-w-48">
        <p className="font-medium">{row.original.tenantName}</p>
        <p className="text-xs text-muted-foreground">{row.original.ownerName}</p>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: ({ column }) => sortableHeader("Location", column),
    cell: ({ row }) => (
      <div className="min-w-35">
        <p className="font-medium">{row.original.location}</p>
        <p className="text-xs text-muted-foreground">Units: {row.original.units}</p>
      </div>
    ),
  },
  {
    accessorKey: "occupancyRate",
    header: ({ column }) => sortableHeader("Occupancy", column),
    cell: ({ row }) => (
      <div className="min-w-30">
        <p className="font-medium">{row.original.occupancyRate}%</p>
        <p className="text-xs text-muted-foreground">Bookings: {row.original.activeBookings}</p>
      </div>
    ),
  },
  {
    accessorKey: "monthlyRevenue",
    header: ({ column }) => sortableHeader("Revenue", column),
    cell: ({ row }) => currency.format(row.original.monthlyRevenue),
  },
  {
    accessorKey: "operationsStatus",
    header: ({ column }) => sortableHeader("Operations", column),
    cell: ({ row }) => (
      <Badge className={operationsClasses[row.original.operationsStatus]} variant="outline">
        {row.original.operationsStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "setupStatus",
    header: ({ column }) => sortableHeader("Setup", column),
    cell: ({ row }) => (
      <Badge className={setupClasses[row.original.setupStatus]} variant="outline">
        {row.original.setupStatus}
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
          <DropdownMenuLabel>Resort actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onUpdateOperations(row.original.id, "Stable")}
          >
            Mark stable
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateOperations(row.original.id, "Busy")}
          >
            Mark busy
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateOperations(row.original.id, "Attention")}
          >
            Flag attention
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
