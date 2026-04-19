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
import { TrialClient } from "./trial-clients-data";

const stepClasses: Record<TrialClient["onboardingStep"], string> = {
  Setup: "bg-slate-100 text-slate-700",
  Rooms: "bg-blue-100 text-blue-700",
  Payments: "bg-amber-100 text-amber-700",
  "Launch Ready": "bg-emerald-100 text-emerald-700",
};

const usageClasses: Record<TrialClient["usageLevel"], string> = {
  High: "bg-emerald-100 text-emerald-700",
  Moderate: "bg-blue-100 text-blue-700",
  Low: "bg-amber-100 text-amber-700",
};

type TrialColumnActions = {
  onUpdateStep: (id: string, step: TrialClient["onboardingStep"]) => void;
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

export const getTrialClientColumns = ({
  onUpdateStep,
  onTogglePriority,
}: TrialColumnActions): ColumnDef<TrialClient>[] => [
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
    accessorKey: "tenantName",
    header: ({ column }) => sortableHeader("Tenant", column),
    cell: ({ row }) => (
      <div className="min-w-52.5">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.tenantName}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">{row.original.id}</p>
      </div>
    ),
  },
  {
    accessorKey: "ownerName",
    header: ({ column }) => sortableHeader("Owner", column),
    cell: ({ row }) => (
      <div className="min-w-50">
        <p className="font-medium">{row.original.ownerName}</p>
        <p className="text-xs text-muted-foreground">{row.original.ownerEmail}</p>
      </div>
    ),
  },
  {
    accessorKey: "trialEnds",
    header: ({ column }) => sortableHeader("Trial Ends", column),
  },
  {
    accessorKey: "daysRemaining",
    header: ({ column }) => sortableHeader("Days Left", column),
  },
  {
    accessorKey: "onboardingStep",
    header: ({ column }) => sortableHeader("Onboarding", column),
    cell: ({ row }) => (
      <Badge className={stepClasses[row.original.onboardingStep]} variant="outline">
        {row.original.onboardingStep}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "usageLevel",
    header: ({ column }) => sortableHeader("Usage", column),
    cell: ({ row }) => (
      <Badge className={usageClasses[row.original.usageLevel]} variant="outline">
        {row.original.usageLevel}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "properties",
    header: ({ column }) => sortableHeader("Properties", column),
  },
  {
    accessorKey: "lastActivity",
    header: ({ column }) => sortableHeader("Last Active", column),
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
          <DropdownMenuLabel>Trial actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(row.original.ownerEmail)}
          >
            Copy contact email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onUpdateStep(row.original.id, "Payments")}
          >
            Move to payments
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateStep(row.original.id, "Launch Ready")}
          >
            Mark launch ready
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
