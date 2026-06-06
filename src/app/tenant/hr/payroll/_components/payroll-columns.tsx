"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
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
import { cn } from "@/lib/utils";
import type { PayrollRow, PayrollStatus } from "./payroll-data";

const statusClasses: Record<PayrollStatus, string> = {
  READY:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  NEEDS_REVIEW:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-300",
  BLOCKED:
    "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950 dark:text-rose-300",
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

type PayrollColumnActions = {
  onOpenPayslip: (row: PayrollRow) => void;
};

export const getPayrollColumns = ({
  onOpenPayslip,
}: PayrollColumnActions): ColumnDef<PayrollRow>[] => [
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
      <div className="min-w-40">
        <div className="font-medium">{row.original.employee.fullName}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.employee.department || "--"}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "employee.defaultShift",
    header: ({ column }) => sortableHeader("Shift", column),
    cell: ({ row }) => (
      <div className="min-w-25 whitespace-nowrap">
        {row.original.employee.defaultShift || "--"}
      </div>
    ),
  },
  {
    accessorKey: "employee.hourlyRateCents",
    header: ({ column }) => sortableHeader("Rate", column),
    cell: ({ row }) => (
      <div className="min-w-20 whitespace-nowrap">
        {row.original.employee.hourlyRateCents != null
          ? `PHP ${(row.original.employee.hourlyRateCents / 100).toFixed(2)}`
          : "--"}
      </div>
    ),
  },
  {
    accessorKey: "regularMinutes",
    header: ({ column }) => sortableHeader("Regular", column),
    cell: ({ row }) => (
      <div className="min-w-20 whitespace-nowrap">
        {(row.original.regularMinutes / 60).toFixed(2)}h
      </div>
    ),
  },
  {
    accessorKey: "overtimeMinutes",
    header: ({ column }) => sortableHeader("OT/UT", column),
    cell: ({ row }) => (
      <div className="min-w-20 whitespace-nowrap">
        <p>{(row.original.overtimeMinutes / 60).toFixed(2)}h</p>
        <p className="text-xs text-muted-foreground">
          Undertime: {(row.original.undertimeMinutes / 60).toFixed(2)}h
        </p>
      </div>
    ),
  },
  {
    accessorKey: "holidayMinutes",
    header: ({ column }) => sortableHeader("Holiday", column),
    cell: ({ row }) => (
      <div className="min-w-20 whitespace-nowrap">
        {(row.original.holidayMinutes / 60).toFixed(2)}h
      </div>
    ),
  },
  {
    accessorKey: "grossPayCents",
    header: ({ column }) => sortableHeader("Gross", column),
    cell: ({ row }) => (
      <div className="min-w-24 whitespace-nowrap">
        PHP {(row.original.grossPayCents / 100).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "deductionsCents",
    header: ({ column }) => sortableHeader("Deductions", column),
    cell: ({ row }) => (
      <div className="min-w-24 whitespace-nowrap">
        PHP {(row.original.deductionsCents / 100).toFixed(2)}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => sortableHeader("Status", column),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn("whitespace-nowrap", statusClasses[row.original.status])}
      >
        {row.original.status === "READY"
          ? "Ready"
          : row.original.status === "NEEDS_REVIEW"
            ? "Needs review"
            : "Blocked"}
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
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Payroll actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.employee.fullName)}
          >
            Copy employee name
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onOpenPayslip(row.original)}>
            Open payslip
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
