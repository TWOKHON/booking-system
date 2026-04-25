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
import { FrontdeskRecord } from "./frontdesk-data";

const queueStageClasses: Record<FrontdeskRecord["queueStage"], string> = {
  "Arrival Today": "bg-sky-100 text-sky-700",
  "Check-In Pending": "bg-violet-100 text-violet-700",
  "In House": "bg-emerald-100 text-emerald-700",
  "Checkout Due": "bg-amber-100 text-amber-700",
};

const frontdeskStatusClasses: Record<FrontdeskRecord["frontdeskStatus"], string> = {
  Ready: "bg-emerald-100 text-emerald-700",
  "Waiting Payment": "bg-amber-100 text-amber-700",
  "Room Not Ready": "bg-rose-100 text-rose-700",
  "Needs ID Review": "bg-blue-100 text-blue-700",
};

const paymentStatusClasses: Record<FrontdeskRecord["paymentStatus"], string> = {
  Settled: "bg-emerald-100 text-emerald-700",
  Partial: "bg-amber-100 text-amber-700",
  Outstanding: "bg-rose-100 text-rose-700",
};

type FrontdeskColumnActions = {
  onUpdateStatus: (id: string, status: FrontdeskRecord["frontdeskStatus"]) => void;
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

export const getFrontdeskColumns = ({
  onUpdateStatus,
  onTogglePriority,
}: FrontdeskColumnActions): ColumnDef<FrontdeskRecord>[] => [
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
    accessorKey: "guestName",
    header: ({ column }) => sortableHeader("Guest", column),
    cell: ({ row }) => (
      <div className="min-w-44">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.guestName}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          {row.original.reservationCode} · {row.original.roomName}
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
    accessorKey: "queueStage",
    header: ({ column }) => sortableHeader("Queue Stage", column),
    cell: ({ row }) => (
      <Badge className={queueStageClasses[row.original.queueStage]} variant="outline">
        {row.original.queueStage}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "frontdeskStatus",
    header: ({ column }) => sortableHeader("Front Desk Status", column),
    cell: ({ row }) => (
      <Badge
        className={frontdeskStatusClasses[row.original.frontdeskStatus]}
        variant="outline"
      >
        {row.original.frontdeskStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "paymentStatus",
    header: ({ column }) => sortableHeader("Payment", column),
    cell: ({ row }) => (
      <Badge className={paymentStatusClasses[row.original.paymentStatus]} variant="outline">
        {row.original.paymentStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "conciergeFlag",
    header: ({ column }) => sortableHeader("Guest Type", column),
    cell: ({ row }) => (
      <div className="min-w-28">
        <p className="font-medium">{row.original.conciergeFlag}</p>
        <p className="text-xs text-muted-foreground">{row.original.assignee}</p>
      </div>
    ),
  },
  {
    accessorKey: "lastUpdated",
    header: ({ column }) => sortableHeader("Last Updated", column),
    cell: ({ row }) => <span className="text-sm">{row.original.lastUpdated}</span>,
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
          <DropdownMenuLabel>Front desk actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Ready")}>
            Mark ready
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateStatus(row.original.id, "Waiting Payment")}
          >
            Flag waiting payment
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateStatus(row.original.id, "Room Not Ready")}
          >
            Flag room not ready
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateStatus(row.original.id, "Needs ID Review")}
          >
            Request ID review
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
