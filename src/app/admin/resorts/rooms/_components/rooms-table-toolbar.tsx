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
import { RoomRecord } from "./rooms-data";

type RoomsTableToolbarProps = {
  table: Table<RoomRecord>;
  onBatchHousekeepingUpdate: (status: RoomRecord["housekeepingStatus"]) => void;
  onBatchPriority: () => void;
};

export const RoomsTableToolbar = ({
  table,
  onBatchHousekeepingUpdate,
  onBatchPriority,
}: RoomsTableToolbarProps) => {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search room, resort, tenant, or zone..."
            className="pl-9"
          />
        </div>

        <Select
          value={
            (table.getColumn("occupancyStatus")?.getFilterValue() as string) ??
            "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("occupancyStatus")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Filter occupancy" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All occupancy</SelectItem>
            <SelectItem value="Occupied">Occupied</SelectItem>
            <SelectItem value="Vacant">Vacant</SelectItem>
            <SelectItem value="Reserved">Reserved</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            (table.getColumn("housekeepingStatus")?.getFilterValue() as string) ??
            "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("housekeepingStatus")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[175px]">
            <SelectValue placeholder="Filter housekeeping" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All housekeeping</SelectItem>
            <SelectItem value="Ready">Ready</SelectItem>
            <SelectItem value="Cleaning">Cleaning</SelectItem>
            <SelectItem value="Inspection">Inspection</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            (table.getColumn("maintenanceStatus")?.getFilterValue() as string) ??
            "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("maintenanceStatus")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[165px]">
            <SelectValue placeholder="Filter maintenance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All maintenance</SelectItem>
            <SelectItem value="Clear">Clear</SelectItem>
            <SelectItem value="Watch">Watch</SelectItem>
            <SelectItem value="Issue">Issue</SelectItem>
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
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>Update selected</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onBatchHousekeepingUpdate("Ready")}>
                Mark ready
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onBatchHousekeepingUpdate("Cleaning")}
              >
                Mark cleaning
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onBatchHousekeepingUpdate("Inspection")}
              >
                Send to inspection
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
