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
import { ApiKeyRecord } from "./api-keys-data";

const keyStatusClasses: Record<ApiKeyRecord["keyStatus"], string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Review: "bg-amber-100 text-amber-700",
  Expiring: "bg-rose-100 text-rose-700",
  Revoked: "bg-slate-100 text-slate-700",
};

type ApiKeysColumnActions = {
  onUpdateStatus: (id: string, status: ApiKeyRecord["keyStatus"]) => void;
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

export const getApiKeysColumns = ({
  onUpdateStatus,
  onTogglePriority,
}: ApiKeysColumnActions): ColumnDef<ApiKeyRecord>[] => [
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
    accessorKey: "keyName",
    header: ({ column }) => sortableHeader("Key", column),
    cell: ({ row }) => (
      <div className="min-w-52">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.keyName}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">{row.original.provider}</p>
      </div>
    ),
  },
  {
    accessorKey: "keyType",
    header: ({ column }) => sortableHeader("Type", column),
    cell: ({ row }) => (
      <div className="min-w-36">
        <p className="font-medium">{row.original.keyType}</p>
        <p className="text-xs text-muted-foreground">{row.original.environment}</p>
      </div>
    ),
  },
  {
    accessorKey: "keyStatus",
    header: ({ column }) => sortableHeader("Status", column),
    cell: ({ row }) => (
      <Badge className={keyStatusClasses[row.original.keyStatus]} variant="outline">
        {row.original.keyStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "accessScope",
    header: ({ column }) => sortableHeader("Scope", column),
    cell: ({ row }) => (
      <div className="min-w-28">
        <p className="font-medium">{row.original.accessScope}</p>
        <p className="text-xs text-muted-foreground">{row.original.rotationWindow}</p>
      </div>
    ),
  },
  {
    accessorKey: "maskedKey",
    header: ({ column }) => sortableHeader("Credential", column),
    cell: ({ row }) => (
      <div className="min-w-44">
        <p className="font-mono text-sm">{row.original.maskedKey}</p>
        <p className="text-xs text-muted-foreground">{row.original.lastUsed}</p>
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
          <DropdownMenuLabel>API key actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Active")}>
            Mark active
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Review")}>
            Send to review
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Expiring")}>
            Mark expiring
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Revoked")}>
            Revoke key
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
