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
import { HousekeepingRecord } from "./housekeeping-data";

type HousekeepingTableToolbarProps = {
  table: Table<HousekeepingRecord>;
  onBatchStatusUpdate: (status: HousekeepingRecord["housekeepingStatus"]) => void;
  onBatchPriority: () => void;
};

export const HousekeepingTableToolbar = ({
  table,
  onBatchStatusUpdate,
  onBatchPriority,
}: HousekeepingTableToolbarProps) => {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search room, resort, tenant, assignee, or blocker..."
            className="pl-9"
          />
        </div>

        <Select
          value={
            (table.getColumn("housekeepingStatus")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("housekeepingStatus")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[175px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Queued">Queued</SelectItem>
            <SelectItem value="Cleaning">Cleaning</SelectItem>
            <SelectItem value="Inspection">Inspection</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Blocked">Blocked</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            (table.getColumn("readinessStatus")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("readinessStatus")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[185px]">
            <SelectValue placeholder="Filter readiness" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All readiness</SelectItem>
            <SelectItem value="Ready">Ready</SelectItem>
            <SelectItem value="Not Ready">Not Ready</SelectItem>
            <SelectItem value="Awaiting Inspection">Awaiting Inspection</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            (table.getColumn("occupancyContext")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("occupancyContext")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[170px]">
            <SelectValue placeholder="Filter context" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All contexts</SelectItem>
            <SelectItem value="Arrival Today">Arrival Today</SelectItem>
            <SelectItem value="In House">In House</SelectItem>
            <SelectItem value="Checkout Due">Checkout Due</SelectItem>
            <SelectItem value="Vacant">Vacant</SelectItem>
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
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Queued")}>
                Move to queue
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Cleaning")}>
                Mark cleaning
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Inspection")}>
                Send to inspection
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Completed")}>
                Mark completed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Blocked")}>
                Mark blocked
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
