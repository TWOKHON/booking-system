"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical } from "lucide-react";
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
import type { GuestLifecycle, GuestProfile, GuestSegment } from "./crm-data";

const segmentClasses: Record<GuestSegment, string> = {
  VIP: "border-violet-200 bg-violet-50 text-violet-700",
  Returning: "border-green-200 bg-green-50 text-green-700",
  Family: "border-blue-200 bg-blue-50 text-blue-700",
  Corporate: "border-cyan-200 bg-cyan-50 text-cyan-700",
  "At Risk": "border-red-200 bg-red-50 text-red-700",
  New: "border-zinc-200 bg-zinc-50 text-zinc-700",
};

const lifecycleClasses: Record<GuestLifecycle, string> = {
  Active: "border-green-200 bg-green-50 text-green-700",
  Upcoming: "border-blue-200 bg-blue-50 text-blue-700",
  Dormant: "border-amber-200 bg-amber-50 text-amber-700",
  "Win-back": "border-red-200 bg-red-50 text-red-700",
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

export function createCrmColumns({
  onAddToCampaign,
  onCompleteFollowUp,
  onCopyEmail,
  onPromoteVip,
}: {
  onAddToCampaign: (guest: GuestProfile) => void;
  onCompleteFollowUp: (guest: GuestProfile) => void;
  onCopyEmail: (guest: GuestProfile) => void;
  onPromoteVip: (guest: GuestProfile) => void;
}): ColumnDef<GuestProfile>[] {
  return [
  {
    accessorKey: "guestName",
    header: ({ column }) => sortableHeader("Guest", column),
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.guestName}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "segment",
    header: ({ column }) => sortableHeader("Segment", column),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn("whitespace-nowrap", segmentClasses[row.original.segment])}
      >
        {row.original.segment}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "lifecycle",
    header: ({ column }) => sortableHeader("Lifecycle", column),
    cell: ({ row }) => (
      <Badge
        variant="outline"
        className={cn(
          "whitespace-nowrap",
          lifecycleClasses[row.original.lifecycle],
        )}
      >
        {row.original.lifecycle}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "totalStays",
    header: ({ column }) => sortableHeader("Stays", column),
    cell: ({ row }) => (
      <span className="font-medium tabular-nums">{row.original.totalStays}</span>
    ),
  },
  {
    accessorKey: "lifetimeValue",
    header: ({ column }) => sortableHeader("Lifetime value", column),
    cell: ({ row }) => (
      <span className="whitespace-nowrap font-medium">
        {row.original.lifetimeValue}
      </span>
    ),
  },
  {
    accessorKey: "nextStay",
    header: ({ column }) => sortableHeader("Next stay", column),
    cell: ({ row }) => (
      <span className="whitespace-nowrap">{row.original.nextStay}</span>
    ),
  },
  {
    accessorKey: "preference",
    header: "Preference signal",
    enableSorting: false,
    cell: ({ row }) => (
      <p className="max-w-60 truncate text-sm text-muted-foreground">
        {row.original.preference}
      </p>
    ),
  },
  {
    accessorKey: "owner",
    header: ({ column }) => sortableHeader("Owner", column),
    cell: ({ row }) => (
      <span className="inline-flex items-center gap-2 whitespace-nowrap">
        <span className="grid size-7 place-items-center rounded-full bg-muted text-xs font-medium">
          {row.original.initials}
        </span>
        {row.original.owner}
      </span>
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
            <span className="sr-only">Open CRM actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuLabel>{row.original.guestName}</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onPromoteVip(row.original)}
          >
            Mark as VIP
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onCompleteFollowUp(row.original)}
          >
            Complete follow-up
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onAddToCampaign(row.original)}
          >
            Add to campaign
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onCopyEmail(row.original)}
          >
            Copy email
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  ];
}
