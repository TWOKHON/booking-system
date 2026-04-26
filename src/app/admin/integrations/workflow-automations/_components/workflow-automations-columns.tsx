"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Star } from "lucide-react";
import Link from "next/link";
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
import { WorkflowAutomationRecord } from "./workflow-automation-data";

const statusClasses: Record<WorkflowAutomationRecord["status"], string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Draft: "bg-slate-100 text-slate-700",
  Review: "bg-amber-100 text-amber-700",
  Paused: "bg-rose-100 text-rose-700",
};

type WorkflowAutomationColumnActions = {
  onUpdateStatus: (id: string, status: WorkflowAutomationRecord["status"]) => void;
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

export const getWorkflowAutomationsColumns = ({
  onUpdateStatus,
  onTogglePriority,
}: WorkflowAutomationColumnActions): ColumnDef<WorkflowAutomationRecord>[] => [
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
    accessorKey: "name",
    header: ({ column }) => sortableHeader("Workflow", column),
    cell: ({ row }) => (
      <div className="min-w-52">
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/integrations/workflow-automations/${row.original.id}`}
            className="font-medium hover:underline"
          >
            {row.original.name}
          </Link>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">{row.original.domain}</p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => sortableHeader("Status", column),
    cell: ({ row }) => (
      <Badge className={statusClasses[row.original.status]} variant="outline">
        {row.original.status}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "triggerLabel",
    header: ({ column }) => sortableHeader("Trigger", column),
    cell: ({ row }) => (
      <div className="min-w-40">
        <p className="font-medium">{row.original.triggerLabel}</p>
        <p className="text-xs text-muted-foreground">{row.original.successRate}</p>
      </div>
    ),
  },
  {
    accessorKey: "runVolume",
    header: ({ column }) => sortableHeader("Runs", column),
    cell: ({ row }) => (
      <div className="min-w-28">
        <p className="font-medium">{row.original.runVolume.toLocaleString("en-PH")}</p>
        <p className="text-xs text-muted-foreground">{row.original.lastUpdated}</p>
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
          <DropdownMenuLabel>Workflow actions</DropdownMenuLabel>
          <DropdownMenuItem asChild>
            <Link href={`/admin/integrations/workflow-automations/${row.original.id}`}>
              Open builder
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Active")}>
            Mark active
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Draft")}>
            Move to draft
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Review")}>
            Send to review
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Paused")}>
            Pause workflow
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
