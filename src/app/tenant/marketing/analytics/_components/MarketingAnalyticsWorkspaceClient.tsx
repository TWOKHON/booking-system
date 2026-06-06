"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  ChartColumnIncreasingIcon,
  MegaphoneIcon,
  MousePointerClickIcon,
  TimerResetIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTRPC } from "@/trpc/client";
import { MarketingAnalyticsTable } from "./MarketingAnalyticsTable";

const trendChartConfig = {
  sessions: {
    label: "Sessions",
    color: "hsl(84 55% 36%)",
  },
  leads: {
    label: "Leads",
    color: "hsl(27 88% 54%)",
  },
  conversions: {
    label: "Conversions",
    color: "hsl(222 47% 42%)",
  },
};

const mixChartConfig = {
  leads: {
    label: "Leads",
    color: "hsl(84 55% 36%)",
  },
};

export function MarketingAnalyticsWorkspaceClient({
  ownerName,
  resortName,
}: {
  ownerName: string;
  resortName: string;
}) {
  const trpc = useTRPC();
  const analyticsQuery = useQuery(trpc.marketingAnalytics.overview.queryOptions());

  const rows = analyticsQuery.data?.rows ?? [];
  const summary = analyticsQuery.data?.summary;
  const trendData = analyticsQuery.data?.trendData ?? [];
  const sourceMix = analyticsQuery.data?.sourceMix ?? [];
  const insightMessage = `${resortName} is currently tracking ${summary?.activeSources ?? 0} marketing source${summary?.activeSources === 1 ? "" : "s"}, with ${summary?.totalLeads ?? 0} modeled leads and a ${summary?.conversionRate ?? 0}% conversion baseline. Focus next on direct website strength and source quality.`;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <MegaphoneIcon className="size-3.5" />
                Marketing analytics
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <ChartColumnIncreasingIcon className="size-3.5" />
                Source and conversion view
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {resortName}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Review direct demand signals, inquiry-source quality, website
              activity, and follow-up timing so owners can decide where to put
              their next growth effort.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/tenant/web/builder">
                Website builder
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tenant/ai/recommendations">
                Smart recommendations
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
              Primary growth reviewer
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Modeled leads
            </div>
            <div className="mt-3 flex items-center gap-2 text-xl font-semibold">
              {analyticsQuery.isPending ? "..." : (summary?.totalLeads ?? 0)}
              <MegaphoneIcon className="size-5 text-zinc-700" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Inquiry volume currently supported by your workspace setup
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Conversion baseline
            </div>
            <div className="mt-3 flex items-center gap-2 text-xl font-semibold">
              {analyticsQuery.isPending
                ? "..."
                : `${summary?.conversionRate ?? 0}%`}
              <MousePointerClickIcon className="size-5 text-zinc-700" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Lead-to-booking modeled performance
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Avg lead age
            </div>
            <div className="mt-3 flex items-center gap-2 text-xl font-semibold">
              {analyticsQuery.isPending
                ? "..."
                : `${summary?.averageLeadAgeHours ?? 0} hrs`}
              <TimerResetIcon className="size-5 text-zinc-700" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Response speed proxy from current marketing operations
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.9fr)]">
        <div className="border bg-background p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Lead momentum</h2>
              <p className="text-sm text-muted-foreground">
                A six-period view of sessions, leads, and conversions derived
                from the current marketing readiness of the tenant workspace.
              </p>
            </div>
            <Badge variant="outline">Trend view</Badge>
          </div>

          <div className="mt-5">
            <ChartContainer config={trendChartConfig} className="h-130 w-full">
              <BarChart data={trendData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={10} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="sessions"
                  fill="var(--color-sessions)"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="leads"
                  fill="var(--color-leads)"
                  radius={[6, 6, 0, 0]}
                />
                <Bar
                  dataKey="conversions"
                  fill="var(--color-conversions)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="border bg-background p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Source mix</h2>
                <p className="text-sm text-muted-foreground">
                  Where modeled inquiry demand is currently expected to come
                  from.
                </p>
              </div>
              <Badge variant="outline">Channels</Badge>
            </div>

            <div className="mt-5">
              <ChartContainer config={mixChartConfig} className="h-70 w-full">
                <BarChart data={sourceMix} layout="vertical" margin={{ left: -20 }}>
                  <CartesianGrid horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="source"
                    tickLine={false}
                    axisLine={false}
                    width={96}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Bar
                    dataKey="leads"
                    fill="var(--color-leads)"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </div>

          <div className="border bg-background p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Highlights</h2>
            <div className="mt-4 space-y-4 text-sm text-muted-foreground">
              <div className="border-l-4 border-zinc-900 pl-2">
                Direct traffic is strongest when the website builder, property
                copy, and services are all filled out clearly.
              </div>
              <div className="border-l-4 border-zinc-300 pl-2">
                Faster lead response is currently modeled from accepted team
                members and active follow-up automations.
              </div>
              <div className="border-l-4 border-zinc-300 pl-2">
                The more guest-facing offers you publish, the stronger referral
                and repeat-demand signals become.
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingAnalyticsTable
        rows={rows}
        isLoading={analyticsQuery.isPending}
        isFetching={analyticsQuery.isFetching}
      />
    </main>
  );
}
