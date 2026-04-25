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
import { SalesRecord } from "./sales-data";

type SalesTableToolbarProps = {
  table: Table<SalesRecord>;
  onBatchStageUpdate: (stage: SalesRecord["pipelineStage"]) => void;
  onBatchPriority: () => void;
};

export const SalesTableToolbar = ({
  table,
  onBatchStageUpdate,
  onBatchPriority,
}: SalesTableToolbarProps) => {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search lead, resort, campaign, channel, owner, or note..."
            className="pl-9"
          />
        </div>

        <Select
          value={
            (table.getColumn("pipelineStage")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table.getColumn("pipelineStage")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-45">
            <SelectValue placeholder="Filter pipeline stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All stages</SelectItem>
            <SelectItem value="New Lead">New Lead</SelectItem>
            <SelectItem value="Qualified">Qualified</SelectItem>
            <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
            <SelectItem value="Negotiation">Negotiation</SelectItem>
            <SelectItem value="Confirmed">Confirmed</SelectItem>
            <SelectItem value="Lost">Lost</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            (table.getColumn("followUpStatus")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table.getColumn("followUpStatus")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-41.25">
            <SelectValue placeholder="Filter follow-up" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All follow-up</SelectItem>
            <SelectItem value="On Track">On Track</SelectItem>
            <SelectItem value="Due Today">Due Today</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
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
              <DropdownMenuItem onClick={() => onBatchStageUpdate("Qualified")}>
                Mark qualified
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStageUpdate("Proposal Sent")}>
                Send proposal
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStageUpdate("Negotiation")}>
                Move to negotiation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStageUpdate("Confirmed")}>
                Mark confirmed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStageUpdate("Lost")}>
                Mark lost
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
