"use client";

import * as React from "react";
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
import type { AttendanceRecord, AttendanceStatus } from "./attendance-data";

const statusClasses: Record<AttendanceStatus, string> = {
  Present:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  Late:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  "On Leave":
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900 dark:bg-sky-950 dark:text-sky-300",
  Absent:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
};

type AttendanceColumnActions = {
  onUpdateStatus?: (id: string, status: AttendanceStatus) => void;
  onRemove?: (id: string) => void;
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

export const getAttendanceColumns = ({
  onUpdateStatus,
  onRemove,
}: AttendanceColumnActions): ColumnDef<AttendanceRecord>[] => [
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
    accessorKey: "date",
    header: ({ column }) => sortableHeader("Date", column),
    cell: ({ row }) => (
      <div className="min-w-28 whitespace-nowrap text-sm">
        {row.original.date}
      </div>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "employee",
    header: ({ column }) => sortableHeader("Employee", column),
    cell: ({ row }) => (
      <div className="min-w-40">
        <div className="font-medium">{row.original.employee}</div>
        <div className="text-xs text-muted-foreground">{row.original.role}</div>
      </div>
    ),
  },
  {
    accessorKey: "department",
    header: ({ column }) => sortableHeader("Department", column),
    cell: ({ row }) => <div className="min-w-40">{row.original.department}</div>,
  },
  {
    accessorKey: "shift",
    header: ({ column }) => sortableHeader("Shift", column),
    cell: ({ row }) => (
      <div className="min-w-44 whitespace-nowrap">{row.original.shift}</div>
    ),
  },
  {
    accessorKey: "checkIn",
    header: ({ column }) => sortableHeader("Check In", column),
  },
  {
    accessorKey: "checkOut",
    header: ({ column }) => sortableHeader("Check Out", column),
  },
  {
    accessorKey: "hours",
    header: ({ column }) => sortableHeader("Hours", column),
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
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>Attendance actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.employee)}
          >
            Copy employee name
          </DropdownMenuItem>
          {onUpdateStatus ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onUpdateStatus(row.original.id, "Present")}
              >
                Mark present
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Late")}>
                Mark late
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onUpdateStatus(row.original.id, "On Leave")}
              >
                Mark on leave
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onUpdateStatus(row.original.id, "Absent")}
              >
                Mark absent
              </DropdownMenuItem>
            </>
          ) : null}
          {onRemove ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-rose-600 focus:text-rose-600"
                onClick={() => onRemove(row.original.id)}
              >
                Remove employee row
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
