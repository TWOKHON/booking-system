"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical } from "lucide-react";
import Link from "next/link";
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
  maintenanceTypeMeta,
  type MaintenancePriority,
  type MaintenanceRequest,
  type MaintenanceStatus,
} from "./maintenance-data";

const statusClasses: Record<MaintenanceStatus, string> = {
  Draft: "border-zinc-300 bg-zinc-100 text-zinc-700",
  Open: "border-blue-200 bg-blue-50 text-blue-700",
  "In Progress": "border-amber-200 bg-amber-50 text-amber-700",
  Completed: "border-green-200 bg-green-50 text-green-700",
  Overdue: "border-red-200 bg-red-50 text-red-700",
};

const priorityClasses: Record<MaintenancePriority, string> = {
  Low: "border-green-200 bg-green-50 text-green-700",
  Medium: "border-amber-200 bg-amber-50 text-amber-700",
  High: "border-red-200 bg-red-50 text-red-700",
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

export const maintenanceColumns: ColumnDef<MaintenanceRequest>[] = [
  {
    accessorKey: "requestNumber",
    header: ({ column }) => sortableHeader("Request ID", column),
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-semibold text-green-700">
        {row.original.requestNumber}
      </span>
    ),
  },
  {
    accessorKey: "reportedAt",
    header: ({ column }) => sortableHeader("Date reported", column),
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm">{row.original.reportedAt}</span>
    ),
  },
  {
    accessorKey: "roomArea",
    header: ({ column }) => sortableHeader("Room / Area", column),
  },
  {
    accessorKey: "type",
    header: ({ column }) => sortableHeader("Type", column),
    cell: ({ row }) => {
      const meta = maintenanceTypeMeta[row.original.type];
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
    header: ({ column }) => sortableHeader("Title", column),
  },
  {
    accessorKey: "priority",
    header: ({ column }) => sortableHeader("Priority", column),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn("whitespace-nowrap", priorityClasses[row.original.priority])}
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
    accessorKey: "assignee",
    header: ({ column }) => sortableHeader("Assignee", column),
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-2 whitespace-nowrap">
        <span className="grid size-7 place-items-center rounded-full bg-muted text-xs font-medium">
          {row.original.initials}
        </span>
        {row.original.assignee}
      </span>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "dueDate",
    header: ({ column }) => sortableHeader("Due date", column),
    cell: ({ row }) => (
      <span className="whitespace-nowrap text-sm">{row.original.dueDate}</span>
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
            <span className="sr-only">Open request actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>{row.original.requestNumber}</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/tenant/operations/maintenance/${row.original.id}`}>
              Open request
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Assign technician</DropdownMenuItem>
          <DropdownMenuItem>Update status</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Copy request ID</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
