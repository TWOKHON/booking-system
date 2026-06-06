"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  BellRingIcon,
  CalendarRangeIcon,
  CoinsIcon,
  HotelIcon,
  TrendingUpIcon,
  WandSparklesIcon,
} from "lucide-react";
import Link from "next/link";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
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
import { RatesTable } from "./RatesTable";

const ladderChartConfig = {
  rate: {
    label: "Nightly rate",
    color: "hsl(27 88% 54%)",
  },
  units: {
    label: "Sellable units",
    color: "hsl(84 55% 36%)",
  },
};

const categoryChartConfig = {
  avgRate: {
    label: "Average rate",
    color: "hsl(222 47% 42%)",
  },
};

export function RatesWorkspaceClient({
  ownerName,
  resortName,
}: {
  ownerName: string;
  resortName: string;
}) {
  const trpc = useTRPC();
  const ratesQuery = useQuery(trpc.rates.overview.queryOptions());

  const rows = ratesQuery.data?.rows ?? [];
  const summary = ratesQuery.data?.summary;
  const chartData = ratesQuery.data?.chartData ?? [];
  const categoryMix = ratesQuery.data?.categoryMix ?? [];
  const insightMessage = `${resortName} currently holds an average nightly rate of ${summary?.averageRate ? `₱ ${summary.averageRate.toLocaleString("en-PH")}` : "₱ 0"}, with ${summary?.liftSignals ?? 0} rooms showing lift potential and ${summary?.watchSignals ?? 0} rooms needing closer conversion review.`;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden border bg-[linear-gradient(135deg,rgba(250,250,250,1)_0%,rgba(244,244,245,0.92)_42%,rgba(255,247,237,0.9)_100%)] p-5 shadow-sm md:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_360px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <CoinsIcon className="size-3.5" />
                Rates & availability
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <TrendingUpIcon className="size-3.5" />
                Yield posture
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {resortName}
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              Review nightly pricing across your room mix, compare rate posture
              by category, and spot where inventory can likely carry a firmer
              or steadier price.
            </p>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="border bg-background/90 p-4">
                <div className="text-xs uppercase text-muted-foreground">Owner</div>
                <div className="mt-3 text-xl font-semibold">{ownerName}</div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Primary revenue reviewer
                </div>
              </div>
              <div className="border bg-background/90 p-4">
                <div className="text-xs uppercase text-muted-foreground">
                  Average nightly rate
                </div>
                <div className="mt-3 text-xl font-semibold">
                  {ratesQuery.isPending
                    ? "..."
                    : `₱${(summary?.averageRate ?? 0).toLocaleString("en-PH")}`}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Current blended pricing
                </div>
              </div>
              <div className="border bg-background/90 p-4">
                <div className="text-xs uppercase text-muted-foreground">
                  Lift opportunities
                </div>
                <div className="mt-3 text-xl font-semibold">
                  {ratesQuery.isPending ? "..." : (summary?.liftSignals ?? 0)}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Room support pricing
                </div>
              </div>
              <div className="border bg-background/90 p-4">
                <div className="text-xs uppercase text-muted-foreground">
                  Active room units
                </div>
                <div className="mt-3 text-xl font-semibold">
                  {ratesQuery.isPending ? "..." : (summary?.totalUnits ?? 0)}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Sellable units
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div className="border bg-background/90 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">
                      Pricing snapshot
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      A quick owner read of the current deck range and pricing spread.
                    </div>
                  </div>
                  <Badge variant="outline" className="gap-1.5">
                    <CoinsIcon className="size-3.5" />
                    Live deck
                  </Badge>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border bg-background px-4 py-3">
                    <div className="text-xs uppercase text-muted-foreground">
                      Highest rate
                    </div>
                    <div className="mt-2 text-lg font-semibold">
                      {ratesQuery.isPending
                        ? "..."
                        : `₱${(summary?.highestRate?? 0).toLocaleString("en-PH")}`}
                    </div>
                  </div>
                  <div className="rounded-xl border bg-background px-4 py-3">
                    <div className="text-xs uppercase text-muted-foreground">
                      Lowest rate
                    </div>
                    <div className="mt-2 text-lg font-semibold">
                      {ratesQuery.isPending
                        ? "..."
                        : `₱${(summary?.lowestRate ?? 0).toLocaleString("en-PH")}`}
                    </div>
                  </div>
                  <div className="rounded-xl border bg-background px-4 py-3">
                    <div className="text-xs uppercase text-muted-foreground">
                      Rate spread
                    </div>
                    <div className="mt-2 text-lg font-semibold">
                      {ratesQuery.isPending
                        ? "..."
                        : `₱${Math.max(
                            0,
                            (summary?.highestRate ?? 0) - (summary?.lowestRate ?? 0),
                          ).toLocaleString("en-PH")}`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border bg-background/90 p-4">
                <div className="text-xs uppercase text-muted-foreground">
                  Deck health
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-md border p-2 text-zinc-700">
                      <HotelIcon className="size-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Inventory-backed pricing</div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {ratesQuery.isPending
                          ? "Reviewing inventory support..."
                          : `${summary?.roomCount ?? 0} room type${summary?.roomCount === 1 ? "" : "s"} are currently shaping the active rate deck.`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-md border p-2 text-zinc-700">
                      <BellRingIcon className="size-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Pricing alert readiness</div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {ratesQuery.isPending
                          ? "Checking pricing alert coverage..."
                          : `${summary?.notificationCoverage ?? 0} enabled notification rule${summary?.notificationCoverage === 1 ? "" : "s"}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="flex h-full flex-col justify-between border bg-background/92 p-5 shadow-sm">
            <div>
              <div className="flex items-center gap-2 text-sm font-medium">
                <WandSparklesIcon className="size-4" />
                Revenue posture
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="border-l-2 border-zinc-900 pl-4">
                <div className="text-sm font-medium">Protect premium rooms</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Higher-priced rooms should preserve perceived value before
                  chasing short-term discounting.
                </p>
              </div>
              <div className="border-l-2 border-zinc-300 pl-4">
                <div className="text-sm font-medium">Lift underpriced demand</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Rooms with healthy capacity and lower-than-blended pricing are
                  the cleanest candidates for rate improvement.
                </p>
              </div>
              <div className="border-l-2 border-zinc-300 pl-4">
                <div className="text-sm font-medium">Watch conversion risk</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  If inventory is high and pricing already sits above the pack,
                  reinforce value before pushing rates further.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/tenant/settings/rooms">
                  Room inventory
                  <ArrowUpRightIcon className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/tenant/ai/forecast">
                  Revenue forecast
                  <ArrowUpRightIcon className="size-4" />
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.95fr)]">
        <div className="border bg-background p-5 shadow-sm md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Rate ladder</h2>
              <p className="text-sm text-muted-foreground">
                Compare room pricing against sellable units to see which parts
                of the room mix carry the most commercial weight.
              </p>
            </div>
            <Badge variant="outline" className="gap-1.5">
              <CalendarRangeIcon className="size-3.5" />
              Current deck
            </Badge>
          </div>
          <div className="mt-5">
            <ChartContainer config={ladderChartConfig} className="h-80 w-full">
              <LineChart data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="roomName"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <YAxis yAxisId="left" tickLine={false} axisLine={false} tickMargin={10} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={10}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Bar
                  yAxisId="right"
                  dataKey="units"
                  fill="var(--color-units)"
                  radius={[6, 6, 0, 0]}
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="rate"
                  stroke="var(--color-rate)"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "var(--color-rate)" }}
                />
              </LineChart>
            </ChartContainer>
          </div>
        </div>

        <div className="border bg-background p-5 shadow-sm md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Category price posture</h2>
              <p className="text-sm text-muted-foreground">
                A quick read on average pricing per room category.
              </p>
            </div>
            <Badge variant="outline">Category mix</Badge>
          </div>
          <div className="mt-5">
            <ChartContainer config={categoryChartConfig} className="h-80 w-full">
              <BarChart data={categoryMix}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="category"
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
                  dataKey="avgRate"
                  fill="var(--color-avgRate)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </section>

      <RatesTable
        rows={rows}
        isLoading={ratesQuery.isPending}
        isFetching={ratesQuery.isFetching}
      />
    </main>
  );
}
