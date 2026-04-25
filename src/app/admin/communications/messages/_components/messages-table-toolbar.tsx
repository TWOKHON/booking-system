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
import { MessageRecord } from "./messages-data";

type MessagesTableToolbarProps = {
  table: Table<MessageRecord>;
  onBatchStatusUpdate: (status: MessageRecord["messageStatus"]) => void;
  onBatchPriority: () => void;
};

export const MessagesTableToolbar = ({
  table,
  onBatchStatusUpdate,
  onBatchPriority,
}: MessagesTableToolbarProps) => {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search conversation, resort, tenant, assignee, or preview..."
            className="pl-9"
          />
        </div>

        <Select
          value={
            (table.getColumn("messageStatus")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table.getColumn("messageStatus")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Unread">Unread</SelectItem>
            <SelectItem value="Responded">Responded</SelectItem>
            <SelectItem value="Pending Follow-Up">Pending Follow-Up</SelectItem>
            <SelectItem value="Escalated">Escalated</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={
            (table.getColumn("priorityLevel")?.getFilterValue() as string) ?? "all"
          }
          onValueChange={(value) =>
            table.getColumn("priorityLevel")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[165px]">
            <SelectValue placeholder="Filter priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priority</SelectItem>
            <SelectItem value="Normal">Normal</SelectItem>
            <SelectItem value="Watch">Watch</SelectItem>
            <SelectItem value="Urgent">Urgent</SelectItem>
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
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Unread")}>
                Mark unread
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Responded")}>
                Mark responded
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Pending Follow-Up")}>
                Set follow-up
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Escalated")}>
                Escalate thread
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Closed")}>
                Close thread
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
