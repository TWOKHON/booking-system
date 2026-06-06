"use client";

import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type AccountingSummaryMetric,
  formatAccountingMoney,
} from "./accounting-data";

const valueTone = {
  green: "text-green-700",
  red: "text-red-600",
  blue: "text-blue-700",
  neutral: "text-zinc-950 dark:text-zinc-50",
};

const trendTone = {
  green: "text-green-700",
  red: "text-red-600",
  blue: "text-green-700",
  neutral: "text-green-700",
};

export function AccountingSummaryCards({
  metrics,
  isLoading,
}: {
  metrics: AccountingSummaryMetric[];
  isLoading?: boolean;
}) {
  return (
    <section className="rounded-lg border bg-background shadow-sm">
      <div className="border-b px-5 py-4">
        <h2 className="text-base font-semibold">Accounting summary</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Key financial information for the selected period.
        </p>
      </div>

      <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className={cn(
              "px-5 py-5",
              index > 0 && "border-t md:border-l md:border-t-0",
              index === 2 && "md:border-t xl:border-t-0",
            )}
          >
            <p className="text-sm text-muted-foreground">{metric.label}</p>
            <p
              className={cn(
                "mt-3 text-2xl font-semibold tracking-tight",
                valueTone[metric.tone],
              )}
            >
              {formatAccountingMoney(metric.valueCents)}
            </p>
            <div className="mt-5 flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">{metric.comparison}</span>
              <span
                className={cn(
                  "inline-flex items-center gap-1 font-medium",
                  trendTone[metric.tone],
                )}
              >
                <ArrowUp className="size-3.5 fill-current" />
                {isLoading ? "--" : `${metric.trend.toFixed(1)}%`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
