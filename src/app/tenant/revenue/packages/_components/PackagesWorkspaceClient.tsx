"use client";

import { useQuery } from "@tanstack/react-query";
import {
  GiftIcon,
  Layers3Icon,
  PackageCheckIcon,
  SparklesIcon,
  TicketPercentIcon,
  WandSparklesIcon,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTRPC } from "@/trpc/client";
import { PackagesTable } from "./PackagesTable";

const serviceValueChartConfig = {
  price: {
    label: "Service value",
    color: "hsl(27 88% 54%)",
  },
};

const categoryMixChartConfig = {
  bundleStrength: {
    label: "Bundle strength",
    color: "hsl(84 55% 36%)",
  },
};

export function PackagesWorkspaceClient({
  ownerName,
  resortName,
}: {
  ownerName: string;
  resortName: string;
}) {
  const trpc = useTRPC();
  const packagesQuery = useQuery(trpc.packages.overview.queryOptions());

  const rows = packagesQuery.data?.rows ?? [];
  const summary = packagesQuery.data?.summary;
  const topServices = packagesQuery.data?.topServices ?? [];
  const categoryMix = packagesQuery.data?.categoryMix ?? [];
  const radialMix = categoryMix.map((item) => ({
    category: item.category,
    bundleStrength: Math.max(18, Math.min(100, item.services * 22 + item.avgValue / 45)),
  }));
  const insightMessage = `${resortName} currently has ${summary?.serviceCount ?? 0} active service${summary?.serviceCount === 1 ? "" : "s"} supporting ${summary?.packageRows ?? 0} package-ready bundle angle${summary?.packageRows === 1 ? "" : "s"}, with ${summary?.readyBundles ?? 0} already in a strong position to sell as upsells.`;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden border bg-[linear-gradient(135deg,rgba(255,250,245,1)_0%,rgba(250,250,250,1)_44%,rgba(245,244,255,0.92)_100%)] p-5 shadow-sm md:p-6">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="gap-1.5">
                  <GiftIcon className="size-3.5" />
                  Packages & upsells
                </Badge>
                <Badge variant="secondary" className="gap-1.5">
                  <SparklesIcon className="size-3.5" />
                  Guest spend design
                </Badge>
              </div>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight">
                {resortName}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
                Shape higher-value stays by combining your strongest services
                with room value, better timing, and cleaner guest-facing offers.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <div className="border bg-background/90 p-4">
                <div className="text-xs uppercase text-muted-foreground">
                  Active services
                </div>
                <div className="mt-3 text-xl font-semibold">
                  {packagesQuery.isPending ? "..." : (summary?.serviceCount ?? 0)}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Current service catalog available
                </div>
              </div>
              <div className="border bg-background/90 p-4">
                <div className="text-xs uppercase text-muted-foreground">
                  Ready bundles
                </div>
                <div className="mt-3 text-xl font-semibold">
                  {packagesQuery.isPending ? "..." : (summary?.readyBundles ?? 0)}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Package angles
                </div>
              </div>
              <div className="border bg-background/90 p-4">
                <div className="text-xs uppercase text-muted-foreground">
                  Service value pool
                </div>
                <div className="mt-3 text-xl font-semibold">
                  {packagesQuery.isPending
                    ? "..."
                    : `₱${(summary?.totalServiceValue ?? 0).toLocaleString("en-PH")}`}
                </div>
                <div className="mt-2 text-xs text-muted-foreground">
                  Total catalog value
                </div>
              </div>
            </div>

            <div className="grid gap-3 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
              <div className="border bg-background/90 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase text-muted-foreground">
                      Offer stack
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      The current building blocks available for guest-facing bundles.
                    </div>
                  </div>
                  <Badge variant="outline" className="gap-1.5">
                    <Layers3Icon className="size-3.5" />
                    Bundle base
                  </Badge>
                </div>

                <div className="mt-4 grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl border bg-background px-4 py-3">
                    <div className="text-xs uppercase text-muted-foreground">
                      Bundles
                    </div>
                    <div className="mt-2 text-lg font-semibold">
                      {packagesQuery.isPending ? "..." : (summary?.packageRows ?? 0)}
                    </div>
                  </div>
                  <div className="rounded-xl border bg-background px-4 py-3">
                    <div className="text-xs uppercase text-muted-foreground">
                      priority
                    </div>
                    <div className="mt-2 text-lg font-semibold">
                      {packagesQuery.isPending
                        ? "..."
                        : (summary?.highPriorityBundles ?? 0)}
                    </div>
                  </div>
                  <div className="rounded-xl border bg-background px-4 py-3">
                    <div className="text-xs uppercase text-muted-foreground">
                       anchor
                    </div>
                    <div className="mt-2 text-lg font-semibold">
                      {packagesQuery.isPending
                        ? "..."
                        : `₱${(summary?.highestRoomRate ?? 0).toLocaleString("en-PH")}`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border bg-background/90 p-4">
                <div className="text-xs uppercase text-muted-foreground">
                  Launch cues
                </div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-md border p-2 text-zinc-700">
                      <TicketPercentIcon className="size-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Lead with convenience</div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Transport, dining, and arrival-help
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-md border p-2 text-zinc-700">
                      <WandSparklesIcon className="size-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Price around moments</div>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Packages work better
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="border bg-background/92 p-5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-medium">
              <SparklesIcon className="size-4" />
              Package narrative
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Strong packages usually raise guest spend by making the stay feel
              easier, more complete, or more occasion-specific.
            </p>

            <div className="mt-6 space-y-4">
              <div className="border-l-4 border-zinc-900 pl-3">
                <div className="text-sm font-medium">Bundle what guests already understand</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Build around recognizable offers like transfer, dining, spa, or
                  family convenience.
                </p>
              </div>
              <div className="border-l-4 border-zinc-300 pl-3">
                <div className="text-sm font-medium">Use room value as the anchor</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Let the stay set the baseline, then add curated extras that feel
                  worthwhile rather than random.
                </p>
              </div>
              <div className="border-l-4 border-zinc-300 pl-3">
                <div className="text-sm font-medium">Time the offer before arrival</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Guests respond best when the offer arrives while trip planning is
                  still active.
                </p>
              </div>
              <div className="border-l-4 border-zinc-300 pl-3">
                <div className="text-sm font-medium">Leverage guest preferences</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Packages that align with known guest preferences tend to perform better, so use what you know about your guests to guide your
                  offer construction.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.95fr)]">
        <div className="border bg-background p-5 shadow-sm md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Top service value</h2>
              <p className="text-sm text-muted-foreground">
                The highest-value service building blocks currently available for
                upsells and bundles.
              </p>
            </div>
            <Badge variant="outline">Offer value</Badge>
          </div>
          <div className="mt-5">
            <ChartContainer config={serviceValueChartConfig} className="h-80 w-full">
              <BarChart data={topServices}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="serviceName"
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
                  dataKey="price"
                  fill="var(--color-price)"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        <div className="border bg-background p-5 shadow-sm md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Category bundle strength</h2>
              <p className="text-sm text-muted-foreground">
                A different view of which service categories are structurally strongest for bundle building.
              </p>
            </div>
            <Badge variant="outline">Strength map</Badge>
          </div>
          <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_220px]">
            <ChartContainer config={categoryMixChartConfig} className="h-80 w-full">
              <RadialBarChart
                data={radialMix}
                innerRadius="20%"
                outerRadius="95%"
                barSize={18}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis
                  type="number"
                  domain={[0, 100]}
                  tick={false}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <RadialBar
                  dataKey="bundleStrength"
                  cornerRadius={10}
                  fill="var(--color-bundleStrength)"
                  background={{ fill: "hsl(var(--muted))" }}
                />
              </RadialBarChart>
            </ChartContainer>

            <div className="space-y-3">
              {categoryMix.map((item) => (
                <div key={item.category} className="rounded-xl border bg-background p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-medium">{item.category}</div>
                    <PackageCheckIcon className="size-4 text-zinc-600" />
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    {item.services} service{item.services === 1 ? "" : "s"} · avg{" "}
                    {new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                      maximumFractionDigits: 0,
                    }).format(item.avgValue)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <PackagesTable
        rows={rows}
        isLoading={packagesQuery.isPending}
        isFetching={packagesQuery.isFetching}
      />
    </main>
  );
}
