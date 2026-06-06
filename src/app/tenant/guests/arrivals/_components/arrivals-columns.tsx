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
import type {
  ArrivalGuest,
  ArrivalStatus,
  RoomReadiness,
} from "./arrivals-data";

const statusClasses: Record<ArrivalStatus, string> = {
  "Due In": "border-blue-200 bg-blue-50 text-blue-700",
  Arrived: "border-green-200 bg-green-50 text-green-700",
  Early: "border-cyan-200 bg-cyan-50 text-cyan-700",
  Delayed: "border-amber-200 bg-amber-50 text-amber-700",
  VIP: "border-violet-200 bg-violet-50 text-violet-700",
};

const readinessClasses: Record<RoomReadiness, string> = {
  Ready: "border-green-200 bg-green-50 text-green-700",
  Inspecting: "border-blue-200 bg-blue-50 text-blue-700",
  Dirty: "border-amber-200 bg-amber-50 text-amber-700",
  Blocked: "border-red-200 bg-red-50 text-red-700",
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

export function createArrivalsColumns({
  onStartCheckIn,
  onMessageGuest,
  onCopyReservation,
}: {
  onStartCheckIn: (arrival: ArrivalGuest) => void;
  onMessageGuest: (arrival: ArrivalGuest) => void;
  onCopyReservation: (arrival: ArrivalGuest) => void;
}): ColumnDef<ArrivalGuest>[] {
  return [
  {
    accessorKey: "guestName",
    header: ({ column }) => sortableHeader("Guest", column),
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.guestName}</p>
        <p className="text-xs text-muted-foreground">
          {row.original.reservationCode}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "room",
    header: ({ column }) => sortableHeader("Room", column),
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        <p className="font-medium">{row.original.room}</p>
        <p className="text-xs text-muted-foreground">{row.original.roomType}</p>
      </div>
    ),
  },
  {
    accessorKey: "arrivalTime",
    header: ({ column }) => sortableHeader("Arrival", column),
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.arrivalTime}</span>
    ),
  },
  {
    accessorKey: "party",
    header: "Party",
    enableSorting: false,
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
    accessorKey: "roomReadiness",
    header: ({ column }) => sortableHeader("Room readiness", column),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          "whitespace-nowrap",
          readinessClasses[row.original.roomReadiness],
        )}
      >
        {row.original.roomReadiness}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) => sortableHeader("Balance", column),
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium">{row.original.balance}</span>
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
            <span className="sr-only">Open arrival actions</span>
          </Button>
        </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{row.original.reservationCode}</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onStartCheckIn(row.original)}>
            Start check-in
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onMessageGuest(row.original)}>
            Message guest
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onCopyReservation(row.original)}>
            Copy confirmation code
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  ];
}
