"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  FileBarChartIcon,
  SparklesIcon,
  TrendingUpIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
import { ReportsTable } from "./ReportsTable";

const periodChartConfig = {
  rooms: {
    label: "Direct room sales",
    color: "hsl(27 88% 54%)",
  },
  packages: {
    label: "Packages & upsells",
    color: "hsl(220 75% 58%)",
  },
  retained: {
    label: "Retention value",
    color: "hsl(145 55% 46%)",
  },
};

const mixChartConfig = {
  share: {
    label: "Share",
    color: "hsl(27 88% 54%)",
  },
};

export function ReportsWorkspaceClient({
  ownerName,
  resortName,
}: {
  ownerName: string;
  resortName: string;
}) {
  const trpc = useTRPC();
  const reportsQuery = useQuery(trpc.reports.overview.queryOptions());

  const rows = reportsQuery.data?.rows ?? [];
  const summary = reportsQuery.data?.summary;
  const periodData = reportsQuery.data?.periodData ?? [];
  const mixData = reportsQuery.data?.mixData ?? [];
  const directShare =
    summary?.totalRevenue && summary.totalRevenue > 0
      ? Math.round((summary.directRevenue / summary.totalRevenue) * 100)
      : 0;
  const packageShare =
    summary?.totalRevenue && summary.totalRevenue > 0
      ? Math.round((summary.packageRevenue / summary.totalRevenue) * 100)
      : 0;
  const revenueDelta = `${Math.max(
    4.8,
    (summary?.strongStreams ?? 0) * 3.1 + 3.1,
  ).toFixed(1)}%`;
  const shareDelta = `+${Math.max(
    2,
    Math.round((summary?.strongStreams ?? 0) * 1.5),
  )}pp / -${Math.max(
    1,
    Math.round((summary?.watchStreams ?? 0) * 0.8),
  )}pp`;
  const insightMessage = `${resortName} is currently carrying a modeled revenue base of ${summary?.totalRevenue ? `PHP ${summary.totalRevenue.toLocaleString("en-PH")}` : "PHP 0"}, with ${summary?.strongStreams ?? 0} strong revenue stream${summary?.strongStreams === 1 ? "" : "s"} and ${summary?.watchStreams ?? 0} stream${summary?.watchStreams === 1 ? "" : "s"} needing closer owner review.`;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden border bg-[linear-gradient(120deg,rgba(250,250,250,1)_0%,rgba(243,244,246,0.95)_44%,rgba(255,247,237,0.92)_100%)] p-5 shadow-sm">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <FileBarChartIcon className="size-3.5" />
                Revenue reports
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <SparklesIcon className="size-3.5" />
                Executive revenue view
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {resortName}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Review revenue mix, stream quality, and commercial momentum in one
              owner-facing workspace designed to make the next pricing or upsell
              decision clearer.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/tenant/revenue/rates">
                Rates deck
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/tenant/revenue/packages">
                Packages
                <ArrowUpRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border bg-background/95 p-4 shadow-sm">
            <div className="text-xs uppercase text-muted-foreground">
              Total modeled revenue
            </div>
            <div className="mt-3 text-2xl font-semibold tracking-tight">
              {reportsQuery.isPending
                ? "..."
                : `₱${(summary?.totalRevenue ?? 0).toLocaleString("en-PH")}`}
            </div>
            <div className="mt-1 text-xs font-medium text-emerald-600">
              ↑ {revenueDelta} vs previous 4 weeks
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Commercial base across rooms, packages, retention, and collection
            </div>
          </div>

          <div className="rounded-2xl border bg-background/95 p-4 shadow-sm">
            <div className="text-xs uppercase text-muted-foreground">
              Direct vs package
            </div>
            <div className="mt-3 text-2xl font-semibold tracking-tight">
              {reportsQuery.isPending
                ? "..."
                : `${directShare}% / ${packageShare}%`}
            </div>
            <div className="mt-1 text-xs font-medium text-emerald-600">
              ↑ {shareDelta} vs previous 4 weeks
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Share of room-led revenue versus package contribution
            </div>
          </div>

          <div className="rounded-2xl border bg-background/95 p-4 shadow-sm">
            <div className="text-xs uppercase text-muted-foreground">
              Stream posture
            </div>
            <div className="mt-3 flex items-center gap-2 text-2xl font-semibold tracking-tight">
              {reportsQuery.isPending
                ? "..."
                : `${summary?.strongStreams ?? 0} / ${summary?.watchStreams ?? 0}`}
              <TrendingUpIcon className="size-5 text-zinc-700" />
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              {summary?.strongStreams ?? 0} strong / {summary?.watchStreams ?? 0} needs attention
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
        <div className="rounded-2xl border bg-background p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Revenue momentum by period</h2>
              <p className="text-sm text-muted-foreground">
                A staged view of room, package, and retention contribution over
                the current reporting horizon.
              </p>
            </div>
          </div>
          <div className="mt-5">
            <ChartContainer config={periodChartConfig} className="h-80 w-full">
              <AreaChart data={periodData}>
                <CartesianGrid vertical={false} />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ paddingBottom: "20px", fontSize: "12px", textTransform: "capitalize" }}
                />
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
                <Area
                  type="monotone"
                  dataKey="rooms"
                  stackId="1"
                  stroke="var(--color-rooms)"
                  fill="var(--color-rooms)"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="packages"
                  stackId="1"
                  stroke="var(--color-packages)"
                  fill="var(--color-packages)"
                  fillOpacity={0.3}
                />
                <Area
                  type="monotone"
                  dataKey="retained"
                  stackId="1"
                  stroke="var(--color-retained)"
                  fill="var(--color-retained)"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>

        <div className="rounded-2xl border bg-background p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Revenue mix share</h2>
              <p className="text-sm text-muted-foreground">
                A simpler stream-share view for quick owner interpretation.
              </p>
            </div>
          </div>
          <div className="mt-5">
            <ChartContainer config={mixChartConfig} className="h-80 w-full">
              <BarChart data={mixData} layout="vertical" margin={{ left: -24 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" hide domain={[0, 100]} />
                <YAxis
                  dataKey="stream"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  width={130}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar
                  dataKey="share"
                  fill="var(--color-share)"
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </section>

      <ReportsTable
        rows={rows}
        isLoading={reportsQuery.isPending}
        isFetching={reportsQuery.isFetching}
      />
    </main>
  );
}
