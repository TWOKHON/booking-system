"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  ChartColumnIncreasingIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { AdvancedAnalyticsTable } from "./AdvancedAnalyticsTable";

export function AdvancedAnalyticsWorkspaceClient({
  ownerName,
  resortName,
}: {
  ownerName: string;
  resortName: string;
}) {
  const trpc = useTRPC();
  const analyticsQuery = useQuery(
    trpc.advancedAnalytics.list.queryOptions(),
  );

  const rows = analyticsQuery.data?.rows ?? [];
  const summary = analyticsQuery.data?.summary;
  const insightMessage = `${resortName} currently has ${summary?.readyCount ?? 0} advanced analytics area${summary?.readyCount === 1 ? "" : "s"} in a ready state and ${summary?.watchCount ?? 0} that still need attention. Focus next on tightening inventory, finance, and alert coverage.`;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <ChartColumnIncreasingIcon className="size-3.5" />
                Advanced analytics
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <SparklesIcon className="size-3.5" />
                Growth reporting
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {resortName}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Review the setup signals that make higher-tier reporting useful:
              inventory depth, finance readiness, guest offer coverage, team
              access, and notification infrastructure across ResortCloud.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/tenant/analytics/kpi">
                KPI dashboard
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tenant/settings/automations">
                Automations
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
              Primary analytics reviewer
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Ready areas
            </div>
            <div className="mt-3 text-xl font-semibold">
              {analyticsQuery.isPending ? "..." : (summary?.readyCount ?? 0)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Analytics inputs already healthy
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Sellable units
            </div>
            <div className="mt-3 text-xl font-semibold">
              {analyticsQuery.isPending ? "..." : (summary?.sellableUnits ?? 0)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Units currently shaping inventory
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Automation & alerts
            </div>
            <div className="mt-3 flex items-center gap-2 text-xl font-semibold">
              {analyticsQuery.isPending
                ? "..."
                : `${summary?.activeWorkflowCount ?? 0} / ${summary?.enabledNotificationRuleCount ?? 0}`}
              <ShieldCheckIcon className="size-5 text-zinc-700" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Active workflows vs notification rules
            </div>
          </div>
        </div>
      </section>

      <AdvancedAnalyticsTable
        rows={rows}
        isLoading={analyticsQuery.isPending}
        isFetching={analyticsQuery.isFetching}
      />
    </main>
  );
}
