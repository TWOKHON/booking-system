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
import { InvoiceRecord } from "./invoices-data";

type InvoicesTableToolbarProps = {
  table: Table<InvoiceRecord>;
  onBatchStatusUpdate: (status: InvoiceRecord["invoiceStatus"]) => void;
  onBatchPriority: () => void;
  onOpenManualInvoice: () => void;
};

export const InvoicesTableToolbar = ({
  table,
  onBatchStatusUpdate,
  onBatchPriority,
  onOpenManualInvoice,
}: InvoicesTableToolbarProps) => {
  const selectedCount = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={(table.getState().globalFilter as string) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            placeholder="Search invoice, tenant, resort, assignee, or note..."
            className="pl-9"
          />
        </div>

        <Select
          value={(table.getColumn("invoiceSource")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table.getColumn("invoiceSource")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[165px]">
            <SelectValue placeholder="Filter source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All sources</SelectItem>
            <SelectItem value="Automatic">Automatic</SelectItem>
            <SelectItem value="Manual">Manual</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={(table.getColumn("invoiceStatus")?.getFilterValue() as string) ?? "all"}
          onValueChange={(value) =>
            table.getColumn("invoiceStatus")?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-full sm:w-[165px]">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Issued">Issued</SelectItem>
            <SelectItem value="Due Soon">Due Soon</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" onClick={onOpenManualInvoice}>
          <Plus className="size-4" />
          Create manual invoice
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
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Draft")}>
                Move to draft
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Issued")}>
                Mark as issued
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Due Soon")}>
                Flag due soon
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Overdue")}>
                Mark overdue
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onBatchStatusUpdate("Paid")}>
                Mark paid
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
