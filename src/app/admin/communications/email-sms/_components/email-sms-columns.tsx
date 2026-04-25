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
import { EmailSmsRecord } from "./email-sms-data";

const sendStatusClasses: Record<EmailSmsRecord["sendStatus"], string> = {
  Draft: "bg-slate-100 text-slate-700",
  Queued: "bg-amber-100 text-amber-700",
  Scheduled: "bg-blue-100 text-blue-700",
  Sent: "bg-emerald-100 text-emerald-700",
  Failed: "bg-rose-100 text-rose-700",
  "Needs Approval": "bg-violet-100 text-violet-700",
};

const priorityClasses: Record<EmailSmsRecord["priorityLevel"], string> = {
  Normal: "bg-slate-100 text-slate-700",
  Watch: "bg-amber-100 text-amber-700",
  Urgent: "bg-rose-100 text-rose-700",
};

type EmailSmsColumnActions = {
  onUpdateStatus: (id: string, status: EmailSmsRecord["sendStatus"]) => void;
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

export const getEmailSmsColumns = ({
  onUpdateStatus,
  onTogglePriority,
}: EmailSmsColumnActions): ColumnDef<EmailSmsRecord>[] => [
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
    accessorKey: "campaignName",
    header: ({ column }) => sortableHeader("Campaign", column),
    cell: ({ row }) => (
      <div className="min-w-48">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.campaignName}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          {row.original.messageType} · {row.original.channel}
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
    accessorKey: "audienceType",
    header: ({ column }) => sortableHeader("Audience", column),
    cell: ({ row }) => <span className="text-sm">{row.original.audienceType}</span>,
  },
  {
    accessorKey: "sendStatus",
    header: ({ column }) => sortableHeader("Send Status", column),
    cell: ({ row }) => (
      <Badge className={sendStatusClasses[row.original.sendStatus]} variant="outline">
        {row.original.sendStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "priorityLevel",
    header: ({ column }) => sortableHeader("Priority", column),
    cell: ({ row }) => (
      <Badge className={priorityClasses[row.original.priorityLevel]} variant="outline">
        {row.original.priorityLevel}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "deliveryWindow",
    header: ({ column }) => sortableHeader("Delivery Window", column),
    cell: ({ row }) => (
      <div className="max-w-50">
        <p className="font-medium">{row.original.deliveryWindow}</p>
        <p className="text-xs text-muted-foreground truncate">{row.original.note}</p>
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
          <DropdownMenuLabel>Email and SMS actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Draft")}>
            Move to draft
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Queued")}>
            Queue send
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Scheduled")}>
            Schedule send
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Sent")}>
            Mark sent
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Failed")}>
            Mark failed
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateStatus(row.original.id, "Needs Approval")}
          >
            Send for approval
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
