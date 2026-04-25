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
import { HrRecord } from "./hr-data";

const workforceStatusClasses: Record<HrRecord["workforceStatus"], string> = {
  "On Shift": "bg-emerald-100 text-emerald-700",
  Late: "bg-amber-100 text-amber-700",
  "Off Duty": "bg-slate-100 text-slate-700",
  Leave: "bg-blue-100 text-blue-700",
  "Open Role": "bg-rose-100 text-rose-700",
};

const staffingRiskClasses: Record<HrRecord["staffingRisk"], string> = {
  Stable: "bg-emerald-100 text-emerald-700",
  Watch: "bg-amber-100 text-amber-700",
  Critical: "bg-rose-100 text-rose-700",
};

const attendanceClasses: Record<HrRecord["attendanceStatus"], string> = {
  Present: "bg-emerald-100 text-emerald-700",
  Late: "bg-amber-100 text-amber-700",
  Leave: "bg-blue-100 text-blue-700",
  Vacant: "bg-slate-100 text-slate-700",
};

type HrColumnActions = {
  onUpdateStatus: (id: string, status: HrRecord["workforceStatus"]) => void;
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

export const getHrColumns = ({
  onUpdateStatus,
  onTogglePriority,
}: HrColumnActions): ColumnDef<HrRecord>[] => [
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
    accessorKey: "employeeName",
    header: ({ column }) => sortableHeader("Employee", column),
    cell: ({ row }) => (
      <div className="min-w-44">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.employeeName}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          {row.original.roleTitle} · {row.original.department}
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
    accessorKey: "workforceStatus",
    header: ({ column }) => sortableHeader("Workforce", column),
    cell: ({ row }) => (
      <Badge className={workforceStatusClasses[row.original.workforceStatus]} variant="outline">
        {row.original.workforceStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "staffingRisk",
    header: ({ column }) => sortableHeader("Risk", column),
    cell: ({ row }) => (
      <Badge className={staffingRiskClasses[row.original.staffingRisk]} variant="outline">
        {row.original.staffingRisk}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "attendanceStatus",
    header: ({ column }) => sortableHeader("Attendance", column),
    cell: ({ row }) => (
      <div className="min-w-32">
        <Badge className={attendanceClasses[row.original.attendanceStatus]} variant="outline">
          {row.original.attendanceStatus}
        </Badge>
        <p className="mt-1 text-xs text-muted-foreground">{row.original.shiftWindow}</p>
      </div>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "assignedManager",
    header: ({ column }) => sortableHeader("Assigned Manager", column),
    cell: ({ row }) => (
      <div className="min-w-32">
        <p className="font-medium">{row.original.assignedManager}</p>
        <p className="text-xs text-muted-foreground">{row.original.hrNote}</p>
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
          <DropdownMenuLabel>HR actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "On Shift")}>
            Mark on shift
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Late")}>
            Flag late arrival
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Leave")}>
            Mark on leave
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Open Role")}>
            Mark open role
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Off Duty")}>
            Mark off duty
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
