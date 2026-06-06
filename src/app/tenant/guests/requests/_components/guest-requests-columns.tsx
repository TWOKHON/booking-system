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
import {
  requestTypeMeta,
  type GuestRequest,
  type GuestRequestPriority,
  type GuestRequestStatus,
} from "./guest-requests-data";

const statusClasses: Record<GuestRequestStatus, string> = {
  New: "border-blue-200 bg-blue-50 text-blue-700",
  Acknowledged: "border-zinc-200 bg-zinc-50 text-zinc-700",
  "In Progress": "border-amber-200 bg-amber-50 text-amber-700",
  Completed: "border-green-200 bg-green-50 text-green-700",
  Escalated: "border-red-200 bg-red-50 text-red-700",
};

const priorityClasses: Record<GuestRequestPriority, string> = {
  Low: "border-green-200 bg-green-50 text-green-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  High: "border-red-200 bg-red-50 text-red-700",
  Urgent: "border-red-300 bg-red-100 text-red-800",
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

export function createGuestRequestsColumns({
  onCopyRequest,
  onUpdateStatus,
}: {
  onCopyRequest: (request: GuestRequest) => void;
  onUpdateStatus: (request: GuestRequest, status: GuestRequestStatus) => void;
}): ColumnDef<GuestRequest>[] {
  return [
  {
    accessorKey: "requestNumber",
    header: ({ column }) => sortableHeader("Request", column),
    cell: ({ row }) => (
      <div>
        <p className="font-semibold text-green-700">
          {row.original.requestNumber}
        </p>
        <p className="text-xs text-muted-foreground">
          {row.original.requestedAt}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "guestName",
    header: ({ column }) => sortableHeader("Guest", column),
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.guestName}</p>
        <p className="text-xs text-muted-foreground">
          Room {row.original.room}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => sortableHeader("Type", column),
    cell: ({ row }) => {
      const meta = requestTypeMeta[row.original.type];
      const Icon = meta.icon;

      return (
        <span className="inline-flex items-center gap-2 whitespace-nowrap">
          <span
            className={cn(
              "grid size-7 place-items-center rounded-full",
              meta.badge,
            )}
          >
            <Icon className="size-3.5" />
          </span>
          {row.original.type}
        </span>
      );
    },
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => sortableHeader("Request detail", column),
    cell: ({ row }) => (
      <div className=" ">
        <p className="font-medium">{row.original.title}</p>
        <p className="mt-1 text-xs max-w-50 truncate text-muted-foreground">
          {row.original.detail}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: ({ column }) => sortableHeader("Priority", column),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          "whitespace-nowrap",
          priorityClasses[row.original.priority],
        )}
      >
        {row.original.priority}
      </Badge>
    ),
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
    accessorKey: "assignedTo",
    header: ({ column }) => sortableHeader("Assigned to", column),
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-2 whitespace-nowrap">
        <span className="grid size-7 place-items-center rounded-full bg-muted text-xs font-medium">
          {row.original.initials}
        </span>
        {row.original.assignedTo}
      </span>
    ),
  },
  {
    accessorKey: "dueBy",
    header: ({ column }) => sortableHeader("Due by", column),
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.dueBy}</span>
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
            <span className="sr-only">Open guest request actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>{row.original.requestNumber}</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onUpdateStatus(row.original, "Acknowledged")}
          >
            Acknowledge request
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateStatus(row.original, "In Progress")}
          >
            Start work
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateStatus(row.original, "Completed")}
          >
            Mark completed
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateStatus(row.original, "Escalated")}
          >
            Escalate
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onCopyRequest(row.original)}>
            Copy request ID
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  ];
}
