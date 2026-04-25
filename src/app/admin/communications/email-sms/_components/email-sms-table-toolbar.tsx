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
import { EmailSmsRecord } from "./email-sms-data";

type EmailSmsTableToolbarProps = {
  table: Table<EmailSmsRecord>;
  onBatchStatusUpdate: (status: EmailSmsRecord["sendStatus"]) => void;
  onBatchPriority: () => void;
};

export const EmailSmsTableToolbar = ({
  table,
  onBatchStatusUpdate,
  onBatchPriority,
}: EmailSmsTableToolbarProps) => {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search campaign, resort, tenant, owner, or note..."
            className="pl-9"
          />
        </div>

        <Select
          value={(table.getColumn("sendStatus")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table.getColumn("sendStatus")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter send status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Queued">Queued</SelectItem>
            <SelectItem value="Scheduled">Scheduled</SelectItem>
            <SelectItem value="Sent">Sent</SelectItem>
            <SelectItem value="Failed">Failed</SelectItem>
            <SelectItem value="Needs Approval">Needs Approval</SelectItem>
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
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Draft")}>
                Move to draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Queued")}>
                Queue send
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Scheduled")}>
                Schedule send
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Sent")}>
                Mark sent
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Failed")}>
                Mark failed
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Needs Approval")}>
                Send for approval
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
