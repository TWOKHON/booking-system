"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { HousekeepingRoom, RoomStatus } from "./housekeeping-data";

const statusClasses: Record<RoomStatus, string> = {
  Clean:
    "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300",
  "Occupied (Dirty)":
    "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950 dark:text-orange-300",
  "Vacant (Dirty)":
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  "Out of Order":
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300",
  "Out of Service":
    "border-zinc-300 bg-zinc-100 text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300",
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

export const createHousekeepingColumns = ({
  onMarkClean,
}: {
  onMarkClean: (room: HousekeepingRoom) => void;
}): ColumnDef<HousekeepingRoom>[] => [
  {
    accessorKey: "roomType",
    header: ({ column }) => sortableHeader("Room Type", column),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => sortableHeader("Status", column),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn("whitespace-nowrap", statusClasses[row.original.status])}
      >
        {row.original.status}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "occupancy",
    header: ({ column }) => sortableHeader("Occupancy", column),
  },
  {
    accessorKey: "assignedTo",
    header: ({ column }) => sortableHeader("Assigned To", column),
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.assignedTo}</span>
    ),
  },
  {
    accessorKey: "lastCleaned",
    header: ({ column }) => sortableHeader("Last Cleaned", column),
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.lastCleaned}</span>
    ),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="min-w-36 text-sm text-muted-foreground">
        {row.original.notes}
      </span>
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
            <MoreVertical className="size-4" />
            <span className="sr-only">Open room actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>Room actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.roomNo)}
          >
            Copy room number
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Assign housekeeper</DropdownMenuItem>
          <DropdownMenuItem onClick={() => onMarkClean(row.original)}>
            Mark clean
          </DropdownMenuItem>
          <DropdownMenuItem>Open inspection</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
