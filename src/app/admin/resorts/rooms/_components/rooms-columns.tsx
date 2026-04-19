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
import { RoomRecord } from "./rooms-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const occupancyClasses: Record<RoomRecord["occupancyStatus"], string> = {
  Occupied: "bg-blue-100 text-blue-700",
  Vacant: "bg-emerald-100 text-emerald-700",
  Reserved: "bg-violet-100 text-violet-700",
};

const housekeepingClasses: Record<RoomRecord["housekeepingStatus"], string> = {
  Ready: "bg-emerald-100 text-emerald-700",
  Cleaning: "bg-amber-100 text-amber-700",
  Inspection: "bg-blue-100 text-blue-700",
};

const maintenanceClasses: Record<RoomRecord["maintenanceStatus"], string> = {
  Clear: "bg-emerald-100 text-emerald-700",
  Watch: "bg-amber-100 text-amber-700",
  Issue: "bg-rose-100 text-rose-700",
};

type RoomColumnActions = {
  onUpdateHousekeeping: (id: string, status: RoomRecord["housekeepingStatus"]) => void;
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

export const getRoomColumns = ({
  onUpdateHousekeeping,
  onTogglePriority,
}: RoomColumnActions): ColumnDef<RoomRecord>[] => [
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
      <div className="min-w-40">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.roomName}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">Rate: {currency.format(row.original.rate)}</p>
      </div>
    ),
  },
  {
    accessorKey: "resortName",
    header: ({ column }) => sortableHeader("Resort", column),
    cell: ({ row }) => (
      <div className="min-w-45">
        <p className="font-medium">{row.original.resortName}</p>
        <p className="text-xs text-muted-foreground">{row.original.tenantName}</p>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: ({ column }) => sortableHeader("Category", column),
    cell: ({ row }) => (
      <div className="min-w-30">
        <p className="font-medium">{row.original.category}</p>
        <p className="text-xs text-muted-foreground">Capacity: {row.original.capacity}</p>
      </div>
    ),
  },
  {
    accessorKey: "occupancyStatus",
    header: ({ column }) => sortableHeader("Occupancy", column),
    cell: ({ row }) => (
      <Badge className={occupancyClasses[row.original.occupancyStatus]} variant="outline">
        {row.original.occupancyStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "housekeepingStatus",
    header: ({ column }) => sortableHeader("Housekeeping", column),
    cell: ({ row }) => (
      <Badge className={housekeepingClasses[row.original.housekeepingStatus]} variant="outline">
        {row.original.housekeepingStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "maintenanceStatus",
    header: ({ column }) => sortableHeader("Maintenance", column),
    cell: ({ row }) => (
      <Badge className={maintenanceClasses[row.original.maintenanceStatus]} variant="outline">
        {row.original.maintenanceStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "bookingWindow",
    header: ({ column }) => sortableHeader("Booking Window", column),
    cell: ({ row }) => (
      <div className="min-w-30">
        <p className="font-medium">{row.original.bookingWindow}</p>
        <p className="text-xs text-muted-foreground">Zone: {row.original.floorOrZone}</p>
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
          <DropdownMenuLabel>Room actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onUpdateHousekeeping(row.original.id, "Ready")}
          >
            Mark ready
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateHousekeeping(row.original.id, "Cleaning")}
          >
            Mark cleaning
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateHousekeeping(row.original.id, "Inspection")}
          >
            Send to inspection
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
