"use client";

import { Table } from "@tanstack/react-table";
import { Columns3, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReviewRecord } from "./reviews-data";

type ReviewsTableToolbarProps = {
  table: Table<ReviewRecord>;
  onBatchStatusUpdate: (status: ReviewRecord["reviewStatus"]) => void;
  onBatchPriority: () => void;
};

export const ReviewsTableToolbar = ({
  table,
  onBatchStatusUpdate,
  onBatchPriority,
}: ReviewsTableToolbarProps) => {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search reviewer, resort, tenant, assignee, or summary..."
            className="pl-9"
          />
        </div>

        <Select
          value={
            (table.getColumn("reviewStatus")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table.getColumn("reviewStatus")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter review status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Responded">Responded</SelectItem>
            <SelectItem value="Pending Response">Pending Response</SelectItem>
            <SelectItem value="Escalated">Escalated</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            (table.getColumn("sentimentLevel")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table.getColumn("sentimentLevel")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[165px]">
            <SelectValue placeholder="Filter sentiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sentiment</SelectItem>
            <SelectItem value="Positive">Positive</SelectItem>
            <SelectItem value="Mixed">Mixed</SelectItem>
            <SelectItem value="Negative">Negative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {selectedCount > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="size-4" />
                Batch Actions ({selectedCount})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Update selected</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("New")}>
                Mark new
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Responded")}>
                Mark responded
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Pending Response")}>
                Set pending response
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Escalated")}>
                Escalate review
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Closed")}>
                Close review
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onBatchPriority}>
                Toggle priority
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Columns3 className="size-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
