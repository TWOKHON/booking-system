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
import { HousekeepingRecord } from "./housekeeping-data";

const housekeepingStatusClasses: Record<HousekeepingRecord["housekeepingStatus"], string> = {
  Queued: "bg-slate-100 text-slate-700",
  Cleaning: "bg-amber-100 text-amber-700",
  Inspection: "bg-blue-100 text-blue-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Blocked: "bg-rose-100 text-rose-700",
};

const readinessStatusClasses: Record<HousekeepingRecord["readinessStatus"], string> = {
  Ready: "bg-emerald-100 text-emerald-700",
  "Not Ready": "bg-rose-100 text-rose-700",
  "Awaiting Inspection": "bg-blue-100 text-blue-700",
};

const occupancyClasses: Record<HousekeepingRecord["occupancyContext"], string> = {
  "Arrival Today": "bg-violet-100 text-violet-700",
  "In House": "bg-sky-100 text-sky-700",
  "Checkout Due": "bg-amber-100 text-amber-700",
  Vacant: "bg-slate-100 text-slate-700",
};

type HousekeepingColumnActions = {
  onUpdateStatus: (id: string, status: HousekeepingRecord["housekeepingStatus"]) => void;
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

export const getHousekeepingColumns = ({
  onUpdateStatus,
  onTogglePriority,
}: HousekeepingColumnActions): ColumnDef<HousekeepingRecord>[] => [
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
      <div className="min-w-44">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.roomName}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          {row.original.roomCategory} · {row.original.serviceType}
        </p>
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
    accessorKey: "housekeepingStatus",
    header: ({ column }) => sortableHeader("Task Status", column),
    cell: ({ row }) => (
      <Badge
        className={housekeepingStatusClasses[row.original.housekeepingStatus]}
        variant="outline"
      >
        {row.original.housekeepingStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "readinessStatus",
    header: ({ column }) => sortableHeader("Readiness", column),
    cell: ({ row }) => (
      <Badge className={readinessStatusClasses[row.original.readinessStatus]} variant="outline">
        {row.original.readinessStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "occupancyContext",
    header: ({ column }) => sortableHeader("Context", column),
    cell: ({ row }) => (
      <div className="min-w-32">
        <Badge className={occupancyClasses[row.original.occupancyContext]} variant="outline">
          {row.original.occupancyContext}
        </Badge>
        <p className="mt-1 text-xs text-muted-foreground">{row.original.dueWindow}</p>
      </div>
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
      <div className="min-w-32">
        <p className="font-medium">{row.original.assignedTo}</p>
        <p className="text-xs text-muted-foreground">{row.original.blocker}</p>
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
          <DropdownMenuLabel>Housekeeping actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Queued")}>
            Move to queue
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Cleaning")}>
            Mark cleaning
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Inspection")}>
            Send to inspection
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Completed")}>
            Mark completed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Blocked")}>
            Mark blocked
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
