"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Star, StarHalf } from "lucide-react";
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
import { ReviewRecord } from "./reviews-data";

const reviewStatusClasses: Record<ReviewRecord["reviewStatus"], string> = {
  New: "bg-slate-100 text-slate-700",
  Responded: "bg-emerald-100 text-emerald-700",
  "Pending Response": "bg-amber-100 text-amber-700",
  Escalated: "bg-rose-100 text-rose-700",
  Closed: "bg-blue-100 text-blue-700",
};

const sentimentClasses: Record<ReviewRecord["sentimentLevel"], string> = {
  Positive: "bg-emerald-100 text-emerald-700",
  Mixed: "bg-amber-100 text-amber-700",
  Negative: "bg-rose-100 text-rose-700",
};

type ReviewsColumnActions = {
  onUpdateStatus: (id: string, status: ReviewRecord["reviewStatus"]) => void;
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

const RatingView = ({ rating }: { rating: ReviewRecord["rating"] }) => {
  return (
    <div className="flex items-center gap-1 text-amber-500">
      {Array.from({ length: 5 }).map((_, index) =>
        index < rating ? (
          <Star key={index} className="size-3.5 fill-amber-400 text-amber-400" />
        ) : (
          <StarHalf key={index} className="size-3.5 text-slate-300" />
        )
      )}
    </div>
  );
};

export const getReviewsColumns = ({
  onUpdateStatus,
  onTogglePriority,
}: ReviewsColumnActions): ColumnDef<ReviewRecord>[] => [
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
    accessorKey: "guestName",
    header: ({ column }) => sortableHeader("Reviewer", column),
    cell: ({ row }) => (
      <div className="min-w-48">
        <div className="flex items-center gap-2">
          <p className="font-medium">{row.original.guestName}</p>
          {row.original.priority ? (
            <Star className="size-3.5 fill-amber-400 text-amber-400" />
          ) : null}
        </div>
        <p className="text-xs text-muted-foreground">
          {row.original.sourcePlatform} · {row.original.postedAt}
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
    accessorKey: "rating",
    header: ({ column }) => sortableHeader("Rating", column),
    cell: ({ row }) => (
      <div className="min-w-28">
        <p className="text-sm font-medium">{row.original.rating} / 5</p>
        <RatingView rating={row.original.rating} />
      </div>
    ),
  },
  {
    accessorKey: "reviewStatus",
    header: ({ column }) => sortableHeader("Status", column),
    cell: ({ row }) => (
      <Badge className={reviewStatusClasses[row.original.reviewStatus]} variant="outline">
        {row.original.reviewStatus}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "sentimentLevel",
    header: ({ column }) => sortableHeader("Sentiment", column),
    cell: ({ row }) => (
      <Badge className={sentimentClasses[row.original.sentimentLevel]} variant="outline">
        {row.original.sentimentLevel}
      </Badge>
    ),
    filterFn: (row, id, value: string) => {
      if (!value || value === "all") return true;
      return row.getValue(id) === value;
    },
  },
  {
    accessorKey: "reviewSummary",
    header: ({ column }) => sortableHeader("Review Summary", column),
    cell: ({ row }) => (
      <div className="max-w-70">
        <p className="truncate text-sm">{row.original.reviewSummary}</p>
        <p className="text-xs text-muted-foreground truncate">{row.original.recoveryNote}</p>
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
          <DropdownMenuLabel>Review actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onTogglePriority(row.original.id)}>
            {row.original.priority ? "Remove priority" : "Mark as priority"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "New")}>
            Mark new
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Responded")}>
            Mark responded
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onUpdateStatus(row.original.id, "Pending Response")}
          >
            Set pending response
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Escalated")}>
            Escalate review
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus(row.original.id, "Closed")}>
            Close review
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
