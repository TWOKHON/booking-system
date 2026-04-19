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
import { RateRecord } from "./rates-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const pricingClasses: Record<RateRecord["pricingStatus"], string> = {
  Optimized: "bg-emerald-100 text-emerald-700",
  "Needs Review": "bg-amber-100 text-amber-700",
  "Promo Live": "bg-violet-100 text-violet-700",
};

const demandClasses: Record<RateRecord["demandSignal"], string> = {
  High: "bg-emerald-100 text-emerald-700",
  Medium: "bg-blue-100 text-blue-700",
  Low: "bg-amber-100 text-amber-700",
};

type RateColumnActions = {
  onUpdatePricing: (id: string, status: RateRecord["pricingStatus"]) => void;
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

export const getRateColumns = ({
  onUpdatePricing,
  onTogglePriority,
}: RateColumnActions): ColumnDef<RateRecord>[] => [
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
    accessorKey: "roomName",
    header: ({ column }) => sortableHeader("Room", column),
    cell: ({ row }) => (
      <div className="min-w-45">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.roomName}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">{row.original.id}</p>
      </div>
    ),
  },
  {
    accessorKey: "resortName",
    header: ({ column }) => sortableHeader("Resort", column),
    cell: ({ row }) => (
      <div className="min-w-48">
        <p className="font-medium">{row.original.resortName}</p>
        <p className="text-xs text-muted-foreground">{row.original.tenantName}</p>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => sortableHeader("Category", column),
    cell: ({ row }) => (
      <div className="min-w-35">
        <p className="font-medium">{row.original.category}</p>
        <p className="text-xs text-muted-foreground">Promo: {row.original.promoRate > 0 ? currency.format(row.original.promoRate) : "None"}</p>
      </div>
    ), 
  },
  {
    accessorKey: "baseRate",
    header: ({ column }) => sortableHeader("Base", column),
    cell: ({ row }) => currency.format(row.original.baseRate),
  },
  {
    accessorKey: "weekendRate",
    header: ({ column }) => sortableHeader("Weekend", column),
    cell: ({ row }) => currency.format(row.original.weekendRate),
  },
  {
    accessorKey: "channelRate",
    header: ({ column }) => sortableHeader("Channel", column),
    cell: ({ row }) => currency.format(row.original.channelRate),
  },
  {
    accessorKey: "pricingStatus",
    header: ({ column }) => sortableHeader("Pricing", column),
    cell: ({ row }) => (
      <Badge className={pricingClasses[row.original.pricingStatus]} variant="outline">
        {row.original.pricingStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "demandSignal",
    header: ({ column }) => sortableHeader("Demand", column),
    cell: ({ row }) => (
      <Badge className={demandClasses[row.original.demandSignal]} variant="outline">
        {row.original.demandSignal}
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
          <DropdownMenuLabel>Rate actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onUpdatePricing(row.original.id, "Optimized")}
          >
            Mark optimized
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdatePricing(row.original.id, "Promo Live")}
          >
            Launch promo
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdatePricing(row.original.id, "Needs Review")}
          >
            Flag review
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
