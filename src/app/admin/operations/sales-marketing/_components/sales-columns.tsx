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
import { SalesRecord } from "./sales-data";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

const pipelineStageClasses: Record<SalesRecord["pipelineStage"], string> = {
  "New Lead": "bg-slate-100 text-slate-700",
  Qualified: "bg-blue-100 text-blue-700",
  "Proposal Sent": "bg-violet-100 text-violet-700",
  Negotiation: "bg-amber-100 text-amber-700",
  Confirmed: "bg-emerald-100 text-emerald-700",
  Lost: "bg-rose-100 text-rose-700",
};

const followUpClasses: Record<SalesRecord["followUpStatus"], string> = {
  "On Track": "bg-emerald-100 text-emerald-700",
  "Due Today": "bg-amber-100 text-amber-700",
  Overdue: "bg-rose-100 text-rose-700",
};

type SalesColumnActions = {
  onUpdateStage: (id: string, stage: SalesRecord["pipelineStage"]) => void;
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

export const getSalesColumns = ({
  onUpdateStage,
  onTogglePriority,
}: SalesColumnActions): ColumnDef<SalesRecord>[] => [
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
    accessorKey: "leadName",
    header: ({ column }) => sortableHeader("Lead", column),
    cell: ({ row }) => (
      <div className="min-w-44">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.leadName}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          {row.original.salesType} · {row.original.campaignName}
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
    accessorKey: "pipelineStage",
    header: ({ column }) => sortableHeader("Pipeline Stage", column),
    cell: ({ row }) => (
      <Badge className={pipelineStageClasses[row.original.pipelineStage]} variant="outline">
        {row.original.pipelineStage}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "sourceChannel",
    header: ({ column }) => sortableHeader("Channel", column),
    cell: ({ row }) => (
      <div className="min-w-32">
        <p className="font-medium">{row.original.sourceChannel}</p>
        <p className="text-xs text-muted-foreground">{row.original.campaignName}</p>
      </div>
    ),
  },
  {
    accessorKey: "followUpStatus",
    header: ({ column }) => sortableHeader("Follow-Up", column),
    cell: ({ row }) => (
      <Badge className={followUpClasses[row.original.followUpStatus]} variant="outline">
        {row.original.followUpStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "quotedValue",
    header: ({ column }) => sortableHeader("Quoted Value", column),
    cell: ({ row }) => (
      <div className="min-w-32">
        <p className="font-medium">{currency.format(row.original.quotedValue)}</p>
        <p className="text-xs text-muted-foreground">{row.original.targetStayOrEvent}</p>
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
          <DropdownMenuLabel>Sales and marketing actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onUpdateStage(row.original.id, "Qualified")}>
            Mark qualified
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStage(row.original.id, "Proposal Sent")}>
            Send proposal
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStage(row.original.id, "Negotiation")}>
            Move to negotiation
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStage(row.original.id, "Confirmed")}>
            Mark confirmed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStage(row.original.id, "Lost")}>
            Mark lost
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
