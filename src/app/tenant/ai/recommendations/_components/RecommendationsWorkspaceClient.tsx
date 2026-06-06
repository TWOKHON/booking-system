"use client";

import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRightIcon,
  BrainCircuitIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { TuroInsightCard } from "@/app/admin/dashboard/_components/TuroInsightCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { RecommendationsTable } from "./RecommendationsTable";

export function RecommendationsWorkspaceClient({
  ownerName,
  resortName,
}: {
  ownerName: string;
  resortName: string;
}) {
  const trpc = useTRPC();
  const recommendationsQuery = useQuery(
    trpc.recommendations.list.queryOptions(),
  );

  const rows = recommendationsQuery.data?.rows ?? [];
  const summary = recommendationsQuery.data?.summary;
  const insightMessage = `${resortName} currently has ${summary?.readyCount ?? 0} recommendation surface${summary?.readyCount === 1 ? "" : "s"} ready for decision support, with ${summary?.highPriorityCount ?? 0} high-priority opportunities. Focus next on pricing, packaging, and promotion workflows.`;

  return (
    <main className="flex flex-1 flex-col gap-6">
      <TuroInsightCard message={insightMessage} userName={ownerName} />

      <section className="overflow-hidden border bg-[radial-gradient(circle_at_top_left,rgba(244,244,245,0.96),rgba(255,255,255,1)_46%,rgba(244,244,245,0.84))] p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1.5">
                <BrainCircuitIcon className="size-3.5" />
                Smart recommendations
              </Badge>
              <Badge variant="secondary" className="gap-1.5">
                <SparklesIcon className="size-3.5" />
                AI-assisted decisions
              </Badge>
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">
              {resortName}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Review AI-ready pricing, packaging, promotion, and guest
              experience opportunities based on the signals your tenant
              workspace already has available today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/tenant/analytics/advanced">
                Advanced analytics
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
              Primary AI reviewer
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Ready surfaces
            </div>
            <div className="mt-3 text-xl font-semibold">
              {recommendationsQuery.isPending
                ? "..."
                : (summary?.readyCount ?? 0)}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Recommendation areas with enough current signal quality
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              Avg nightly rate
            </div>
            <div className="mt-3 text-xl font-semibold">
              {recommendationsQuery.isPending
                ? "..."
                : summary?.averageNightlyRate
                  ? new Intl.NumberFormat("en-PH", {
                      style: "currency",
                      currency: "PHP",
                      maximumFractionDigits: 0,
                    }).format(summary.averageNightlyRate)
                  : "Not set"}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Current room-rate baseline for commercial guidance
            </div>
          </div>
          <div className="border bg-background/90 p-4">
            <div className="text-xs uppercase text-muted-foreground">
              High-priority opportunities
            </div>
            <div className="mt-3 flex items-center gap-2 text-xl font-semibold">
              {recommendationsQuery.isPending
                ? "..."
                : (summary?.highPriorityCount ?? 0)}
              <ShieldCheckIcon className="size-5 text-zinc-700" />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Areas most ready for owner action next
            </div>
          </div>
        </div>
      </section>

      <RecommendationsTable
        rows={rows}
        isLoading={recommendationsQuery.isPending}
        isFetching={recommendationsQuery.isFetching}
      />
    </main>
  );
}
