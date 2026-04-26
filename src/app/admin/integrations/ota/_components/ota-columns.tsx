"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OtaIntegrationRecord } from "./ota-data";

const integrationStatusClasses: Record<OtaIntegrationRecord["integrationStatus"], string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Review: "bg-amber-100 text-amber-700",
  Sandbox: "bg-blue-100 text-blue-700",
  Paused: "bg-slate-100 text-slate-700",
};

const syncHealthClasses: Record<OtaIntegrationRecord["syncHealth"], string> = {
  Healthy: "bg-emerald-100 text-emerald-700",
  Watch: "bg-amber-100 text-amber-700",
  Delayed: "bg-rose-100 text-rose-700",
};

type OtaColumnActions = {
  onUpdateStatus: (id: string, status: OtaIntegrationRecord["integrationStatus"]) => void;
  onTogglePriority: (id: string) => void;
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

export const getOtaColumns = ({
  onUpdateStatus,
  onTogglePriority,
}: OtaColumnActions): ColumnDef<OtaIntegrationRecord>[] => [
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
    accessorKey: "providerName",
    header: ({ column }) => sortableHeader("Provider", column),
    cell: ({ row }) => (
      <div className="min-w-44">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.providerName}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">{row.original.channelType}</p>
      </div>
    ),
  },
  {
    accessorKey: "integrationStatus",
    header: ({ column }) => sortableHeader("Status", column),
    cell: ({ row }) => (
      <Badge
        className={integrationStatusClasses[row.original.integrationStatus]}
        variant="outline"
      >
        {row.original.integrationStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "syncHealth",
    header: ({ column }) => sortableHeader("Sync", column),
    cell: ({ row }) => (
      <Badge className={syncHealthClasses[row.original.syncHealth]} variant="outline">
        {row.original.syncHealth}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "mappedResorts",
    header: ({ column }) => sortableHeader("Coverage", column),
    cell: ({ row }) => (
      <div className="min-w-36">
        <p className="font-medium">{row.original.mappedResorts} resorts</p>
        <p className="text-xs text-muted-foreground">{row.original.syncWindow}</p>
      </div>
    ),
  },
  {
    accessorKey: "reservationVolume",
    header: ({ column }) => sortableHeader("Reservations", column),
    cell: ({ row }) => (
      <div className="min-w-32">
        <p className="font-medium">
          {row.original.reservationVolume.toLocaleString("en-PH")}
        </p>
        <p className="text-xs text-muted-foreground">{row.original.commissionModel}</p>
      </div>
    ),
  },
  {
    accessorKey: "assignedTo",
    header: ({ column }) => sortableHeader("Assigned To", column),
    cell: ({ row }) => (
      <div className="max-w-56">
        <p className="font-medium">{row.original.assignedTo}</p>
        <p className="truncate text-xs text-muted-foreground">{row.original.note}</p>
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
          <DropdownMenuLabel>OTA actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Active")}>
            Mark active
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Review")}>
            Send to review
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Sandbox")}>
            Move to sandbox
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Paused")}>
            Pause integration
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
