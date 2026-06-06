"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  ChartLineIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { ForecastTable } from "./ForecastTable";

export function ForecastWorkspaceClient({
  ownerName,
  resortName,
}: {
  ownerName: string;
  resortName: string;
}) {
  const trpc = useTRPC();
  const forecastQuery = useQuery(trpc.forecast.list.queryOptions());

  const rows = forecastQuery.data?.rows ?? [];
  const summary = forecastQuery.data?.summary;
  const insightMessage = `${resortName} currently has ${summary?.readyCount ?? 0} forecast surface${summary?.readyCount === 1 ? "" : "s"} ready for planning, with ${summary?.highPriorityCount ?? 0} high-priority horizons to watch. Focus next on turning room, pricing, payments, and alerts.`;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <ChartLineIcon className="size-3.5" />
                Revenue forecasting
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <SparklesIcon className="size-3.5" />
                Forward planning
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {resortName}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Review 30, 60, and 90-day forecast readiness across demand,
              revenue, operations, and trust signals using the tenant data
              already available inside ResortCloud today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/tenant/ai/recommendations">
                Smart recommendations
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tenant/analytics/kpi">
                KPI dashboard
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">Owner</div>
            <div className="mt-3 text-xl font-semibold">{ownerName}</div>
            <div className="mt-2 text-xs text-muted-foreground">
              Primary forecast reviewer
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Ready surfaces
            </div>
            <div className="mt-3 text-xl font-semibold">
              {forecastQuery.isPending ? "..." : (summary?.readyCount ?? 0)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Forecast areas with enough signal quality to use
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              30-day baseline
            </div>
            <div className="mt-3 text-xl font-semibold">
              {forecastQuery.isPending
                ? "..."
                : new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                    maximumFractionDigits: 0,
                  }).format(summary?.forecast30Revenue ?? 0)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Modeled short-range room revenue baseline
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              90-day confidence
            </div>
            <div className="mt-3 flex items-center gap-2 text-xl font-semibold">
              {forecastQuery.isPending
                ? "..."
                : new Intl.NumberFormat("en-PH", {
                    style: "currency",
                    currency: "PHP",
                    maximumFractionDigits: 0,
                  }).format(summary?.forecast90Revenue ?? 0)}
              <ShieldCheckIcon className="size-5 text-zinc-700" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Modeled long-range room revenue baseline
            </div>
          </div>
        </div>
      </section>

      <ForecastTable
        rows={rows}
        isLoading={forecastQuery.isPending}
        isFetching={forecastQuery.isFetching}
      />
    </main>
  );
}
