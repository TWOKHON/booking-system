"use client";

import { Table } from "@tanstack/react-table";
import { Columns3, Plus, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkflowAutomationRecord } from "./workflow-automation-data";

type WorkflowAutomationsTableToolbarProps = {
  table: Table<WorkflowAutomationRecord>;
  onBatchStatusUpdate: (status: WorkflowAutomationRecord["status"]) => void;
  onBatchPriority: () => void;
};

export const WorkflowAutomationsTableToolbar = ({
  table,
  onBatchStatusUpdate,
  onBatchPriority,
}: WorkflowAutomationsTableToolbarProps) => {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search workflow, trigger, owner, or note..."
            className="pl-9"
          />
        </div>

        <Select
          value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[165px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Review">Review</SelectItem>
            <SelectItem value="Paused">Paused</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={(table.getColumn("name")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table.getColumn("name")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[175px]">
            <SelectValue placeholder="Filter workflow" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All workflows</SelectItem>
            <SelectItem value="Arrival readiness assistant">Arrival readiness assistant</SelectItem>
            <SelectItem value="Housekeeping turnover priority">Housekeeping turnover priority</SelectItem>
            <SelectItem value="Failed payment recovery">Failed payment recovery</SelectItem>
            <SelectItem value="Guest review nurture">Guest review nurture</SelectItem>
            <SelectItem value="OTA overbook guard">OTA overbook guard</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" asChild>
          <Link href="/admin/integrations/workflow-automations/new">
            <Plus className="size-4" />
            Create workflow
          </Link>
        </Button>

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
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Active")}>
                Mark active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Draft")}>
                Move to draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Review")}>
                Send to review
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Paused")}>
                Pause workflow
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
