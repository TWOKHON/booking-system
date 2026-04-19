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
import { ResortRecord } from "./resorts-data";

type ResortsTableToolbarProps = {
  table: Table<ResortRecord>;
  onBatchOperationsUpdate: (status: ResortRecord["operationsStatus"]) => void;
  onBatchPriority: () => void;
};

export const ResortsTableToolbar = ({
  table,
  onBatchOperationsUpdate,
  onBatchPriority,
}: ResortsTableToolbarProps) => {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search resort, tenant, owner, or location..."
            className="pl-9"
          />
        </div>

        <Select
          value={
            (table.getColumn("operationsStatus")?.getFilterValue() as string) ??
            "all"
          }
          onValueChange={(value) =>
            table
              .getColumn("operationsStatus")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-42.5">
            <SelectValue placeholder="Filter operations" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All operations</SelectItem>
            <SelectItem value="Stable">Stable</SelectItem>
            <SelectItem value="Busy">Busy</SelectItem>
            <SelectItem value="Attention">Attention</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={(table.getColumn("setupStatus")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table
              .getColumn("setupStatus")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter setup" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All setup states</SelectItem>
            <SelectItem value="Live">Live</SelectItem>
            <SelectItem value="Launching">Launching</SelectItem>
            <SelectItem value="Needs Review">Needs Review</SelectItem>
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
              <DropdownMenuItem onClick={() => onBatchOperationsUpdate("Stable")}>
                Mark stable
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchOperationsUpdate("Busy")}>
                Mark busy
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onBatchOperationsUpdate("Attention")}
              >
                Flag attention
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
