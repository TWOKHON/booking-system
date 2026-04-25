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
import { FrontdeskRecord } from "./frontdesk-data";

type FrontdeskTableToolbarProps = {
  table: Table<FrontdeskRecord>;
  onBatchStatusUpdate: (status: FrontdeskRecord["frontdeskStatus"]) => void;
  onBatchPriority: () => void;
};

export const FrontdeskTableToolbar = ({
  table,
  onBatchStatusUpdate,
  onBatchPriority,
}: FrontdeskTableToolbarProps) => {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search guest, reservation, resort, tenant, or room..."
            className="pl-9"
          />
        </div>

        <Select
          value={(table.getColumn("queueStage")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table.getColumn("queueStage")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[170px]">
            <SelectValue placeholder="Filter queue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All queue stages</SelectItem>
            <SelectItem value="Arrival Today">Arrival Today</SelectItem>
            <SelectItem value="Check-In Pending">Check-In Pending</SelectItem>
            <SelectItem value="In House">In House</SelectItem>
            <SelectItem value="Checkout Due">Checkout Due</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            (table.getColumn("frontdeskStatus")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("frontdeskStatus")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[185px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Ready">Ready</SelectItem>
            <SelectItem value="Waiting Payment">Waiting Payment</SelectItem>
            <SelectItem value="Room Not Ready">Room Not Ready</SelectItem>
            <SelectItem value="Needs ID Review">Needs ID Review</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={(table.getColumn("paymentStatus")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table.getColumn("paymentStatus")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Filter payment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All payments</SelectItem>
            <SelectItem value="Settled">Settled</SelectItem>
            <SelectItem value="Partial">Partial</SelectItem>
            <SelectItem value="Outstanding">Outstanding</SelectItem>
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
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Ready")}>
                Mark ready
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Waiting Payment")}>
                Flag waiting payment
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Room Not Ready")}>
                Flag room not ready
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Needs ID Review")}>
                Request ID review
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
