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
import { MaintenanceRecord } from "./maintenance-data";

const statusClasses: Record<MaintenanceRecord["maintenanceStatus"], string> = {
  Open: "bg-slate-100 text-slate-700",
  "In Progress": "bg-amber-100 text-amber-700",
  "Awaiting Parts": "bg-violet-100 text-violet-700",
  "For Verification": "bg-blue-100 text-blue-700",
  Resolved: "bg-emerald-100 text-emerald-700",
};

const severityClasses: Record<MaintenanceRecord["severity"], string> = {
  Low: "bg-slate-100 text-slate-700",
  Medium: "bg-blue-100 text-blue-700",
  High: "bg-amber-100 text-amber-700",
  Critical: "bg-rose-100 text-rose-700",
};

const impactClasses: Record<MaintenanceRecord["roomImpact"], string> = {
  Sellable: "bg-emerald-100 text-emerald-700",
  Limited: "bg-amber-100 text-amber-700",
  "Out of Order": "bg-rose-100 text-rose-700",
};

type MaintenanceColumnActions = {
  onUpdateStatus: (id: string, status: MaintenanceRecord["maintenanceStatus"]) => void;
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

export const getMaintenanceColumns = ({
  onUpdateStatus,
  onTogglePriority,
}: MaintenanceColumnActions): ColumnDef<MaintenanceRecord>[] => [
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
          {row.original.issueCategory} · {row.original.workOrderType}
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
    accessorKey: "maintenanceStatus",
    header: ({ column }) => sortableHeader("Work Order Status", column),
    cell: ({ row }) => (
      <Badge className={statusClasses[row.original.maintenanceStatus]} variant="outline">
        {row.original.maintenanceStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "severity",
    header: ({ column }) => sortableHeader("Severity", column),
    cell: ({ row }) => (
      <Badge className={severityClasses[row.original.severity]} variant="outline">
        {row.original.severity}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "roomImpact",
    header: ({ column }) => sortableHeader("Room Impact", column),
    cell: ({ row }) => (
      <div className="min-w-32">
        <Badge className={impactClasses[row.original.roomImpact]} variant="outline">
          {row.original.roomImpact}
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
          <DropdownMenuLabel>Maintenance actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Open")}>
            Reopen ticket
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "In Progress")}>
            Start work
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateStatus(row.original.id, "Awaiting Parts")}
          >
            Await parts
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateStatus(row.original.id, "For Verification")}
          >
            Send for verification
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Resolved")}>
            Mark resolved
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
