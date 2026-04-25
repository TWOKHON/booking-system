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
import { HrRecord } from "./hr-data";

type HrTableToolbarProps = {
  table: Table<HrRecord>;
  onBatchStatusUpdate: (status: HrRecord["workforceStatus"]) => void;
  onBatchPriority: () => void;
};

export const HrTableToolbar = ({
  table,
  onBatchStatusUpdate,
  onBatchPriority,
}: HrTableToolbarProps) => {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search employee, role, department, resort, or manager..."
            className="pl-9"
          />
        </div>

        <Select
          value={
            (table.getColumn("workforceStatus")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("workforceStatus")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[175px]">
            <SelectValue placeholder="Filter workforce" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All workforce</SelectItem>
            <SelectItem value="On Shift">On Shift</SelectItem>
            <SelectItem value="Late">Late</SelectItem>
            <SelectItem value="Off Duty">Off Duty</SelectItem>
            <SelectItem value="Leave">Leave</SelectItem>
            <SelectItem value="Open Role">Open Role</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={(table.getColumn("staffingRisk")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table.getColumn("staffingRisk")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Filter risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All risk</SelectItem>
            <SelectItem value="Stable">Stable</SelectItem>
            <SelectItem value="Watch">Watch</SelectItem>
            <SelectItem value="Critical">Critical</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            (table.getColumn("attendanceStatus")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("attendanceStatus")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[165px]">
            <SelectValue placeholder="Filter attendance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All attendance</SelectItem>
            <SelectItem value="Present">Present</SelectItem>
            <SelectItem value="Late">Late</SelectItem>
            <SelectItem value="Leave">Leave</SelectItem>
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
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("On Shift")}>
                Mark on shift
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Late")}>
                Flag late
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Leave")}>
                Mark on leave
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Open Role")}>
                Mark open role
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Off Duty")}>
                Mark off duty
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
