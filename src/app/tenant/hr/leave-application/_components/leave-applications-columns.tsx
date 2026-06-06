"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { LeaveApplication, LeaveStatus } from "./leave-applications-data";

const statusClasses: Record<LeaveStatus, string> = {
  PENDING:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  APPROVED:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  REJECTED:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
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

export const leaveApplicationsColumns: ColumnDef<LeaveApplication>[] = [
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
    accessorKey: "employee.fullName",
    header: ({ column }) => sortableHeader("Employee", column),
    cell: ({ row }) => (
      <div className="min-w-56">
        <div className="font-medium">{row.original.employee.fullName}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.employee.department || "--"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "leaveType",
    header: ({ column }) => sortableHeader("Type", column),
    cell: ({ row }) => <div className="min-w-40">{row.original.leaveType}</div>,
  },
  {
    accessorKey: "startDate",
    header: ({ column }) => sortableHeader("From", column),
    cell: ({ row }) => (
      <div className="whitespace-nowrap min-w-30">{row.original.startDate}</div>
    ),
  },
  {
    accessorKey: "endDate",
    header: ({ column }) => sortableHeader("To", column),
    cell: ({ row }) => (
      <div className="whitespace-nowrap min-w-30">{row.original.endDate}</div>
    ),
  },
  {
    accessorKey: "days",
    header: ({ column }) => sortableHeader("Days", column),
    cell: ({ row }) => <div className="min-w-16">{row.original.days}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => sortableHeader("Status", column),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn("whitespace-nowrap", statusClasses[row.original.status])}
      >
        {row.original.status === "PENDING"
          ? "Pending"
          : row.original.status === "APPROVED"
            ? "Approved"
            : "Rejected"}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "reason",
    header: "Reason",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="min-w-40 whitespace-nowrap text-sm text-muted-foreground">{row.original.reason}</div>
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
          <DropdownMenuLabel>Leave actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() =>
              navigator.clipboard.writeText(row.original.employee.fullName)
            }
          >
            Copy employee name
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Approve (coming soon)</DropdownMenuItem>
          <DropdownMenuItem disabled>Reject (coming soon)</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
