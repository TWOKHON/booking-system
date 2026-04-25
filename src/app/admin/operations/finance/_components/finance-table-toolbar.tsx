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
import { FinanceRecord } from "./finance-data";

type FinanceTableToolbarProps = {
  table: Table<FinanceRecord>;
  onBatchStatusUpdate: (status: FinanceRecord["financeStatus"]) => void;
  onBatchPriority: () => void;
};

export const FinanceTableToolbar = ({
  table,
  onBatchStatusUpdate,
  onBatchPriority,
}: FinanceTableToolbarProps) => {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search account, ledger, resort, assignee, or note..."
            className="pl-9"
          />
        </div>

        <Select
          value={
            (table.getColumn("financeStatus")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table.getColumn("financeStatus")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter finance status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="Pending Collection">Pending Collection</SelectItem>
            <SelectItem value="For Reconciliation">For Reconciliation</SelectItem>
            <SelectItem value="Payout Hold">Payout Hold</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            (table.getColumn("paymentHealth")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table.getColumn("paymentHealth")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[165px]">
            <SelectValue placeholder="Filter payment health" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All health levels</SelectItem>
            <SelectItem value="Clear">Clear</SelectItem>
            <SelectItem value="Watch">Watch</SelectItem>
            <SelectItem value="At Risk">At Risk</SelectItem>
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
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Open")}>
                Reopen item
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Pending Collection")}>
                Send to collection
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("For Reconciliation")}>
                Send to reconciliation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Payout Hold")}>
                Place payout hold
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Closed")}>
                Mark closed
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
