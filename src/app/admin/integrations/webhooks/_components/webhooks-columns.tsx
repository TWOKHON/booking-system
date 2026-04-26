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
import { WebhookRecord } from "./webhooks-data";

const webhookStatusClasses: Record<WebhookRecord["webhookStatus"], string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Retrying: "bg-amber-100 text-amber-700",
  Review: "bg-blue-100 text-blue-700",
  Paused: "bg-slate-100 text-slate-700",
};

const deliveryHealthClasses: Record<WebhookRecord["deliveryHealth"], string> = {
  Healthy: "bg-emerald-100 text-emerald-700",
  Watch: "bg-amber-100 text-amber-700",
  Failing: "bg-rose-100 text-rose-700",
};

type WebhooksColumnActions = {
  onUpdateStatus: (id: string, status: WebhookRecord["webhookStatus"]) => void;
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

export const getWebhooksColumns = ({
  onUpdateStatus,
  onTogglePriority,
}: WebhooksColumnActions): ColumnDef<WebhookRecord>[] => [
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
    accessorKey: "endpointName",
    header: ({ column }) => sortableHeader("Endpoint", column),
    cell: ({ row }) => (
      <div className="min-w-52">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.endpointName}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">{row.original.provider}</p>
      </div>
    ),
  },
  {
    accessorKey: "eventType",
    header: ({ column }) => sortableHeader("Event", column),
    cell: ({ row }) => (
      <div className="min-w-36">
        <p className="font-medium">{row.original.eventType}</p>
        <p className="text-xs text-muted-foreground">{row.original.environment}</p>
      </div>
    ),
  },
  {
    accessorKey: "webhookStatus",
    header: ({ column }) => sortableHeader("Status", column),
    cell: ({ row }) => (
      <Badge className={webhookStatusClasses[row.original.webhookStatus]} variant="outline">
        {row.original.webhookStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "deliveryHealth",
    header: ({ column }) => sortableHeader("Delivery", column),
    cell: ({ row }) => (
      <Badge className={deliveryHealthClasses[row.original.deliveryHealth]} variant="outline">
        {row.original.deliveryHealth}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "successRate",
    header: ({ column }) => sortableHeader("Success Rate", column),
    cell: ({ row }) => (
      <div className="min-w-32">
        <p className="font-medium">{row.original.successRate}</p>
        <p className="text-xs text-muted-foreground">{row.original.retryWindow}</p>
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
          <DropdownMenuLabel>Webhook actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Active")}>
            Mark active
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Retrying")}>
            Retry delivery
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Review")}>
            Send to review
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Paused")}>
            Pause endpoint
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
