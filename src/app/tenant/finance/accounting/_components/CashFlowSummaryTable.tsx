"use client";

import { useState } from "react";
import {
  Building2,
  CircleEllipsis,
  Receipt,
  ShoppingBasket,
  Tag,
  Users,
  Waves,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import {
  type CashFlowSummaryRow,
  formatAccountingTableMoney,
} from "./accounting-data";

type SummaryMode = "category" | "type";

const iconMap: Record<CashFlowSummaryRow["icon"], LucideIcon> = {
  building: Building2,
  service: Waves,
  tag: Tag,
  receipt: Receipt,
  users: Users,
  basket: ShoppingBasket,
  more: CircleEllipsis,
};

const iconTone: Record<CashFlowSummaryRow["icon"], string> = {
  building: "bg-green-100 text-green-700",
  service: "bg-blue-100 text-blue-700",
  tag: "bg-amber-100 text-amber-700",
  receipt: "bg-red-100 text-red-700",
  users: "bg-sky-100 text-sky-700",
  basket: "bg-orange-100 text-orange-700",
  more: "bg-zinc-100 text-zinc-600",
};

export function CashFlowSummaryTable({
  categoryRows,
  typeRows,
  isLoading,
}: {
  categoryRows: CashFlowSummaryRow[];
  typeRows: CashFlowSummaryRow[];
  isLoading?: boolean;
}) {
  const [mode, setMode] = useState<SummaryMode>("category");
  const rows = mode === "category" ? categoryRows : typeRows;

  return (
    <section className="overflow-hidden rounded-lg border bg-background shadow-sm">
      <div className="flex flex-col gap-3 border-b px-5 py-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-semibold">Cash flow summary</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Summary of cash inflows and outflows by category.
          </p>
        </div>
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(value) => {
            if (value) {
              setMode(value as SummaryMode);
            }
          }}
          size="sm"
          variant="outline"
          className="rounded-md border bg-muted/40 p-1"
          aria-label="Cash flow summary grouping"
        >
          <ToggleGroupItem
            value="category"
            className="h-8 rounded-sm px-4 text-xs data-[state=on]:border-green-200 data-[state=on]:bg-green-50 data-[state=on]:text-green-800 data-[state=on]:shadow-sm"
          >
            By category
          </ToggleGroupItem>
          <ToggleGroupItem
            value="type"
            className="h-8 rounded-sm px-4 text-xs data-[state=on]:border-green-200 data-[state=on]:bg-green-50 data-[state=on]:text-green-800 data-[state=on]:shadow-sm"
          >
            By type
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="min-w-64 px-5">Category</TableHead>
              <TableHead className="text-right">Inflows (PHP)</TableHead>
              <TableHead className="text-right">Outflows (PHP)</TableHead>
              <TableHead className="text-right">Net (PHP)</TableHead>
              <TableHead className="text-center">% of Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  Loading accounting summary...
                </TableCell>
              </TableRow>
            ) : rows.length ? (
              rows.map((row) => <SummaryRow key={row.id} row={row} />)
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  No cash-flow records found for this period.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function SummaryRow({ row }: { row: CashFlowSummaryRow }) {
  const Icon = iconMap[row.icon];
  const isTotal = row.id.startsWith("total-");
  const isNet = row.group === "net";

  return (
    <TableRow
      className={cn(
        isTotal && "bg-blue-50/60 font-semibold dark:bg-blue-950/20",
        isNet && "bg-green-50/80 font-semibold dark:bg-green-950/20",
      )}
    >
      <TableCell className="px-5">
        <div className="flex items-center gap-3">
          {!isTotal && !isNet ? (
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full",
                iconTone[row.icon],
              )}
            >
              <Icon className="size-4" />
            </span>
          ) : (
            <span className="size-7 shrink-0" />
          )}
          <span
            className={cn(
              "text-sm",
              row.group === "net" && "text-green-800 dark:text-green-300",
            )}
          >
            {row.label}
          </span>
        </div>
      </TableCell>
      <TableCell
        className={cn(
          "text-right",
          row.inflowCents > 0 && "text-green-700",
        )}
      >
        {formatAccountingTableMoney(row.inflowCents)}
      </TableCell>
      <TableCell className="text-right">
        {formatAccountingTableMoney(row.outflowCents)}
      </TableCell>
      <TableCell
        className={cn(
          "text-right",
          row.netCents > 0 && "text-green-700",
          row.netCents < 0 && "text-red-600",
        )}
      >
        {formatAccountingTableMoney(row.netCents)}
      </TableCell>
      <TableCell className="text-center">{row.percentOfTotal}</TableCell>
    </TableRow>
  );
}
