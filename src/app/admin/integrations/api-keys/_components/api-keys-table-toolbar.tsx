"use client";

import { Table } from "@tanstack/react-table";
import { Columns3, Plus, Search, SlidersHorizontal } from "lucide-react";
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
import { ApiKeyRecord } from "./api-keys-data";

type ApiKeysTableToolbarProps = {
  table: Table<ApiKeyRecord>;
  onBatchStatusUpdate: (status: ApiKeyRecord["keyStatus"]) => void;
  onBatchPriority: () => void;
  onOpenCreate: () => void;
};

export const ApiKeysTableToolbar = ({
  table,
  onBatchStatusUpdate,
  onBatchPriority,
  onOpenCreate,
}: ApiKeysTableToolbarProps) => {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search key, provider, assignee, or note..."
            className="pl-9"
          />
        </div>

        <Select
          value={(table.getColumn("keyStatus")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table.getColumn("keyStatus")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[165px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Review">Review</SelectItem>
            <SelectItem value="Expiring">Expiring</SelectItem>
            <SelectItem value="Revoked">Revoked</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={(table.getColumn("accessScope")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table.getColumn("accessScope")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[165px]">
            <SelectValue placeholder="Filter scope" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All scopes</SelectItem>
            <SelectItem value="Read">Read</SelectItem>
            <SelectItem value="Write">Write</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={onOpenCreate}>
          <Plus className="size-4" />
          Create API key
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
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Review")}>
                Send to review
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Expiring")}>
                Mark expiring
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Revoked")}>
                Revoke key
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
